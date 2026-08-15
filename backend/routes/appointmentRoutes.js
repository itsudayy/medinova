const express = require('express');
const router = express.Router();
const verifyFirebaseToken = require('../middleware/verifyFirebaseToken');
const requirePatient = require('../middleware/requirePatient');
const requireApprovedDoctor = require('../middleware/requireApprovedDoctor');
const {
  createAppointment,
  confirmBooking,
  listMyAppointmentsAsPatient,
  listMyAppointmentsAsDoctor,
  getPatientStats,
  getDoctorStats,
} = require('../controllers/appointmentController');
const { submitReview } = require('../controllers/reviewController');
const { setPrescription } = require('../controllers/prescriptionController');

router.post('/', verifyFirebaseToken, requirePatient, createAppointment);
router.post('/confirm', verifyFirebaseToken, requirePatient, confirmBooking);
router.post('/:id/review', verifyFirebaseToken, requirePatient, submitReview);
router.put('/:id/prescription', verifyFirebaseToken, requireApprovedDoctor, setPrescription);
router.get('/mine', verifyFirebaseToken, requirePatient, listMyAppointmentsAsPatient);
router.get('/doctor/mine', verifyFirebaseToken, requireApprovedDoctor, listMyAppointmentsAsDoctor);
router.get('/stats/patient', verifyFirebaseToken, requirePatient, getPatientStats);
router.get('/stats/doctor', verifyFirebaseToken, requireApprovedDoctor, getDoctorStats);

module.exports = router;
