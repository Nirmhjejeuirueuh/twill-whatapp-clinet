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
    console.log(`📸 Proxying media: ${mediaSid} for message ${messageSid}`);
    
    // Step 1: Request from Twilio with Auth
    let response = await fetch(mediaUrl, {
      headers: {
        Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`,
      },
      redirect: 'manual', // We handle the redirect to avoid passing auth to S3
    });

    // Step 2: Handle redirect if present
    if (response.status >= 300 && response.status < 400) {
      const redirectUrl = response.headers.get('location');
      if (redirectUrl) {
        console.log('   ↪ Following redirect to:', redirectUrl.split('?')[0]);
        // Fetch the content WITHOUT auth header
        response = await fetch(redirectUrl);
      }
    }

    if (!response.ok) {
      console.error(`❌ Error fetching media: ${response.status} ${response.statusText}`);
      return new NextResponse('Failed to fetch media', { status: response.status });
    }

    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    console.log(`   ✅ Success: ${contentType}, ${buffer.length} bytes`);

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
