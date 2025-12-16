import { NextRequest, NextResponse } from 'next/server';
import { fetchMessages, groupMessagesIntoConversations } from '@/lib/twilio';
import { messageStore } from '@/lib/store';

export async function GET(request: NextRequest) {
  console.log('\n📞 API /api/messages called');

  try {
    const searchParams = request.nextUrl.searchParams;
    const accountSid = searchParams.get('accountSid') || process.env.TWILIO_ACCOUNT_SID;
    const authToken = searchParams.get('authToken') || process.env.TWILIO_AUTH_TOKEN;
    const whatsappNumber = searchParams.get('whatsappNumber') || process.env.TWILIO_WHATSAPP_NUMBER;

    console.log('Credentials check:');
    console.log('  AccountSID:', accountSid ? `${accountSid.substring(0, 10)}...` : 'MISSING');
    console.log('  AuthToken:', authToken ? 'Present' : 'MISSING');
    console.log('  WhatsApp Number:', whatsappNumber || 'MISSING');

    if (!accountSid || !authToken || !whatsappNumber) {
      console.error('❌ Missing credentials!');
      return NextResponse.json(
        { success: false, error: 'Missing Twilio credentials' },
        { status: 400 }
      );
    }

    // Set the whatsapp number in the store
    messageStore.setWhatsappNumber(whatsappNumber);

    console.log('Calling Twilio API...');
    const messages = await fetchMessages(accountSid, authToken, 200);

    // Store messages
    messageStore.addMessages(messages);

    const conversations = groupMessagesIntoConversations(
      messages,
      whatsappNumber
    );

    console.log(`✅ API response: ${conversations.length} conversations\n`);
    return NextResponse.json({
      success: true,
      data: {
        messages,
        conversations,
        whatsappNumber: `whatsapp:${whatsappNumber}`,
      },
    });
  } catch (error) {
    console.error('❌ API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch messages',
      },
      { status: 500 }
    );
  }
}
