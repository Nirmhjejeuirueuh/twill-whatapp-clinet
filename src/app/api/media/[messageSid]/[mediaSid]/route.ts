import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ messageSid: string; mediaSid: string }> }
) {
  const { messageSid, mediaSid } = await params;
  const searchParams = request.nextUrl.searchParams;
  const accountSid = searchParams.get('accountSid') || process.env.TWILIO_ACCOUNT_SID;
  const authToken = searchParams.get('authToken') || process.env.TWILIO_AUTH_TOKEN;

  if (!accountSid || !authToken) {
    return new NextResponse('Missing credentials', { status: 401 });
  }

  // Construct Twilio API URL for the media
  // For Messaging API media, the URL structure is:
  // https://api.twilio.com/2010-04-01/Accounts/{AccountSid}/Messages/{MessageSid}/Media/{MediaSid}
  const mediaUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages/${messageSid}/Media/${mediaSid}`;

  try {
    const response = await fetch(mediaUrl, {
      headers: {
        Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`,
      },
    });

    if (!response.ok) {
      console.error(`Error fetching media: ${response.status} ${response.statusText}`);
      return new NextResponse('Failed to fetch media', { status: response.status });
    }

    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    const blob = await response.blob();
    const buffer = Buffer.from(await blob.arrayBuffer());

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error in media proxy:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
