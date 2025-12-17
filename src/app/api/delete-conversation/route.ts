import { NextRequest, NextResponse } from 'next/server';
import { deleteConversation } from '@/lib/twilio';

/**
 * DELETE conversation endpoint
 * Deletes a conversation from Twilio Conversations API
 */
export async function POST(request: NextRequest) {
  console.log('\n🗑️  API /api/delete-conversation called');

  try {
    const { conversationSid, accountSid, authToken } = await request.json();

    if (!conversationSid) {
      return NextResponse.json(
        { success: false, error: 'Conversation SID is required' },
        { status: 400 }
      );
    }

    console.log('Deleting conversation:', conversationSid);

    // Delete the conversation
    await deleteConversation(conversationSid, accountSid, authToken);

    return NextResponse.json({
      success: true,
      message: 'Conversation deleted successfully',
    });
  } catch (error: any) {
    console.error('❌ API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to delete conversation',
      },
      { status: 500 }
    );
  }
}
