const Complaint = require("./models/Complaint");
const checkEscalation = require("./utils/escalation"); // ✅ Correct Import
const sendEmail = require("./utils/emailService");

const escalateOldComplaints = async () => {
  console.log("🔄 Running escalation check...");

  try {
    const complaints = await Complaint.find({ status: { $ne: "Resolved" } });

    for (let complaint of complaints) {
      if (typeof checkEscalation === "function") {
        await checkEscalation(complaint); // ✅ Now works correctly
      } else {
        console.error("❌ checkEscalation is NOT a function!");
      }
    }
  } catch (error) {
    console.error("❌ Error in escalation process:", error.message);
  }
};

// Run the check every 24 hours
setInterval(escalateOldComplaints, 24 * 60 * 60 * 1000);

module.exports = escalateOldComplaints;
