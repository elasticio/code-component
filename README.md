# Code Component

## Table of Contents

* [Description](#description)
* [Credentials](#credentials)
* [Actions](#actions)
    * [Executes custom code](#execute-custom-code)

## Description

A code component for the [elastic.io platform](https://www.elastic.io "elastic.io platform"), runs a piece of a JavaScript code inside your integration flow.

Pretty much the same way that you would use any other component in our system. It is deployed by default to production,
so no need to deploy it yourself (although you could if you have extended it yourself). In our Dashboard
start building your integration and include the Code component as well. You will see a picture similar to the one below:

![image](https://github.com/elasticio/code-component/assets/8449044/577a8652-f264-490c-abec-c0cc8f6b6651)


However, don't let the simple look fool you - it has a full-fledged interface with many very useful features like the ones you would expect from your favourite desktop developing tool:

* Syntax highlighting - a standard for any online real-time coding interface
* Code auto-completion - again a standard that you got used to from your desktop tool
* Support for number of variables and libraries within the context of the execution
* Support latest ECMAScript standard
* Run and troubleshoot within the designer interface.

## Available Variables and Libraries
Here are the available variables and libraries that can be used within the context of execution. The most up-to-date list
can always be found in be used within the context of execution or in `code.js` of the component. Below is a sample for the reference.
Built-in Node.js global objects are also supported.

### Elastic.io Specific Functionality
- `msg` - incoming message containing the payload from the previous step
- `cfg` - step's configuration. At the moment contains the following properties:
  - `code` (the code, being executed)
  - `secretId` - the ID of the secret being used by the credentials
  - `credentials` - The credentials section. Depending on the selected credentials type contains a set of credentials fields
- `snapshot` - step's snapshot
- `messages` - utility for convenient message creation
- `emitter` user to emit messages and errors

### Other Libraries/functions
- `wait(numberOfMilliscondsToSleep)` - Utility function for sleeping
- [`request`](https://github.com/request/request) - Http Client (wrapped in `co` - [this library](https://www.npmjs.com/package/co-request) so that it is pre-promisified)
- `_` - [Lodash](https://lodash.com/)


## Credentials

To use the Gemini API, you’ll need an API key. If you don’t already have one, create a key in Google AI Studio.
[Click here to create API Key](https://makersuite.google.com/app/apikey).

Please note - for the moment not all the regions over the world are supported. You might want to use VPN connection to create a key.

[A list of regions that are supported](https://ai.google.dev/available_regions)

### Component credentials configuration fields:
* **API Version** (string, optional) - Either `v1` or `v1beta` for now. Refer [the documentation](https://ai.google.dev/docs/api_versions) to find out the difference.
* **API Key** (string, required) - API Token generated as described above

## Actions

### Generate Content

Simply send a request to the Gemini API.
The following input modes are supported:
* Text-only input
* Text-and-image input
* Multi-turn conversations (chat)

#### Configuration Fields

* **Model** (dropdown, required) - Use the `gemini-pro` model for text-only prompts and `gemini-pro-vision` for image processing. You can't send a text-only prompt to the 'gemini-pro-vision' model. It is a dynamically-fetched list of models that support `generateContent` method.
* **Safety categories to setup** (multi select dropdown, optional) - A list of [Safety categories](https://ai.google.dev/docs/safety_setting_gemini?hl=en). If you wish, you can configure an allowed threshold for each or some of them. Also refer to [List of available levels](https://ai.google.dev/api/rest/v1beta/SafetySetting?hl=en#HarmBlockThreshold)
* **Temperature** (dropdown, optional) - Controls the randomness of the output. Values are in the range: [0.0, 1.0]. Higher values produce a more random and varied response. A temperature of zero will be deterministic.
* **Max Output Tokens** (string, optional) - Specifies the maximum number of tokens that can be generated in the response. A token is approximately four characters. 100 tokens correspond to roughly 60-80 words.
* **topK** (string, optional) - The topK parameter changes how the model selects tokens for output. A topK of 1 means the selected token is the most probable among all the tokens in the model's vocabulary (also called greedy decoding), while a topK of 3 means that the next token is selected from among the 3 most probable using the temperature. For each token selection step, the topK tokens with the highest probabilities are sampled. Tokens are then further filtered based on topP with the final token selected using temperature sampling.
* **topP** (string, optional) - The topP parameter changes how the model selects tokens for output. Tokens are selected from the most to least probable until the sum of their probabilities equals the topP value. For example, if tokens A, B, and C have a probability of 0.3, 0.2, and 0.1 and the topP value is 0.5, then the model will select either A or B as the next token by using the temperature and exclude C as a candidate. The default topP value is 0.95.
* **stop_sequences** (string, optional) - Set a stop sequence to tell the model to stop generating content. A stop sequence can be any sequence of characters. Try to avoid using a sequence of characters that may appear in the generated content. Comma-separated list. E.g. 'weapon,drugs,antivaxxer'.

Please be aware that any configuration options labeled as 'optional' will automatically utilize default values if left unspecified by the user. If you wish to customize these defaults, kindly consult the Gemini API documentation for precise information on the default values.

Here is the description of the available parameters: https://ai.google.dev/docs/concepts?hl=en#model_parameters

#### Input Metadata

Please refer to the [Input Schema file](./src/schemas/actions/generateContent.in.json) for the full list of metadata fields.

As were said above, there are three modes available:
##### Text-only input
Use it for a simple text-based chatting.
Input body example:
```json
{
  "contents": [{
    "parts": [{
      "text": "Hello. How can you help me today?"
    }]
  }]
}
```

##### Text-and-image input
Use it for text-based chatting with possibility to sena an image for the Gemini API to analyze.

The following MIME types are supported:
- PNG - image/png
- JPEG - image/jpeg
- WEBP - image/webp
- HEIC - image/heic
- HEIF - image/heif

An image must be converted to a in Base64 format string without any preceding prefix like `data:image/png;base64,`

Input body example:
```json
{
  "contents": [{
    "parts": [
      {
        "text": "Describe what is in the photo"
      },
      {
        "inline_data": {
          "mime_type": "image/png",
          "data": "iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAIAAADTED8xAAADMElEQVR4nOzVwQnAIBQFQYXff81RUkQCOyDj1YOPnbXWPmeTRef+/3O/OyBjzh3CD95BfqICMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMO0TAAD//2Anhf4QtqobAAAAAElFTkSuQmCC"
        }
      }
    ]
  }]
}
```

##### Multi-turn conversations (chat)
Using Gemini, you can build freeform conversations across multiple turns.

Input body example:
```json
{
  "contents": [
    {
      "role": "user",
      "parts": [
        {
          "text": "Write the first line of a story about a magic backpack."
        }
      ]
    },
    {
      "role": "model",
      "parts": [
        {
          "text": "In the bustling city of Meadow brook, lived a young girl named Sophie. She was a bright and curious soul with an imaginative mind."
        }
      ]
    },
    {
      "role": "user",
      "parts": [
        {
          "text": "Can you set it in a quiet village in 1600s France?"
        }
      ]
    }
  ]
}
```

#### Output Metadata

Please refer to the [Output Schema file](./src/schemas/actions/generateContent.out.json) for the full list of metadata fields

## Triggers



==============
# code-component

> A code component for the [elastic.io platform](https://www.elastic.io "elastic.io platform"), runs a piece of a JavaScript code inside your integration flow.

## Documentation

Pretty much the same way that you would use any other component in our system. It is deployed by default to production,
so no need to deploy it yourself (although you could if you have extended it yourself). In our Dashboard
start building your integration and include the Code component as well. You will see a picture similar to the one below:

![image](https://user-images.githubusercontent.com/2523461/68778086-f3678280-0632-11ea-9e9c-d2a888fd5788.png)


However, don't let the simple look fool you - it has a full-fledged interface with many very useful features like the ones you would expect from your favourite desktop developing tool:

 * Syntax highlighting - a standard for any online real-time coding interface
 * Code auto-completion - again a standard that you got used to from your desktop tool
 * Support for number of variables and libraries within the context of the execution
 * Support latest ECMAScript standard
 * Run and troubleshoot within the designer interface.

## Available Variables and Libraries
Here are the available variables and libraries that can be used within the context of execution. The most up-to-date list
can always be found in be used within the context of execution or in `code.js` of the component. Below is a sample for the reference.
Built-in Node.js global objects are also supported.

### Elastic.io Specific Functionality
- `msg` - incoming message containing the payload from the previous step
- `cfg` - step's configuration. At the moment contains only one property: `code` (the code, being executed)
- `snapshot` - step's snapshot
- `messages` - utility for convenient message creation
- `emitter` user to emit messages and errors

### Other Libraries/functions
- `wait(numberOfMilliscondsToSleep)` - Utility function for sleeping
- [`request`](https://github.com/request/request) - Http Client (wrapped in `co` - [this library](https://www.npmjs.com/package/co-request) so that it is pre-promisified)
- `_` - [Lodash](https://lodash.com/)

## Code component usage Examples

Use code is very simple, just do following:

```JavaScript
async function run(msg, cfg, snapshot) {
  console.log('Incoming message is %s', JSON.stringify(msg));
  const body = { result : 'Hello world!' };
  // You can emit as many data messages as required
  await this.emit('data', { body });
  console.log('Execution finished');
}
```

Please note if you have a simple one-in-one-out function you can simply return a JSON object as a result
of your function, it will be automatically emitted as data.

## Common usage scenarios

### Doing complex data transformation

[JSONata](http://jsonata.org/) is great however sometimes it's easier to do things in JavaScript, if you want to transorm
an incoming message with code, just use following sample:

```JavaScript
async function run(msg, cfg, snapshot) {
  return {
      addition: 'You can use code',
      keys: Object.keys(msg)    
  };
}
```

### Calling an external REST API

It's very simple to code a small REST API call out of the Code component, see following example:

```JavaScript
async function run(msg, cfg, snapshot) {
  const res = await request.get({
    uri: 'https://api.elastic.io/v1/users',
    auth: {
      user: process.env.ELASTICIO_API_USERNAME,
      pass: process.env.ELASTICIO_API_KEY
    },
    json: true  
  });
  return {
    fullName: res.body.first_name + " " + res.body.last_name,
    email: res.body.email,
    userID: res.body.id    
  }
}
```

## Known issues and limitations

 - Credentials are not supported
