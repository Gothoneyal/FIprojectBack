const nodemailer = require("nodemailer");
require("dotenv").config();

// Configure email transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Function to send an email
const sendEmail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: `"Complaint System" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text
    });

    console.log(`📧 Email sent to ${to}`);
  } catch (error) {
    console.error(`❌ Email sending failed: ${error}`);
  }
};

module.exports = sendEmail;
