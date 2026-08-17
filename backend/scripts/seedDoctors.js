/**
 * Seeds a realistic set of approved doctors (Firebase auth user + Mongo User +
 * Doctor profile) so the browse catalog has something to show.
 *
 * Idempotent: re-running updates existing seeded records rather than creating
 * duplicates, so it's safe to run against a database that already has data.
 *
 * Usage:  node scripts/seedDoctors.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const { auth } = require('../config/firebaseAdmin');
const User = require('../models/User');
const Doctor = require('../models/Doctor');

const SEED_PASSWORD = 'test123456'; // dev/demo accounts only

const DOCTORS = [
  {
    email: 'amara.okafor@medinova.demo',
    name: 'Dr Amara Okafor',
    photoURL: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80',
    specialization: 'Neurologist',
    bio: 'Neurologist focused on migraine management, epilepsy, and long-term care for neurological conditions.',
    experienceYears: 11,
    videoFee: 90,
    physicalFee: 110,
    availability: [
      { day: 'Mon', startTime: '10:00', endTime: '16:00' },
      { day: 'Wed', startTime: '10:00', endTime: '16:00' },
      { day: 'Fri', startTime: '09:00', endTime: '13:00' },
    ],
  },
  {
    email: 'miguel.santos@medinova.demo',
    name: 'Dr Miguel Santos',
    photoURL: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80',
    specialization: 'Pediatrician',
    bio: 'Paediatrician caring for newborns through adolescence, with a focus on developmental milestones and preventive care.',
    experienceYears: 8,
    videoFee: 60,
    physicalFee: 75,
    availability: [
      { day: 'Tue', startTime: '09:00', endTime: '17:00' },
      { day: 'Thu', startTime: '09:00', endTime: '17:00' },
      { day: 'Sat', startTime: '10:00', endTime: '14:00' },
    ],
  },
  {
    email: 'priya.nair@medinova.demo',
    name: 'Dr Priya Nair',
    photoURL: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&q=80',
    specialization: 'Dermatologist',
    bio: 'Dermatologist treating acne, eczema, and skin cancer screening, with an emphasis on evidence-based skincare.',
    experienceYears: 6,
    videoFee: 70,
    physicalFee: 85,
    availability: [
      { day: 'Mon', startTime: '11:00', endTime: '18:00' },
      { day: 'Thu', startTime: '11:00', endTime: '18:00' },
    ],
  },
  {
    email: 'james.whitfield@medinova.demo',
    name: 'Dr James Whitfield',
    photoURL: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&q=80',
    specialization: 'Orthopedic Surgeon',
    bio: 'Orthopaedic surgeon specialising in sports injuries, joint replacement, and post-operative rehabilitation planning.',
    experienceYears: 15,
    videoFee: 100,
    physicalFee: 130,
    availability: [
      { day: 'Tue', startTime: '08:00', endTime: '14:00' },
      { day: 'Fri', startTime: '08:00', endTime: '14:00' },
    ],
  },
  {
    email: 'yuki.tanaka@medinova.demo',
    name: 'Dr Yuki Tanaka',
    photoURL: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&q=80',
    specialization: 'General Medicine',
    bio: 'General physician handling everyday illness, chronic condition reviews, and routine health checks for adults.',
    experienceYears: 9,
    videoFee: 50,
    physicalFee: 65,
    availability: [
      { day: 'Mon', startTime: '09:00', endTime: '17:00' },
      { day: 'Tue', startTime: '09:00', endTime: '17:00' },
      { day: 'Wed', startTime: '09:00', endTime: '17:00' },
      { day: 'Thu', startTime: '09:00', endTime: '17:00' },
    ],
  },
  {
    email: 'elena.rossi@medinova.demo',
    name: 'Dr Elena Rossi',
    photoURL: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&q=80',
    specialization: 'Ophthalmologist',
    bio: 'Ophthalmologist covering vision correction, glaucoma monitoring, and diabetic eye care.',
    experienceYears: 12,
    videoFee: 80,
    physicalFee: 95,
    availability: [
      { day: 'Wed', startTime: '10:00', endTime: '17:00' },
      { day: 'Sat', startTime: '09:00', endTime: '13:00' },
    ],
  },
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

  for (const d of DOCTORS) {
    const uid = await ensureFirebaseUser(d.email, d.name);

    // Doctors created by this script are pre-approved — they represent the
    // established practitioners the platform launched with.
    const user = await User.findOneAndUpdate(
      { firebaseUid: uid },
      {
        firebaseUid: uid,
        name: d.name,
        email: d.email,
        role: 'doctor',
        status: 'approved',
        photoURL: d.photoURL,
      },
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

  const total = await Doctor.countDocuments();
  console.log(`\nDone. ${total} doctor profiles now in the catalog.`);
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
