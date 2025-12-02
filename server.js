const express = require("express");
const cors = require("cors");
require("dotenv").config();
const axios = require("axios");
const generateAIResponse = require("./utils/ai.js"); // <-- AI replies here

// 🛑 Prevent duplicate replies
const processedMessages = new Set();

const app = express();
app.use(express.json());
app.use(cors());

const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "AmicoXbotverify";
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;

// --------------------------------------------------
// Logging middleware
// --------------------------------------------------
app.use((req, res, next) => {
  console.log(`➡️ Incoming request: ${req.method} ${req.url}`);
  next();
});

// --------------------------------------------------
// WEBHOOK VERIFICATION (GET)
// --------------------------------------------------
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("🔥 WEBHOOK VERIFIED!");
    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);
});

// --------------------------------------------------
// MAIN WEBHOOK RECEIVER (POST)
// --------------------------------------------------
app.post("/webhook", async (req, res) => {
  console.log("📩 Incoming webhook:", JSON.stringify(req.body, null, 2));

  const message = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
  if (!message) return res.sendStatus(200);

  const messageId = message.id;
  const userText = message.text?.body || "";
  const from = message.from;

  // 🛑 Ignore duplicates
  if (processedMessages.has(messageId)) {
    console.log("⚠️ Duplicate message ignored:", messageId);
    return res.sendStatus(200);
  }
  processedMessages.add(messageId);

  console.log("👤 User says:", userText);

  // --------------------------------------------------
  // BUSINESS LOGIC (Before AI)
  // --------------------------------------------------
  let replyText = null;
  const text = userText.toLowerCase();

  if (text === "hi" || text === "hello") {
    replyText = "👋 Hi! Welcome. How can I help you today?";
  }

  else if (text.includes("price")) {
    replyText = "💸 Our pricing starts at ₹499. Would you like our full catalog?";
  }

  else if (text.includes("help")) {
    replyText = "Here are the options:\n1️⃣ View products\n2️⃣ Track order\n3️⃣ Talk to support";
  }

  // --------------------------------------------------
  // AI FALLBACK (if no rule matched)
  // --------------------------------------------------
  if (!replyText) {
    replyText = await generateAIResponse(userText);
  }

  // --------------------------------------------------
  // SEND REPLY TO WHATSAPP
  // --------------------------------------------------
  try {
    await axios.post(
      `https://graph.facebook.com/v20.0/${PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to: from,
        text: { body: replyText },
      },
      {
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Reply sent:", replyText);

  } catch (err) {
    console.error("❌ Error sending reply:", err.response?.data || err.message);
  }

  return res.sendStatus(200);
});

// --------------------------------------------------
// START SERVER
// --------------------------------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
