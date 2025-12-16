import { NextRequest, NextResponse } from 'next/server';
import { sendWhatsAppMessage } from '@/lib/twilio';
import { messageStore } from '@/lib/store';
import { SendMessageRequest } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body: SendMessageRequest & {
      accountSid?: string;
      authToken?: string;
    } = await request.json();

    const { to, body: messageBody, mediaUrl, accountSid, authToken } = body;

    if (!to || !messageBody) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: to and body' },
        { status: 400 }
      );
    }

    const message = await sendWhatsAppMessage(
      to,
      messageBody,
      mediaUrl,
      accountSid,
      authToken
    );

    // Add to store
    messageStore.addMessage(message);

    return NextResponse.json({
      success: true,
      data: message,
    });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send message',
      },
      { status: 500 }
    );
  }
}
