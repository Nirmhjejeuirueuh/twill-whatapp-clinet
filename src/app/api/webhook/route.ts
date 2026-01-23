import { NextRequest, NextResponse } from 'next/server';

/**
 * Twilio Messaging API Webhook Handler for WhatsApp
 *
 * Webhook disabled - using polling instead
 */
export async function POST(request: NextRequest) {
  // Webhook disabled - using polling instead
  console.log('🔔 Webhook received but disabled (using polling)');

  // Acknowledge receipt (Messaging API expects empty 200 OK)
  return new Response('', { status: 200 });
}

// Handle GET requests for webhook verification
export async function GET() {
  return NextResponse.json({
    status: 'Webhook endpoint active but disabled (using polling)',
    description: 'Webhook processing disabled, using 10-second polling instead',
  });
}
