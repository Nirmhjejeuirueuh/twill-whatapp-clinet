import { NextRequest, NextResponse } from 'next/server';
import { sendWhatsAppMessage } from '@/lib/twilio';
import { messageStore } from '@/lib/store';
import { SendMessageRequest } from '@/types';

export async function POST(request: NextRequest) {
  console.log('\n📤 API /api/send called');

  try {
    const body: SendMessageRequest & {
      accountSid?: string;
      authToken?: string;
    } = await request.json();

    const { to, body: messageBody, mediaUrl, accountSid, authToken } = body;

    console.log('Send request data:');
    console.log('  To:', to);
    console.log('  Body:', messageBody);
    console.log('  AccountSID:', accountSid ? `${accountSid.substring(0, 10)}...` : 'MISSING');
    console.log('  AuthToken:', authToken ? 'Present' : 'MISSING');

    if (!to || !messageBody) {
      console.error('❌ Missing required fields: to and body');
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

    console.log('✅ Message sent successfully:');
    console.log('  SID:', message.sid);
    console.log('  Status:', message.status);

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
