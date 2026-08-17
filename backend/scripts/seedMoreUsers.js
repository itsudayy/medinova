/**
 * Seeds a second wave of demo accounts: 3 more doctors and 3 patients.
 * Same idempotent pattern as seedDoctors.js — safe to re-run.
 *
 * Usage:  node scripts/seedMoreUsers.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const { auth } = require('../config/firebaseAdmin');
const User = require('../models/User');
const Doctor = require('../models/Doctor');

const SEED_PASSWORD = 'test123456'; // dev/demo accounts only

const DOCTORS = [
  {
    email: 'sheikh.fuad@medinova.demo',
    name: 'Dr Sheikh Fuad',
    photoURL: 'https://images.unsplash.com/photo-1622902046580-2b47f47f5471?w=400&q=80',
    specialization: 'Psychiatrist',
    bio: 'Psychiatrist focused on anxiety, depression, and stress-related conditions, with an emphasis on long-term, judgment-free care.',
    experienceYears: 10,
    videoFee: 85,
    physicalFee: 100,
    availability: [
      { day: 'Mon', startTime: '13:00', endTime: '19:00' },
      { day: 'Wed', startTime: '13:00', endTime: '19:00' },
    ],
  },
  {
    email: 'kylian.shafin@medinova.demo',
    name: 'Dr Kylian Shafin',
    photoURL: 'https://images.unsplash.com/photo-1600180758890-6b94519a8ba6?w=400&q=80',
    specialization: 'ENT Specialist',
    bio: 'Ear, nose and throat specialist treating sinus issues, hearing concerns, and chronic throat conditions.',
    experienceYears: 7,
    videoFee: 65,
    physicalFee: 80,
    availability: [
      { day: 'Tue', startTime: '09:00', endTime: '15:00' },
      { day: 'Fri', startTime: '09:00', endTime: '15:00' },
    ],
  },
  {
    email: 'nafiz.yamal@medinova.demo',
    name: 'Dr Nafiz Yamal',
    photoURL: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80',
    specialization: 'Gastroenterologist',
    bio: 'Gastroenterologist specialising in digestive health, acid reflux management, and routine screening.',
    experienceYears: 13,
    videoFee: 95,
    physicalFee: 115,
    availability: [
      { day: 'Mon', startTime: '08:00', endTime: '14:00' },
      { day: 'Thu', startTime: '08:00', endTime: '14:00' },
    ],
  },
];

const PATIENTS = [
  { email: 'rajking.barua@medinova.demo', name: 'Rajking Barua' },
  { email: 'uday.hossain@medinova.demo', name: 'Uday Hossain' },
  { email: 'mohaimin.rahman@medinova.demo', name: 'Mohaimin Rahman' },
];

async function ensureFirebaseUser(email, name) {
  try {
    const existing = await auth.getUserByEmail(email);
    return existing.uid;
  } catch (err) {
    if (err.code !== 'auth/user-not-found') throw err;
    const created = await auth.createUser({ email, password: SEED_PASSWORD, displayName: name });
    return created.uid;
  }
}

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB\n');

  console.log('Doctors:');
  for (const d of DOCTORS) {
    const uid = await ensureFirebaseUser(d.email, d.name);
    const user = await User.findOneAndUpdate(
      { firebaseUid: uid },
      { firebaseUid: uid, name: d.name, email: d.email, role: 'doctor', status: 'approved', photoURL: d.photoURL },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    await Doctor.findOneAndUpdate(
      { user: user._id },
      {
        user: user._id,
        specialization: d.specialization,
        bio: d.bio,
        experienceYears: d.experienceYears,
        videoFee: d.videoFee,
        physicalFee: d.physicalFee,
        availability: d.availability,
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    console.log(`  ✓ ${d.name} — ${d.specialization}`);
  }

  console.log('\nPatients:');
  for (const p of PATIENTS) {
    const uid = await ensureFirebaseUser(p.email, p.name);
    await User.findOneAndUpdate(
      { firebaseUid: uid },
      { firebaseUid: uid, name: p.name, email: p.email, role: 'patient', status: 'active' },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    console.log(`  ✓ ${p.name}`);
  }

  const totalDoctors = await Doctor.countDocuments();
  const totalPatients = await User.countDocuments({ role: 'patient' });
  console.log(`\nDone. ${totalDoctors} doctors, ${totalPatients} patients in the database.`);
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
