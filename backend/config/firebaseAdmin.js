const { initializeApp, getApps, cert } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');

// Locally, the raw JSON key file is easiest. In production the file never
// exists (it's git-ignored), so we accept the same JSON pasted into a single
// env var instead — that's the standard way to hand a host a credential
// without committing it to the repo.
const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
  : require('../firebase-service-account.json');

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
  });
}

module.exports = { auth: getAuth() };
