const stripe = require('../config/stripe');

const PREMIUM_PRICE_CENTS = 9999; // $99.99 one-time

// CLIENT_URL may hold a comma-separated allow-list for CORS. Stripe redirect
// URLs need exactly one origin, so always take the first entry.
const clientUrl = () => (process.env.CLIENT_URL || '').split(',')[0].trim();

async function createPremiumCheckout(req, res) {
  try {
    const user = req.mongoUser;

    if (user.isPremium) {
      return res.status(400).json({ message: 'Already a premium member' });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      // Pin the session to the signed-in user's own email — see the same note
      // in appointmentController: without it Stripe's Link wallet suggests
      // whichever address this browser used last.
      customer_email: user.email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'MediNova Premium Membership (1 year)',
              description: 'Priority booking, exclusive seminars & health programs, premium-only discount coupons',
            },
            unit_amount: PREMIUM_PRICE_CENTS,
          },
          quantity: 1,
        },
      ],
      success_url: `${clientUrl()}/premium/confirm?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${clientUrl()}/premium`,
      // `purpose` lets confirmPremium reject session ids from other flows
      // (e.g. an appointment payment) being replayed here.
      metadata: { userId: user._id.toString(), purpose: 'premium' },
    });

    res.json({ checkoutUrl: session.url });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function confirmPremium(req, res) {
  const { sessionId } = req.body;
  if (!sessionId) return res.status(400).json({ message: 'sessionId is required' });

  try {
    const user = req.mongoUser;
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // A paid session alone proves nothing — it must be a premium purchase that
    // *this* user paid for. Otherwise any paid session id (including someone
    // else's, or this user's own appointment payment) could unlock premium.
    if (session.metadata?.purpose !== 'premium') {
      return res.status(400).json({ message: 'Not a premium checkout session' });
    }
    if (session.metadata?.userId !== user._id.toString()) {
      return res.status(403).json({ message: 'Session does not belong to this account' });
    }
    if (session.payment_status !== 'paid') {
      return res.status(400).json({ message: 'Payment not completed' });
    }

    if (!user.isPremium) {
      user.isPremium = true;
      user.premiumSince = new Date();
      await user.save();
    }

    res.json({ isPremium: user.isPremium, premiumSince: user.premiumSince });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = { createPremiumCheckout, confirmPremium };
