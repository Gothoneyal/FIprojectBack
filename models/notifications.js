const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
  user_id: { type: String, required: true, ref: "User" }, // Now uses national ID
  message: { type: String, required: true },
  is_read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Notification", NotificationSchema);
