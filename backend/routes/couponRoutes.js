const express = require('express');
const router = express.Router();
const verifyFirebaseToken = require('../middleware/verifyFirebaseToken');
const requirePatient = require('../middleware/requirePatient');
const requireAdminSecret = require('../middleware/requireAdminSecret');
const { checkCoupon, createCoupon } = require('../controllers/couponController');

router.get('/:code', verifyFirebaseToken, requirePatient, checkCoupon);
router.post('/', requireAdminSecret, createCoupon);

module.exports = router;
