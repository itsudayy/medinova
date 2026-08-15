const Doctor = require('../models/Doctor');
const User = require('../models/User');

// Create or update the calling doctor's own profile.
// req.mongoUser is set by requireApprovedDoctor middleware.
async function upsertMyProfile(req, res) {
  const { specialization, bio, experienceYears, videoFee, physicalFee, availability } = req.body;

  if (!specialization || videoFee === undefined || physicalFee === undefined) {
    return res.status(400).json({ message: 'specialization, videoFee and physicalFee are required' });
  }

  try {
    const doctor = await Doctor.findOneAndUpdate(
      { user: req.mongoUser._id },
      { specialization, bio, experienceYears, videoFee, physicalFee, availability },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    ).populate('user', 'name email photoURL');

    res.json(doctor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getMyProfile(req, res) {
  try {
    const doctor = await Doctor.findOne({ user: req.mongoUser._id }).populate('user', 'name email photoURL');
    if (!doctor) return res.status(404).json({ message: 'No profile yet' });
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Public browse list — only shows doctors who are (a) approved and (b) have
// created a profile. Supports optional ?specialization= and ?search= filters.
async function listDoctors(req, res) {
  const { specialization, search } = req.query;

  try {
    const approvedUserIds = await User.find({ role: 'doctor', status: 'approved' }).distinct('_id');

    const query = { user: { $in: approvedUserIds } };
    if (specialization) query.specialization = specialization;

    let doctors = await Doctor.find(query).populate('user', 'name email photoURL');

    if (search) {
      const term = search.toLowerCase();
      doctors = doctors.filter(
        (d) => d.user.name.toLowerCase().includes(term) || d.specialization.toLowerCase().includes(term)
      );
    }

    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getDoctorById(req, res) {
  try {
    const doctor = await Doctor.findById(req.params.id).populate('user', 'name email photoURL');
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

    const owner = await User.findById(doctor.user._id);
    if (!owner || owner.status !== 'approved') {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.json(doctor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = { upsertMyProfile, getMyProfile, listDoctors, getDoctorById };
