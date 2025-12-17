# Conversation with Participants Resource

The **ConversationWithParticipants** resource accepts all the details for a conversation and allows up to 10 participants in one request. It is especially helpful for situations where you want to send group texts. It helps prevent issues that might occur with existing conversations when you add participants individually.

## API Base URL

All URLs in the reference documentation use the following base URL:

```xml
https://conversations.twilio.com/v1
```

### Using the shortened base URL

Using the REST API, you can create Conversation with Participants in the **default Conversation Service** instance via a "shortened" URL that doesn't include the Conversation Service instance SID (`ISXXX...`). If you are only using one Conversation Service (the default), you don't need to include the Conversation Service SID in your URL, e.g.

```bash
POST /v1/ConversationWithParticipants
```

For Conversations applications that build on more than one [Conversation Service instance](/docs/conversations/api/service-resource), you will need to specify the Conversation Service SID in the REST API call:

```bash
POST /v1/Services/ISxx/ConversationWithParticipants
```

## ConversationWithParticipant Properties

```json
{"type":"object","refName":"conversations.v1.conversation_with_participants","modelName":"conversations_v1_conversation_with_participants","properties":{"account_sid":{"type":"string","minLength":34,"maxLength":34,"pattern":"^AC[0-9a-fA-F]{32}$","nullable":true,"description":"The unique ID of the [Account](/docs/iam/api/account) responsible for this conversation."},"chat_service_sid":{"type":"string","minLength":34,"maxLength":34,"pattern":"^IS[0-9a-fA-F]{32}$","nullable":true,"description":"The unique ID of the [Conversation Service](/docs/conversations/api/service-resource) this conversation belongs to."},"messaging_service_sid":{"type":"string","minLength":34,"maxLength":34,"pattern":"^MG[0-9a-fA-F]{32}$","nullable":true,"description":"The unique ID of the [Messaging Service](/docs/messaging/api/service-resource) this conversation belongs to."},"sid":{"type":"string","minLength":34,"maxLength":34,"pattern":"^CH[0-9a-fA-F]{32}$","nullable":true,"description":"A 34 character string that uniquely identifies this resource."},"friendly_name":{"type":"string","nullable":true,"description":"The human-readable name of this conversation, limited to 256 characters. Optional.","x-twilio":{"pii":{"handling":"standard","deleteSla":30}}},"unique_name":{"type":"string","nullable":true,"description":"An application-defined string that uniquely identifies the resource. It can be used to address the resource in place of the resource's `sid` in the URL.","x-twilio":{"pii":{"handling":"standard","deleteSla":30}}},"attributes":{"type":"string","nullable":true,"description":"An optional string metadata field you can use to store any data you wish. The string value must contain structurally valid JSON if specified.  **Note** that if the attributes are not set \"{}\" will be returned.","x-twilio":{"pii":{"handling":"sensitive","deleteSla":30}}},"state":{"type":"string","enum":["initializing","inactive","active","closed"],"description":"Current state of this conversation. Can be either `initializing`, `active`, `inactive` or `closed` and defaults to `active`","refName":"conversation_with_participants_enum_state","modelName":"conversation_with_participants_enum_state"},"date_created":{"type":"string","format":"date-time","nullable":true,"description":"The date that this resource was created."},"date_updated":{"type":"string","format":"date-time","nullable":true,"description":"The date that this resource was last updated."},"timers":{"nullable":true,"description":"Timer date values representing state update for this conversation."},"links":{"type":"object","format":"uri-map","nullable":true,"description":"Contains absolute URLs to access the [participants](/docs/conversations/api/conversation-participant-resource), [messages](/docs/conversations/api/conversation-message-resource) and [webhooks](/docs/conversations/api/conversation-scoped-webhook-resource) of this conversation."},"bindings":{"nullable":true},"url":{"type":"string","format":"uri","nullable":true,"description":"An absolute API resource URL for this conversation."}}}
```

## Create a Conversation with Participants resource

`POST https://conversations.twilio.com/v1/ConversationWithParticipants`

This resource behaves differently than most other Conversations API resources. Here's how it works:

1. **Parameter validation**: It validates all conversation and participant parameters and returns various possible conversations errors.
2. **Conversations are created synchronously**: If the request is valid, a conversation will be created and returned in the response. This conversation will be in the state `initializing` while the participants are added. In this state, the conversation cannot be updated.
3. **Participants are added to the conversation asynchronously**: Once all participants are added, the conversation state will be set to `active` and the conversation can be used. Listening to the `onConversationStateUpdated` webhook event or polling the conversations `GET` endpoint are both acceptable ways to check if the conversation is ready to be used.
4. **System Errors**: If any unexpected errors happen while adding the participants, the conversation state will be set to `closed`. You can view the error logs in the [Twilio Console](https://console.twilio.com/us1/monitor/logs/conversations?frameUrl=%2Fconsole%2Fconversations%2Fdefault%3Fx-target-region%3Dus1), and in your webhook notifications if you subscribe to them.

### Headers

```json
[{"name":"X-Twilio-Webhook-Enabled","in":"header","description":"The X-Twilio-Webhook-Enabled HTTP request header","schema":{"type":"string","enum":["true","false"],"refName":"conversation_with_participants_enum_webhook_enabled_type","modelName":"conversation_with_participants_enum_webhook_enabled_type"}}]
```

### Request body parameters

```json
{"schema":{"type":"object","title":"CreateConversationWithParticipantsRequest","properties":{"FriendlyName":{"type":"string","description":"The human-readable name of this conversation, limited to 256 characters. Optional.","x-twilio":{"pii":{"handling":"standard","deleteSla":30}}},"UniqueName":{"type":"string","description":"An application-defined string that uniquely identifies the resource. It can be used to address the resource in place of the resource's `sid` in the URL.","x-twilio":{"pii":{"handling":"standard","deleteSla":30}}},"DateCreated":{"type":"string","format":"date-time","description":"The date that this resource was created."},"DateUpdated":{"type":"string","format":"date-time","description":"The date that this resource was last updated."},"MessagingServiceSid":{"type":"string","minLength":34,"maxLength":34,"pattern":"^MG[0-9a-fA-F]{32}$","description":"The unique ID of the [Messaging Service](/docs/messaging/api/service-resource) this conversation belongs to."},"Attributes":{"type":"string","description":"An optional string metadata field you can use to store any data you wish. The string value must contain structurally valid JSON if specified.  **Note** that if the attributes are not set \"{}\" will be returned.","x-twilio":{"pii":{"handling":"sensitive","deleteSla":30}}},"State":{"type":"string","enum":["initializing","inactive","active","closed"],"description":"Current state of this conversation. Can be either `initializing`, `active`, `inactive` or `closed` and defaults to `active`","refName":"conversation_with_participants_enum_state","modelName":"conversation_with_participants_enum_state"},"Timers.Inactive":{"type":"string","description":"ISO8601 duration when conversation will be switched to `inactive` state. Minimum value for this timer is 1 minute."},"Timers.Closed":{"type":"string","description":"ISO8601 duration when conversation will be switched to `closed` state. Minimum value for this timer is 10 minutes."},"Bindings.Email.Address":{"type":"string","description":"The default email address that will be used when sending outbound emails in this conversation."},"Bindings.Email.Name":{"type":"string","description":"The default name that will be used when sending outbound emails in this conversation."},"Participant":{"type":"array","description":"The participant to be added to the conversation in JSON format. The JSON object attributes are as parameters in [Participant Resource](/docs/conversations/api/conversation-participant-resource). The maximum number of participants that can be added in a single request is 10.","items":{"type":"string"}}}},"examples":{"create":{"value":{"lang":"json","value":"{\n  \"FriendlyName\": \"friendly_name\",\n  \"UniqueName\": \"unique_name\",\n  \"Attributes\": \"{ \\\"topic\\\": \\\"feedback\\\" }\",\n  \"DateCreated\": \"2015-12-16T22:18:37Z\",\n  \"DateUpdated\": \"2015-12-16T22:18:38Z\",\n  \"MessagingServiceSid\": \"MGaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\",\n  \"State\": \"inactive\",\n  \"Timers.Inactive\": \"PT1M\",\n  \"Timers.Closed\": \"PT10M\"\n}","meta":"","code":"{\n  \"FriendlyName\": \"friendly_name\",\n  \"UniqueName\": \"unique_name\",\n  \"Attributes\": \"{ \\\"topic\\\": \\\"feedback\\\" }\",\n  \"DateCreated\": \"2015-12-16T22:18:37Z\",\n  \"DateUpdated\": \"2015-12-16T22:18:38Z\",\n  \"MessagingServiceSid\": \"MGaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\",\n  \"State\": \"inactive\",\n  \"Timers.Inactive\": \"PT1M\",\n  \"Timers.Closed\": \"PT10M\"\n}","tokens":[["{","#C9D1D9"],"\n  ",["\"FriendlyName\"","#7EE787"],[":","#C9D1D9"]," ",["\"friendly_name\"","#A5D6FF"],[",","#C9D1D9"],"\n  ",["\"UniqueName\"","#7EE787"],[":","#C9D1D9"]," ",["\"unique_name\"","#A5D6FF"],[",","#C9D1D9"],"\n  ",["\"Attributes\"","#7EE787"],[":","#C9D1D9"]," ",["\"{","#A5D6FF"]," ",["\\\"","#79C0FF"],["topic","#A5D6FF"],["\\\"","#79C0FF"],[":","#A5D6FF"]," ",["\\\"","#79C0FF"],["feedback","#A5D6FF"],["\\\"","#79C0FF"]," ",["}\"","#A5D6FF"],[",","#C9D1D9"],"\n  ",["\"DateCreated\"","#7EE787"],[":","#C9D1D9"]," ",["\"2015-12-16T22:18:37Z\"","#A5D6FF"],[",","#C9D1D9"],"\n  ",["\"DateUpdated\"","#7EE787"],[":","#C9D1D9"]," ",["\"2015-12-16T22:18:38Z\"","#A5D6FF"],[",","#C9D1D9"],"\n  ",["\"MessagingServiceSid\"","#7EE787"],[":","#C9D1D9"]," ",["\"MGaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\"","#A5D6FF"],[",","#C9D1D9"],"\n  ",["\"State\"","#7EE787"],[":","#C9D1D9"]," ",["\"inactive\"","#A5D6FF"],[",","#C9D1D9"],"\n  ",["\"Timers.Inactive\"","#7EE787"],[":","#C9D1D9"]," ",["\"PT1M\"","#A5D6FF"],[",","#C9D1D9"],"\n  ",["\"Timers.Closed\"","#7EE787"],[":","#C9D1D9"]," ",["\"PT10M\"","#A5D6FF"],"\n",["}","#C9D1D9"]],"annotations":[],"themeName":"github-dark","style":{"color":"#c9d1d9","background":"#0d1117"}}},"createNoTimersNoAttributes":{"value":{"lang":"json","value":"{\n  \"FriendlyName\": \"friendly_name\",\n  \"DateCreated\": \"2020-07-01T22:18:37Z\",\n  \"DateUpdated\": \"2020-07-01T22:18:37Z\",\n  \"MessagingServiceSid\": \"MGaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\",\n  \"State\": \"active\"\n}","meta":"","code":"{\n  \"FriendlyName\": \"friendly_name\",\n  \"DateCreated\": \"2020-07-01T22:18:37Z\",\n  \"DateUpdated\": \"2020-07-01T22:18:37Z\",\n  \"MessagingServiceSid\": \"MGaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\",\n  \"State\": \"active\"\n}","tokens":[["{","#C9D1D9"],"\n  ",["\"FriendlyName\"","#7EE787"],[":","#C9D1D9"]," ",["\"friendly_name\"","#A5D6FF"],[",","#C9D1D9"],"\n  ",["\"DateCreated\"","#7EE787"],[":","#C9D1D9"]," ",["\"2020-07-01T22:18:37Z\"","#A5D6FF"],[",","#C9D1D9"],"\n  ",["\"DateUpdated\"","#7EE787"],[":","#C9D1D9"]," ",["\"2020-07-01T22:18:37Z\"","#A5D6FF"],[",","#C9D1D9"],"\n  ",["\"MessagingServiceSid\"","#7EE787"],[":","#C9D1D9"]," ",["\"MGaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\"","#A5D6FF"],[",","#C9D1D9"],"\n  ",["\"State\"","#7EE787"],[":","#C9D1D9"]," ",["\"active\"","#A5D6FF"],"\n",["}","#C9D1D9"]],"annotations":[],"themeName":"github-dark","style":{"color":"#c9d1d9","background":"#0d1117"}}},"createWithParticipants":{"value":{"lang":"json","value":"{\n  \"FriendlyName\": \"friendly_name\",\n  \"DateCreated\": \"2020-07-01T22:18:37Z\",\n  \"DateUpdated\": \"2020-07-01T22:18:37Z\",\n  \"MessagingServiceSid\": \"MGaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\",\n  \"State\": \"active\",\n  \"Participant\": [\n    \"{ \\\"identity\\\": \\\"user1\\\" }\",\n    \"{ \\\"identity\\\": \\\"user2\\\" }\"\n  ]\n}","meta":"","code":"{\n  \"FriendlyName\": \"friendly_name\",\n  \"DateCreated\": \"2020-07-01T22:18:37Z\",\n  \"DateUpdated\": \"2020-07-01T22:18:37Z\",\n  \"MessagingServiceSid\": \"MGaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\",\n  \"State\": \"active\",\n  \"Participant\": [\n    \"{ \\\"identity\\\": \\\"user1\\\" }\",\n    \"{ \\\"identity\\\": \\\"user2\\\" }\"\n  ]\n}","tokens":[["{","#C9D1D9"],"\n  ",["\"FriendlyName\"","#7EE787"],[":","#C9D1D9"]," ",["\"friendly_name\"","#A5D6FF"],[",","#C9D1D9"],"\n  ",["\"DateCreated\"","#7EE787"],[":","#C9D1D9"]," ",["\"2020-07-01T22:18:37Z\"","#A5D6FF"],[",","#C9D1D9"],"\n  ",["\"DateUpdated\"","#7EE787"],[":","#C9D1D9"]," ",["\"2020-07-01T22:18:37Z\"","#A5D6FF"],[",","#C9D1D9"],"\n  ",["\"MessagingServiceSid\"","#7EE787"],[":","#C9D1D9"]," ",["\"MGaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\"","#A5D6FF"],[",","#C9D1D9"],"\n  ",["\"State\"","#7EE787"],[":","#C9D1D9"]," ",["\"active\"","#A5D6FF"],[",","#C9D1D9"],"\n  ",["\"Participant\"","#7EE787"],[": [","#C9D1D9"],"\n    ",["\"{","#A5D6FF"]," ",["\\\"","#79C0FF"],["identity","#A5D6FF"],["\\\"","#79C0FF"],[":","#A5D6FF"]," ",["\\\"","#79C0FF"],["user1","#A5D6FF"],["\\\"","#79C0FF"]," ",["}\"","#A5D6FF"],[",","#C9D1D9"],"\n    ",["\"{","#A5D6FF"]," ",["\\\"","#79C0FF"],["identity","#A5D6FF"],["\\\"","#79C0FF"],[":","#A5D6FF"]," ",["\\\"","#79C0FF"],["user2","#A5D6FF"],["\\\"","#79C0FF"]," ",["}\"","#A5D6FF"],"\n  ",["]","#C9D1D9"],"\n",["}","#C9D1D9"]],"annotations":[],"themeName":"github-dark","style":{"color":"#c9d1d9","background":"#0d1117"}}},"createWithParticipantsMixedCaseHeaderIenumTrue":{"value":{"lang":"json","value":"{\n  \"FriendlyName\": \"friendly_name\",\n  \"DateCreated\": \"2020-07-01T22:18:37Z\",\n  \"DateUpdated\": \"2020-07-01T22:18:37Z\",\n  \"MessagingServiceSid\": \"MGaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\",\n  \"State\": \"active\",\n  \"Participant\": [\n    \"{ \\\"identity\\\": \\\"user1\\\" }\",\n    \"{ \\\"identity\\\": \\\"user2\\\" }\"\n  ]\n}","meta":"","code":"{\n  \"FriendlyName\": \"friendly_name\",\n  \"DateCreated\": \"2020-07-01T22:18:37Z\",\n  \"DateUpdated\": \"2020-07-01T22:18:37Z\",\n  \"MessagingServiceSid\": \"MGaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\",\n  \"State\": \"active\",\n  \"Participant\": [\n    \"{ \\\"identity\\\": \\\"user1\\\" }\",\n    \"{ \\\"identity\\\": \\\"user2\\\" }\"\n  ]\n}","tokens":[["{","#C9D1D9"],"\n  ",["\"FriendlyName\"","#7EE787"],[":","#C9D1D9"]," ",["\"friendly_name\"","#A5D6FF"],[",","#C9D1D9"],"\n  ",["\"DateCreated\"","#7EE787"],[":","#C9D1D9"]," ",["\"2020-07-01T22:18:37Z\"","#A5D6FF"],[",","#C9D1D9"],"\n  ",["\"DateUpdated\"","#7EE787"],[":","#C9D1D9"]," ",["\"2020-07-01T22:18:37Z\"","#A5D6FF"],[",","#C9D1D9"],"\n  ",["\"MessagingServiceSid\"","#7EE787"],[":","#C9D1D9"]," ",["\"MGaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\"","#A5D6FF"],[",","#C9D1D9"],"\n  ",["\"State\"","#7EE787"],[":","#C9D1D9"]," ",["\"active\"","#A5D6FF"],[",","#C9D1D9"],"\n  ",["\"Participant\"","#7EE787"],[": [","#C9D1D9"],"\n    ",["\"{","#A5D6FF"]," ",["\\\"","#79C0FF"],["identity","#A5D6FF"],["\\\"","#79C0FF"],[":","#A5D6FF"]," ",["\\\"","#79C0FF"],["user1","#A5D6FF"],["\\\"","#79C0FF"]," ",["}\"","#A5D6FF"],[",","#C9D1D9"],"\n    ",["\"{","#A5D6FF"]," ",["\\\"","#79C0FF"],["identity","#A5D6FF"],["\\\"","#79C0FF"],[":","#A5D6FF"]," ",["\\\"","#79C0FF"],["user2","#A5D6FF"],["\\\"","#79C0FF"]," ",["}\"","#A5D6FF"],"\n  ",["]","#C9D1D9"],"\n",["}","#C9D1D9"]],"annotations":[],"themeName":"github-dark","style":{"color":"#c9d1d9","background":"#0d1117"}}},"createWithParticipantsMixedCaseHeaderIenumFalse":{"value":{"lang":"json","value":"{\n  \"FriendlyName\": \"friendly_name\",\n  \"DateCreated\": \"2020-07-01T22:18:37Z\",\n  \"DateUpdated\": \"2020-07-01T22:18:37Z\",\n  \"MessagingServiceSid\": \"MGaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\",\n  \"State\": \"active\",\n  \"Participant\": [\n    \"{ \\\"identity\\\": \\\"user1\\\" }\",\n    \"{ \\\"identity\\\": \\\"user2\\\" }\"\n  ]\n}","meta":"","code":"{\n  \"FriendlyName\": \"friendly_name\",\n  \"DateCreated\": \"2020-07-01T22:18:37Z\",\n  \"DateUpdated\": \"2020-07-01T22:18:37Z\",\n  \"MessagingServiceSid\": \"MGaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\",\n  \"State\": \"active\",\n  \"Participant\": [\n    \"{ \\\"identity\\\": \\\"user1\\\" }\",\n    \"{ \\\"identity\\\": \\\"user2\\\" }\"\n  ]\n}","tokens":[["{","#C9D1D9"],"\n  ",["\"FriendlyName\"","#7EE787"],[":","#C9D1D9"]," ",["\"friendly_name\"","#A5D6FF"],[",","#C9D1D9"],"\n  ",["\"DateCreated\"","#7EE787"],[":","#C9D1D9"]," ",["\"2020-07-01T22:18:37Z\"","#A5D6FF"],[",","#C9D1D9"],"\n  ",["\"DateUpdated\"","#7EE787"],[":","#C9D1D9"]," ",["\"2020-07-01T22:18:37Z\"","#A5D6FF"],[",","#C9D1D9"],"\n  ",["\"MessagingServiceSid\"","#7EE787"],[":","#C9D1D9"]," ",["\"MGaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\"","#A5D6FF"],[",","#C9D1D9"],"\n  ",["\"State\"","#7EE787"],[":","#C9D1D9"]," ",["\"active\"","#A5D6FF"],[",","#C9D1D9"],"\n  ",["\"Participant\"","#7EE787"],[": [","#C9D1D9"],"\n    ",["\"{","#A5D6FF"]," ",["\\\"","#79C0FF"],["identity","#A5D6FF"],["\\\"","#79C0FF"],[":","#A5D6FF"]," ",["\\\"","#79C0FF"],["user1","#A5D6FF"],["\\\"","#79C0FF"]," ",["}\"","#A5D6FF"],[",","#C9D1D9"],"\n    ",["\"{","#A5D6FF"]," ",["\\\"","#79C0FF"],["identity","#A5D6FF"],["\\\"","#79C0FF"],[":","#A5D6FF"]," ",["\\\"","#79C0FF"],["user2","#A5D6FF"],["\\\"","#79C0FF"]," ",["}\"","#A5D6FF"],"\n  ",["]","#C9D1D9"],"\n",["}","#C9D1D9"]],"annotations":[],"themeName":"github-dark","style":{"color":"#c9d1d9","background":"#0d1117"}}}},"encodingType":"application/x-www-form-urlencoded","conditionalParameterMap":{}}
```

Create Conversation with Participants

```js
// Download the helper library from https://www.twilio.com/docs/node/install
const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";

// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

async function createConversationWithParticipants() {
  const conversationWithParticipant =
    await client.conversations.v1.conversationWithParticipants.create({
      friendlyName: "Friendly Conversation",
      participant: [
        '{"messaging_binding": {"address": "<External Participant Number>", "proxy_address": "<Your Twilio Number>"}}',
        '{"identity": "<Chat User Identity>"}',
      ],
    });

  console.log(conversationWithParticipant.sid);
}

createConversationWithParticipants();
```

```python
# Download the helper library from https://www.twilio.com/docs/python/install
import os
from twilio.rest import Client

# Find your Account SID and Auth Token at twilio.com/console
# and set the environment variables. See http://twil.io/secure
account_sid = os.environ["TWILIO_ACCOUNT_SID"]
auth_token = os.environ["TWILIO_AUTH_TOKEN"]
client = Client(account_sid, auth_token)

conversation_with_participant = client.conversations.v1.conversation_with_participants.create(
    friendly_name="Friendly Conversation",
    participant=[
        '{"messaging_binding": {"address": "<External Participant Number>", "proxy_address": "<Your Twilio Number>"}}',
        '{"identity": "<Chat User Identity>"}',
    ],
)

print(conversation_with_participant.sid)
```

```csharp
// Install the C# / .NET helper library from twilio.com/docs/csharp/install

using System;
using Twilio;
using Twilio.Rest.Conversations.V1;
using System.Threading.Tasks;
using System.Collections.Generic;

class Program {
    public static async Task Main(string[] args) {
        // Find your Account SID and Auth Token at twilio.com/console
        // and set the environment variables. See http://twil.io/secure
        string accountSid = Environment.GetEnvironmentVariable("TWILIO_ACCOUNT_SID");
        string authToken = Environment.GetEnvironmentVariable("TWILIO_AUTH_TOKEN");

        TwilioClient.Init(accountSid, authToken);

        var conversationWithParticipants = await ConversationWithParticipantsResource.CreateAsync(
            friendlyName: "Friendly Conversation",
            participant: new List<string> {
                "{\"messaging_binding\": {\"address\": \"<External Participant Number>\", \"proxy_address\": \"<Your Twilio Number>\"}}",
                "{\"identity\": \"<Chat User Identity>\"}"
            });

        Console.WriteLine(conversationWithParticipants.Sid);
    }
}
```

```java
// Install the Java helper library from twilio.com/docs/java/install

import java.util.Arrays;
import com.twilio.Twilio;
import com.twilio.rest.conversations.v1.ConversationWithParticipants;

public class Example {
    // Find your Account SID and Auth Token at twilio.com/console
    // and set the environment variables. See http://twil.io/secure
    public static final String ACCOUNT_SID = System.getenv("TWILIO_ACCOUNT_SID");
    public static final String AUTH_TOKEN = System.getenv("TWILIO_AUTH_TOKEN");

    public static void main(String[] args) {
        Twilio.init(ACCOUNT_SID, AUTH_TOKEN);
        ConversationWithParticipants conversationWithParticipants =
            ConversationWithParticipants.creator()
                .setFriendlyName("Friendly Conversation")
                .setParticipant(Arrays.asList("{\"messaging_binding\": {\"address\": \"<External Participant "
                                              + "Number>\", \"proxy_address\": \"<Your Twilio Number>\"}}",
                    "{\"identity\": \"<Chat User Identity>\"}"))
                .create();

        System.out.println(conversationWithParticipants.getSid());
    }
}
```

```go
// Download the helper library from https://www.twilio.com/docs/go/install
package main

import (
	"fmt"
	"github.com/twilio/twilio-go"
	conversations "github.com/twilio/twilio-go/rest/conversations/v1"
	"os"
)

func main() {
	// Find your Account SID and Auth Token at twilio.com/console
	// and set the environment variables. See http://twil.io/secure
	// Make sure TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN exists in your environment
	client := twilio.NewRestClient()

	params := &conversations.CreateConversationWithParticipantsParams{}
	params.SetFriendlyName("Friendly Conversation")
	params.SetParticipant([]string{
		"{\"messaging_binding\": {\"address\": \"<External Participant Number>\", \"proxy_address\": \"<Your Twilio Number>\"}}",
		"{\"identity\": \"<Chat User Identity>\"}",
	})

	resp, err := client.ConversationsV1.CreateConversationWithParticipants(params)
	if err != nil {
		fmt.Println(err.Error())
		os.Exit(1)
	} else {
		if resp.Sid != nil {
			fmt.Println(*resp.Sid)
		} else {
			fmt.Println(resp.Sid)
		}
	}
}
```

```php
<?php

// Update the path below to your autoload.php,
// see https://getcomposer.org/doc/01-basic-usage.md
require_once "/path/to/vendor/autoload.php";

use Twilio\Rest\Client;

// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
$sid = getenv("TWILIO_ACCOUNT_SID");
$token = getenv("TWILIO_AUTH_TOKEN");
$twilio = new Client($sid, $token);

$conversation_with_participant = $twilio->conversations->v1->conversationWithParticipants->create(
    [
        "friendlyName" => "Friendly Conversation",
        "participant" => [
            "{\"messaging_binding\": {\"address\": \"<External Participant Number>\", \"proxy_address\": \"<Your Twilio Number>\"}}",
            "{\"identity\": \"<Chat User Identity>\"}",
        ],
    ]
);

print $conversation_with_participant->sid;
```

```ruby
# Download the helper library from https://www.twilio.com/docs/ruby/install
require 'rubygems'
require 'twilio-ruby'

# Find your Account SID and Auth Token at twilio.com/console
# and set the environment variables. See http://twil.io/secure
account_sid = ENV['TWILIO_ACCOUNT_SID']
auth_token = ENV['TWILIO_AUTH_TOKEN']
@client = Twilio::REST::Client.new(account_sid, auth_token)

conversation_with_participant = @client
                                .conversations
                                .v1
                                .conversation_with_participants
                                .create(
                                  friendly_name: 'Friendly Conversation',
                                  participant: [
                                    '{"messaging_binding": {"address": "<External Participant Number>", "proxy_address": "<Your Twilio Number>"}}',
                                    '{"identity": "<Chat User Identity>"}'
                                  ]
                                )

puts conversation_with_participant.sid
```

```bash
# Install the twilio-cli from https://twil.io/cli

twilio api:conversations:v1:conversation-with-participants:create \
   --friendly-name "Friendly Conversation" \
   --participant "{\"messaging_binding\": {\"address\": \"<External Participant Number>\", \"proxy_address\": \"<Your Twilio Number>\"}}" "{\"identity\": \"<Chat User Identity>\"}"
```

```bash
curl -X POST "https://conversations.twilio.com/v1/ConversationWithParticipants" \
--data-urlencode "FriendlyName=Friendly Conversation" \
--data-urlencode "Participant={\"messaging_binding\": {\"address\": \"<External Participant Number>\", \"proxy_address\": \"<Your Twilio Number>\"}}" \
--data-urlencode "Participant={\"identity\": \"<Chat User Identity>\"}" \
-u $TWILIO_ACCOUNT_SID:$TWILIO_AUTH_TOKEN
```

```json
{
  "sid": "CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  "chat_service_sid": "ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  "messaging_service_sid": "MGaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  "friendly_name": "Friendly Conversation",
  "unique_name": "unique_name",
  "attributes": "{ \"topic\": \"feedback\" }",
  "date_created": "2015-12-16T22:18:37Z",
  "date_updated": "2015-12-16T22:18:38Z",
  "state": "inactive",
  "timers": {
    "date_inactive": "2015-12-16T22:19:38Z",
    "date_closed": "2015-12-16T22:28:38Z"
  },
  "bindings": {},
  "links": {
    "participants": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Participants",
    "messages": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages",
    "webhooks": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Webhooks"
  },
  "url": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
}
```

Create GMMS Conversation with Participants

```js
// Download the helper library from https://www.twilio.com/docs/node/install
const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";

// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

async function createConversationWithParticipants() {
  const conversationWithParticipant =
    await client.conversations.v1.conversationWithParticipants.create({
      friendlyName: "Friendly Conversation",
      participant: [
        '{"messaging_binding": {"address": "<External Participant Number>"}}',
        '{"messaging_binding": {"address": "<External Participant Number>"}}',
        '{"messaging_binding": {"projected_address": "<Your Twilio Number>"}}',
      ],
    });

  console.log(conversationWithParticipant.sid);
}

createConversationWithParticipants();
```

```python
# Download the helper library from https://www.twilio.com/docs/python/install
import os
from twilio.rest import Client

# Find your Account SID and Auth Token at twilio.com/console
# and set the environment variables. See http://twil.io/secure
account_sid = os.environ["TWILIO_ACCOUNT_SID"]
auth_token = os.environ["TWILIO_AUTH_TOKEN"]
client = Client(account_sid, auth_token)

conversation_with_participant = client.conversations.v1.conversation_with_participants.create(
    friendly_name="Friendly Conversation",
    participant=[
        '{"messaging_binding": {"address": "<External Participant Number>"}}',
        '{"messaging_binding": {"address": "<External Participant Number>"}}',
        '{"messaging_binding": {"projected_address": "<Your Twilio Number>"}}',
    ],
)

print(conversation_with_participant.sid)
```

```csharp
// Install the C# / .NET helper library from twilio.com/docs/csharp/install

using System;
using Twilio;
using Twilio.Rest.Conversations.V1;
using System.Threading.Tasks;
using System.Collections.Generic;

class Program {
    public static async Task Main(string[] args) {
        // Find your Account SID and Auth Token at twilio.com/console
        // and set the environment variables. See http://twil.io/secure
        string accountSid = Environment.GetEnvironmentVariable("TWILIO_ACCOUNT_SID");
        string authToken = Environment.GetEnvironmentVariable("TWILIO_AUTH_TOKEN");

        TwilioClient.Init(accountSid, authToken);

        var conversationWithParticipants = await ConversationWithParticipantsResource.CreateAsync(
            friendlyName: "Friendly Conversation",
            participant: new List<string> {
                "{\"messaging_binding\": {\"address\": \"<External Participant Number>\"}}",
                "{\"messaging_binding\": {\"address\": \"<External Participant Number>\"}}",
                "{\"messaging_binding\": {\"projected_address\": \"<Your Twilio Number>\"}}"
            });

        Console.WriteLine(conversationWithParticipants.Sid);
    }
}
```

```java
// Install the Java helper library from twilio.com/docs/java/install

import java.util.Arrays;
import com.twilio.Twilio;
import com.twilio.rest.conversations.v1.ConversationWithParticipants;

public class Example {
    // Find your Account SID and Auth Token at twilio.com/console
    // and set the environment variables. See http://twil.io/secure
    public static final String ACCOUNT_SID = System.getenv("TWILIO_ACCOUNT_SID");
    public static final String AUTH_TOKEN = System.getenv("TWILIO_AUTH_TOKEN");

    public static void main(String[] args) {
        Twilio.init(ACCOUNT_SID, AUTH_TOKEN);
        ConversationWithParticipants conversationWithParticipants =
            ConversationWithParticipants.creator()
                .setFriendlyName("Friendly Conversation")
                .setParticipant(
                    Arrays.asList("{\"messaging_binding\": {\"address\": \"<External Participant Number>\"}}",
                        "{\"messaging_binding\": {\"address\": \"<External Participant Number>\"}}",
                        "{\"messaging_binding\": {\"projected_address\": \"<Your Twilio Number>\"}}"))
                .create();

        System.out.println(conversationWithParticipants.getSid());
    }
}
```

```go
// Download the helper library from https://www.twilio.com/docs/go/install
package main

import (
	"fmt"
	"github.com/twilio/twilio-go"
	conversations "github.com/twilio/twilio-go/rest/conversations/v1"
	"os"
)

func main() {
	// Find your Account SID and Auth Token at twilio.com/console
	// and set the environment variables. See http://twil.io/secure
	// Make sure TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN exists in your environment
	client := twilio.NewRestClient()

	params := &conversations.CreateConversationWithParticipantsParams{}
	params.SetFriendlyName("Friendly Conversation")
	params.SetParticipant([]string{
		"{\"messaging_binding\": {\"address\": \"<External Participant Number>\"}}",
		"{\"messaging_binding\": {\"address\": \"<External Participant Number>\"}}",
		"{\"messaging_binding\": {\"projected_address\": \"<Your Twilio Number>\"}}",
	})

	resp, err := client.ConversationsV1.CreateConversationWithParticipants(params)
	if err != nil {
		fmt.Println(err.Error())
		os.Exit(1)
	} else {
		if resp.Sid != nil {
			fmt.Println(*resp.Sid)
		} else {
			fmt.Println(resp.Sid)
		}
	}
}
```

```php
<?php

// Update the path below to your autoload.php,
// see https://getcomposer.org/doc/01-basic-usage.md
require_once "/path/to/vendor/autoload.php";

use Twilio\Rest\Client;

// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
$sid = getenv("TWILIO_ACCOUNT_SID");
$token = getenv("TWILIO_AUTH_TOKEN");
$twilio = new Client($sid, $token);

$conversation_with_participant = $twilio->conversations->v1->conversationWithParticipants->create(
    [
        "friendlyName" => "Friendly Conversation",
        "participant" => [
            "{\"messaging_binding\": {\"address\": \"<External Participant Number>\"}}",
            "{\"messaging_binding\": {\"address\": \"<External Participant Number>\"}}",
            "{\"messaging_binding\": {\"projected_address\": \"<Your Twilio Number>\"}}",
        ],
    ]
);

print $conversation_with_participant->sid;
```

```ruby
# Download the helper library from https://www.twilio.com/docs/ruby/install
require 'rubygems'
require 'twilio-ruby'

# Find your Account SID and Auth Token at twilio.com/console
# and set the environment variables. See http://twil.io/secure
account_sid = ENV['TWILIO_ACCOUNT_SID']
auth_token = ENV['TWILIO_AUTH_TOKEN']
@client = Twilio::REST::Client.new(account_sid, auth_token)

conversation_with_participant = @client
                                .conversations
                                .v1
                                .conversation_with_participants
                                .create(
                                  friendly_name: 'Friendly Conversation',
                                  participant: [
                                    '{"messaging_binding": {"address": "<External Participant Number>"}}',
                                    '{"messaging_binding": {"address": "<External Participant Number>"}}',
                                    '{"messaging_binding": {"projected_address": "<Your Twilio Number>"}}'
                                  ]
                                )

puts conversation_with_participant.sid
```

```bash
# Install the twilio-cli from https://twil.io/cli

twilio api:conversations:v1:conversation-with-participants:create \
   --friendly-name "Friendly Conversation" \
   --participant "{\"messaging_binding\": {\"address\": \"<External Participant Number>\"}}" "{\"messaging_binding\": {\"address\": \"<External Participant Number>\"}}" "{\"messaging_binding\": {\"projected_address\": \"<Your Twilio Number>\"}}"
```

```bash
curl -X POST "https://conversations.twilio.com/v1/ConversationWithParticipants" \
--data-urlencode "FriendlyName=Friendly Conversation" \
--data-urlencode "Participant={\"messaging_binding\": {\"address\": \"<External Participant Number>\"}}" \
--data-urlencode "Participant={\"messaging_binding\": {\"address\": \"<External Participant Number>\"}}" \
--data-urlencode "Participant={\"messaging_binding\": {\"projected_address\": \"<Your Twilio Number>\"}}" \
-u $TWILIO_ACCOUNT_SID:$TWILIO_AUTH_TOKEN
```

```json
{
  "sid": "CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  "chat_service_sid": "ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  "messaging_service_sid": "MGaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  "friendly_name": "Friendly Conversation",
  "unique_name": "unique_name",
  "attributes": "{ \"topic\": \"feedback\" }",
  "date_created": "2015-12-16T22:18:37Z",
  "date_updated": "2015-12-16T22:18:38Z",
  "state": "inactive",
  "timers": {
    "date_inactive": "2015-12-16T22:19:38Z",
    "date_closed": "2015-12-16T22:28:38Z"
  },
  "bindings": {},
  "links": {
    "participants": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Participants",
    "messages": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages",
    "webhooks": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Webhooks"
  },
  "url": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
}
```
