const express = require('express');
const router = express.Router();
const verifyFirebaseToken = require('../middleware/verifyFirebaseToken');
const requirePatient = require('../middleware/requirePatient');
const { createPremiumCheckout, confirmPremium } = require('../controllers/premiumController');

router.post('/checkout', verifyFirebaseToken, requirePatient, createPremiumCheckout);
router.post('/confirm', verifyFirebaseToken, requirePatient, confirmPremium);

module.exports = router;
