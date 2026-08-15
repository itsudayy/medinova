// Placeholder for a real admin panel later — for now, approving a doctor
// just requires knowing a shared secret set in .env (ADMIN_SECRET).
function requireAdminSecret(req, res, next) {
  const secret = req.headers['x-admin-secret'];
  if (!secret || secret !== process.env.ADMIN_SECRET) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  next();
}

module.exports = requireAdminSecret;
