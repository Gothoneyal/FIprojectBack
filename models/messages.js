const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  sender_id: { type: String, required: true, ref: "User" }, // Now uses national ID
  receiver_id: { type: String, required: true, ref: "User" }, // Now uses national ID
  message: { type: String, required: true },
  complaint_id: { type: mongoose.Schema.Types.ObjectId, ref: "Complaint" }, // Complaint can still use ObjectId
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Message", MessageSchema);
