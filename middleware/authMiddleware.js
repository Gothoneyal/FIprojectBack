const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware to verify JWT and extract user role
const authenticateUser = async (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ error: "Access denied. No token provided." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findOne({ user_id: decoded.userId }).select("-password");
    if (!req.user) return res.status(404).json({ error: "User not found" });

    next();
  } catch (error) {
    res.status(400).json({ error: "Invalid token" });
  }
};

// Middleware to check if user is an admin
const authorizeAdmin = (req, res, next) => {
  if (!["woreda_officer", "kefle_ketema_officer", "superadmin"].includes(req.user.role)) {
    return res.status(403).json({ error: "Unauthorized. Admins only." });
  }
  next();
};

module.exports = { authenticateUser, authorizeAdmin };
