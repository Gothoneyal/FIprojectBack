const express = require("express");
const Notification = require("../models/notifications");
const router = express.Router();

// Get user notifications
router.get("/:user_id", async (req, res) => {
  const notifications = await Notification.find({ user_id: req.params.user_id });
  res.json(notifications);
});

// Mark notification as read
router.put("/:id", async (req, res) => {
  const notification = await Notification.findByIdAndUpdate(req.params.id, { is_read: true }, { new: true });

  if (!notification) return res.status(404).json({ error: "Notification not found" });
  res.json({ message: "Notification marked as read", notification });
});

module.exports = router;
