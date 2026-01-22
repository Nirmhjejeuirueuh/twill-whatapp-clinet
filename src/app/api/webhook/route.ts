import { NextRequest, NextResponse } from 'next/server';
import { messageStore } from '@/lib/store';
import { broadcastToSSE } from '../sse/route';
import { Message, Conversation } from '@/types';

/**
 * Twilio Messaging API Webhook Handler for WhatsApp
 *
 * Messaging API sends webhooks as form data for incoming messages:
 * - MessageSid: The message SID
 * - Body: The message content
 * - From: The sender's WhatsApp number (whatsapp:+1234567890)
 * - To: Your WhatsApp number (whatsapp:+1234567890)
 * - NumMedia: Number of media attachments
 * - ProfileName: Sender's profile name
 * - WaId: WhatsApp ID
 */
export async function POST(request: NextRequest) {
  console.log('\n🔔 ===== WEBHOOK RECEIVED =====');
  console.log('Timestamp:', new Date().toISOString());

  try {
    // Messaging API sends form data (not JSON like Conversations API)
    const formData = await request.formData();

    const payload = {
      MessageSid: formData.get('MessageSid') as string,
      Body: formData.get('Body') as string,
      From: formData.get('From') as string,
      To: formData.get('To') as string,
      NumMedia: formData.get('NumMedia') as string,
      ProfileName: formData.get('ProfileName') as string,
      WaId: formData.get('WaId') as string,
    };

    console.log('📨 Incoming WhatsApp message:');
    console.log('  Message SID:', payload.MessageSid);
    console.log('  From:', payload.From);
    console.log('  To:', payload.To);
    console.log('  Body:', payload.Body);
    console.log('  Profile Name:', payload.ProfileName);

    // Handle media if present
    const numMedia = parseInt(payload.NumMedia || '0');
    const mediaUrls: string[] = [];
    const mediaTypes: string[] = [];

    for (let i = 0; i < numMedia; i++) {
      const url = formData.get(`MediaUrl${i}`) as string;
      const type = formData.get(`MediaContentType${i}`) as string;
      if (url) mediaUrls.push(url);
      if (type) mediaTypes.push(type);
    }

    if (numMedia > 0) {
      console.log('  Media URLs:', mediaUrls);
      console.log('  Media Types:', mediaTypes);
    }

    // Create message object in our format
    const message: Message = {
      sid: payload.MessageSid,
      conversation_sid: '', // Not used in Messaging API
      body: payload.Body || '',
      author: payload.From, // The sender
      from: payload.From, // Sender phone number
      to: payload.To, // Recipient phone number
      participant_sid: null,
      direction: 'inbound',
      index: 0, // Not used in Messaging API
      dateCreated: new Date().toISOString(),
      dateUpdated: null,
      media: mediaUrls.length > 0 ? mediaUrls.map((url, i) => ({
        sid: `media_${i}`,
        size: 0, // Size not provided in webhook
        content_type: mediaTypes[i] || 'unknown',
        filename: `media_${i}`,
      })) : null,
      delivery: null,
      attributes: JSON.stringify({
        profileName: payload.ProfileName,
        waId: payload.WaId,
      }),
    };

    // Store the message
    messageStore.addMessage(message);

    // Broadcast to SSE clients for real-time updates
    broadcastToSSE({
      type: 'new_message',
      message: message,
    });

    console.log('✅ Message stored successfully in MessageStore');
    console.log('📦 Total messages in store:', messageStore.getMessages().length);
    console.log('🔔 ===== WEBHOOK COMPLETED =====\n');

    // Acknowledge receipt (Messaging API expects empty 200 OK)
    return new Response('', { status: 200 });

  } catch (error) {
    console.error('❌ Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

// Handle GET requests for webhook verification
export async function GET() {
  return NextResponse.json({
    status: 'Webhook endpoint active (Messaging API)',
    description: 'Handles incoming WhatsApp messages via Twilio Messaging API webhooks',
    expectedFormat: 'Form data with MessageSid, Body, From, To, etc.',
  });
}
