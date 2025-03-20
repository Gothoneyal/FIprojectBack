const express = require("express");
const Service = require("../models/services");
const router = express.Router();

// Get all services
router.get("/", async (req, res) => {
  const services = await Service.find();
  res.json(services);
});

// Get service by ID
router.get("/:id", async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) return res.status(404).json({ error: "Service not found" });

  res.json(service);
});

module.exports = router;
