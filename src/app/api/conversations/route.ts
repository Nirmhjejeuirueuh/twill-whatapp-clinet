import { NextResponse } from 'next/server';
import { messageStore } from '@/lib/store';

export async function GET() {
  try {
    const conversations = messageStore.getConversations();
    
    return NextResponse.json({
      success: true,
      data: conversations,
    });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch conversations',
      },
      { status: 500 }
    );
  }
}
