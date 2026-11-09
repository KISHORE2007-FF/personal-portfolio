const express = require("express");
const { pool } = require("../config/db");

const router = express.Router();

router.post("/", async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ message: "Name, email and message are required." });
  }
  const cleanEmail = String(email).trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    return res.status(400).json({ message: "Please enter a valid email address." });
  }
  if (String(message).trim().length < 10) {
    return res.status(400).json({ message: "Message must contain at least 10 characters." });
  }

  try {
    await pool.execute(
      "INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)",
      [String(name).trim(), cleanEmail, subject ? String(subject).trim() : null, String(message).trim()]
    );
    res.status(201).json({ message: "Thanks! Your message has been sent successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to send your message right now." });
  }
});

module.exports = router;
