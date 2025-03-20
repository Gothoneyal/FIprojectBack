const mongoose = require("mongoose");

const AuditLogSchema = new mongoose.Schema({
  admin_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  action: { type: String, required: true },
  target_id: { type: mongoose.Schema.Types.ObjectId }, // Can reference any collection
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("AuditLog", AuditLogSchema);
