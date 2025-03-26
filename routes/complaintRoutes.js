const express = require("express");
const Complaint = require("../models/Complaint");
const User = require("../models/User");
const { authenticateUser, authorizeAdmin } = require("../middleware/authMiddleware");
const sendEmail = require("../utils/emailService");

const router = express.Router();

// ✅ Submit a New Complaint (Citizen)
router.post("/", authenticateUser, async (req, res) => {
  console.log("✅ POST /api/complaints hit!");

  const { user_id, description, category } = req.body;
  console.log("📌 Request body:", req.body);

  if (!user_id || !description || !category) {
    console.log("❌ Missing fields in request");
    return res.status(400).json({ error: "User ID, description, and category are required" });
  }

  try {
    console.log("🔍 Searching for user...");
    const user = await User.findOne({ user_id });
    console.log("✅ User found:", user);

    if (!user) {
      console.log("❌ User not found!");
      return res.status(404).json({ error: "User not found" });
    }

    console.log("📝 Creating new complaint...");
    const newComplaint = new Complaint({
      user_id,
      description,
      category,
      status: "Pending",
      escalation_level: "Woreda",
      createdAt: new Date(),
      lastUpdated: new Date(),
    });

    console.log("💾 Saving complaint to database...");
    await newComplaint.save();
    console.log("✅ Complaint saved!");

    res.status(201).json({ message: "Complaint submitted successfully", newComplaint });
  } catch (error) {
    console.error("❌ Error submitting complaint:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Get Complaints for a Specific User
router.get("/user/:user_id", authenticateUser, async (req, res) => {
  console.log("✅ GET /api/complaints/user/:user_id hit!");

  if (req.user.user_id !== req.params.user_id && req.user.role !== "superadmin") {
    return res.status(403).json({ error: "Unauthorized to view these complaints" });
  }

  const complaints = await Complaint.find({ user_id: req.params.user_id });
  console.log("✅ Complaints found:", complaints.length);
  res.json(complaints);
});

// ✅ Admin Updates Complaint Status
router.put("/:id", authenticateUser, authorizeAdmin, async (req, res) => {
  console.log("✅ PUT /api/complaints/:id request received!");

  const { status } = req.body;
  const complaintId = req.params.id;
  console.log("📌 Complaint ID:", complaintId);

  try {
    console.log("🔍 Searching for complaint...");
    const complaint = await Complaint.findById(complaintId);
    console.log("✅ Complaint found:", complaint);

    if (!complaint) {
      return res.status(404).json({ error: "Complaint not found" });
    }

    if (status) {
      complaint.status = status;
    }

    complaint.lastUpdated = new Date();
    console.log("💾 Saving complaint update...");
    await complaint.save();
    console.log("✅ Complaint updated successfully!");

    res.json({ message: "Complaint updated", complaint });
  } catch (error) {
    console.error("❌ Error updating complaint:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Get All Complaints (Admins Only)
router.get("/all", authenticateUser, authorizeAdmin, async (req, res) => {
  console.log("✅ GET /api/complaints/all hit!");

  const complaints = await Complaint.find();
  console.log("✅ All complaints retrieved:", complaints.length);
  res.json(complaints);
});

module.exports = router;
