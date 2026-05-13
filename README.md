# code-component

> A code component for the [elastic.io platform](https://www.elastic.io "elastic.io platform"), runs a piece of a JavaScript code inside your integration flow.

## Documentation

Pretty much the same way that you would use any other component in our system. It is deployed by default to production,
so no need to deploy it yourself (although you could if you have extended it yourself). In our Dashboard
start building your integration and include the Code component as well. You will see a picture similar to the one below:

![image](https://github.com/user-attachments/assets/fa84cf12-6c47-4c33-b7f7-16b4b8372cef)


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
- [`strong-soap`](https://github.com/loopbackio/strong-soap) - SOAP client for invoking web services
- `_` - [Lodash](https://lodash.com/)
- [`nodemailer`](https://nodemailer.com/) - Library for sending emails from Node.js

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

### Calling a SOAP web service with strong-soap

The Code component exposes the [`strong-soap`](https://github.com/loopbackio/strong-soap) client as `soap`. You can call SOAP operations using async/await. Create the client with a small promise wrapper, then invoke methods (they return promises).

**Basic SOAP call (WSDL URL and operation args from incoming message):**

```JavaScript
function createSoapClient(wsdlUrl, options = {}) {
  return new Promise((resolve, reject) => {
    soap.createClient(wsdlUrl, options, (err, client) => {
      if (err) reject(err);
      else resolve(client);
    });
  });
}

async function run(msg, cfg, snapshot) {
  const { wsdlUrl, operation, args } = msg.body;
  const client = await createSoapClient(wsdlUrl);
  const { result } = await client[operation](args || {});
  await this.emit('data', { body: result });
}
```

**Calling a specific service and port:**

If the WSDL defines multiple services or ports, use the `ServiceName.PortName.MethodName` form (use the same `createSoapClient` helper as in the examples above):

```JavaScript
async function run(msg, cfg, snapshot) {
  const client = await createSoapClient(msg.body.wsdlUrl);
  const { result } = await client.MyService.MyPort.MyFunction({ name: msg.body.inputName });
  await this.emit('data', { body: result });
}
```

### Sending an email with nodemailer

The Code component includes [`nodemailer`](https://nodemailer.com/) for sending emails. Here is an example of how to use it:

```JavaScript
async function run(msg, cfg, snapshot) {
  this.logger.info('Verifying nodemailer support...');
  
  // 1. Check if the library is available in the context
  if (typeof nodemailer === 'undefined') {
    throw new Error('nodemailer library was not found in the execution context');
  }
  // 2. Create a test transporter using Ethereal (safe for testing)
  const testAccount = await nodemailer.createTestAccount();
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
  // 3. Attempt to send a test email
  const info = await transporter.sendMail({
    from: '"Tester" <test@elastic.io>',
    to: "bar@example.com",
    subject: "Nodemailer Test from elastic.io ✔",
    text: "Nodemailer is correctly installed and accessible!",
    html: "<b>Nodemailer is correctly installed and accessible!</b>",
    attachments: [
      {
        filename: 'test.txt',
        content: 'Hello world!'
      }
    ]
  });
  this.logger.info("Email sent successfully! Message ID: %s", info.messageId);
  const previewUrl = nodemailer.getTestMessageUrl(info);
  this.logger.info("You can view the test email at: %s", previewUrl);
  await this.emit('data', { body: {
    status: 'Nodemailer is working', 
    messageId: info.messageId, 
    previewUrl 
  }});
}
```

## Known issues and limitations

 - Credentials are not supported
 