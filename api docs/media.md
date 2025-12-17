# Conversations Media Resource

The Media resource in Twilio's Media Content Service allows you to upload/download files for use in other Twilio products. You can attach these media files to [Conversation Messages](/docs/conversations/api/conversation-message-resource) as part of the [Media Messaging](/docs/conversations/media-support-conversations) feature.

**Note:** The Media REST resource is accessed via a separate sub-domain from Chat and other Twilio products. The base URL for Media via the Media Content Service (MCS) is:

```bash
https://mcs.us1.twilio.com/v1
```

## Authentication

To authenticate requests to the Twilio APIs, Twilio supports [HTTP Basic authentication](https://en.wikipedia.org/wiki/Basic_access_authentication). Use your *API key* as the username and your *API key secret* as the password. You can create an API key either [in the Twilio Console](/docs/iam/api-keys/keys-in-console) or [using the API](/docs/iam/api-keys/key-resource-v1).

**Note**: Twilio recommends using API keys for authentication in production apps. For local testing, you can use your Account SID as the username and your Auth token as the password. You can find your Account SID and Auth Token in the [Twilio Console](https://www.twilio.com/console).

Learn more about [Twilio API authentication](/docs/usage/requests-to-twilio).

```bash
curl -G https://mcs.us1.twilio.com/v1/Services \
    -u $TWILIO_API_KEY:$TWILIO_API_KEY_SECRET
```

> \[!NOTE]
>
> You can't use the Twilio server-side SDKs or the Twilio CLI to make requests to the Media resource.

## Properties \[#properties]

Each Media resource instance has these properties:

| name          | description                                                                                                                                                                                             |
| :------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| sid           | A 34-character string that uniquely identifies this resource.                                                                                                                                           |
| account\_sid  | The unique id of the [Account][account] responsible for this message.                                                                                                                                   |
| service\_sid  | The unique id of the [Chat Service][service] this message belongs to.                                                                                                                                   |
| date\_created | The date that this resource was created.                                                                                                                                                                |
| date\_updated | The date that this resource was last updated, `null` if the message has not been edited.                                                                                                                |
| channel\_sid  | The unique id of the [Conversation][conversation] (same as the underlying [Chat Channel][channel]) containing the [Message][message] that this media instance was added to.                             |
| message\_sid  | The unique id of the [Conversation Message][message] this media instance was added to.                                                                                                                  |
| size          | The size of the file this Media instance represents in BYTES                                                                                                                                            |
| content\_type | The MIME type of the file this Media instance represents. Please refer to the [MIME Types](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types) for a list of valid MIME types. |
| file\_name    | The filename of the underlying media file as specified when uploaded                                                                                                                                    |
| author        | The identity of the [User][user] that uploaded the Media instance. This is automatically set to `sender` when using the REST API.                                                                       |
| url           | An absolute URL for this media instance                                                                                                                                                                 |
| links         | Links to access the underlying media file (`content`) and a temporary URL to use to access this (`content_direct_temporary`)                                                                            |

[account]: /docs/iam/api/account

[message]: /docs/conversations/api/conversation-message-resource

[conversation]: /docs/conversations/api/conversation-resource

[channel]: /docs/chat/channels

[service]: /docs/chat/rest/service-resource

[user]: /docs/conversations/api/user-resource

## Create/Upload a new Media resource

```bash
POST /Services/{Chat Service SID}/Media
```

**Note**: The Chat Service SID must be the Chat Service Instance that this Media instance will be used for. You can find the Chat Service SID as a property of the [Conversation](/docs/conversations/api/conversation-resource) to which you want to add a new media message.

To create a new media instance, you should upload the media file itself as content on the `POST` request. (See Curl Example below.)

Ultimately, this will be converted into a `POST` request, containing the following headers and the file itself as the request body.

### Headers

| name           | description                                                                                                                                                                                                                                                                                      |
| :------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Content-Type` | The MIME type of the file this Media instance represents. Please refer to the [MIME Types](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types) for a list of valid MIME types. This should be set explicitly by the API caller or automatically detected by the client. |
| `Content-Size` | The size of the media (the file) being uploaded in bytes                                                                                                                                                                                                                                         |

### Body

The body or content of the `POST` must be the file itself in binary format.

### Curl Example

```bash
curl -u "<account_sid>:<account_secret>" --data-binary @<filename.png> -H "Content-Type: <content-type of upload>" https://mcs.us1.twilio.com/v1/Services/<chat_service_sid>/Media
```

## Retrieve a Media resource

You can retrieve an uploaded Media resource by issuing a `GET` request with the SID of the media instance:

```bash
GET /Services/{Chat Service SID}/Media/{Media SID}
```

### Curl Example for retrieving a media resource

```bash
curl -u "<account_sid>:<account_secret>" -G https://mcs.us1.twilio.com/v1/Services/<chat_service_sid>/Media/<Media SID>
```
