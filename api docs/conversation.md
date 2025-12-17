# Conversation Resource

A **Conversation** is a unique message thread that contains Participants and the Messages they have sent.

> \[!CAUTION]
>
> Avoid using a person's name, home address, email, phone number, or other PII in the `friendlyName` field. Use some form of pseudonymized identifier, instead.
>
> You can learn more about how we process your data in our [privacy policy.](https://www.twilio.com/legal/privacy)

## API Base URL

All URLs in the reference documentation use the following base URL:

```xml
https://conversations.twilio.com/v1
```

### Using the shortened base URL

Using the REST API, you can interact with Conversation resources in the **default Conversation Service** instance via a "shortened" URL that does not include the Conversation Service instance SID ("ISXXX..."). If you are only using one Conversation Service (the default), you do not need to include the Conversation Service SID in your URL, e.g.

```bash
GET /v1/Conversations

```

For Conversations applications that build on more than one Conversation Service instance, you will need to specify the Conversation Service SID in the REST API call:

```bash
GET /v1/Services/ISxx/Conversations
```

## Conversation Properties

```json
{"type":"object","refName":"conversations.v1.conversation","modelName":"conversations_v1_conversation","properties":{"account_sid":{"type":"string","minLength":34,"maxLength":34,"pattern":"^AC[0-9a-fA-F]{32}$","nullable":true,"description":"The unique ID of the [Account](/docs/iam/api/account) responsible for this conversation."},"chat_service_sid":{"type":"string","minLength":34,"maxLength":34,"pattern":"^IS[0-9a-fA-F]{32}$","nullable":true,"description":"The unique ID of the [Conversation Service](/docs/conversations/api/service-resource) this conversation belongs to."},"messaging_service_sid":{"type":"string","minLength":34,"maxLength":34,"pattern":"^MG[0-9a-fA-F]{32}$","nullable":true,"description":"The unique ID of the [Messaging Service](/docs/messaging/api/service-resource) this conversation belongs to."},"sid":{"type":"string","minLength":34,"maxLength":34,"pattern":"^CH[0-9a-fA-F]{32}$","nullable":true,"description":"A 34 character string that uniquely identifies this resource."},"friendly_name":{"type":"string","nullable":true,"description":"The human-readable name of this conversation, limited to 256 characters. Optional.","x-twilio":{"pii":{"handling":"standard","deleteSla":30}}},"unique_name":{"type":"string","nullable":true,"description":"An application-defined string that uniquely identifies the resource. It can be used to address the resource in place of the resource's `sid` in the URL.","x-twilio":{"pii":{"handling":"standard","deleteSla":30}}},"attributes":{"type":"string","nullable":true,"description":"An optional string metadata field you can use to store any data you wish. The string value must contain structurally valid JSON if specified.  **Note** that if the attributes are not set \"{}\" will be returned.","x-twilio":{"pii":{"handling":"sensitive","deleteSla":30}}},"state":{"type":"string","enum":["initializing","inactive","active","closed"],"description":"Current state of this conversation. Can be either `initializing`, `active`, `inactive` or `closed` and defaults to `active`","refName":"conversation_enum_state","modelName":"conversation_enum_state"},"date_created":{"type":"string","format":"date-time","nullable":true,"description":"The date that this resource was created."},"date_updated":{"type":"string","format":"date-time","nullable":true,"description":"The date that this resource was last updated."},"timers":{"nullable":true,"description":"Timer date values representing state update for this conversation."},"url":{"type":"string","format":"uri","nullable":true,"description":"An absolute API resource URL for this conversation."},"links":{"type":"object","format":"uri-map","nullable":true,"description":"Contains absolute URLs to access the [participants](/docs/conversations/api/conversation-participant-resource), [messages](/docs/conversations/api/conversation-message-resource) and [webhooks](/docs/conversations/api/conversation-scoped-webhook-resource) of this conversation."},"bindings":{"nullable":true}}}
```

## Create a Conversation resource

`POST https://conversations.twilio.com/v1/Conversations`

### Headers

```json
[{"name":"X-Twilio-Webhook-Enabled","in":"header","description":"The X-Twilio-Webhook-Enabled HTTP request header","schema":{"type":"string","enum":["true","false"],"refName":"conversation_enum_webhook_enabled_type","modelName":"conversation_enum_webhook_enabled_type"}}]
```

### Request body parameters

```json
{"schema":{"type":"object","title":"CreateConversationRequest","properties":{"FriendlyName":{"type":"string","description":"The human-readable name of this conversation, limited to 256 characters. Optional.","x-twilio":{"pii":{"handling":"standard","deleteSla":30}}},"UniqueName":{"type":"string","description":"An application-defined string that uniquely identifies the resource. It can be used to address the resource in place of the resource's `sid` in the URL.","x-twilio":{"pii":{"handling":"standard","deleteSla":30}}},"DateCreated":{"type":"string","format":"date-time","description":"The date that this resource was created."},"DateUpdated":{"type":"string","format":"date-time","description":"The date that this resource was last updated."},"MessagingServiceSid":{"type":"string","minLength":34,"maxLength":34,"pattern":"^MG[0-9a-fA-F]{32}$","description":"The unique ID of the [Messaging Service](/docs/messaging/api/service-resource) this conversation belongs to."},"Attributes":{"type":"string","description":"An optional string metadata field you can use to store any data you wish. The string value must contain structurally valid JSON if specified.  **Note** that if the attributes are not set \"{}\" will be returned.","x-twilio":{"pii":{"handling":"sensitive","deleteSla":30}}},"State":{"type":"string","enum":["initializing","inactive","active","closed"],"description":"Current state of this conversation. Can be either `initializing`, `active`, `inactive` or `closed` and defaults to `active`","refName":"conversation_enum_state","modelName":"conversation_enum_state"},"Timers.Inactive":{"type":"string","description":"ISO8601 duration when conversation will be switched to `inactive` state. Minimum value for this timer is 1 minute."},"Timers.Closed":{"type":"string","description":"ISO8601 duration when conversation will be switched to `closed` state. Minimum value for this timer is 10 minutes."},"Bindings.Email.Address":{"type":"string","description":"The default email address that will be used when sending outbound emails in this conversation."},"Bindings.Email.Name":{"type":"string","description":"The default name that will be used when sending outbound emails in this conversation."}}},"examples":{"create":{"value":{"lang":"json","value":"{\n  \"FriendlyName\": \"friendly_name\",\n  \"UniqueName\": \"unique_name\",\n  \"Attributes\": \"{ \\\"topic\\\": \\\"feedback\\\" }\",\n  \"DateCreated\": \"2015-12-16T22:18:37Z\",\n  \"DateUpdated\": \"2015-12-16T22:18:38Z\",\n  \"MessagingServiceSid\": \"MGaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\",\n  \"State\": \"inactive\",\n  \"Timers.Inactive\": \"PT1M\",\n  \"Timers.Closed\": \"PT10M\"\n}","meta":"","code":"{\n  \"FriendlyName\": \"friendly_name\",\n  \"UniqueName\": \"unique_name\",\n  \"Attributes\": \"{ \\\"topic\\\": \\\"feedback\\\" }\",\n  \"DateCreated\": \"2015-12-16T22:18:37Z\",\n  \"DateUpdated\": \"2015-12-16T22:18:38Z\",\n  \"MessagingServiceSid\": \"MGaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\",\n  \"State\": \"inactive\",\n  \"Timers.Inactive\": \"PT1M\",\n  \"Timers.Closed\": \"PT10M\"\n}","tokens":[["{","#C9D1D9"],"\n  ",["\"FriendlyName\"","#7EE787"],[":","#C9D1D9"]," ",["\"friendly_name\"","#A5D6FF"],[",","#C9D1D9"],"\n  ",["\"UniqueName\"","#7EE787"],[":","#C9D1D9"]," ",["\"unique_name\"","#A5D6FF"],[",","#C9D1D9"],"\n  ",["\"Attributes\"","#7EE787"],[":","#C9D1D9"]," ",["\"{","#A5D6FF"]," ",["\\\"","#79C0FF"],["topic","#A5D6FF"],["\\\"","#79C0FF"],[":","#A5D6FF"]," ",["\\\"","#79C0FF"],["feedback","#A5D6FF"],["\\\"","#79C0FF"]," ",["}\"","#A5D6FF"],[",","#C9D1D9"],"\n  ",["\"DateCreated\"","#7EE787"],[":","#C9D1D9"]," ",["\"2015-12-16T22:18:37Z\"","#A5D6FF"],[",","#C9D1D9"],"\n  ",["\"DateUpdated\"","#7EE787"],[":","#C9D1D9"]," ",["\"2015-12-16T22:18:38Z\"","#A5D6FF"],[",","#C9D1D9"],"\n  ",["\"MessagingServiceSid\"","#7EE787"],[":","#C9D1D9"]," ",["\"MGaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\"","#A5D6FF"],[",","#C9D1D9"],"\n  ",["\"State\"","#7EE787"],[":","#C9D1D9"]," ",["\"inactive\"","#A5D6FF"],[",","#C9D1D9"],"\n  ",["\"Timers.Inactive\"","#7EE787"],[":","#C9D1D9"]," ",["\"PT1M\"","#A5D6FF"],[",","#C9D1D9"],"\n  ",["\"Timers.Closed\"","#7EE787"],[":","#C9D1D9"]," ",["\"PT10M\"","#A5D6FF"],"\n",["}","#C9D1D9"]],"annotations":[],"themeName":"github-dark","style":{"color":"#c9d1d9","background":"#0d1117"}}},"createNoTimersNoAttributes":{"value":{"lang":"json","value":"{\n  \"FriendlyName\": \"friendly_name\",\n  \"DateCreated\": \"2020-07-01T22:18:37Z\",\n  \"DateUpdated\": \"2020-07-01T22:18:37Z\",\n  \"MessagingServiceSid\": \"MGaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\",\n  \"State\": \"active\"\n}","meta":"","code":"{\n  \"FriendlyName\": \"friendly_name\",\n  \"DateCreated\": \"2020-07-01T22:18:37Z\",\n  \"DateUpdated\": \"2020-07-01T22:18:37Z\",\n  \"MessagingServiceSid\": \"MGaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\",\n  \"State\": \"active\"\n}","tokens":[["{","#C9D1D9"],"\n  ",["\"FriendlyName\"","#7EE787"],[":","#C9D1D9"]," ",["\"friendly_name\"","#A5D6FF"],[",","#C9D1D9"],"\n  ",["\"DateCreated\"","#7EE787"],[":","#C9D1D9"]," ",["\"2020-07-01T22:18:37Z\"","#A5D6FF"],[",","#C9D1D9"],"\n  ",["\"DateUpdated\"","#7EE787"],[":","#C9D1D9"]," ",["\"2020-07-01T22:18:37Z\"","#A5D6FF"],[",","#C9D1D9"],"\n  ",["\"MessagingServiceSid\"","#7EE787"],[":","#C9D1D9"]," ",["\"MGaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\"","#A5D6FF"],[",","#C9D1D9"],"\n  ",["\"State\"","#7EE787"],[":","#C9D1D9"]," ",["\"active\"","#A5D6FF"],"\n",["}","#C9D1D9"]],"annotations":[],"themeName":"github-dark","style":{"color":"#c9d1d9","background":"#0d1117"}}},"createEmailConversation":{"value":{"lang":"json","value":"{\n  \"FriendlyName\": \"friendly_name\",\n  \"DateCreated\": \"2020-07-01T22:18:37Z\",\n  \"DateUpdated\": \"2020-07-01T22:18:37Z\",\n  \"Bindings.Email.Address\": \"example@example.com\",\n  \"Bindings.Email.Name\": \"Example\"\n}","meta":"","code":"{\n  \"FriendlyName\": \"friendly_name\",\n  \"DateCreated\": \"2020-07-01T22:18:37Z\",\n  \"DateUpdated\": \"2020-07-01T22:18:37Z\",\n  \"Bindings.Email.Address\": \"example@example.com\",\n  \"Bindings.Email.Name\": \"Example\"\n}","tokens":[["{","#C9D1D9"],"\n  ",["\"FriendlyName\"","#7EE787"],[":","#C9D1D9"]," ",["\"friendly_name\"","#A5D6FF"],[",","#C9D1D9"],"\n  ",["\"DateCreated\"","#7EE787"],[":","#C9D1D9"]," ",["\"2020-07-01T22:18:37Z\"","#A5D6FF"],[",","#C9D1D9"],"\n  ",["\"DateUpdated\"","#7EE787"],[":","#C9D1D9"]," ",["\"2020-07-01T22:18:37Z\"","#A5D6FF"],[",","#C9D1D9"],"\n  ",["\"Bindings.Email.Address\"","#7EE787"],[":","#C9D1D9"]," ",["\"example@example.com\"","#A5D6FF"],[",","#C9D1D9"],"\n  ",["\"Bindings.Email.Name\"","#7EE787"],[":","#C9D1D9"]," ",["\"Example\"","#A5D6FF"],"\n",["}","#C9D1D9"]],"annotations":[],"themeName":"github-dark","style":{"color":"#c9d1d9","background":"#0d1117"}}},"createWithIntializingResponseState":{"value":{"lang":"json","value":"{\n  \"FriendlyName\": \"friendly_name\",\n  \"UniqueName\": \"unique_name\",\n  \"Attributes\": \"{ \\\"topic\\\": \\\"feedback\\\" }\",\n  \"DateCreated\": \"2015-12-16T22:18:37Z\",\n  \"DateUpdated\": \"2015-12-16T22:18:38Z\",\n  \"MessagingServiceSid\": \"MGaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\",\n  \"State\": \"active\",\n  \"Timers.Inactive\": \"PT1M\",\n  \"Timers.Closed\": \"PT10M\"\n}","meta":"","code":"{\n  \"FriendlyName\": \"friendly_name\",\n  \"UniqueName\": \"unique_name\",\n  \"Attributes\": \"{ \\\"topic\\\": \\\"feedback\\\" }\",\n  \"DateCreated\": \"2015-12-16T22:18:37Z\",\n  \"DateUpdated\": \"2015-12-16T22:18:38Z\",\n  \"MessagingServiceSid\": \"MGaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\",\n  \"State\": \"active\",\n  \"Timers.Inactive\": \"PT1M\",\n  \"Timers.Closed\": \"PT10M\"\n}","tokens":[["{","#C9D1D9"],"\n  ",["\"FriendlyName\"","#7EE787"],[":","#C9D1D9"]," ",["\"friendly_name\"","#A5D6FF"],[",","#C9D1D9"],"\n  ",["\"UniqueName\"","#7EE787"],[":","#C9D1D9"]," ",["\"unique_name\"","#A5D6FF"],[",","#C9D1D9"],"\n  ",["\"Attributes\"","#7EE787"],[":","#C9D1D9"]," ",["\"{","#A5D6FF"]," ",["\\\"","#79C0FF"],["topic","#A5D6FF"],["\\\"","#79C0FF"],[":","#A5D6FF"]," ",["\\\"","#79C0FF"],["feedback","#A5D6FF"],["\\\"","#79C0FF"]," ",["}\"","#A5D6FF"],[",","#C9D1D9"],"\n  ",["\"DateCreated\"","#7EE787"],[":","#C9D1D9"]," ",["\"2015-12-16T22:18:37Z\"","#A5D6FF"],[",","#C9D1D9"],"\n  ",["\"DateUpdated\"","#7EE787"],[":","#C9D1D9"]," ",["\"2015-12-16T22:18:38Z\"","#A5D6FF"],[",","#C9D1D9"],"\n  ",["\"MessagingServiceSid\"","#7EE787"],[":","#C9D1D9"]," ",["\"MGaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\"","#A5D6FF"],[",","#C9D1D9"],"\n  ",["\"State\"","#7EE787"],[":","#C9D1D9"]," ",["\"active\"","#A5D6FF"],[",","#C9D1D9"],"\n  ",["\"Timers.Inactive\"","#7EE787"],[":","#C9D1D9"]," ",["\"PT1M\"","#A5D6FF"],[",","#C9D1D9"],"\n  ",["\"Timers.Closed\"","#7EE787"],[":","#C9D1D9"]," ",["\"PT10M\"","#A5D6FF"],"\n",["}","#C9D1D9"]],"annotations":[],"themeName":"github-dark","style":{"color":"#c9d1d9","background":"#0d1117"}}}},"encodingType":"application/x-www-form-urlencoded","conditionalParameterMap":{}}
```

Create Conversation

```js
// Download the helper library from https://www.twilio.com/docs/node/install
const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";

// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

async function createConversation() {
  const conversation = await client.conversations.v1.conversations.create({
    friendlyName: "Friendly Conversation",
  });

  console.log(conversation.sid);
}

createConversation();
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

conversation = client.conversations.v1.conversations.create(
    friendly_name="Friendly Conversation"
)

print(conversation.sid)
```

```csharp
// Install the C# / .NET helper library from twilio.com/docs/csharp/install

using System;
using Twilio;
using Twilio.Rest.Conversations.V1;
using System.Threading.Tasks;

class Program {
    public static async Task Main(string[] args) {
        // Find your Account SID and Auth Token at twilio.com/console
        // and set the environment variables. See http://twil.io/secure
        string accountSid = Environment.GetEnvironmentVariable("TWILIO_ACCOUNT_SID");
        string authToken = Environment.GetEnvironmentVariable("TWILIO_AUTH_TOKEN");

        TwilioClient.Init(accountSid, authToken);

        var conversation =
            await ConversationResource.CreateAsync(friendlyName: "Friendly Conversation");

        Console.WriteLine(conversation.Sid);
    }
}
```

```java
// Install the Java helper library from twilio.com/docs/java/install

import com.twilio.Twilio;
import com.twilio.rest.conversations.v1.Conversation;

public class Example {
    // Find your Account SID and Auth Token at twilio.com/console
    // and set the environment variables. See http://twil.io/secure
    public static final String ACCOUNT_SID = System.getenv("TWILIO_ACCOUNT_SID");
    public static final String AUTH_TOKEN = System.getenv("TWILIO_AUTH_TOKEN");

    public static void main(String[] args) {
        Twilio.init(ACCOUNT_SID, AUTH_TOKEN);
        Conversation conversation = Conversation.creator().setFriendlyName("Friendly Conversation").create();

        System.out.println(conversation.getSid());
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

	params := &conversations.CreateConversationParams{}
	params.SetFriendlyName("Friendly Conversation")

	resp, err := client.ConversationsV1.CreateConversation(params)
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

$conversation = $twilio->conversations->v1->conversations->create([
    "friendlyName" => "Friendly Conversation",
]);

print $conversation->sid;
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

conversation = @client
               .conversations
               .v1
               .conversations
               .create(friendly_name: 'Friendly Conversation')

puts conversation.sid
```

```bash
# Install the twilio-cli from https://twil.io/cli

twilio api:conversations:v1:conversations:create \
   --friendly-name "Friendly Conversation"
```

```bash
curl -X POST "https://conversations.twilio.com/v1/Conversations" \
--data-urlencode "FriendlyName=Friendly Conversation" \
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
  "url": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  "links": {
    "participants": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Participants",
    "messages": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages",
    "webhooks": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Webhooks",
    "export": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Export"
  }
}
```

## Fetch a Conversation resource

`GET https://conversations.twilio.com/v1/Conversations/{Sid}`

You can fetch a Conversation by providing your account credentials and the conversation SID (provided when the Conversation is created).

The most valuable part of the Conversation resource itself is the `attributes` key, which includes metadata attached to the conversation from the moment of its creation.

The other relevant parts of a Conversation include its Participants (the entities who are currently conversing) and the Messages they've sent. Both of these are linked directly from the top-level `url` key.

### Path parameters

```json
[{"name":"Sid","in":"path","description":"A 34 character string that uniquely identifies this resource. Can also be the `unique_name` of the Conversation.","schema":{"type":"string"},"required":true}]
```

Fetch Conversation

```js
// Download the helper library from https://www.twilio.com/docs/node/install
const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";

// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

async function fetchConversation() {
  const conversation = await client.conversations.v1
    .conversations("CHXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    .fetch();

  console.log(conversation.accountSid);
}

fetchConversation();
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

conversation = client.conversations.v1.conversations(
    "CHXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
).fetch()

print(conversation.account_sid)
```

```csharp
// Install the C# / .NET helper library from twilio.com/docs/csharp/install

using System;
using Twilio;
using Twilio.Rest.Conversations.V1;
using System.Threading.Tasks;

class Program {
    public static async Task Main(string[] args) {
        // Find your Account SID and Auth Token at twilio.com/console
        // and set the environment variables. See http://twil.io/secure
        string accountSid = Environment.GetEnvironmentVariable("TWILIO_ACCOUNT_SID");
        string authToken = Environment.GetEnvironmentVariable("TWILIO_AUTH_TOKEN");

        TwilioClient.Init(accountSid, authToken);

        var conversation =
            await ConversationResource.FetchAsync(pathSid: "CHXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");

        Console.WriteLine(conversation.AccountSid);
    }
}
```

```java
// Install the Java helper library from twilio.com/docs/java/install

import com.twilio.Twilio;
import com.twilio.rest.conversations.v1.Conversation;

public class Example {
    // Find your Account SID and Auth Token at twilio.com/console
    // and set the environment variables. See http://twil.io/secure
    public static final String ACCOUNT_SID = System.getenv("TWILIO_ACCOUNT_SID");
    public static final String AUTH_TOKEN = System.getenv("TWILIO_AUTH_TOKEN");

    public static void main(String[] args) {
        Twilio.init(ACCOUNT_SID, AUTH_TOKEN);
        Conversation conversation = Conversation.fetcher("CHXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX").fetch();

        System.out.println(conversation.getAccountSid());
    }
}
```

```go
// Download the helper library from https://www.twilio.com/docs/go/install
package main

import (
	"fmt"
	"github.com/twilio/twilio-go"
	"os"
)

func main() {
	// Find your Account SID and Auth Token at twilio.com/console
	// and set the environment variables. See http://twil.io/secure
	// Make sure TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN exists in your environment
	client := twilio.NewRestClient()

	resp, err := client.ConversationsV1.FetchConversation("CHXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
	if err != nil {
		fmt.Println(err.Error())
		os.Exit(1)
	} else {
		if resp.AccountSid != nil {
			fmt.Println(*resp.AccountSid)
		} else {
			fmt.Println(resp.AccountSid)
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

$conversation = $twilio->conversations->v1
    ->conversations("CHXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    ->fetch();

print $conversation->accountSid;
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

conversation = @client
               .conversations
               .v1
               .conversations('CHXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')
               .fetch

puts conversation.account_sid
```

```bash
# Install the twilio-cli from https://twil.io/cli

twilio api:conversations:v1:conversations:fetch \
   --sid CHXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

```bash
curl -X GET "https://conversations.twilio.com/v1/Conversations/CHXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX" \
-u $TWILIO_ACCOUNT_SID:$TWILIO_AUTH_TOKEN
```

```json
{
  "sid": "CHXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  "chat_service_sid": "ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  "messaging_service_sid": "MGaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  "friendly_name": "My First Conversation",
  "unique_name": "first_conversation",
  "attributes": "{ \"topic\": \"feedback\" }",
  "date_created": "2015-12-16T22:18:37Z",
  "date_updated": "2015-12-16T22:18:38Z",
  "state": "active",
  "timers": {
    "date_inactive": "2015-12-16T22:19:38Z",
    "date_closed": "2015-12-16T22:28:38Z"
  },
  "bindings": {},
  "url": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  "links": {
    "participants": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Participants",
    "messages": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages",
    "webhooks": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Webhooks",
    "export": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Export"
  }
}
```

## Read multiple Conversation resources

`GET https://conversations.twilio.com/v1/Conversations`

Returns a list of conversations sorted by recent message activity.

### Query parameters

```json
[{"name":"StartDate","in":"query","description":"Specifies the beginning of the date range for filtering Conversations based on their creation date. Conversations that were created on or after this date will be included in the results. The date must be in ISO8601 format, specifically starting at the beginning of the specified date (YYYY-MM-DDT00:00:00Z), for precise filtering. This parameter can be combined with other filters. If this filter is used, the returned list is sorted by latest conversation creation date in descending order.","schema":{"type":"string"}},{"name":"EndDate","in":"query","description":"Defines the end of the date range for filtering conversations by their creation date. Only conversations that were created on or before this date will appear in the results.  The date must be in ISO8601 format, specifically capturing up to the end of the specified date (YYYY-MM-DDT23:59:59Z), to ensure that conversations from the entire end day are included. This parameter can be combined with other filters. If this filter is used, the returned list is sorted by latest conversation creation date in descending order.","schema":{"type":"string"}},{"name":"State","in":"query","description":"State for sorting and filtering list of Conversations. Can be `active`, `inactive` or `closed`","schema":{"type":"string","enum":["initializing","inactive","active","closed"],"description":"Current state of this conversation. Can be either `initializing`, `active`, `inactive` or `closed` and defaults to `active`","refName":"conversation_enum_state","modelName":"conversation_enum_state"}},{"name":"PageSize","in":"query","description":"How many resources to return in each list page. The default is 50, and the maximum is 100.","schema":{"type":"integer","format":"int64","minimum":1,"maximum":100}},{"name":"Page","in":"query","description":"The page index. This value is simply for client state.","schema":{"type":"integer","minimum":0}},{"name":"PageToken","in":"query","description":"The page token. This is provided by the API.","schema":{"type":"string"}}]
```

Read multiple Conversation resources

```js
// Download the helper library from https://www.twilio.com/docs/node/install
const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";

// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

async function listConversation() {
  const conversations = await client.conversations.v1.conversations.list({
    limit: 20,
  });

  conversations.forEach((c) => console.log(c.accountSid));
}

listConversation();
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

conversations = client.conversations.v1.conversations.list(limit=20)

for record in conversations:
    print(record.account_sid)
```

```csharp
// Install the C# / .NET helper library from twilio.com/docs/csharp/install

using System;
using Twilio;
using Twilio.Rest.Conversations.V1;
using System.Threading.Tasks;

class Program {
    public static async Task Main(string[] args) {
        // Find your Account SID and Auth Token at twilio.com/console
        // and set the environment variables. See http://twil.io/secure
        string accountSid = Environment.GetEnvironmentVariable("TWILIO_ACCOUNT_SID");
        string authToken = Environment.GetEnvironmentVariable("TWILIO_AUTH_TOKEN");

        TwilioClient.Init(accountSid, authToken);

        var conversations = await ConversationResource.ReadAsync(limit: 20);

        foreach (var record in conversations) {
            Console.WriteLine(record.AccountSid);
        }
    }
}
```

```java
// Install the Java helper library from twilio.com/docs/java/install

import com.twilio.Twilio;
import com.twilio.rest.conversations.v1.Conversation;
import com.twilio.base.ResourceSet;

public class Example {
    // Find your Account SID and Auth Token at twilio.com/console
    // and set the environment variables. See http://twil.io/secure
    public static final String ACCOUNT_SID = System.getenv("TWILIO_ACCOUNT_SID");
    public static final String AUTH_TOKEN = System.getenv("TWILIO_AUTH_TOKEN");

    public static void main(String[] args) {
        Twilio.init(ACCOUNT_SID, AUTH_TOKEN);
        ResourceSet<Conversation> conversations = Conversation.reader().limit(20).read();

        for (Conversation record : conversations) {
            System.out.println(record.getAccountSid());
        }
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

	params := &conversations.ListConversationParams{}
	params.SetLimit(20)

	resp, err := client.ConversationsV1.ListConversation(params)
	if err != nil {
		fmt.Println(err.Error())
		os.Exit(1)
	} else {
		for record := range resp {
			if resp[record].AccountSid != nil {
				fmt.Println(*resp[record].AccountSid)
			} else {
				fmt.Println(resp[record].AccountSid)
			}
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

$conversations = $twilio->conversations->v1->conversations->read([], 20);

foreach ($conversations as $record) {
    print $record->accountSid;
}
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

conversations = @client
                .conversations
                .v1
                .conversations
                .list(limit: 20)

conversations.each do |record|
   puts record.account_sid
end
```

```bash
# Install the twilio-cli from https://twil.io/cli

twilio api:conversations:v1:conversations:list
```

```bash
curl -X GET "https://conversations.twilio.com/v1/Conversations?PageSize=20" \
-u $TWILIO_ACCOUNT_SID:$TWILIO_AUTH_TOKEN
```

```json
{
  "conversations": [
    {
      "sid": "CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      "chat_service_sid": "ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      "messaging_service_sid": "MGaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      "friendly_name": "Home Repair Visit",
      "unique_name": null,
      "attributes": "{ \"topic\": \"feedback\" }",
      "date_created": "2015-12-16T22:18:37Z",
      "date_updated": "2015-12-16T22:18:38Z",
      "state": "active",
      "timers": {
        "date_inactive": "2015-12-16T22:19:38Z",
        "date_closed": "2015-12-16T22:28:38Z"
      },
      "bindings": {},
      "url": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      "links": {
        "participants": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Participants",
        "messages": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages",
        "webhooks": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Webhooks",
        "export": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Export"
      }
    }
  ],
  "meta": {
    "page": 0,
    "page_size": 50,
    "first_page_url": "https://conversations.twilio.com/v1/Conversations?PageSize=50&Page=0",
    "previous_page_url": null,
    "url": "https://conversations.twilio.com/v1/Conversations?PageSize=50&Page=0",
    "next_page_url": null,
    "key": "conversations"
  }
}
```

## Update Conversation

`POST https://conversations.twilio.com/v1/Conversations/{Sid}`

The core definition of any Conversation can be modified on the fly. Update a Conversation to attach metadata that you extract on the fly (e.g. "customer-loyalty-status": "gold", or "aml-risk-level": "heightened"), or to correct mistakes manually.

### Headers

```json
[{"name":"X-Twilio-Webhook-Enabled","in":"header","description":"The X-Twilio-Webhook-Enabled HTTP request header","schema":{"type":"string","enum":["true","false"],"refName":"conversation_enum_webhook_enabled_type","modelName":"conversation_enum_webhook_enabled_type"}}]
```

### Path parameters

```json
[{"name":"Sid","in":"path","description":"A 34 character string that uniquely identifies this resource. Can also be the `unique_name` of the Conversation.","schema":{"type":"string"},"required":true}]
```

### Request body parameters

```json
{"schema":{"type":"object","title":"UpdateConversationRequest","properties":{"FriendlyName":{"type":"string","description":"The human-readable name of this conversation, limited to 256 characters. Optional.","x-twilio":{"pii":{"handling":"standard","deleteSla":30}}},"DateCreated":{"type":"string","format":"date-time","description":"The date that this resource was created."},"DateUpdated":{"type":"string","format":"date-time","description":"The date that this resource was last updated."},"Attributes":{"type":"string","description":"An optional string metadata field you can use to store any data you wish. The string value must contain structurally valid JSON if specified.  **Note** that if the attributes are not set \"{}\" will be returned.","x-twilio":{"pii":{"handling":"sensitive","deleteSla":30}}},"MessagingServiceSid":{"type":"string","minLength":34,"maxLength":34,"pattern":"^MG[0-9a-fA-F]{32}$","description":"The unique ID of the [Messaging Service](/docs/messaging/api/service-resource) this conversation belongs to."},"State":{"type":"string","enum":["initializing","inactive","active","closed"],"description":"Current state of this conversation. Can be either `initializing`, `active`, `inactive` or `closed` and defaults to `active`","refName":"conversation_enum_state","modelName":"conversation_enum_state"},"Timers.Inactive":{"type":"string","description":"ISO8601 duration when conversation will be switched to `inactive` state. Minimum value for this timer is 1 minute."},"Timers.Closed":{"type":"string","description":"ISO8601 duration when conversation will be switched to `closed` state. Minimum value for this timer is 10 minutes."},"UniqueName":{"type":"string","description":"An application-defined string that uniquely identifies the resource. It can be used to address the resource in place of the resource's `sid` in the URL.","x-twilio":{"pii":{"handling":"standard","deleteSla":30}}},"Bindings.Email.Address":{"type":"string","description":"The default email address that will be used when sending outbound emails in this conversation."},"Bindings.Email.Name":{"type":"string","description":"The default name that will be used when sending outbound emails in this conversation."}}},"examples":{"update":{"value":{"lang":"json","value":"{\n  \"FriendlyName\": \"friendly_name\",\n  \"UniqueName\": \"unique_name\",\n  \"Attributes\": \"{ \\\"topic\\\": \\\"feedback\\\" }\",\n  \"DateCreated\": \"2015-12-16T22:18:37Z\",\n  \"DateUpdated\": \"2015-12-16T22:18:38Z\",\n  \"MessagingServiceSid\": \"MGaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaab\",\n  \"State\": \"inactive\",\n  \"Timers.Inactive\": \"PT1M\",\n  \"Timers.Closed\": \"PT10M\"\n}","meta":"","code":"{\n  \"FriendlyName\": \"friendly_name\",\n  \"UniqueName\": \"unique_name\",\n  \"Attributes\": \"{ \\\"topic\\\": \\\"feedback\\\" }\",\n  \"DateCreated\": \"2015-12-16T22:18:37Z\",\n  \"DateUpdated\": \"2015-12-16T22:18:38Z\",\n  \"MessagingServiceSid\": \"MGaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaab\",\n  \"State\": \"inactive\",\n  \"Timers.Inactive\": \"PT1M\",\n  \"Timers.Closed\": \"PT10M\"\n}","tokens":[["{","#C9D1D9"],"\n  ",["\"FriendlyName\"","#7EE787"],[":","#C9D1D9"]," ",["\"friendly_name\"","#A5D6FF"],[",","#C9D1D9"],"\n  ",["\"UniqueName\"","#7EE787"],[":","#C9D1D9"]," ",["\"unique_name\"","#A5D6FF"],[",","#C9D1D9"],"\n  ",["\"Attributes\"","#7EE787"],[":","#C9D1D9"]," ",["\"{","#A5D6FF"]," ",["\\\"","#79C0FF"],["topic","#A5D6FF"],["\\\"","#79C0FF"],[":","#A5D6FF"]," ",["\\\"","#79C0FF"],["feedback","#A5D6FF"],["\\\"","#79C0FF"]," ",["}\"","#A5D6FF"],[",","#C9D1D9"],"\n  ",["\"DateCreated\"","#7EE787"],[":","#C9D1D9"]," ",["\"2015-12-16T22:18:37Z\"","#A5D6FF"],[",","#C9D1D9"],"\n  ",["\"DateUpdated\"","#7EE787"],[":","#C9D1D9"]," ",["\"2015-12-16T22:18:38Z\"","#A5D6FF"],[",","#C9D1D9"],"\n  ",["\"MessagingServiceSid\"","#7EE787"],[":","#C9D1D9"]," ",["\"MGaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaab\"","#A5D6FF"],[",","#C9D1D9"],"\n  ",["\"State\"","#7EE787"],[":","#C9D1D9"]," ",["\"inactive\"","#A5D6FF"],[",","#C9D1D9"],"\n  ",["\"Timers.Inactive\"","#7EE787"],[":","#C9D1D9"]," ",["\"PT1M\"","#A5D6FF"],[",","#C9D1D9"],"\n  ",["\"Timers.Closed\"","#7EE787"],[":","#C9D1D9"]," ",["\"PT10M\"","#A5D6FF"],"\n",["}","#C9D1D9"]],"annotations":[],"themeName":"github-dark","style":{"color":"#c9d1d9","background":"#0d1117"}}},"updateClosedState":{"value":{"lang":"json","value":"{\n  \"State\": \"closed\"\n}","meta":"","code":"{\n  \"State\": \"closed\"\n}","tokens":[["{","#C9D1D9"],"\n  ",["\"State\"","#7EE787"],[":","#C9D1D9"]," ",["\"closed\"","#A5D6FF"],"\n",["}","#C9D1D9"]],"annotations":[],"themeName":"github-dark","style":{"color":"#c9d1d9","background":"#0d1117"}}}},"encodingType":"application/x-www-form-urlencoded","conditionalParameterMap":{}}
```

Update Conversation

```js
// Download the helper library from https://www.twilio.com/docs/node/install
const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";

// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

async function updateConversation() {
  const conversation = await client.conversations.v1
    .conversations("Sid")
    .update({ friendlyName: "Important Customer Question" });

  console.log(conversation.friendlyName);
}

updateConversation();
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

conversation = client.conversations.v1.conversations("Sid").update(
    friendly_name="Important Customer Question"
)

print(conversation.friendly_name)
```

```csharp
// Install the C# / .NET helper library from twilio.com/docs/csharp/install

using System;
using Twilio;
using Twilio.Rest.Conversations.V1;
using System.Threading.Tasks;

class Program {
    public static async Task Main(string[] args) {
        // Find your Account SID and Auth Token at twilio.com/console
        // and set the environment variables. See http://twil.io/secure
        string accountSid = Environment.GetEnvironmentVariable("TWILIO_ACCOUNT_SID");
        string authToken = Environment.GetEnvironmentVariable("TWILIO_AUTH_TOKEN");

        TwilioClient.Init(accountSid, authToken);

        var conversation = await ConversationResource.UpdateAsync(
            friendlyName: "Important Customer Question", pathSid: "Sid");

        Console.WriteLine(conversation.FriendlyName);
    }
}
```

```java
// Install the Java helper library from twilio.com/docs/java/install

import com.twilio.Twilio;
import com.twilio.rest.conversations.v1.Conversation;

public class Example {
    // Find your Account SID and Auth Token at twilio.com/console
    // and set the environment variables. See http://twil.io/secure
    public static final String ACCOUNT_SID = System.getenv("TWILIO_ACCOUNT_SID");
    public static final String AUTH_TOKEN = System.getenv("TWILIO_AUTH_TOKEN");

    public static void main(String[] args) {
        Twilio.init(ACCOUNT_SID, AUTH_TOKEN);
        Conversation conversation = Conversation.updater("Sid").setFriendlyName("Important Customer Question").update();

        System.out.println(conversation.getFriendlyName());
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

	params := &conversations.UpdateConversationParams{}
	params.SetFriendlyName("Important Customer Question")

	resp, err := client.ConversationsV1.UpdateConversation("Sid",
		params)
	if err != nil {
		fmt.Println(err.Error())
		os.Exit(1)
	} else {
		if resp.FriendlyName != nil {
			fmt.Println(*resp.FriendlyName)
		} else {
			fmt.Println(resp.FriendlyName)
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

$conversation = $twilio->conversations->v1
    ->conversations("Sid")
    ->update(["friendlyName" => "Important Customer Question"]);

print $conversation->friendlyName;
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

conversation = @client
               .conversations
               .v1
               .conversations('Sid')
               .update(friendly_name: 'Important Customer Question')

puts conversation.friendly_name
```

```bash
# Install the twilio-cli from https://twil.io/cli

twilio api:conversations:v1:conversations:update \
   --sid Sid \
   --friendly-name "Important Customer Question"
```

```bash
curl -X POST "https://conversations.twilio.com/v1/Conversations/Sid" \
--data-urlencode "FriendlyName=Important Customer Question" \
-u $TWILIO_ACCOUNT_SID:$TWILIO_AUTH_TOKEN
```

```json
{
  "sid": "Sid",
  "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  "chat_service_sid": "ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  "messaging_service_sid": "MGaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaab",
  "friendly_name": "Important Customer Question",
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
  "url": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  "links": {
    "participants": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Participants",
    "messages": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages",
    "webhooks": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Webhooks",
    "export": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Export"
  }
}
```

## Delete a Conversation resource

`DELETE https://conversations.twilio.com/v1/Conversations/{Sid}`

### Headers

```json
[{"name":"X-Twilio-Webhook-Enabled","in":"header","description":"The X-Twilio-Webhook-Enabled HTTP request header","schema":{"type":"string","enum":["true","false"],"refName":"conversation_enum_webhook_enabled_type","modelName":"conversation_enum_webhook_enabled_type"}}]
```

### Path parameters

```json
[{"name":"Sid","in":"path","description":"A 34 character string that uniquely identifies this resource. Can also be the `unique_name` of the Conversation.","schema":{"type":"string"},"required":true}]
```

Delete Conversation

```js
// Download the helper library from https://www.twilio.com/docs/node/install
const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";

// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

async function deleteConversation() {
  await client.conversations.v1
    .conversations("CHXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    .remove();
}

deleteConversation();
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

client.conversations.v1.conversations(
    "CHXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
).delete()
```

```csharp
// Install the C# / .NET helper library from twilio.com/docs/csharp/install

using System;
using Twilio;
using Twilio.Rest.Conversations.V1;
using System.Threading.Tasks;

class Program {
    public static async Task Main(string[] args) {
        // Find your Account SID and Auth Token at twilio.com/console
        // and set the environment variables. See http://twil.io/secure
        string accountSid = Environment.GetEnvironmentVariable("TWILIO_ACCOUNT_SID");
        string authToken = Environment.GetEnvironmentVariable("TWILIO_AUTH_TOKEN");

        TwilioClient.Init(accountSid, authToken);

        await ConversationResource.DeleteAsync(pathSid: "CHXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");
    }
}
```

```java
// Install the Java helper library from twilio.com/docs/java/install

import com.twilio.Twilio;
import com.twilio.rest.conversations.v1.Conversation;

public class Example {
    // Find your Account SID and Auth Token at twilio.com/console
    // and set the environment variables. See http://twil.io/secure
    public static final String ACCOUNT_SID = System.getenv("TWILIO_ACCOUNT_SID");
    public static final String AUTH_TOKEN = System.getenv("TWILIO_AUTH_TOKEN");

    public static void main(String[] args) {
        Twilio.init(ACCOUNT_SID, AUTH_TOKEN);
        Conversation.deleter("CHXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX").delete();
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

	params := &conversations.DeleteConversationParams{}

	err := client.ConversationsV1.DeleteConversation("CHXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
		params)
	if err != nil {
		fmt.Println(err.Error())
		os.Exit(1)
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

$twilio->conversations->v1
    ->conversations("CHXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    ->delete();
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

@client
  .conversations
  .v1
  .conversations('CHXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')
  .delete
```

```bash
# Install the twilio-cli from https://twil.io/cli

twilio api:conversations:v1:conversations:remove \
   --sid CHXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

```bash
curl -X DELETE "https://conversations.twilio.com/v1/Conversations/CHXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX" \
-u $TWILIO_ACCOUNT_SID:$TWILIO_AUTH_TOKEN
```
