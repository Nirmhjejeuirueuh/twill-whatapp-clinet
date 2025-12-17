# Conversation Message Resource

## API Base URL

All URLs in the reference documentation use the following base URL:

```bash
https://conversations.twilio.com/v1
```

### Using the shortened base URL

Using the REST API, you can interact with Conversation Message resources in the **default Conversation Service** instance via a "shortened" URL that does not include the Conversation Service instance SID ("ISXXX..."). If you are only using one Conversation Service (the default), you do not need to include the Conversation Service SID in your URL, e.g.

```bash
GET /v1/Conversations/CHxx/Messages

```

For Conversations applications that build on more than one Conversation Service instance, you will need to specify the Conversation Service SID in the REST API call:

```bash
GET /v1/Services/ISxx/Conversations/CHxx/Messages
```

## Message Properties

```json
{"type":"object","refName":"conversations.v1.conversation.conversation_message","modelName":"conversations_v1_conversation_conversation_message","properties":{"account_sid":{"type":"string","minLength":34,"maxLength":34,"pattern":"^AC[0-9a-fA-F]{32}$","nullable":true,"description":"The unique ID of the [Account](/docs/iam/api/account) responsible for this message."},"conversation_sid":{"type":"string","minLength":34,"maxLength":34,"pattern":"^CH[0-9a-fA-F]{32}$","nullable":true,"description":"The unique ID of the [Conversation](/docs/conversations/api/conversation-resource) for this message."},"sid":{"type":"string","minLength":34,"maxLength":34,"pattern":"^IM[0-9a-fA-F]{32}$","nullable":true,"description":"A 34 character string that uniquely identifies this resource."},"index":{"type":"integer","default":0,"description":"The index of the message within the [Conversation](/docs/conversations/api/conversation-resource).  Indices may skip numbers, but will always be in order of when the message was received."},"author":{"type":"string","nullable":true,"description":"The channel specific identifier of the message's author. Defaults to `system`.","x-twilio":{"pii":{"handling":"standard","deleteSla":30}}},"body":{"type":"string","nullable":true,"description":"The content of the message, can be up to 1,600 characters long.","x-twilio":{"pii":{"handling":"sensitive","deleteSla":30}}},"media":{"type":"array","nullable":true,"description":"An array of objects that describe the Message's media, if the message contains media. Each object contains these fields: `content_type` with the MIME type of the media, `filename` with the name of the media, `sid` with the SID of the Media resource, and `size` with the media object's file size in bytes. If the Message has no media, this value is `null`.","x-twilio":{"pii":{"handling":"standard","deleteSla":30}}},"attributes":{"type":"string","nullable":true,"description":"A string metadata field you can use to store any data you wish. The string value must contain structurally valid JSON if specified.  **Note** that if the attributes are not set \"{}\" will be returned.","x-twilio":{"pii":{"handling":"sensitive","deleteSla":30}}},"participant_sid":{"type":"string","minLength":34,"maxLength":34,"pattern":"^MB[0-9a-fA-F]{32}$","nullable":true,"description":"The unique ID of messages's author participant. Null in case of `system` sent message."},"date_created":{"type":"string","format":"date-time","nullable":true,"description":"The date that this resource was created."},"date_updated":{"type":"string","format":"date-time","nullable":true,"description":"The date that this resource was last updated. `null` if the message has not been edited."},"url":{"type":"string","format":"uri","nullable":true,"description":"An absolute API resource API URL for this message."},"delivery":{"nullable":true,"description":"An object that contains the summary of delivery statuses for the message to non-chat participants."},"links":{"type":"object","format":"uri-map","nullable":true,"description":"Contains an absolute API resource URL to access the delivery & read receipts of this message."},"content_sid":{"type":"string","minLength":34,"maxLength":34,"pattern":"^HX[0-9a-fA-F]{32}$","nullable":true,"description":"The unique ID of the multi-channel [Rich Content](/docs/content) template."}}}
```

## Create a ConversationMessage resource

`POST https://conversations.twilio.com/v1/Conversations/{ConversationSid}/Messages`

### Headers

```json
[{"name":"X-Twilio-Webhook-Enabled","in":"header","description":"The X-Twilio-Webhook-Enabled HTTP request header","schema":{"type":"string","enum":["true","false"],"refName":"conversation_message_enum_webhook_enabled_type","modelName":"conversation_message_enum_webhook_enabled_type"}}]
```

### Path parameters

```json
[{"name":"ConversationSid","in":"path","description":"The unique ID of the [Conversation](/docs/conversations/api/conversation-resource) for this message.","schema":{"type":"string"},"required":true}]
```

### Request body parameters

```json
{"schema":{"type":"object","title":"CreateConversationMessageRequest","properties":{"Author":{"type":"string","description":"The channel specific identifier of the message's author. Defaults to `system`.","x-twilio":{"pii":{"handling":"standard","deleteSla":30}}},"Body":{"type":"string","description":"The content of the message, can be up to 1,600 characters long.","x-twilio":{"pii":{"handling":"sensitive","deleteSla":30}}},"DateCreated":{"type":"string","format":"date-time","description":"The date that this resource was created."},"DateUpdated":{"type":"string","format":"date-time","description":"The date that this resource was last updated. `null` if the message has not been edited."},"Attributes":{"type":"string","description":"A string metadata field you can use to store any data you wish. The string value must contain structurally valid JSON if specified.  **Note** that if the attributes are not set \"{}\" will be returned.","x-twilio":{"pii":{"handling":"sensitive","deleteSla":30}}},"MediaSid":{"type":"string","minLength":34,"maxLength":34,"pattern":"^ME[0-9a-fA-F]{32}$","description":"The Media SID to be attached to the new Message."},"ContentSid":{"type":"string","minLength":34,"maxLength":34,"pattern":"^HX[0-9a-fA-F]{32}$","description":"The unique ID of the multi-channel [Rich Content](/docs/content) template, required for template-generated messages.  **Note** that if this field is set, `Body` and `MediaSid` parameters are ignored."},"ContentVariables":{"type":"string","description":"A structurally valid JSON string that contains values to resolve Rich Content template variables."},"Subject":{"type":"string","description":"The subject of the message, can be up to 256 characters long."}}},"examples":{"create":{"value":{"lang":"json","value":"{\n  \"Body\": \"Hello\",\n  \"Author\": \"message author\",\n  \"Attributes\": \"{ \\\"importance\\\": \\\"high\\\" }\",\n  \"DateCreated\": \"2015-12-16T22:18:37Z\",\n  \"DateUpdated\": \"2015-12-16T22:18:38Z\"\n}","meta":"","code":"{\n  \"Body\": \"Hello\",\n  \"Author\": \"message author\",\n  \"Attributes\": \"{ \\\"importance\\\": \\\"high\\\" }\",\n  \"DateCreated\": \"2015-12-16T22:18:37Z\",\n  \"DateUpdated\": \"2015-12-16T22:18:38Z\"\n}","tokens":[["{","#C9D1D9"],"\n  ",["\"Body\"","#7EE787"],[":","#C9D1D9"]," ",["\"Hello\"","#A5D6FF"],[",","#C9D1D9"],"\n  ",["\"Author\"","#7EE787"],[":","#C9D1D9"]," ",["\"message author\"","#A5D6FF"],[",","#C9D1D9"],"\n  ",["\"Attributes\"","#7EE787"],[":","#C9D1D9"]," ",["\"{","#A5D6FF"]," ",["\\\"","#79C0FF"],["importance","#A5D6FF"],["\\\"","#79C0FF"],[":","#A5D6FF"]," ",["\\\"","#79C0FF"],["high","#A5D6FF"],["\\\"","#79C0FF"]," ",["}\"","#A5D6FF"],[",","#C9D1D9"],"\n  ",["\"DateCreated\"","#7EE787"],[":","#C9D1D9"]," ",["\"2015-12-16T22:18:37Z\"","#A5D6FF"],[",","#C9D1D9"],"\n  ",["\"DateUpdated\"","#7EE787"],[":","#C9D1D9"]," ",["\"2015-12-16T22:18:38Z\"","#A5D6FF"],"\n",["}","#C9D1D9"]],"annotations":[],"themeName":"github-dark","style":{"color":"#c9d1d9","background":"#0d1117"}}},"createWithMedia":{"value":{"lang":"json","value":"{\n  \"MediaSid\": \"MEaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\",\n  \"Author\": \"message author\",\n  \"Attributes\": \"{ \\\"importance\\\": \\\"high\\\" }\",\n  \"DateCreated\": \"2015-12-16T22:18:37Z\",\n  \"DateUpdated\": \"2015-12-16T22:18:38Z\"\n}","meta":"","code":"{\n  \"MediaSid\": \"MEaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\",\n  \"Author\": \"message author\",\n  \"Attributes\": \"{ \\\"importance\\\": \\\"high\\\" }\",\n  \"DateCreated\": \"2015-12-16T22:18:37Z\",\n  \"DateUpdated\": \"2015-12-16T22:18:38Z\"\n}","tokens":[["{","#C9D1D9"],"\n  ",["\"MediaSid\"","#7EE787"],[":","#C9D1D9"]," ",["\"MEaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\"","#A5D6FF"],[",","#C9D1D9"],"\n  ",["\"Author\"","#7EE787"],[":","#C9D1D9"]," ",["\"message author\"","#A5D6FF"],[",","#C9D1D9"],"\n  ",["\"Attributes\"","#7EE787"],[":","#C9D1D9"]," ",["\"{","#A5D6FF"]," ",["\\\"","#79C0FF"],["importance","#A5D6FF"],["\\\"","#79C0FF"],[":","#A5D6FF"]," ",["\\\"","#79C0FF"],["high","#A5D6FF"],["\\\"","#79C0FF"]," ",["}\"","#A5D6FF"],[",","#C9D1D9"],"\n  ",["\"DateCreated\"","#7EE787"],[":","#C9D1D9"]," ",["\"2015-12-16T22:18:37Z\"","#A5D6FF"],[",","#C9D1D9"],"\n  ",["\"DateUpdated\"","#7EE787"],[":","#C9D1D9"]," ",["\"2015-12-16T22:18:38Z\"","#A5D6FF"],"\n",["}","#C9D1D9"]],"annotations":[],"themeName":"github-dark","style":{"color":"#c9d1d9","background":"#0d1117"}}},"createNoAttributes":{"value":{"lang":"json","value":"{\n  \"Body\": \"Hello\",\n  \"Author\": \"message author\",\n  \"DateCreated\": \"2020-07-01T22:18:37Z\",\n  \"DateUpdated\": \"2020-07-01T22:18:37Z\"\n}","meta":"","code":"{\n  \"Body\": \"Hello\",\n  \"Author\": \"message author\",\n  \"DateCreated\": \"2020-07-01T22:18:37Z\",\n  \"DateUpdated\": \"2020-07-01T22:18:37Z\"\n}","tokens":[["{","#C9D1D9"],"\n  ",["\"Body\"","#7EE787"],[":","#C9D1D9"]," ",["\"Hello\"","#A5D6FF"],[",","#C9D1D9"],"\n  ",["\"Author\"","#7EE787"],[":","#C9D1D9"]," ",["\"message author\"","#A5D6FF"],[",","#C9D1D9"],"\n  ",["\"DateCreated\"","#7EE787"],[":","#C9D1D9"]," ",["\"2020-07-01T22:18:37Z\"","#A5D6FF"],[",","#C9D1D9"],"\n  ",["\"DateUpdated\"","#7EE787"],[":","#C9D1D9"]," ",["\"2020-07-01T22:18:37Z\"","#A5D6FF"],"\n",["}","#C9D1D9"]],"annotations":[],"themeName":"github-dark","style":{"color":"#c9d1d9","background":"#0d1117"}}},"createWithContentSid":{"value":{"lang":"json","value":"{\n  \"Author\": \"message author\",\n  \"DateCreated\": \"2015-12-16T22:18:37Z\",\n  \"DateUpdated\": \"2015-12-16T22:18:38Z\",\n  \"ContentSid\": \"HXaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\",\n  \"ContentVariables\": \"{\\\"name\\\": \\\"John\\\"}\"\n}","meta":"","code":"{\n  \"Author\": \"message author\",\n  \"DateCreated\": \"2015-12-16T22:18:37Z\",\n  \"DateUpdated\": \"2015-12-16T22:18:38Z\",\n  \"ContentSid\": \"HXaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\",\n  \"ContentVariables\": \"{\\\"name\\\": \\\"John\\\"}\"\n}","tokens":[["{","#C9D1D9"],"\n  ",["\"Author\"","#7EE787"],[":","#C9D1D9"]," ",["\"message author\"","#A5D6FF"],[",","#C9D1D9"],"\n  ",["\"DateCreated\"","#7EE787"],[":","#C9D1D9"]," ",["\"2015-12-16T22:18:37Z\"","#A5D6FF"],[",","#C9D1D9"],"\n  ",["\"DateUpdated\"","#7EE787"],[":","#C9D1D9"]," ",["\"2015-12-16T22:18:38Z\"","#A5D6FF"],[",","#C9D1D9"],"\n  ",["\"ContentSid\"","#7EE787"],[":","#C9D1D9"]," ",["\"HXaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\"","#A5D6FF"],[",","#C9D1D9"],"\n  ",["\"ContentVariables\"","#7EE787"],[":","#C9D1D9"]," ",["\"{","#A5D6FF"],["\\\"","#79C0FF"],["name","#A5D6FF"],["\\\"","#79C0FF"],[":","#A5D6FF"]," ",["\\\"","#79C0FF"],["John","#A5D6FF"],["\\\"","#79C0FF"],["}\"","#A5D6FF"],"\n",["}","#C9D1D9"]],"annotations":[],"themeName":"github-dark","style":{"color":"#c9d1d9","background":"#0d1117"}}},"createWithSubject":{"value":{"lang":"json","value":"{\n  \"Author\": \"message author\",\n  \"Body\": \"message body\",\n  \"DateCreated\": \"2015-12-16T22:18:37Z\",\n  \"DateUpdated\": \"2015-12-16T22:18:38Z\",\n  \"Subject\": \"message subject\"\n}","meta":"","code":"{\n  \"Author\": \"message author\",\n  \"Body\": \"message body\",\n  \"DateCreated\": \"2015-12-16T22:18:37Z\",\n  \"DateUpdated\": \"2015-12-16T22:18:38Z\",\n  \"Subject\": \"message subject\"\n}","tokens":[["{","#C9D1D9"],"\n  ",["\"Author\"","#7EE787"],[":","#C9D1D9"]," ",["\"message author\"","#A5D6FF"],[",","#C9D1D9"],"\n  ",["\"Body\"","#7EE787"],[":","#C9D1D9"]," ",["\"message body\"","#A5D6FF"],[",","#C9D1D9"],"\n  ",["\"DateCreated\"","#7EE787"],[":","#C9D1D9"]," ",["\"2015-12-16T22:18:37Z\"","#A5D6FF"],[",","#C9D1D9"],"\n  ",["\"DateUpdated\"","#7EE787"],[":","#C9D1D9"]," ",["\"2015-12-16T22:18:38Z\"","#A5D6FF"],[",","#C9D1D9"],"\n  ",["\"Subject\"","#7EE787"],[":","#C9D1D9"]," ",["\"message subject\"","#A5D6FF"],"\n",["}","#C9D1D9"]],"annotations":[],"themeName":"github-dark","style":{"color":"#c9d1d9","background":"#0d1117"}}}},"encodingType":"application/x-www-form-urlencoded","conditionalParameterMap":{}}
```

Create a Conversation Message

```js
// Download the helper library from https://www.twilio.com/docs/node/install
const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";

// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

async function createConversationMessage() {
  const message = await client.conversations.v1
    .conversations("CHXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    .messages.create({
      author: "smee",
      body: "Ahoy there!",
    });

  console.log(message.sid);
}

createConversationMessage();
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

message = client.conversations.v1.conversations(
    "CHXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
).messages.create(author="smee", body="Ahoy there!")

print(message.sid)
```

```csharp
// Install the C# / .NET helper library from twilio.com/docs/csharp/install

using System;
using Twilio;
using Twilio.Rest.Conversations.V1.Conversation;
using System.Threading.Tasks;

class Program {
    public static async Task Main(string[] args) {
        // Find your Account SID and Auth Token at twilio.com/console
        // and set the environment variables. See http://twil.io/secure
        string accountSid = Environment.GetEnvironmentVariable("TWILIO_ACCOUNT_SID");
        string authToken = Environment.GetEnvironmentVariable("TWILIO_AUTH_TOKEN");

        TwilioClient.Init(accountSid, authToken);

        var message = await MessageResource.CreateAsync(
            author: "smee",
            body: "Ahoy there!",
            pathConversationSid: "CHXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");

        Console.WriteLine(message.Sid);
    }
}
```

```java
// Install the Java helper library from twilio.com/docs/java/install

import com.twilio.Twilio;
import com.twilio.rest.conversations.v1.conversation.Message;

public class Example {
    // Find your Account SID and Auth Token at twilio.com/console
    // and set the environment variables. See http://twil.io/secure
    public static final String ACCOUNT_SID = System.getenv("TWILIO_ACCOUNT_SID");
    public static final String AUTH_TOKEN = System.getenv("TWILIO_AUTH_TOKEN");

    public static void main(String[] args) {
        Twilio.init(ACCOUNT_SID, AUTH_TOKEN);
        Message message =
            Message.creator("CHXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX").setAuthor("smee").setBody("Ahoy there!").create();

        System.out.println(message.getSid());
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

	params := &conversations.CreateConversationMessageParams{}
	params.SetAuthor("smee")
	params.SetBody("Ahoy there!")

	resp, err := client.ConversationsV1.CreateConversationMessage("CHXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
		params)
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

$message = $twilio->conversations->v1
    ->conversations("CHXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    ->messages->create([
        "author" => "smee",
        "body" => "Ahoy there!",
    ]);

print $message->sid;
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

message = @client
          .conversations
          .v1
          .conversations('CHXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')
          .messages
          .create(
            author: 'smee',
            body: 'Ahoy there!'
          )

puts message.sid
```

```bash
EXCLAMATION_MARK='!'
# Install the twilio-cli from https://twil.io/cli

twilio api:conversations:v1:conversations:messages:create \
   --conversation-sid CHXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX \
   --author smee \
   --body "Ahoy there$EXCLAMATION_MARK"
```

```bash
EXCLAMATION_MARK='!'
curl -X POST "https://conversations.twilio.com/v1/Conversations/CHXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/Messages" \
--data-urlencode "Author=smee" \
--data-urlencode "Body=Ahoy there$EXCLAMATION_MARK" \
-u $TWILIO_ACCOUNT_SID:$TWILIO_AUTH_TOKEN
```

```json
{
  "sid": "IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  "conversation_sid": "CHXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  "body": "Ahoy there!",
  "media": null,
  "author": "smee",
  "participant_sid": "MBaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  "attributes": "{ \"importance\": \"high\" }",
  "date_created": "2015-12-16T22:18:37Z",
  "date_updated": "2015-12-16T22:18:38Z",
  "index": 0,
  "delivery": {
    "total": 2,
    "sent": "all",
    "delivered": "some",
    "read": "some",
    "failed": "none",
    "undelivered": "none"
  },
  "content_sid": null,
  "url": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages/IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  "links": {
    "delivery_receipts": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages/IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Receipts",
    "channel_metadata": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages/IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/ChannelMetadata"
  }
}
```

## Fetch a ConversationMessage resource

`GET https://conversations.twilio.com/v1/Conversations/{ConversationSid}/Messages/{Sid}`

### Path parameters

```json
[{"name":"ConversationSid","in":"path","description":"The unique ID of the [Conversation](/docs/conversations/api/conversation-resource) for this message.","schema":{"type":"string"},"required":true},{"name":"Sid","in":"path","description":"A 34 character string that uniquely identifies this resource.","schema":{"type":"string","minLength":34,"maxLength":34,"pattern":"^IM[0-9a-fA-F]{32}$"},"required":true}]
```

Fetch a Conversation Message

```js
// Download the helper library from https://www.twilio.com/docs/node/install
const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";

// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

async function fetchConversationMessage() {
  const message = await client.conversations.v1
    .conversations("ConversationSid")
    .messages("IMXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    .fetch();

  console.log(message.accountSid);
}

fetchConversationMessage();
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

message = (
    client.conversations.v1.conversations("ConversationSid")
    .messages("IMXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    .fetch()
)

print(message.account_sid)
```

```csharp
// Install the C# / .NET helper library from twilio.com/docs/csharp/install

using System;
using Twilio;
using Twilio.Rest.Conversations.V1.Conversation;
using System.Threading.Tasks;

class Program {
    public static async Task Main(string[] args) {
        // Find your Account SID and Auth Token at twilio.com/console
        // and set the environment variables. See http://twil.io/secure
        string accountSid = Environment.GetEnvironmentVariable("TWILIO_ACCOUNT_SID");
        string authToken = Environment.GetEnvironmentVariable("TWILIO_AUTH_TOKEN");

        TwilioClient.Init(accountSid, authToken);

        var message = await MessageResource.FetchAsync(
            pathConversationSid: "ConversationSid", pathSid: "IMXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");

        Console.WriteLine(message.AccountSid);
    }
}
```

```java
// Install the Java helper library from twilio.com/docs/java/install

import com.twilio.Twilio;
import com.twilio.rest.conversations.v1.conversation.Message;

public class Example {
    // Find your Account SID and Auth Token at twilio.com/console
    // and set the environment variables. See http://twil.io/secure
    public static final String ACCOUNT_SID = System.getenv("TWILIO_ACCOUNT_SID");
    public static final String AUTH_TOKEN = System.getenv("TWILIO_AUTH_TOKEN");

    public static void main(String[] args) {
        Twilio.init(ACCOUNT_SID, AUTH_TOKEN);
        Message message = Message.fetcher("ConversationSid", "IMXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX").fetch();

        System.out.println(message.getAccountSid());
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

	resp, err := client.ConversationsV1.FetchConversationMessage("ConversationSid",
		"IMXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
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

$message = $twilio->conversations->v1
    ->conversations("ConversationSid")
    ->messages("IMXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    ->fetch();

print $message->accountSid;
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

message = @client
          .conversations
          .v1
          .conversations('ConversationSid')
          .messages('IMXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')
          .fetch

puts message.account_sid
```

```bash
# Install the twilio-cli from https://twil.io/cli

twilio api:conversations:v1:conversations:messages:fetch \
   --conversation-sid ConversationSid \
   --sid IMXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

```bash
curl -X GET "https://conversations.twilio.com/v1/Conversations/ConversationSid/Messages/IMXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX" \
-u $TWILIO_ACCOUNT_SID:$TWILIO_AUTH_TOKEN
```

```json
{
  "sid": "IMXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  "conversation_sid": "ConversationSid",
  "body": "Welcome!",
  "media": null,
  "author": "system",
  "participant_sid": null,
  "attributes": "{ \"importance\": \"high\" }",
  "date_created": "2016-03-24T20:37:57Z",
  "date_updated": "2016-03-24T20:37:57Z",
  "index": 0,
  "delivery": {
    "total": 2,
    "sent": "all",
    "delivered": "some",
    "read": "some",
    "failed": "none",
    "undelivered": "none"
  },
  "content_sid": null,
  "url": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages/IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  "links": {
    "delivery_receipts": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages/IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Receipts",
    "channel_metadata": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages/IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/ChannelMetadata"
  }
}
```

## List all Conversation Message(s)

`GET https://conversations.twilio.com/v1/Conversations/{ConversationSid}/Messages`

### Path parameters

```json
[{"name":"ConversationSid","in":"path","description":"The unique ID of the [Conversation](/docs/conversations/api/conversation-resource) for messages.","schema":{"type":"string"},"required":true}]
```

### Query parameters

```json
[{"name":"Order","in":"query","description":"The sort order of the returned messages. Can be: `asc` (ascending) or `desc` (descending), with `asc` as the default.","schema":{"type":"string","enum":["asc","desc"],"refName":"conversation_message_enum_order_type","modelName":"conversation_message_enum_order_type"},"examples":{"readLastMessage":{"value":"desc"},"readLastMessage_ienumOrderMixedCaseDesc":{"value":"DeSc"},"readLastMessage_ienumOrderMixedCaseAsc":{"value":"AsC"}}},{"name":"PageSize","in":"query","description":"How many resources to return in each list page. The default is 50, and the maximum is 100.","schema":{"type":"integer","format":"int64","minimum":1,"maximum":100}},{"name":"Page","in":"query","description":"The page index. This value is simply for client state.","schema":{"type":"integer","minimum":0}},{"name":"PageToken","in":"query","description":"The page token. This is provided by the API.","schema":{"type":"string"}}]
```

List all Conversation Messages

```js
// Download the helper library from https://www.twilio.com/docs/node/install
const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";

// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

async function listConversationMessage() {
  const messages = await client.conversations.v1
    .conversations("CHXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    .messages.list({ limit: 20 });

  messages.forEach((m) => console.log(m.accountSid));
}

listConversationMessage();
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

messages = client.conversations.v1.conversations(
    "CHXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
).messages.list(limit=20)

for record in messages:
    print(record.account_sid)
```

```csharp
// Install the C# / .NET helper library from twilio.com/docs/csharp/install

using System;
using Twilio;
using Twilio.Rest.Conversations.V1.Conversation;
using System.Threading.Tasks;

class Program {
    public static async Task Main(string[] args) {
        // Find your Account SID and Auth Token at twilio.com/console
        // and set the environment variables. See http://twil.io/secure
        string accountSid = Environment.GetEnvironmentVariable("TWILIO_ACCOUNT_SID");
        string authToken = Environment.GetEnvironmentVariable("TWILIO_AUTH_TOKEN");

        TwilioClient.Init(accountSid, authToken);

        var messages = await MessageResource.ReadAsync(
            pathConversationSid: "CHXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", limit: 20);

        foreach (var record in messages) {
            Console.WriteLine(record.AccountSid);
        }
    }
}
```

```java
// Install the Java helper library from twilio.com/docs/java/install

import com.twilio.Twilio;
import com.twilio.rest.conversations.v1.conversation.Message;
import com.twilio.base.ResourceSet;

public class Example {
    // Find your Account SID and Auth Token at twilio.com/console
    // and set the environment variables. See http://twil.io/secure
    public static final String ACCOUNT_SID = System.getenv("TWILIO_ACCOUNT_SID");
    public static final String AUTH_TOKEN = System.getenv("TWILIO_AUTH_TOKEN");

    public static void main(String[] args) {
        Twilio.init(ACCOUNT_SID, AUTH_TOKEN);
        ResourceSet<Message> messages = Message.reader("CHXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX").limit(20).read();

        for (Message record : messages) {
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

	params := &conversations.ListConversationMessageParams{}
	params.SetLimit(20)

	resp, err := client.ConversationsV1.ListConversationMessage("CHXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
		params)
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

$messages = $twilio->conversations->v1
    ->conversations("CHXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    ->messages->read([], 20);

foreach ($messages as $record) {
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

messages = @client
           .conversations
           .v1
           .conversations('CHXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')
           .messages
           .list(limit: 20)

messages.each do |record|
   puts record.account_sid
end
```

```bash
# Install the twilio-cli from https://twil.io/cli

twilio api:conversations:v1:conversations:messages:list \
   --conversation-sid CHXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

```bash
curl -X GET "https://conversations.twilio.com/v1/Conversations/CHXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/Messages?PageSize=20" \
-u $TWILIO_ACCOUNT_SID:$TWILIO_AUTH_TOKEN
```

```json
{
  "meta": {
    "page": 0,
    "page_size": 50,
    "first_page_url": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages?PageSize=50&Page=0",
    "previous_page_url": null,
    "url": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages?PageSize=50&Page=0",
    "next_page_url": null,
    "key": "messages"
  },
  "messages": [
    {
      "sid": "IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      "conversation_sid": "CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      "body": "I like pie.",
      "media": null,
      "author": "pie_preferrer",
      "participant_sid": "MBaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      "attributes": "{ \"importance\": \"high\" }",
      "date_created": "2016-03-24T20:37:57Z",
      "date_updated": "2016-03-24T20:37:57Z",
      "index": 0,
      "delivery": {
        "total": 2,
        "sent": "all",
        "delivered": "some",
        "read": "some",
        "failed": "none",
        "undelivered": "none"
      },
      "content_sid": null,
      "url": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages/IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      "links": {
        "delivery_receipts": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages/IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Receipts",
        "channel_metadata": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages/IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/ChannelMetadata"
      }
    },
    {
      "sid": "IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      "conversation_sid": "CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      "body": "Cake is my favorite!",
      "media": null,
      "author": "cake_lover",
      "participant_sid": "MBaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      "attributes": "{ \"importance\": \"high\" }",
      "date_created": "2016-03-24T20:38:21Z",
      "date_updated": "2016-03-24T20:38:21Z",
      "index": 5,
      "delivery": {
        "total": 2,
        "sent": "all",
        "delivered": "some",
        "read": "some",
        "failed": "none",
        "undelivered": "none"
      },
      "content_sid": null,
      "url": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages/IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      "links": {
        "delivery_receipts": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages/IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Receipts",
        "channel_metadata": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages/IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/ChannelMetadata"
      }
    },
    {
      "sid": "IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      "conversation_sid": "CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      "body": null,
      "media": [
        {
          "sid": "MEaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
          "size": 42056,
          "content_type": "image/jpeg",
          "filename": "car.jpg"
        }
      ],
      "author": "cake_lover",
      "participant_sid": "MBaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      "attributes": "{ \"importance\": \"high\" }",
      "date_created": "2016-03-24T20:38:21Z",
      "date_updated": "2016-03-24T20:38:21Z",
      "index": 9,
      "delivery": {
        "total": 2,
        "sent": "all",
        "delivered": "some",
        "read": "some",
        "failed": "none",
        "undelivered": "none"
      },
      "content_sid": null,
      "url": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages/IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      "links": {
        "delivery_receipts": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages/IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Receipts",
        "channel_metadata": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages/IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/ChannelMetadata"
      }
    }
  ]
}
```

Fetch the latest Conversation Message

```js
// Download the helper library from https://www.twilio.com/docs/node/install
const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";

// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

async function listConversationMessage() {
  const messages = await client.conversations.v1
    .conversations("ConversationSid")
    .messages.list({
      order: "desc",
      limit: 20,
    });

  messages.forEach((m) => console.log(m.accountSid));
}

listConversationMessage();
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

messages = client.conversations.v1.conversations(
    "ConversationSid"
).messages.list(order="desc", limit=20)

for record in messages:
    print(record.account_sid)
```

```csharp
// Install the C# / .NET helper library from twilio.com/docs/csharp/install

using System;
using Twilio;
using Twilio.Rest.Conversations.V1.Conversation;
using System.Threading.Tasks;

class Program {
    public static async Task Main(string[] args) {
        // Find your Account SID and Auth Token at twilio.com/console
        // and set the environment variables. See http://twil.io/secure
        string accountSid = Environment.GetEnvironmentVariable("TWILIO_ACCOUNT_SID");
        string authToken = Environment.GetEnvironmentVariable("TWILIO_AUTH_TOKEN");

        TwilioClient.Init(accountSid, authToken);

        var messages = await MessageResource.ReadAsync(
            pathConversationSid: "ConversationSid",
            order: MessageResource.OrderTypeEnum.Desc,
            limit: 20);

        foreach (var record in messages) {
            Console.WriteLine(record.AccountSid);
        }
    }
}
```

```java
// Install the Java helper library from twilio.com/docs/java/install

import com.twilio.Twilio;
import com.twilio.rest.conversations.v1.conversation.Message;
import com.twilio.base.ResourceSet;

public class Example {
    // Find your Account SID and Auth Token at twilio.com/console
    // and set the environment variables. See http://twil.io/secure
    public static final String ACCOUNT_SID = System.getenv("TWILIO_ACCOUNT_SID");
    public static final String AUTH_TOKEN = System.getenv("TWILIO_AUTH_TOKEN");

    public static void main(String[] args) {
        Twilio.init(ACCOUNT_SID, AUTH_TOKEN);
        ResourceSet<Message> messages =
            Message.reader("ConversationSid").setOrder(Message.OrderType.DESC).limit(20).read();

        for (Message record : messages) {
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

	params := &conversations.ListConversationMessageParams{}
	params.SetOrder("desc")
	params.SetLimit(20)

	resp, err := client.ConversationsV1.ListConversationMessage("ConversationSid",
		params)
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

$messages = $twilio->conversations->v1
    ->conversations("ConversationSid")
    ->messages->read(["order" => "desc"], 20);

foreach ($messages as $record) {
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

messages = @client
           .conversations
           .v1
           .conversations('ConversationSid')
           .messages
           .list(
             order: 'desc',
             limit: 20
           )

messages.each do |record|
   puts record.account_sid
end
```

```bash
# Install the twilio-cli from https://twil.io/cli

twilio api:conversations:v1:conversations:messages:list \
   --conversation-sid ConversationSid \
   --order desc
```

```bash
curl -X GET "https://conversations.twilio.com/v1/Conversations/ConversationSid/Messages?Order=desc&PageSize=20" \
-u $TWILIO_ACCOUNT_SID:$TWILIO_AUTH_TOKEN
```

```json
{
  "meta": {
    "page": 0,
    "page_size": 2,
    "first_page_url": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages?Order=desc&PageSize=2&Page=0",
    "previous_page_url": null,
    "url": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages?Order=desc&PageSize=2&Page=0",
    "next_page_url": null,
    "key": "messages"
  },
  "messages": [
    {
      "sid": "IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      "conversation_sid": "CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      "body": null,
      "media": [
        {
          "sid": "MEaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
          "size": 42056,
          "content_type": "image/jpeg",
          "filename": "car.jpg"
        }
      ],
      "author": "cake_lover",
      "participant_sid": "MBaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      "attributes": "{ \"importance\": \"high\" }",
      "date_created": "2016-03-24T20:38:21Z",
      "date_updated": "2016-03-24T20:38:21Z",
      "index": 9,
      "delivery": {
        "total": 2,
        "sent": "all",
        "delivered": "some",
        "read": "some",
        "failed": "none",
        "undelivered": "none"
      },
      "content_sid": null,
      "url": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages/IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      "links": {
        "delivery_receipts": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages/IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Receipts",
        "channel_metadata": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages/IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/ChannelMetadata"
      }
    }
  ]
}
```

## Update a ConversationMessage resource

`POST https://conversations.twilio.com/v1/Conversations/{ConversationSid}/Messages/{Sid}`

### Headers

```json
[{"name":"X-Twilio-Webhook-Enabled","in":"header","description":"The X-Twilio-Webhook-Enabled HTTP request header","schema":{"type":"string","enum":["true","false"],"refName":"conversation_message_enum_webhook_enabled_type","modelName":"conversation_message_enum_webhook_enabled_type"}}]
```

### Path parameters

```json
[{"name":"ConversationSid","in":"path","description":"The unique ID of the [Conversation](/docs/conversations/api/conversation-resource) for this message.","schema":{"type":"string"},"required":true},{"name":"Sid","in":"path","description":"A 34 character string that uniquely identifies this resource.","schema":{"type":"string","minLength":34,"maxLength":34,"pattern":"^IM[0-9a-fA-F]{32}$"},"required":true}]
```

### Request body parameters

```json
{"schema":{"type":"object","title":"UpdateConversationMessageRequest","properties":{"Author":{"type":"string","description":"The channel specific identifier of the message's author. Defaults to `system`.","x-twilio":{"pii":{"handling":"standard","deleteSla":30}}},"Body":{"type":"string","description":"The content of the message, can be up to 1,600 characters long.","x-twilio":{"pii":{"handling":"sensitive","deleteSla":30}}},"DateCreated":{"type":"string","format":"date-time","description":"The date that this resource was created."},"DateUpdated":{"type":"string","format":"date-time","description":"The date that this resource was last updated. `null` if the message has not been edited."},"Attributes":{"type":"string","description":"A string metadata field you can use to store any data you wish. The string value must contain structurally valid JSON if specified.  **Note** that if the attributes are not set \"{}\" will be returned.","x-twilio":{"pii":{"handling":"sensitive","deleteSla":30}}},"Subject":{"type":"string","description":"The subject of the message, can be up to 256 characters long."}}},"examples":{"update":{"value":{"lang":"json","value":"{\n  \"Body\": \"Hello\",\n  \"Author\": \"message author\",\n  \"Attributes\": \"{ \\\"importance\\\": \\\"high\\\" }\",\n  \"DateCreated\": \"2015-12-16T22:18:37Z\",\n  \"DateUpdated\": \"2015-12-16T22:18:38Z\"\n}","meta":"","code":"{\n  \"Body\": \"Hello\",\n  \"Author\": \"message author\",\n  \"Attributes\": \"{ \\\"importance\\\": \\\"high\\\" }\",\n  \"DateCreated\": \"2015-12-16T22:18:37Z\",\n  \"DateUpdated\": \"2015-12-16T22:18:38Z\"\n}","tokens":[["{","#C9D1D9"],"\n  ",["\"Body\"","#7EE787"],[":","#C9D1D9"]," ",["\"Hello\"","#A5D6FF"],[",","#C9D1D9"],"\n  ",["\"Author\"","#7EE787"],[":","#C9D1D9"]," ",["\"message author\"","#A5D6FF"],[",","#C9D1D9"],"\n  ",["\"Attributes\"","#7EE787"],[":","#C9D1D9"]," ",["\"{","#A5D6FF"]," ",["\\\"","#79C0FF"],["importance","#A5D6FF"],["\\\"","#79C0FF"],[":","#A5D6FF"]," ",["\\\"","#79C0FF"],["high","#A5D6FF"],["\\\"","#79C0FF"]," ",["}\"","#A5D6FF"],[",","#C9D1D9"],"\n  ",["\"DateCreated\"","#7EE787"],[":","#C9D1D9"]," ",["\"2015-12-16T22:18:37Z\"","#A5D6FF"],[",","#C9D1D9"],"\n  ",["\"DateUpdated\"","#7EE787"],[":","#C9D1D9"]," ",["\"2015-12-16T22:18:38Z\"","#A5D6FF"],"\n",["}","#C9D1D9"]],"annotations":[],"themeName":"github-dark","style":{"color":"#c9d1d9","background":"#0d1117"}}}},"encodingType":"application/x-www-form-urlencoded","conditionalParameterMap":{}}
```

Update a Conversation Message

```js
// Download the helper library from https://www.twilio.com/docs/node/install
const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";

// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

async function updateConversationMessage() {
  const message = await client.conversations.v1
    .conversations("ConversationSid")
    .messages("IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
    .update({
      author: "regretfulUser",
      body: "I take back what I said",
    });

  console.log(message.accountSid);
}

updateConversationMessage();
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

conversation_message = (
    client.conversations.v1.conversations("ConversationSid")
    .messages("IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
    .update(author="regretfulUser", body="I take back what I said")
)

print(conversation_message.account_sid)
```

```csharp
// Install the C# / .NET helper library from twilio.com/docs/csharp/install

using System;
using Twilio;
using Twilio.Rest.Conversations.V1.Conversation;
using System.Threading.Tasks;

class Program {
    public static async Task Main(string[] args) {
        // Find your Account SID and Auth Token at twilio.com/console
        // and set the environment variables. See http://twil.io/secure
        string accountSid = Environment.GetEnvironmentVariable("TWILIO_ACCOUNT_SID");
        string authToken = Environment.GetEnvironmentVariable("TWILIO_AUTH_TOKEN");

        TwilioClient.Init(accountSid, authToken);

        var message = await MessageResource.UpdateAsync(
            author: "regretfulUser",
            body: "I take back what I said",
            pathConversationSid: "ConversationSid",
            pathSid: "IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");

        Console.WriteLine(message.AccountSid);
    }
}
```

```java
// Install the Java helper library from twilio.com/docs/java/install

import com.twilio.Twilio;
import com.twilio.rest.conversations.v1.conversation.Message;

public class Example {
    // Find your Account SID and Auth Token at twilio.com/console
    // and set the environment variables. See http://twil.io/secure
    public static final String ACCOUNT_SID = System.getenv("TWILIO_ACCOUNT_SID");
    public static final String AUTH_TOKEN = System.getenv("TWILIO_AUTH_TOKEN");

    public static void main(String[] args) {
        Twilio.init(ACCOUNT_SID, AUTH_TOKEN);
        Message message = Message.updater("ConversationSid", "IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
                              .setAuthor("regretfulUser")
                              .setBody("I take back what I said")
                              .update();

        System.out.println(message.getAccountSid());
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

	params := &conversations.UpdateConversationMessageParams{}
	params.SetAuthor("regretfulUser")
	params.SetBody("I take back what I said")

	resp, err := client.ConversationsV1.UpdateConversationMessage("ConversationSid",
		"IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
		params)
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

$conversation_message = $twilio->conversations->v1
    ->conversations("ConversationSid")
    ->messages("IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
    ->update([
        "author" => "regretfulUser",
        "body" => "I take back what I said",
    ]);

print $conversation_message->accountSid;
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

message = @client
          .conversations
          .v1
          .conversations('ConversationSid')
          .messages('IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
          .update(
            author: 'regretfulUser',
            body: 'I take back what I said'
          )

puts message.account_sid
```

```bash
# Install the twilio-cli from https://twil.io/cli

twilio api:conversations:v1:conversations:messages:update \
   --conversation-sid ConversationSid \
   --sid IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa \
   --author regretfulUser \
   --body "I take back what I said"
```

```bash
curl -X POST "https://conversations.twilio.com/v1/Conversations/ConversationSid/Messages/IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" \
--data-urlencode "Author=regretfulUser" \
--data-urlencode "Body=I take back what I said" \
-u $TWILIO_ACCOUNT_SID:$TWILIO_AUTH_TOKEN
```

```json
{
  "sid": "IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  "conversation_sid": "ConversationSid",
  "body": "I take back what I said",
  "media": null,
  "author": "regretfulUser",
  "participant_sid": "MBaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  "attributes": "{ \"importance\": \"high\" }",
  "date_created": "2015-12-16T22:18:37Z",
  "date_updated": "2015-12-16T22:18:38Z",
  "index": 0,
  "delivery": {
    "total": 2,
    "sent": "all",
    "delivered": "some",
    "read": "some",
    "failed": "none",
    "undelivered": "none"
  },
  "content_sid": null,
  "url": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages/IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  "links": {
    "delivery_receipts": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages/IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Receipts",
    "channel_metadata": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages/IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/ChannelMetadata"
  }
}
```

## Delete a ConversationMessage resource

`DELETE https://conversations.twilio.com/v1/Conversations/{ConversationSid}/Messages/{Sid}`

### Headers

```json
[{"name":"X-Twilio-Webhook-Enabled","in":"header","description":"The X-Twilio-Webhook-Enabled HTTP request header","schema":{"type":"string","enum":["true","false"],"refName":"conversation_message_enum_webhook_enabled_type","modelName":"conversation_message_enum_webhook_enabled_type"}}]
```

### Path parameters

```json
[{"name":"ConversationSid","in":"path","description":"The unique ID of the [Conversation](/docs/conversations/api/conversation-resource) for this message.","schema":{"type":"string"},"required":true},{"name":"Sid","in":"path","description":"A 34 character string that uniquely identifies this resource.","schema":{"type":"string","minLength":34,"maxLength":34,"pattern":"^IM[0-9a-fA-F]{32}$"},"required":true}]
```

Delete a Conversation Message

```js
// Download the helper library from https://www.twilio.com/docs/node/install
const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";

// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

async function deleteConversationMessage() {
  await client.conversations.v1
    .conversations("CHXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    .messages("IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
    .remove();
}

deleteConversationMessage();
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
).messages("IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa").delete()
```

```csharp
// Install the C# / .NET helper library from twilio.com/docs/csharp/install

using System;
using Twilio;
using Twilio.Rest.Conversations.V1.Conversation;
using System.Threading.Tasks;

class Program {
    public static async Task Main(string[] args) {
        // Find your Account SID and Auth Token at twilio.com/console
        // and set the environment variables. See http://twil.io/secure
        string accountSid = Environment.GetEnvironmentVariable("TWILIO_ACCOUNT_SID");
        string authToken = Environment.GetEnvironmentVariable("TWILIO_AUTH_TOKEN");

        TwilioClient.Init(accountSid, authToken);

        await MessageResource.DeleteAsync(
            pathConversationSid: "CHXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            pathSid: "IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
    }
}
```

```java
// Install the Java helper library from twilio.com/docs/java/install

import com.twilio.Twilio;
import com.twilio.rest.conversations.v1.conversation.Message;

public class Example {
    // Find your Account SID and Auth Token at twilio.com/console
    // and set the environment variables. See http://twil.io/secure
    public static final String ACCOUNT_SID = System.getenv("TWILIO_ACCOUNT_SID");
    public static final String AUTH_TOKEN = System.getenv("TWILIO_AUTH_TOKEN");

    public static void main(String[] args) {
        Twilio.init(ACCOUNT_SID, AUTH_TOKEN);
        Message.deleter("CHXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", "IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa").delete();
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

	params := &conversations.DeleteConversationMessageParams{}

	err := client.ConversationsV1.DeleteConversationMessage("CHXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
		"IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
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
    ->messages("IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
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
  .messages('IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
  .delete
```

```bash
# Install the twilio-cli from https://twil.io/cli

twilio api:conversations:v1:conversations:messages:remove \
   --conversation-sid CHXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX \
   --sid IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
```

```bash
curl -X DELETE "https://conversations.twilio.com/v1/Conversations/CHXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/Messages/IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" \
-u $TWILIO_ACCOUNT_SID:$TWILIO_AUTH_TOKEN
```
