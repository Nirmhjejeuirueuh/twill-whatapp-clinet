import { NextRequest, NextResponse } from 'next/server';
import { messageStore } from '@/lib/store';
import { Message, WebhookPayload } from '@/types';

export async function POST(request: NextRequest) {
  try {
    // Parse form data from Twilio webhook
    const formData = await request.formData();
    
    const payload: WebhookPayload = {
      MessageSid: formData.get('MessageSid') as string,
      Body: formData.get('Body') as string,
      From: formData.get('From') as string,
      To: formData.get('To') as string,
      NumMedia: formData.get('NumMedia') as string,
      ProfileName: formData.get('ProfileName') as string,
      WaId: formData.get('WaId') as string,
    };

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

    // Create message object
    const message: Message = {
      sid: payload.MessageSid,
      body: payload.Body || '',
      from: payload.From,
      to: payload.To,
      direction: 'inbound',
      status: 'received',
      dateCreated: new Date().toISOString(),
      dateSent: null,
      mediaUrl: mediaUrls.length > 0 ? mediaUrls : undefined,
      mediaContentType: mediaTypes.length > 0 ? mediaTypes : undefined,
    };

    // Store the message
    messageStore.addMessage(message);

    console.log('Received WhatsApp message:', {
      from: payload.From,
      body: payload.Body,
      profileName: payload.ProfileName,
    });

    // Respond with TwiML (empty response acknowledges receipt)
    return new NextResponse(
      '<?xml version="1.0" encoding="UTF-8"?><Response></Response>',
      {
        headers: {
          'Content-Type': 'application/xml',
        },
      }
    );
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

// Handle GET requests for webhook verification
export async function GET() {
  return NextResponse.json({ status: 'Webhook endpoint active' });
}
