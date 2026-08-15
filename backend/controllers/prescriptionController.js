const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');

// PUT /api/appointments/:id/prescription — doctor writes or edits the
// prescription for one of their own paid appointments. Editable (unlike a
// review) because updating dosage/instructions after the fact is a normal,
// legitimate part of patient care — there's no incentive to game it.
async function setPrescription(req, res) {
  const { prescription } = req.body;

  if (typeof prescription !== 'string' || !prescription.trim()) {
    return res.status(400).json({ message: 'Prescription text is required' });
  }

  try {
    const doctor = await Doctor.findOne({ user: req.mongoUser._id });
    if (!doctor) return res.status(404).json({ message: 'Doctor profile not found' });

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    // Ownership: only the doctor who ran this consultation can prescribe for it.
    if (appointment.doctor.toString() !== doctor._id.toString()) {
      return res.status(403).json({ message: 'Not your appointment' });
    }
    if (appointment.paymentStatus !== 'paid') {
      return res.status(400).json({ message: 'Only paid appointments can have a prescription' });
    }
    if (appointment.status === 'cancelled') {
      return res.status(400).json({ message: 'Cancelled appointments cannot have a prescription' });
    }

    appointment.prescription = prescription.trim().slice(0, 2000);
    appointment.prescribedAt = new Date();
    await appointment.save();

    // Populated to match the shape of the list endpoint (see the same fix
    // in reviewController) — the client merges this straight into state, so
    // a bare patient id here would blank out the patient's name on the card.
    await appointment.populate('patient', 'name email phone');
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = { setPrescription };
