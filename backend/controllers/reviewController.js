const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');

// Recomputes a doctor's rating from scratch off their reviewed appointments.
// Recomputing beats incrementing a running average: it can't drift, and it
// stays correct if a review is ever edited or removed.
async function recomputeDoctorRating(doctorId) {
  const [stats] = await Appointment.aggregate([
    { $match: { doctor: doctorId, rating: { $ne: null } } },
    { $group: { _id: null, average: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);

  await Doctor.findByIdAndUpdate(doctorId, {
    ratingAverage: stats ? Math.round(stats.average * 10) / 10 : 0,
    ratingCount: stats ? stats.count : 0,
  });
}

// POST /api/appointments/:id/review
async function submitReview(req, res) {
  const { rating, review } = req.body;

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be a whole number from 1 to 5' });
  }

  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    // Only the patient who attended it can review it.
    if (appointment.patient.toString() !== req.mongoUser._id.toString()) {
      return res.status(403).json({ message: 'Not your appointment' });
    }
    // An unpaid booking never happened, so there is nothing to review.
    if (appointment.paymentStatus !== 'paid') {
      return res.status(400).json({ message: 'Only paid appointments can be reviewed' });
    }
    if (appointment.status === 'cancelled') {
      return res.status(400).json({ message: 'Cancelled appointments cannot be reviewed' });
    }
    // You cannot review a consultation that has not happened yet.
    const todayStr = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD, local
    if (appointment.date > todayStr) {
      return res.status(400).json({ message: 'You can review this after your appointment date' });
    }
    // The rating lives on the appointment, so one appointment can only ever
    // carry one review — no separate uniqueness check needed.
    if (appointment.rating != null) {
      return res.status(409).json({ message: 'You have already reviewed this appointment' });
    }

    appointment.rating = rating;
    appointment.review = (review || '').trim().slice(0, 1000);
    appointment.reviewedAt = new Date();
    if (appointment.status === 'confirmed') appointment.status = 'completed';
    await appointment.save();

    await recomputeDoctorRating(appointment.doctor);

    // Populated to match the shape of the list endpoint — the client merges
    // this straight into its state, so a bare doctor id here would blank out
    // the doctor's name on the card.
    await appointment.populate({ path: 'doctor', populate: { path: 'user', select: 'name' } });
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// GET /api/doctors/:id/reviews — public-facing list for a doctor's profile.
async function listDoctorReviews(req, res) {
  try {
    const appointments = await Appointment.find({ doctor: req.params.id, rating: { $ne: null } })
      .populate('patient', 'name')
      .sort({ reviewedAt: -1 })
      .select('rating review reviewedAt patient type');

    // Distribution powers the 5-bar histogram on the profile page.
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    appointments.forEach((a) => { distribution[a.rating] += 1; });

    res.json({ reviews: appointments, distribution });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = { submitReview, listDoctorReviews };
