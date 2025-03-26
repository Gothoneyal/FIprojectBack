const Complaint = require("../models/Complaint");
const User = require("../models/User");
const sendEmail = require("./emailService");

// Escalation time limits in milliseconds
const ESCALATION_TIMES = {
  "Woreda": 7 * 24 * 60 * 60 * 1000, 
  "Kefle Ketema": 5 * 24 * 60 * 60 * 1000
};

// ✅ Function to Check Escalation
const checkEscalation = async (complaint) => {
  console.log("🔄 Escalation check started for complaint:", complaint._id);

  const now = new Date();
  const timeElapsed = now - complaint.lastUpdated;
  console.log("⏳ Time since last update:", timeElapsed);

  let newEscalationLevel = null;

  if (complaint.status !== "Resolved") {
    if (complaint.escalation_level === "Woreda" && timeElapsed > ESCALATION_TIMES["Woreda"]) {
      newEscalationLevel = "Kefle Ketema";
    } else if (complaint.escalation_level === "Kefle Ketema" && timeElapsed > ESCALATION_TIMES["Kefle Ketema"]) {
      newEscalationLevel = "Superadmin";
    }
  }

  if (newEscalationLevel) {
    console.log(`🚀 Escalating complaint ${complaint._id} to ${newEscalationLevel}`);

    complaint.escalation_level = newEscalationLevel;
    complaint.lastUpdated = new Date();
    await complaint.save();

    console.log("✅ Escalation saved!");
  } else {
    console.log("⚡ No escalation needed.");
  }
};

module.exports = checkEscalation; // ✅ Correct Export
