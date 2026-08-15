const User = require('../models/User');

// Use on any route that only approved doctors should reach (e.g. creating a
// doctor profile, appearing in the browse list, accepting bookings).
async function requireApprovedDoctor(req, res, next) {
  const user = await User.findOne({ firebaseUid: req.firebaseUser.uid });

  if (!user || user.role !== 'doctor') {
    return res.status(403).json({ message: 'Doctor account required' });
  }
  if (user.status !== 'approved') {
    return res.status(403).json({ message: 'Doctor account pending approval' });
  }

  req.mongoUser = user;
  next();
}

module.exports = requireApprovedDoctor;
