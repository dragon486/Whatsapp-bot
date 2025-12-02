const OpenAI = require("openai");
require("dotenv").config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_KEY
});

async function generateAIResponse(userMessage) {
  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You are a friendly WhatsApp assistant." },
      { role: "user", content: userMessage }
    ]
  });

  return response.choices[0].message.content;
}

module.exports = generateAIResponse;
