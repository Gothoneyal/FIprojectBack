const mongoose = require("mongoose");

const ComplaintSchema = new mongoose.Schema({
  user_id: { type: String, required: true, ref: "User" }, 
  description: { type: String, required: true },
  category: { type: String, required: true },
  status: { type: String, enum: ["Pending", "In Review", "Resolved", "Unresolved"], default: "Pending" },
  escalation_level: { type: String, enum: ["Woreda", "Kefle Ketema", "Superadmin"], default: "Woreda" },
  createdAt: { type: Date, default: Date.now },
  lastUpdated: { type: Date, default: Date.now } // Track last update time
});

//module.exports = mongoose.model("Complaint", ComplaintSchema);
// 🔹 Use existing model if it exists, otherwise create it
module.exports = mongoose.models.Complaint || mongoose.model("Complaint", ComplaintSchema);
