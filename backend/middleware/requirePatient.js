const User = require('../models/User');

// Loads the calling user's Mongo profile and confirms they're a patient.
// Used on routes only patients should hit (booking, paying, etc.).
async function requirePatient(req, res, next) {
  const user = await User.findOne({ firebaseUid: req.firebaseUser.uid });

  if (!user || user.role !== 'patient') {
    return res.status(403).json({ message: 'Patient account required' });
  }

  req.mongoUser = user;
  next();
}

module.exports = requirePatient;
