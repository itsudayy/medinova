const User = require('../models/User');

// Use on any route only admins should reach (doctor approval, monitoring).
// Unlike requireAdminSecret, this checks a real signed-in identity's role,
// so every admin action is attributable to a specific account.
async function requireAdmin(req, res, next) {
  const user = await User.findOne({ firebaseUid: req.firebaseUser.uid });

  if (!user || user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin account required' });
  }

  req.mongoUser = user;
  next();
}

module.exports = requireAdmin;
