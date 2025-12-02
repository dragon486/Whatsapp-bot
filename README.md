# WhatsApp Bot 🤖

An intelligent WhatsApp chatbot built with Node.js and Express that connects to Meta's Cloud API. The bot handles customer queries with predefined responses and uses AI-powered fallback for natural conversations.

**Bot Phone Number:** `+1 (555) 168-8079`

## ✨ Features

- 📱 **WhatsApp Business API Integration** - Connects to Meta's Cloud API for sending/receiving messages
- 🤖 **AI-Powered Responses** - Uses OpenAI GPT-4o-mini for intelligent conversation fallback
- 🎯 **Smart Message Handling** - Predefined responses for common queries (greetings, pricing, help)
- 🛡️ **Duplicate Prevention** - Advanced duplicate detection to prevent multiple replies
- ⚡ **Fast Response** - Immediate webhook acknowledgment to prevent retries
- 🧹 **Memory Management** - Automatic cleanup of processed messages

## 🛠️ Technologies Used

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Meta Cloud API** - WhatsApp Business API
- **OpenAI API** - GPT-4o-mini for AI responses
- **Axios** - HTTP client
- **dotenv** - Environment variable management

## 📋 Prerequisites

Before you begin, ensure you have:

- Node.js (v14 or higher) and npm installed
- A Meta Developer account with WhatsApp Business API access
- An OpenAI API key
- ngrok (for local development/testing)

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/dragon486/Whatsapp-bot.git
   cd Whatsapp-bot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   PORT=3000
   VERIFY_TOKEN=your_verify_token_here
   WHATSAPP_TOKEN=your_whatsapp_access_token
   PHONE_NUMBER_ID=your_phone_number_id
   OPENAI_KEY=your_openai_api_key
   ```

   > ⚠️ **Important:** Never commit your `.env` file to git. It's already included in `.gitignore`.

## ⚙️ Configuration

### Getting Your WhatsApp API Credentials

1. Go to [Meta for Developers](https://developers.facebook.com/)
2. Create a new app or select an existing one
3. Add WhatsApp product to your app
4. Get your:
   - **WhatsApp Token** (Access Token)
   - **Phone Number ID** (from WhatsApp > API Setup)
   - Set a **Verify Token** (can be any string you choose)

### Getting Your OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Navigate to API Keys section
3. Create a new secret key
4. Copy and add it to your `.env` file

## 🏃 Running the Bot

### 1. Start the server
```bash
node server.js
```

You should see:
```
🚀 Server running on port 3000
```

### 2. Expose your local server with ngrok

In a new terminal window:
```bash
ngrok http 3000
```

Copy the HTTPS URL (e.g., `https://abc123.ngrok-free.app`)

### 3. Configure Webhook in Meta Dashboard

1. Go to your Meta App Dashboard
2. Navigate to **WhatsApp > Configuration**
3. Click **Edit** on Webhook
4. Set **Callback URL** to: `https://your-ngrok-url.ngrok-free.app/webhook`
5. Set **Verify Token** to match your `VERIFY_TOKEN` in `.env`
6. Click **Verify and Save**
7. Subscribe to **messages** field

## 📱 Usage

Once configured, users can send messages to your bot number `+1 (555) 168-8079`:

- **"hi" or "hello"** → Gets a welcome message
- **"price"** → Gets pricing information
- **"help"** → Gets help options
- **Any other message** → Gets an AI-powered response

## 📁 Project Structure

```
Whatsapp_bot/
├── Controllers/
│   └── whatsappController.js    # Controller logic
├── routes/
│   └── whatsappRoutes.js        # Route definitions
├── utils/
│   └── ai.js                     # OpenAI integration
├── server.js                     # Main server file
├── package.json                  # Dependencies
├── .env                         # Environment variables (not in git)
└── README.md                    # This file
```

## 🔧 How It Works

1. **Webhook Receives Message**: WhatsApp sends webhook to `/webhook` endpoint
2. **Duplicate Check**: System checks if message was already processed
3. **Immediate Response**: Server responds with 200 OK immediately to prevent retries
4. **Message Processing**: 
   - Checks for predefined responses (hi, price, help)
   - Falls back to AI if no match found
5. **Send Reply**: Bot sends response back to user via WhatsApp API

## 🛡️ Duplicate Prevention

The bot uses advanced duplicate detection:
- Unique key combining `messageId + phoneNumber + timestamp`
- Filters out status updates (delivered/read)
- Only processes text messages
- Automatic cleanup of old processed messages (24-hour expiry)

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port (default: 5000) | No |
| `VERIFY_TOKEN` | Token for webhook verification | Yes |
| `WHATSAPP_TOKEN` | Meta WhatsApp API access token | Yes |
| `PHONE_NUMBER_ID` | Your WhatsApp Business phone number ID | Yes |
| `OPENAI_KEY` | OpenAI API key | Yes |

## 🐛 Troubleshooting

### Bot not responding?
- Check if server is running on correct port
- Verify ngrok is forwarding to the same port
- Check webhook URL in Meta dashboard matches ngrok URL
- Verify all environment variables are set correctly

### Getting duplicate messages?
- The duplicate prevention system should handle this automatically
- Check server logs for "⚠️ Duplicate message ignored" messages
- Ensure server is responding quickly (within 20 seconds)

### Webhook verification failing?
- Ensure `VERIFY_TOKEN` in `.env` matches the one in Meta dashboard
- Check that ngrok URL is accessible
- Verify webhook endpoint is `/webhook`

## 📄 License

ISC

## 👤 Author

dragon486

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📞 Support

For issues or questions, please open an issue on GitHub.

---

**Note:** This bot requires active ngrok tunnel for local development. For production, deploy to a server with a public HTTPS endpoint.

