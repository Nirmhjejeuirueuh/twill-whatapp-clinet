import { NextResponse } from 'next/server';
import { messageStore } from '@/lib/store';

/**
 * API endpoint to retrieve messages from the webhook MessageStore
 * The client polls this endpoint to get real-time webhook messages
 */
export async function GET() {
  try {
    const messages = messageStore.getMessages();
    
    return NextResponse.json({
      success: true,
      data: { messages },
    });
  } catch (error) {
    console.error('❌ Error fetching webhook messages:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch webhook messages' 
      },
      { status: 500 }
    );
  }
}

/**
 * Clear the message store (optional, for cleanup)
 */
export async function DELETE() {
  try {
    messageStore.clear();
    
    return NextResponse.json({
      success: true,
      message: 'Message store cleared',
    });
  } catch (error) {
    console.error('❌ Error clearing message store:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to clear message store' 
      },
      { status: 500 }
    );
  }
}
