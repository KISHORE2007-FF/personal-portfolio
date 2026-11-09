function requireAdmin(req, res, next) {
  const expected = process.env.ADMIN_KEY;
  const supplied = req.get("X-Admin-Key");

  if (!expected || expected === "change-this-to-a-long-random-secret") {
    return res.status(503).json({ message: "Admin API is not configured. Set a private ADMIN_KEY." });
  }
  if (!supplied || supplied !== expected) {
    return res.status(401).json({ message: "Unauthorized. A valid X-Admin-Key header is required." });
  }
  next();
}

module.exports = requireAdmin;
