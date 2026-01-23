import { NextRequest, NextResponse } from 'next/server';
import { sendMessage } from '@/lib/twilio';
import { SendMessageRequest, ApiResponse, Message } from '@/types';
import { put } from '@vercel/blob';

export async function POST(request: NextRequest) {
  console.log('\n📤 API /api/send called (Messaging API)');

  let mediaUrl: string | undefined;

  try {
    let body: SendMessageRequest & {
      accountSid?: string;
      authToken?: string;
      whatsappNumber?: string;
    };

    // Check if this is a multipart form request (for file uploads)
    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('multipart/form-data')) {
      console.log('   Processing multipart form data...');
      const formData = await request.formData();

      const to = formData.get('to') as string;
      const messageBody = formData.get('body') as string;
      const accountSid = formData.get('accountSid') as string;
      const authToken = formData.get('authToken') as string;
      const whatsappNumber = formData.get('whatsappNumber') as string;
      const mediaFile = formData.get('media') as File;

      body = { to, body: messageBody, accountSid, authToken, whatsappNumber };

      // If there's a media file, upload it to Vercel Blob
      if (mediaFile) {
        console.log('   Processing media file...');

        // Upload to Vercel Blob (temporary storage - will be cleaned up later)
        const blob = await put(mediaFile.name, mediaFile, {
          access: 'public',
          addRandomSuffix: true, // Generate unique filename to avoid conflicts
        });

        mediaUrl = blob.url;
        console.log('   Media uploaded to Vercel Blob:', mediaUrl);
      }
    } else {
      // Handle JSON request (existing functionality)
      body = await request.json();
    }

    const { to, body: messageBody, accountSid, authToken, whatsappNumber } = body;
    const ourNumber = whatsappNumber || process.env.TWILIO_WHATSAPP_NUMBER;

    console.log('Send request data:');
    console.log('  To:', to);
    console.log('  Body:', messageBody);
    console.log('  From (our number):', ourNumber);
    console.log('  AccountSID:', accountSid ? `${accountSid.substring(0, 10)}...` : 'from env');
    console.log('  AuthToken:', authToken ? 'Present' : 'from env');
    console.log('  Media URL:', mediaUrl || 'none');

    if (!to || (!messageBody && !mediaUrl)) {
      console.error('❌ Missing required fields: to and either body or media');
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Missing required fields: to and either body or media' },
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
      messageBody || '',
      formattedFrom,
      accountSid,
      authToken,
      mediaUrl
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
