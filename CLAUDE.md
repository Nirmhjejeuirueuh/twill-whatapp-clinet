# WhatsApp-Twilio Project Context

## Project Summary
Full-featured WhatsApp Web clone built with Next.js that connects to Twilio's WhatsApp Business API. Provides an authentic WhatsApp Web interface for managing WhatsApp Business messages with real-time polling, message status indicators, and conversation management.

**Current Status:** MVP complete with core messaging features functional. Twilio API connection fixed and working (2025-12-13).

## Tech Stack

### Frontend
- **Next.js 16** (App Router) - React framework with SSR/CSR support
- **React 19** - UI library
- **TypeScript 5.9** - Type safety
- **Tailwind CSS 4.1** - Utility-first CSS framework
- **lucide-react** - Icon library
- **date-fns 4.1** - Date formatting utilities

### Backend
- **Next.js API Routes** - Serverless functions
- **Twilio SDK 5.10** - WhatsApp Business API integration
- **In-Memory Store** - Message/conversation storage (no database yet)

### Build Tools
- **PostCSS** with Tailwind plugin
- **Turbopack** - Fast bundler (Next.js 16 default)
- **TypeScript** compiler with strict mode

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── messages/route.ts      # GET: Fetch messages from Twilio
│   │   ├── send/route.ts          # POST: Send WhatsApp message
│   │   ├── webhook/route.ts       # POST: Twilio webhook handler
│   │   └── conversations/route.ts # GET: Get grouped conversations
│   ├── globals.css                # WhatsApp theme variables
│   ├── layout.tsx                 # Root layout
│   └── page.tsx                   # Home page (renders WhatsAppClient)
├── components/
│   ├── WhatsAppClient.tsx         # Main app orchestrator (state management)
│   ├── Sidebar.tsx                # Conversation list with search/filters
│   ├── ChatWindow.tsx             # Message display + input area
│   ├── EmptyState.tsx             # No chat selected placeholder
│   ├── SettingsModal.tsx          # Twilio credentials configuration
│   ├── NewChatModal.tsx           # Start new conversation
│   └── ConnectionStatus.tsx       # Twilio connection indicator
├── hooks/
│   └── useMessages.ts             # Message fetching/polling logic
├── lib/
│   ├── twilio.ts                  # Twilio client + utility functions
│   ├── store.ts                   # In-memory message store (singleton)
│   └── utils.ts                   # General utilities
└── types/
    └── index.ts                   # TypeScript interfaces
```

## Architecture Overview

### Data Flow
1. **Polling System**: Frontend polls `/api/messages` every 5 seconds (configurable)
2. **Message Storage**: API fetches from Twilio, stores in `MessageStore` singleton
3. **Real-time Webhooks**: Twilio POSTs to `/api/webhook` for incoming messages
4. **State Management**: React state in `WhatsAppClient.tsx` (no external state library)
5. **Persistence**: Twilio credentials stored in `localStorage` (client-side only)

### Key Components

**WhatsAppClient** (src/components/WhatsAppClient.tsx:21)
- Main orchestrator component
- Manages global state (conversations, selected chat, config)
- Handles message polling via `useEffect` hook
- Stores Twilio config in localStorage under key `'twilio_config'`

**MessageStore** (src/lib/store.ts:4)
- Singleton pattern for server-side message caching
- Methods: `addMessage()`, `addMessages()`, `getConversations()`, `markAsRead()`
- Maintains conversation grouping and unread counts
- Subscriber pattern for real-time updates

**API Routes**
- **GET /api/messages** (src/app/api/messages/route.ts:5): Fetch messages from Twilio, group into conversations
- **POST /api/send** (src/app/api/send/route.ts): Send message via Twilio
- **POST /api/webhook** (src/app/api/webhook/route.ts:5): Receive incoming messages from Twilio
- **GET /api/conversations** (src/app/api/conversations/route.ts): Get grouped conversations from store

### Authentication Flow
1. On first load, checks localStorage for `twilio_config`
2. If missing, opens `SettingsModal` automatically (src/components/WhatsAppClient.tsx:177)
3. User enters Account SID, Auth Token, WhatsApp Number
4. Config saved to localStorage and used for all API calls
5. Credentials passed as query params to API routes

## Code Style & Conventions

### Naming Conventions
- **Components**: PascalCase (e.g., `ChatWindow.tsx`)
- **Functions**: camelCase (e.g., `fetchMessages`, `handleSendMessage`)
- **Types/Interfaces**: PascalCase (e.g., `Message`, `Conversation`, `TwilioConfig`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `STORAGE_KEY`)
- **CSS Variables**: kebab-case with `--wa-` prefix (e.g., `--wa-green-dark`)

### TypeScript Patterns
- Strict mode enabled in tsconfig.json
- All API responses use `ApiResponse<T>` wrapper type
- Phone numbers always include `whatsapp:` prefix in backend
- Message direction: `'inbound' | 'outbound'`
- Status types: `'queued' | 'sent' | 'delivered' | 'read' | 'failed' | 'received'`

### Component Patterns
- **Client Components**: Use `'use client'` directive (all components in `src/components/`)
- **Server Components**: API routes use `'server-only'` import where needed
- **Hooks**: Custom hooks in `src/hooks/` (currently only `useMessages.ts`)
- **Props**: Explicit interface definitions for all component props
- **State**: Local React state (useState), no Redux/Zustand/etc.

### Styling
- **Tailwind Utility Classes**: Primary styling method
- **CSS Custom Properties**: WhatsApp color scheme in `globals.css:4-17`
- **Dark Theme**: Authentic WhatsApp Web dark mode colors
- **Responsive**: Mobile-first approach (not fully implemented yet)

### File Organization
- One component per file
- Co-locate related types in component files or use shared `types/index.ts`
- API routes in `app/api/[endpoint]/route.ts` structure
- Utilities in `lib/` folder

## Key Features Implemented

### Messaging
- ✅ Send/receive WhatsApp messages via Twilio
- ✅ Message status indicators (✓ sent, ✓✓ delivered, blue ✓✓ read)
- ✅ Message timestamps with smart formatting (today/yesterday/date)
- ✅ Message bubbles (green for outbound, gray for inbound)
- ✅ Auto-scroll to bottom on new messages
- ✅ Enter key to send (Shift+Enter for new line)

### Conversations
- ✅ Conversation list sorted by most recent message
- ✅ Unread message badges
- ✅ Auto-generated avatars with colored backgrounds
- ✅ Phone number formatting (last 2 digits as initials)
- ✅ Search conversations (by phone number)
- ✅ Filter by All/Unread

### UI/UX
- ✅ Authentic WhatsApp Web dark theme
- ✅ Real-time polling (5-second intervals)
- ✅ Connection status indicator
- ✅ Settings modal for Twilio configuration
- ✅ New chat modal (start conversations with new numbers)
- ✅ Empty state when no chat selected
- ✅ Loading states

### Configuration
- ✅ In-app settings modal
- ✅ Environment variable support (`.env.local`)
- ✅ Connection test in settings
- ✅ Persistent credentials (localStorage)

## API Endpoints Reference

### GET /api/messages
Fetches all messages from Twilio and groups into conversations.

**Query Parameters:**
- `accountSid`: Twilio Account SID (or uses env var)
- `authToken`: Twilio Auth Token (or uses env var)
- `whatsappNumber`: Your WhatsApp number (or uses env var)

**Response:**
```json
{
  "success": true,
  "data": {
    "messages": Message[],
    "conversations": Conversation[],
    "whatsappNumber": "whatsapp:+14155238886"
  }
}
```

### POST /api/send
Sends a WhatsApp message via Twilio.

**Request Body:**
```json
{
  "to": "whatsapp:+1234567890",
  "body": "Hello!",
  "mediaUrl": "https://...", // optional
  "accountSid": "ACxxx",
  "authToken": "xxx"
}
```

**Response:**
```json
{
  "success": true,
  "data": { /* Message object */ }
}
```

### POST /api/webhook
Twilio webhook endpoint for incoming messages.

**Expects:** FormData from Twilio with `MessageSid`, `Body`, `From`, `To`, etc.

**Response:** TwiML XML acknowledging receipt

### GET /api/conversations
Gets grouped conversations from the in-memory store.

**Response:**
```json
{
  "success": true,
  "data": Conversation[]
}
```

## Recent Fixes (2025-12-13)

### Twilio Connection Issues - FIXED ✅
- **Fixed Twilio client caching bug** (src/lib/twilio.ts:5-25): Client now properly updates when credentials change
- **Fixed variable reference error** in `resetTwilioClient()` function (line 29)
- **Added .env.local** file for Next.js to properly read environment variables
- **Added comprehensive logging** throughout Twilio API calls for easier debugging
- **Server running on** http://localhost:3000 with diagnostic logs

## Known Issues & Limitations

### Critical Issues
- **No Database**: Messages stored in-memory, lost on server restart
- **No Authentication**: Anyone with URL can access if credentials in env vars
- **Credentials in localStorage**: Not secure for production use
- **Polling Overhead**: 5-second polling may hit Twilio rate limits at scale
- **No Webhook Verification**: Webhook endpoint doesn't verify Twilio signature

### Minor Issues
- **No Media Support**: UI exists but image/video sending not fully implemented
- **No Message Search**: Can only search conversations by phone number
- **No Typing Indicators**: Not available via Twilio API
- **No Online Status**: Can't determine if contact is online
- **No Read Receipts**: Can mark as read locally but not sent back to Twilio
- **Avatar Generation**: Simple last-2-digits approach, could be improved
- **No Mobile Optimization**: Works but not fully responsive
- **No Dark/Light Toggle**: Only dark mode available
- **No Export/Archive**: Can't export conversation history

### Edge Cases
- Long phone numbers may overflow in UI
- Message order might be incorrect if system clocks differ
- No handling for deleted messages from Twilio
- Concurrent users will have state conflicts (in-memory store is shared)

## Next TODOs / Roadmap

### High Priority
1. **Add Database Integration** - Replace in-memory store with PostgreSQL/MongoDB
   - Create schema for messages, conversations, users
   - Implement proper indexing for fast queries
   - Add migration scripts

2. **Implement Proper Authentication** - Add user login/signup
   - OAuth with Google/GitHub
   - Session management
   - User-specific Twilio credentials

3. **Webhook Signature Verification** - Secure webhook endpoint
   - Verify `X-Twilio-Signature` header
   - Prevent unauthorized webhook calls

4. **Media Message Support** - Enable image/video sending
   - File upload UI in ChatWindow
   - Media URL handling in API routes
   - Image preview in message bubbles

### Medium Priority
5. **Replace Polling with WebSockets** - Real-time updates without polling
   - Use Socket.io or native WebSocket
   - Push notifications from webhook to clients
   - Reduce API calls to Twilio

6. **Message Search** - Full-text search across all conversations
   - Search by message body content
   - Date range filters
   - Highlight search results

7. **Mobile Responsive Design** - Optimize for mobile devices
   - Collapsible sidebar
   - Touch-friendly UI
   - Native app feel

8. **Conversation Management** - Archive, delete, mute conversations
   - Archive old chats
   - Delete conversations
   - Mute notifications

### Low Priority
9. **Export Functionality** - Export chat history
   - PDF export
   - CSV export
   - Date range selection

10. **Multi-user Support** - Multiple team members using same Twilio account
    - Role-based access
    - Assignment/routing
    - Team inbox view

11. **Message Templates** - Quick replies and saved templates
    - Common response templates
    - Variables/placeholders
    - Template management UI

12. **Analytics Dashboard** - Message metrics and insights
    - Message volume over time
    - Response time metrics
    - Popular contacts

## Testing Scenarios

### Manual Test Cases (Not Yet Implemented)
- [ ] Send message to new contact
- [ ] Receive message from Twilio sandbox
- [ ] Handle media messages (images)
- [ ] Test with multiple concurrent conversations
- [ ] Verify message status updates (sent → delivered → read)
- [ ] Test webhook failure recovery
- [ ] Test rate limit handling
- [ ] Verify unread count accuracy
- [ ] Test search functionality
- [ ] Test settings modal validation
- [ ] Test connection status indicator updates

### Automated Tests (None Yet)
- [ ] Unit tests for MessageStore
- [ ] Unit tests for Twilio utility functions
- [ ] Integration tests for API routes
- [ ] E2E tests for message sending flow
- [ ] E2E tests for conversation selection
- [ ] Component tests for all UI components

## Environment Variables

Required variables (see `.env.example`):
```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_WHATSAPP_NUMBER=+14155238886
```

For testing, use Twilio's sandbox number: `+14155238886`

## Development Workflow

### Setup
```bash
npm install
cp .env.example .env.local
# Edit .env.local with your Twilio credentials
npm run dev
```

### Common Tasks
- **Change polling interval**: Edit `src/components/WhatsAppClient.tsx:105` (currently 5000ms)
- **Add new API route**: Create `src/app/api/[name]/route.ts`
- **Add new component**: Create in `src/components/`, use `'use client'` directive
- **Update types**: Edit `src/types/index.ts`
- **Modify theme colors**: Edit CSS variables in `src/app/globals.css:4-17`

### Debugging
- Check browser console for client-side errors
- Check terminal output for API route errors
- Test Twilio connection in Settings modal
- Verify webhook URL in Twilio Console
- Use ngrok for local webhook testing: `ngrok http 3000`

## Deployment Notes

### Vercel (Recommended)
1. Push to GitHub
2. Import to Vercel
3. Add environment variables in dashboard
4. Set webhook URL in Twilio Console to: `https://your-domain.vercel.app/api/webhook`

### Production Checklist
- [ ] Remove localStorage credential storage
- [ ] Add proper authentication
- [ ] Implement webhook signature verification
- [ ] Set up database (replace in-memory store)
- [ ] Add rate limiting on API routes
- [ ] Enable CORS properly
- [ ] Set up monitoring/error tracking
- [ ] Configure proper logging
- [ ] Add CI/CD pipeline

## Security Considerations

**Current Security Issues:**
- Twilio credentials stored in client-side localStorage (insecure)
- No user authentication
- No webhook signature verification
- API routes accept credentials in query params (logged in access logs)
- No rate limiting on endpoints
- No CSRF protection

**Production Requirements:**
- Move credential storage to secure server-side session
- Implement user authentication (NextAuth.js recommended)
- Verify Twilio webhook signatures
- Use POST body for credentials instead of query params
- Add rate limiting (use Upstash or similar)
- Implement CSRF tokens
- Add input validation/sanitization
- Set proper CORS headers

---

**Last Updated:** 2025-12-13
**Version:** 1.0.0 MVP
