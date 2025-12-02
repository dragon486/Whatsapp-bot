// Controllers/whatsappController.js
const axios = require("axios");

// ----------------------
// VERIFY WEBHOOK (GET)
// ----------------------
const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "AmicoXbotverify";

exports.verifyWebhook = (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  console.log("🔍 Webhook verification request:", { mode, token, challenge });

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ WEBHOOK VERIFIED SUCCESSFULLY");
    return res.status(200).send(challenge);
  }

  console.log("❌ WEBHOOK VERIFICATION FAILED");
  return res.sendStatus(403);
};

// ----------------------
// SEND MESSAGE TO USER
// ----------------------
async function replyToUser(waId, message) {
  try {
    await axios({
      method: "POST",
      url: `https://graph.facebook.com/v17.0/${process.env.PHONE_NUMBER_ID}/messages`,
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
      data: {
        messaging_product: "whatsapp",
        to: waId,
        type: "text",
        text: { body: message },
      },
    });

    console.log(`📤 Reply sent to ${waId}: ${message}`);
  } catch (error) {
    console.error(
      "❌ Error sending message:",
      error.response?.data || error.message
    );
  }
}

// ----------------------
// HANDLE INCOMING MESSAGE (POST)
// ----------------------
exports.receiveMessage = async (req, res) => {
  console.log("📩 Incoming WhatsApp Message:", JSON.stringify(req.body, null, 2));

  try {
    const data = req.body;

    const message =
      data?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    if (!message) {
      console.log("⚠️ No message payload");
      return res.sendStatus(200);
    }

    const sender = message.from;
    const userText = message.text?.body || "";

    console.log(`👤 User (${sender}) says: ${userText}`);

    // AUTO-REPLY
    await replyToUser(sender, `I received your message: ${userText}`);

    return res.sendStatus(200);
  } catch (err) {
    console.error("❌ Error handling incoming message:", err);
    return res.sendStatus(500);
  }
};

