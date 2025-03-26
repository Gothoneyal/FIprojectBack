const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ✅ Authenticate Users
const authenticateUser = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1]; // Extract token
    if (!token) return res.status(401).json({ error: "Access denied. No token provided." });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findOne({ user_id: decoded.userId });

    if (!req.user) return res.status(401).json({ error: "Invalid token. User not found." });

    next(); // ✅ Move to the next function
  } catch (error) {
    res.status(401).json({ error: "Invalid token." });
  }
};

// ✅ Authorize Admins Only
const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== "superadmin" && req.user.role !== "kefle_ketema_officer" && req.user.role !== "woreda_officer") {
    return res.status(403).json({ error: "Access denied. Admins only." });
  }
  next();
};

module.exports = { authenticateUser, authorizeAdmin };
