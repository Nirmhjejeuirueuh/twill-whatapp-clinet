# WhatsApp Web Clone with Twilio

A full-featured WhatsApp Web clone built with Next.js and TypeScript that connects to Twilio's WhatsApp Business API. This application provides a familiar WhatsApp Web interface for managing WhatsApp Business messages.

![WhatsApp Web Clone](./screenshot.png)

## Features

### Exact WhatsApp Web Features Implemented

- **Conversation List**: Sidebar with all conversations, search, and filters
- **Chat Window**: Full message history with message bubbles
- **Message Status**: Sent, delivered, and read indicators (✓, ✓✓, blue ✓✓)
- **Real-time Updates**: Auto-polling for new messages (5-second intervals)
- **Message Timestamps**: Time display with today/yesterday/date grouping
- **Avatar System**: Auto-generated colored avatars with initials
- **Unread Badges**: Unread message count per conversation
- **Search & Filter**: Search conversations and filter by unread/all
- **Dark Theme**: Authentic WhatsApp Web dark mode
- **Message Input**: Type and send messages with Enter key support
- **Attachment Menu**: UI for attachments (expandable)
- **New Chat**: Start conversations with new phone numbers
- **Settings Modal**: Configure Twilio credentials with connection test
- **Connection Status**: Visual feedback for connection state

## Prerequisites

1. **Twilio Account**: Sign up at [twilio.com](https://www.twilio.com/)
2. **WhatsApp Business API Access**: 
   - For testing: Use Twilio's WhatsApp Sandbox
   - For production: Apply for WhatsApp Business API access
3. **Node.js**: Version 18 or higher

## Getting Started

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd whatsapp-twilio
npm install
```

### 2. Configure Twilio Credentials

You have two options:

**Option A: Environment Variables**
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_WHATSAPP_NUMBER=+14155238886
```

**Option B: In-App Settings**
- Launch the app and click the Settings icon
- Enter your credentials in the modal
- Click "Test Connection" to verify
- Click "Save Settings"

### 3. Set Up WhatsApp Sandbox (for testing)

1. Go to [Twilio Console](https://console.twilio.com/)
2. Navigate to **Messaging** → **Try it out** → **Send a WhatsApp message**
3. Follow the instructions to join the sandbox
4. Send the join code from your WhatsApp to the sandbox number
5. Use the sandbox number (`+14155238886`) as your WhatsApp number

### 4. Configure Webhook (for real-time incoming messages)

To receive incoming messages in real-time:

1. Deploy your app or use ngrok for local development:
   ```bash
   ngrok http 3000
   ```

2. In Twilio Console, go to **Messaging** → **Settings** → **WhatsApp sandbox settings**

3. Set the webhook URL:
   - When a message comes in: `https://your-domain.com/api/webhook`
   - HTTP Method: POST

### 5. Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
whatsapp-twilio/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── messages/     # Fetch messages API
│   │   │   ├── send/         # Send message API
│   │   │   ├── webhook/      # Twilio webhook handler
│   │   │   └── conversations/# Get conversations API
│   │   ├── globals.css       # WhatsApp-themed styles
│   │   ├── layout.tsx        # App layout
│   │   └── page.tsx          # Main page
│   ├── components/
│   │   ├── ChatWindow.tsx    # Message display & input
│   │   ├── Sidebar.tsx       # Conversation list
│   │   ├── EmptyState.tsx    # No chat selected view
│   │   ├── SettingsModal.tsx # Twilio credentials form
│   │   ├── NewChatModal.tsx  # Start new conversation
│   │   ├── ConnectionStatus.tsx # Connection indicator
│   │   └── WhatsAppClient.tsx   # Main client component
│   ├── hooks/
│   │   └── useMessages.ts    # Messages hook
│   ├── lib/
│   │   ├── twilio.ts         # Twilio client utilities
│   │   └── store.ts          # In-memory message store
│   └── types/
│       └── index.ts          # TypeScript types
├── public/
├── .env.example
├── next.config.js
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

## API Endpoints

### GET /api/messages
Fetch all messages from Twilio.

Query parameters:
- `accountSid`: Twilio Account SID
- `authToken`: Twilio Auth Token
- `whatsappNumber`: Your WhatsApp number

### POST /api/send
Send a WhatsApp message.

Request body:
```json
{
  "to": "whatsapp:+1234567890",
  "body": "Hello!",
  "accountSid": "ACxxx",
  "authToken": "xxx"
}
```

### POST /api/webhook
Webhook endpoint for incoming Twilio messages.

### GET /api/conversations
Get grouped conversations from the message store.

## Customization

### Changing Poll Interval
Edit `src/components/WhatsAppClient.tsx`:
```typescript
const interval = setInterval(() => fetchMessages(), 2000); // Change 2000 to desired ms (2 seconds for real-time updates)
```

### Adding Media Support
The app is structured to support media messages. Extend the `handleSend` function and add file upload UI.

### Database Integration
Replace the in-memory store (`src/lib/store.ts`) with your preferred database (PostgreSQL, MongoDB, etc.).

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Troubleshooting

### "Twilio credentials not configured"
- Ensure environment variables are set correctly
- Or enter credentials in the Settings modal

### Messages not loading
- Verify your Account SID and Auth Token
- Check that your WhatsApp number is correct
- Ensure you've joined the sandbox (for testing)

### Incoming messages not appearing
- Configure the webhook URL in Twilio Console
- Use ngrok for local development
- Check browser console for errors

### Rate limits
Twilio has rate limits on API calls. The app polls every 30 seconds by default (optimized for Vercel free tier). For high-volume use, consider implementing webhooks properly.

## Security Notes

- Never commit `.env.local` with real credentials
- In production, store credentials server-side only
- The current implementation stores credentials in localStorage for convenience - remove this for production
- Implement proper authentication before deploying

## License

MIT

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request
# twill-whatapp-clinet
