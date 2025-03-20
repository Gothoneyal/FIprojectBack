const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  required_documents: [{ type: String }], // Array of document names
  office_hours: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Service", ServiceSchema);
