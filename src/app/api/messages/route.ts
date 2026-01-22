import { NextRequest, NextResponse } from 'next/server';
import { fetchMessages, groupMessagesIntoConversations } from '@/lib/twilio';
import { messageStore } from '@/lib/store';
import { ApiResponse, Conversation } from '@/types';

export async function GET(request: NextRequest) {
  console.log('\n📞 API /api/messages called (Messaging API)');

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
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Missing Twilio credentials' },
        { status: 400 }
      );
    }

    console.log('Fetching messages from Twilio Messaging API...');
    const twilioMessages = await fetchMessages(accountSid, authToken, whatsappNumber, 100);
    console.log('✅ Twilio API call completed, messages fetched:', twilioMessages.length);

    // Get messages from webhook store and merge
    const storeMessages = messageStore.getMessages();
    console.log(`📦 Messages in MessageStore: ${storeMessages.length}`);
    if (storeMessages.length > 0) {
      console.log('   Sample store messages:', storeMessages.slice(0, 3).map(m => ({
        sid: m.sid,
        from: m.from,
        body: m.body?.substring(0, 50)
      })));
    }

    // Merge messages, avoiding duplicates by sid
    const allMessages = [...twilioMessages];
    const existingSids = new Set(twilioMessages.map(m => m.sid));

    for (const storeMsg of storeMessages) {
      if (!existingSids.has(storeMsg.sid)) {
        allMessages.push(storeMsg);
        console.log('➕ Added message from store:', storeMsg.sid);
      }
    }

    const conversations = groupMessagesIntoConversations(
      allMessages,
      whatsappNumber
    );

    console.log(`✅ API response: ${conversations.length} conversations\n`);
    return NextResponse.json<ApiResponse<{ conversations: Conversation[]; messages: any[]; whatsappNumber: string }>>({
      success: true,
      data: {
        conversations,
        messages: allMessages,
        whatsappNumber: whatsappNumber.startsWith('whatsapp:') ? whatsappNumber : `whatsapp:${whatsappNumber}`,
      },
    });
  } catch (error) {
    console.error('❌ API Error:', error);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch messages',
      },
      { status: 500 }
    );
  }
}
