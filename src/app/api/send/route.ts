import { NextRequest, NextResponse } from 'next/server';
import { sendMessage } from '@/lib/twilio';
import { SendMessageRequest, ApiResponse, Message } from '@/types';

export async function POST(request: NextRequest) {
  console.log('\n📤 API /api/send called (Messaging API)');

  try {
    const body: SendMessageRequest & {
      accountSid?: string;
      authToken?: string;
      whatsappNumber?: string;
    } = await request.json();

    const { to, body: messageBody, mediaUrl, accountSid, authToken, whatsappNumber } = body;
    const ourNumber = whatsappNumber || process.env.TWILIO_WHATSAPP_NUMBER;

    console.log('Send request data:');
    console.log('  To:', to);
    console.log('  Body:', messageBody);
    console.log('  From (our number):', ourNumber);
    console.log('  AccountSID:', accountSid ? `${accountSid.substring(0, 10)}...` : 'from env');
    console.log('  AuthToken:', authToken ? 'Present' : 'from env');

    if (!to || !messageBody) {
      console.error('❌ Missing required fields: to and body');
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Missing required fields: to and body' },
        { status: 400 }
      );
    }

    if (!ourNumber) {
      console.error('❌ Missing WhatsApp number');
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'WhatsApp number not configured' },
        { status: 400 }
      );
    }

    // Format numbers for WhatsApp
    const formattedTo = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`;
    const formattedFrom = ourNumber.startsWith('whatsapp:') ? ourNumber : `whatsapp:${ourNumber}`;

    console.log('→ Sending message via Messaging API...');
    const message = await sendMessage(
      formattedTo,
      messageBody,
      formattedFrom,
      accountSid,
      authToken
    );

    console.log('✅ Message sent successfully:');
    console.log('  SID:', message.sid);

    return NextResponse.json<ApiResponse<Message>>({
      success: true,
      data: message,
    });
  } catch (error) {
    console.error('❌ Error sending message:', error);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send message',
      },
      { status: 500 }
    );
  }
}
