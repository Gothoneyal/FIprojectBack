require("dotenv").config();

const escalateOldComplaints = require("./escalationScheduler");

const authRoutes = require("./routes/authRoutes");
const complaintRoutes = require("./routes/complaintRoutes"); // ✅ Import the router only
const messageRoutes = require("./routes/messageRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const serviceRoutes = require("./routes/serviceRoutes");

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");

connectDB();

escalateOldComplaints(); // Run on server startup

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes); // ✅ Now it's correct
app.use("/api/messages", messageRoutes);     // Two-way communication
app.use("/api/notifications", notificationRoutes); // Alerts & notifications
app.use("/api/services", serviceRoutes);     // Government service information

app.get("/", (req, res) => {
  res.json({ message: "API is working!" });
});

app.use((req, res, next) => {
  console.log(`🛑 Incoming request: ${req.method} ${req.url}`);
  next();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
