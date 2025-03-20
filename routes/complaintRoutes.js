const express = require("express");
const Complaint = require("../models/Complaint");
const User = require("../models/user");
const { authenticateUser, authorizeAdmin } = require("../middleware/authMiddleware");
const sendEmail = require("../utils/emailService");

const router = express.Router();

// ⏳ Escalation time limits in milliseconds (days * 24 * 60 * 60 * 1000)
const ESCALATION_TIMES = {
  "Woreda": 7 * 24 * 60 * 60 * 1000,
  "Kefle Ketema": 5 * 24 * 60 * 60 * 1000
};

// ✅ Function to Check Escalation
const checkEscalation = async (complaint) => {
  const now = new Date();
  const timeElapsed = now - complaint.lastUpdated;

  if (complaint.status !== "Resolved") {
    let newEscalationLevel = null;

    if (complaint.escalation_level === "Woreda" && timeElapsed > ESCALATION_TIMES["Woreda"]) {
      newEscalationLevel = "Kefle Ketema";
    } else if (complaint.escalation_level === "Kefle Ketema" && timeElapsed > ESCALATION_TIMES["Kefle Ketema"]) {
      newEscalationLevel = "Superadmin";
    }

    if (newEscalationLevel) {
      complaint.escalation_level = newEscalationLevel;
      complaint.lastUpdated = new Date();
      await complaint.save();

      // 📧 Send Email Notifications
      const citizen = await User.findOne({ user_id: complaint.user_id });
      const admin = await User.findOne({ role: newEscalationLevel.toLowerCase().replace(" ", "_") });

      if (citizen) {
        sendEmail(
          citizen.email,
          "Complaint Escalated",
          `Your complaint has been escalated to ${newEscalationLevel}.`
        );
      }

      if (admin) {
        sendEmail(
          admin.email,
          "New Complaint Assigned",
          `A new complaint has been escalated to your level (${newEscalationLevel}). Please review it.`
        );
      }

      console.log(`🚨 Complaint ${complaint._id} escalated to ${newEscalationLevel}`);
    }
  }
};

// ✅ Submit a New Complaint (Citizen)
router.post("/", authenticateUser, async (req, res) => {
  const { user_id, description, category } = req.body;

  if (!user_id || !description || !category) {
    return res.status(400).json({ error: "User ID, description, and category are required" });
  }

  const user = await User.findOne({ user_id });
  if (!user) return res.status(404).json({ error: "User not found" });

  const newComplaint = new Complaint({
    user_id,
    description,
    category,
    status: "Pending",
    escalation_level: "Woreda",
    createdAt: new Date(),
    lastUpdated: new Date()
  });

  await newComplaint.save();
  res.status(201).json({ message: "Complaint submitted successfully", newComplaint });
});

// ✅ Get Complaints for a Specific User
router.get("/user/:user_id", authenticateUser, async (req, res) => {
  if (req.user.user_id !== req.params.user_id && req.user.role !== "superadmin") {
    return res.status(403).json({ error: "Unauthorized to view these complaints" });
  }

  const complaints = await Complaint.find({ user_id: req.params.user_id });
  res.json(complaints);
});

// ✅ Admin Updates Complaint Status (Auto-Escalation Applied)
router.put("/:id", authenticateUser, authorizeAdmin, async (req, res) => {
  console.log("✅ Update complaint request received!"); // Step 1: Confirm API is hit

  const { status } = req.body;
  const complaintId = req.params.id;

  console.log("📌 Complaint ID:", complaintId); // Step 2: Log complaint ID

  try {
    // Find complaint
    const complaint = await Complaint.findById(complaintId);
    console.log("✅ Complaint found:", complaint); // Step 3: Log retrieved complaint

    if (!complaint) {
      console.log("❌ Complaint not found!"); // Step 4: Log missing complaint
      return res.status(404).json({ error: "Complaint not found" });
    }

    // 🔄 Check if complaint needs automatic escalation
    console.log("🔄 Checking escalation...");
    await checkEscalation(complaint);
    console.log("✅ Escalation check done!");

    // ✅ Manually update status if provided
    if (status) {
      complaint.status = status;
    }

    complaint.lastUpdated = new Date();
    await complaint.save();
    console.log("✅ Complaint updated successfully!"); // Step 5: Log success

    res.json({ message: "Complaint updated", complaint });

  } catch (error) {
    console.error("❌ Error updating complaint:", error.message); // Step 6: Log error
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// ✅ Get All Complaints (Admins Only)
router.get("/all", authenticateUser, authorizeAdmin, async (req, res) => {
  const complaints = await Complaint.find();
  res.json(complaints);
});

module.exports = checkEscalation;
//module.exports = router; ✅ Export only the router

