const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    firebaseUid: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    role: { type: String, enum: ['patient', 'doctor', 'admin'], required: true },
    // Patients are active immediately. Doctors start 'pending' and must be
    // approved before doctor-only functionality (profile listing, bookings) unlocks.
    status: { type: String, enum: ['active', 'pending', 'approved', 'rejected'], required: true },
    isPremium: { type: Boolean, default: false },
    premiumSince: { type: Date, default: null },
    phone: { type: String, default: '' },
    photoURL: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
