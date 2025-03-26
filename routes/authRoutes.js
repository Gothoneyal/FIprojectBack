const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

// Register User
router.post("/register", async (req, res) => {
  const { user_id, name, email, password, role } = req.body;

  if (!user_id || !name || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const existingUser = await User.findOne({ user_id });
  if (existingUser) return res.status(400).json({ error: "User already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ user_id, name, email, password: hashedPassword, role });

  await newUser.save();
  res.status(201).json({ message: "User registered successfully", user: newUser });
});

// Login User
router.post("/login", async (req, res) => {
  const { user_id, email, password } = req.body;

  const user = await User.findOne({ $or: [{ user_id }, { email }] });
  if (!user) return res.status(404).json({ error: "User not found" });

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return res.status(400).json({ error: "Invalid password" });

  const token = jwt.sign({ userId: user.user_id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

  res.json({ message: "Login successful", token });
});

// Get Profile
router.get("/profile", async (req, res) => {
  const { user_id } = req.query;
  const user = await User.findOne({ user_id }).select("-password");
  if (!user) return res.status(404).json({ error: "User not found" });

  res.json(user);
});

module.exports = router;
