const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  user_id: { type: String, required: true, unique: true }, // National ID Number
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["citizen", "woreda_officer", "kefle_ketema_officer", "superadmin"], default: "citizen" },
  createdAt: { type: Date, default: Date.now }
});
// ✅ Fix: Prevent duplicate model compilation
const User = mongoose.models.User || mongoose.model("User", UserSchema);

module.exports = User;
