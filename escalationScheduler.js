const Complaint = require("./models/Complaint");
const checkEscalation = require("./routes/complaintRoutes"); // ✅ Import function
const sendEmail = require("./utils/emailService");

const escalateOldComplaints = async () => {
  console.log("🔄 Running escalation check...");

  const complaints = await Complaint.find({ status: { $ne: "Resolved" } });

  for (let complaint of complaints) {
    await checkEscalation(complaint); // ✅ Now works correctly
  }
};

// Run the check every 24 hours
setInterval(escalateOldComplaints, 24 * 60 * 60 * 1000);

module.exports = escalateOldComplaints;
