const User = require('../models/User');

// Called right after Firebase signup. Creates the Mongo profile if it
// doesn't exist yet, or returns the existing one (safe to call on every login).
async function syncUser(req, res) {
  const { uid, email } = req.firebaseUser;
  const { name, role, phone } = req.body;

  try {
    let user = await User.findOne({ firebaseUid: uid });

    if (!user) {
      if (!name || !role) {
        return res.status(400).json({ message: 'name and role are required for first-time sync' });
      }
      user = await User.create({
        firebaseUid: uid,
        name,
        email,
        role,
        status: role === 'doctor' ? 'pending' : 'active',
        phone: phone || '',
      });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getMe(req, res) {
  try {
    const user = await User.findOne({ firebaseUid: req.firebaseUser.uid });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Minimal stand-in for an admin panel: flips a pending doctor to approved/rejected.
// Guarded by requireAdminSecret, not a real auth role — fine for now, replace later.
async function setDoctorStatus(req, res) {
  const { status } = req.body;

  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ message: 'status must be approved or rejected' });
  }

  try {
    const user = await User.findById(req.params.id);
    if (!user || user.role !== 'doctor') {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    user.status = status;
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// One-time bootstrap: promotes the calling (already-authenticated) user to
// admin, gated by the shared ADMIN_SECRET. After this runs once, every
// further admin action is checked via requireAdmin against a real role on a
// real signed-in account — the shared secret is never used again.
async function bootstrapAdmin(req, res) {
  try {
    const user = await User.findOne({ firebaseUid: req.firebaseUser.uid });
    if (!user) return res.status(404).json({ message: 'Sign up first, then bootstrap' });

    user.role = 'admin';
    user.status = 'active';
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function listDoctorUsers(req, res) {
  try {
    const users = await User.find({ role: 'doctor' }).sort({ status: 1, createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = { syncUser, getMe, setDoctorStatus, listDoctorUsers, bootstrapAdmin };
