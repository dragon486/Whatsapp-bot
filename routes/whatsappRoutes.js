const express = require("express");
const router = express.Router();

const {
  verifyWebhook,
  receiveMessage
} = require("../Controllers/whatsappController");

// GET → Webhook verification
router.get("/webhook", verifyWebhook);

// POST → Incoming WhatsApp messages
router.post("/webhook", receiveMessage);

module.exports = router;
