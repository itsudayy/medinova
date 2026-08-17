const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const stripe = require('../config/stripe');
const { findValidCoupon, computeDiscount } = require('./couponController');

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// CLIENT_URL may hold a comma-separated allow-list for CORS. Stripe redirect
// URLs need exactly one origin, so always take the first entry.
const clientUrl = () => (process.env.CLIENT_URL || '').split(',')[0].trim();

// Creates a pending appointment + a Stripe Checkout Session, returns the
// session URL for the frontend to redirect to. Nothing is confirmed yet —
// that only happens once Stripe confirms the payment (see confirmBooking).
async function createAppointment(req, res) {
  const { doctorId, type, date, couponCode } = req.body;

  if (!doctorId || !['video', 'physical'].includes(type) || !date) {
    return res.status(400).json({ message: 'doctorId, type (video|physical) and date are required' });
  }

  try {
    const doctor = await Doctor.findById(doctorId).populate('user', 'name status');
    if (!doctor || doctor.user.status !== 'approved') {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const chosenDate = new Date(`${date}T00:00:00`);
    if (isNaN(chosenDate) || chosenDate < new Date(new Date().toDateString())) {
      return res.status(400).json({ message: 'Invalid or past date' });
    }
    const day = DAY_NAMES[chosenDate.getDay()];

    const slot = doctor.availability.find((s) => s.day === day);
    if (!slot) {
      return res.status(400).json({ message: `Doctor is not available on ${day}` });
    }

    const fee = type === 'video' ? doctor.videoFee : doctor.physicalFee;

    // Coupon discount is computed here, server-side, from the coupon record
    // and the fee we just looked up — never from anything the client sends.
    let discountAmount = 0;
    let appliedCode = '';
    if (couponCode) {
      const coupon = await findValidCoupon(couponCode, req.mongoUser);
      discountAmount = computeDiscount(coupon, fee);
      appliedCode = coupon.code;
      coupon.usedCount += 1;
      await coupon.save();
    }
    const amountPaid = Math.round((fee - discountAmount) * 100) / 100;

    const appointment = await Appointment.create({
      patient: req.mongoUser._id,
      doctor: doctor._id,
      type,
      date,
      day,
      timeRange: `${slot.startTime}-${slot.endTime}`,
      fee,
      couponCode: appliedCode,
      discountAmount,
      amountPaid,
      stripeCheckoutSessionId: 'pending', // placeholder, set right after session creation below
    });

    // A 100% discount leaves nothing to charge, and Stripe has a minimum
    // amount — so confirm the booking directly instead of sending the
    // patient to an empty checkout page.
    if (amountPaid === 0) {
      appointment.stripeCheckoutSessionId = 'free';
      appointment.paymentStatus = 'paid';
      appointment.status = 'confirmed';
      await appointment.save();
      return res.json({ checkoutUrl: null, appointmentId: appointment._id });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      // Pin the session to the signed-in user's own email. Without this Stripe
      // leaves the field open and its Link wallet offers whichever address was
      // last used in this browser — which looks like another user's account.
      customer_email: req.mongoUser.email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: `${type === 'video' ? 'Video' : 'Physical'} consultation with ${doctor.user.name}` },
            unit_amount: Math.round(amountPaid * 100),
          },
          quantity: 1,
        },
      ],
      success_url: `${clientUrl()}/appointments/confirm?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${clientUrl()}/doctors/${doctorId}`,
      metadata: { appointmentId: appointment._id.toString(), purpose: 'appointment', userId: req.mongoUser._id.toString() },
    });

    appointment.stripeCheckoutSessionId = session.id;
    await appointment.save();

    res.json({ checkoutUrl: session.url });
  } catch (err) {
    // Coupon rejections carry their own status (403 premium-only, 404 unknown code)
    res.status(err.status || 500).json({ message: err.message });
  }
}

// Called by the frontend right after Stripe redirects back on success.
// We ask Stripe directly whether the session actually paid — never trust
// the redirect alone, since a client could hit this URL without paying.
async function confirmBooking(req, res) {
  const { sessionId } = req.body;
  if (!sessionId) return res.status(400).json({ message: 'sessionId is required' });

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const appointment = await Appointment.findOne({ stripeCheckoutSessionId: sessionId });

    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    if (appointment.patient.toString() !== req.mongoUser._id.toString()) {
      return res.status(403).json({ message: 'Not your appointment' });
    }

    if (session.payment_status === 'paid') {
      appointment.paymentStatus = 'paid';
      appointment.status = 'confirmed';
      await appointment.save();
    }

    res.json(appointment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function listMyAppointmentsAsPatient(req, res) {
  try {
    const appointments = await Appointment.find({ patient: req.mongoUser._id })
      .populate({ path: 'doctor', populate: { path: 'user', select: 'name' } })
      .sort({ date: -1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function listMyAppointmentsAsDoctor(req, res) {
  try {
    const doctor = await Doctor.findOne({ user: req.mongoUser._id });
    if (!doctor) return res.json([]);

    const appointments = await Appointment.find({ doctor: doctor._id, status: { $ne: 'pending_payment' } })
      .populate('patient', 'name email phone')
      .sort({ date: -1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// GET /api/appointments/stats/patient
async function getPatientStats(req, res) {
  try {
    const todayStr = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD, local
    const patientId = req.mongoUser._id;

    const [upcoming, doctorsVisited, reviewsWritten] = await Promise.all([
      Appointment.countDocuments({ patient: patientId, status: 'confirmed', date: { $gte: todayStr } }),
      Appointment.distinct('doctor', { patient: patientId, paymentStatus: 'paid' }),
      Appointment.countDocuments({ patient: patientId, rating: { $ne: null } }),
    ]);

    res.json({ upcomingAppointments: upcoming, doctorsVisited: doctorsVisited.length, reviewsWritten });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// GET /api/appointments/stats/doctor
async function getDoctorStats(req, res) {
  try {
    const doctor = await Doctor.findOne({ user: req.mongoUser._id });
    if (!doctor) {
      return res.json({ upcomingAppointments: 0, totalPatients: 0, totalEarnings: 0, ratingAverage: 0, ratingCount: 0 });
    }

    const todayStr = new Date().toLocaleDateString('en-CA');
    const [upcoming, patients, earningsAgg] = await Promise.all([
      Appointment.countDocuments({ doctor: doctor._id, status: 'confirmed', date: { $gte: todayStr } }),
      Appointment.distinct('patient', { doctor: doctor._id, paymentStatus: 'paid' }),
      Appointment.aggregate([
        { $match: { doctor: doctor._id, paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$amountPaid' } } },
      ]),
    ]);

    res.json({
      upcomingAppointments: upcoming,
      totalPatients: patients.length,
      totalEarnings: earningsAgg[0]?.total || 0,
      ratingAverage: doctor.ratingAverage,
      ratingCount: doctor.ratingCount,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = {
  createAppointment,
  confirmBooking,
  listMyAppointmentsAsPatient,
  listMyAppointmentsAsDoctor,
  getPatientStats,
  getDoctorStats,
};
