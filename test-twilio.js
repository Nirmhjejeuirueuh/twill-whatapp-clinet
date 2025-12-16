// Test Twilio Connection
const fs = require('fs');
const twilio = require('twilio');

// Load .env.local file
let accountSid, authToken, whatsappNumber;
try {
  const envContent = fs.readFileSync('.env.local', 'utf8');
  const lines = envContent.split('\n');
  lines.forEach(line => {
    if (line.startsWith('TWILIO_ACCOUNT_SID=')) {
      accountSid = line.split('=')[1].trim();
    } else if (line.startsWith('TWILIO_AUTH_TOKEN=')) {
      authToken = line.split('=')[1].trim();
    } else if (line.startsWith('TWILIO_WHATSAPP_NUMBER=')) {
      whatsappNumber = line.split('=')[1].trim();
    }
  });
} catch (err) {
  console.error('❌ Could not read .env.local file');
  process.exit(1);
}

console.log('\n🧪 Testing Twilio Connection...\n');
console.log('Credentials:');
console.log('  Account SID:', accountSid ? `${accountSid.substring(0, 10)}...` : '❌ MISSING');
console.log('  Auth Token:', authToken ? '✓ Present' : '❌ MISSING');
console.log('  WhatsApp Number:', whatsappNumber || '❌ MISSING');
console.log('');

if (!accountSid || !authToken || !whatsappNumber) {
  console.error('❌ Missing credentials! Check your .env.local file\n');
  process.exit(1);
}

async function testConnection() {
  try {
    const client = twilio(accountSid, authToken);

    // Test 1: Verify account credentials
    console.log('Test 1: Verifying account credentials...');
    const account = await client.api.accounts(accountSid).fetch();
    console.log(`✅ Account verified: ${account.friendlyName}`);
    console.log(`   Status: ${account.status}`);
    console.log('');

    // Test 2: Check if WhatsApp number exists
    console.log('Test 2: Checking WhatsApp number...');
    try {
      const phoneNumbers = await client.incomingPhoneNumbers.list({
        phoneNumber: whatsappNumber,
        limit: 1
      });

      if (phoneNumbers.length > 0) {
        console.log(`✅ Phone number ${whatsappNumber} found in your account`);
      } else {
        console.log(`⚠️  Phone number ${whatsappNumber} not found (this is OK if using sandbox)`);
      }
    } catch (err) {
      console.log(`⚠️  Could not verify phone number (this is OK if using sandbox)`);
    }
    console.log('');

    // Test 3: Fetch recent messages
    console.log('Test 3: Fetching recent messages...');
    const inboundMessages = await client.messages.list({
      to: `whatsapp:${whatsappNumber}`,
      limit: 5
    });

    const outboundMessages = await client.messages.list({
      from: `whatsapp:${whatsappNumber}`,
      limit: 5
    });

    console.log(`✅ Found ${inboundMessages.length} inbound messages`);
    console.log(`✅ Found ${outboundMessages.length} outbound messages`);

    if (inboundMessages.length === 0 && outboundMessages.length === 0) {
      console.log('\n💡 No messages found. This is normal if you haven\'t sent/received any WhatsApp messages yet.');
      console.log('   To test messaging:');
      console.log('   1. If using sandbox, join it by sending your join code to +14155238886');
      console.log('   2. Send a test message from your WhatsApp to the sandbox number');
    } else {
      console.log('\n📨 Sample messages:');
      [...inboundMessages, ...outboundMessages].slice(0, 3).forEach((msg, i) => {
        console.log(`   ${i + 1}. ${msg.direction} | ${msg.from} → ${msg.to}`);
        console.log(`      "${msg.body?.substring(0, 50)}${msg.body?.length > 50 ? '...' : ''}"`);
      });
    }
    console.log('');

    // Success summary
    console.log('═══════════════════════════════════════════');
    console.log('✅ ALL TESTS PASSED!');
    console.log('   Your Twilio connection is working correctly.');
    console.log('   You can now use the WhatsApp client at http://localhost:3000');
    console.log('═══════════════════════════════════════════\n');

  } catch (error) {
    console.error('❌ Connection failed!\n');
    console.error('Error details:');
    console.error('  Code:', error.code);
    console.error('  Status:', error.status);
    console.error('  Message:', error.message);
    console.error('');

    if (error.code === 20003) {
      console.error('🔍 Diagnosis: Authentication failed');
      console.error('   → Your Account SID or Auth Token is incorrect');
      console.error('   → Check your credentials at: https://console.twilio.com/');
    } else if (error.code === 20404) {
      console.error('🔍 Diagnosis: Resource not found');
      console.error('   → The phone number might not exist in your account');
    } else {
      console.error('🔍 Diagnosis: Unknown error');
      console.error('   → Check your internet connection');
      console.error('   → Verify credentials at: https://console.twilio.com/');
    }
    console.error('');
    process.exit(1);
  }
}

testConnection();
