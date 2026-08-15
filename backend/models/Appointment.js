const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    type: { type: String, enum: ['video', 'physical'], required: true },
    date: { type: String, required: true }, // "2026-08-20"
    day: { type: String, required: true }, // "Thu" — derived, kept for display/debug
    timeRange: { type: String, required: true }, // "09:00-17:00", copied from the matched availability slot
    fee: { type: Number, required: true },
    couponCode: { type: String, default: '' },
    discountAmount: { type: Number, default: 0 },
    amountPaid: { type: Number, required: true }, // fee - discountAmount
    stripeCheckoutSessionId: { type: String, required: true },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
    status: { type: String, enum: ['pending_payment', 'confirmed', 'completed', 'cancelled'], default: 'pending_payment' },
    // The review lives on the appointment rather than in its own collection:
    // it ties every rating to one real, paid consultation and makes
    // "one review per appointment" a structural fact instead of a rule to enforce.
    rating: { type: Number, min: 1, max: 5, default: null },
    review: { type: String, default: '' },
    reviewedAt: { type: Date, default: null },
    // Same reasoning as the review fields above: living on the appointment
    // means a prescription is structurally tied to one real consultation
    // between this doctor and this patient — there's no separate collection
    // where a mismatched doctor/patient pair could be created by mistake.
    prescription: { type: String, default: '' },
    prescribedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Appointment', appointmentSchema);
