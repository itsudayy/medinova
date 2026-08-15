const express = require('express');
const router = express.Router();
const verifyFirebaseToken = require('../middleware/verifyFirebaseToken');
const requireAdminSecret = require('../middleware/requireAdminSecret');
const requireAdmin = require('../middleware/requireAdmin');
const { syncUser, getMe, setDoctorStatus, listDoctorUsers, bootstrapAdmin } = require('../controllers/userController');

router.post('/sync', verifyFirebaseToken, syncUser);
router.get('/me', verifyFirebaseToken, getMe);
// One-time: promotes the signed-in caller to admin. Guarded by the shared
// secret since there is no admin yet to guard it via role.
router.post('/bootstrap-admin', verifyFirebaseToken, requireAdminSecret, bootstrapAdmin);
router.get('/doctors', verifyFirebaseToken, requireAdmin, listDoctorUsers);
router.patch('/:id/status', verifyFirebaseToken, requireAdmin, setDoctorStatus);

module.exports = router;
