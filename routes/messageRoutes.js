const express = require("express");
const Message = require("../models/messages");
const User = require("../models/user");
const router = express.Router();

// Send a message
router.post("/send", async (req, res) => {
  const { sender_id, receiver_id, message, complaint_id } = req.body;

  const sender = await User.findOne({ user_id: sender_id });
  const receiver = await User.findOne({ user_id: receiver_id });

  if (!sender || !receiver) return res.status(404).json({ error: "Sender or receiver not found" });

  const newMessage = new Message({ sender_id, receiver_id, message, complaint_id, createdAt: new Date() });

  await newMessage.save();
  res.status(201).json({ message: "Message sent successfully", newMessage });
});

// Get messages for a user
router.get("/user/:user_id", async (req, res) => {
  const messages = await Message.find({ $or: [{ sender_id: req.params.user_id }, { receiver_id: req.params.user_id }] });
  res.json(messages);
});

module.exports = router;
