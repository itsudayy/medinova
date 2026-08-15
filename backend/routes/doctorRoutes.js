const express = require('express');
const router = express.Router();
const verifyFirebaseToken = require('../middleware/verifyFirebaseToken');
const requireApprovedDoctor = require('../middleware/requireApprovedDoctor');
const { upsertMyProfile, getMyProfile, listDoctors, getDoctorById } = require('../controllers/doctorController');
const { listDoctorReviews } = require('../controllers/reviewController');

// Public
router.get('/', listDoctors);
router.get('/:id/reviews', listDoctorReviews);
router.get('/:id', getDoctorById);

// Doctor-only (must be an approved doctor)
router.put('/me/profile', verifyFirebaseToken, requireApprovedDoctor, upsertMyProfile);
router.get('/me/profile', verifyFirebaseToken, requireApprovedDoctor, getMyProfile);

module.exports = router;
