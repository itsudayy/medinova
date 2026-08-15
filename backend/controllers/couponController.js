const Coupon = require('../models/Coupon');

// Shared validity check used by both the standalone lookup endpoint and
// appointment creation. Returns the coupon doc or throws with a message.
async function findValidCoupon(code, user) {
  const coupon = await Coupon.findOne({ code: code.toUpperCase().trim() });
  if (!coupon || !coupon.active) throw { status: 404, message: 'Invalid coupon code' };
  if (coupon.expiresAt && coupon.expiresAt < new Date()) throw { status: 400, message: 'Coupon has expired' };
  if (coupon.maxUses != null && coupon.usedCount >= coupon.maxUses) {
    throw { status: 400, message: 'Coupon has reached its usage limit' };
  }
  // Coupon eligibility is a server-side fact from the user's own record —
  // never trust a client-sent isPremium flag here.
  if (coupon.premiumOnly && !user.isPremium) {
    throw { status: 403, message: 'This coupon is only available to Premium members' };
  }
  return coupon;
}

function computeDiscount(coupon, fee) {
  const raw = coupon.type === 'percent' ? (fee * coupon.value) / 100 : coupon.value;
  return Math.min(Math.round(raw * 100) / 100, fee); // never discount below $0
}

// GET /api/coupons/:code — lets the frontend preview the discount before booking.
async function checkCoupon(req, res) {
  try {
    const coupon = await findValidCoupon(req.params.code, req.mongoUser);
    res.json({ code: coupon.code, type: coupon.type, value: coupon.value });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message || 'Server error' });
  }
}

// POST /api/coupons — admin-only, gated by requireAdminSecret same as doctor approval.
async function createCoupon(req, res) {
  const { code, type, value, premiumOnly, expiresAt, maxUses } = req.body;
  if (!code || !['percent', 'fixed'].includes(type) || typeof value !== 'number') {
    return res.status(400).json({ message: 'code, type (percent|fixed) and numeric value are required' });
  }

  try {
    const coupon = await Coupon.create({
      code,
      type,
      value,
      premiumOnly: premiumOnly !== false,
      expiresAt: expiresAt || null,
      maxUses: maxUses ?? null, // ?? not || — maxUses: 0 is a valid "no uses left"
    });
    res.status(201).json(coupon);
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ message: 'Coupon code already exists' });
    res.status(500).json({ message: err.message });
  }
}

module.exports = { checkCoupon, createCoupon, findValidCoupon, computeDiscount };
