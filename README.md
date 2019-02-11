# code-component

> A code component for the [elastic.io platform](https://www.elastic.io "elastic.io platform"), runs a piece of a JavaScript code inside your integration flow.

## Documentation

Pretty much the same way that you would use any other component in our system. It is deployed by default to production,
so no need to deploy it yourself (although you could if you have extended it yourself). In our Dashboard
start building your integration and include the Code component as well. You will see a picture similar to the one below:

![image](https://user-images.githubusercontent.com/56208/52571227-71cd9480-2e15-11e9-9c62-17e5085d7ada.png)

However, don't let the simple look fool you - it has a full-fledged interface with many very useful features like the ones you would expect from your favourite desktop developing tool:

 * Syntax highlighting - a standard for any online real-time coding interface
 * Code auto-completion - again a standard that you got used to from your desktop tool
 * Support for number of variables and libraries within the context of the execution
 * Support latest ECMAScript standard
 * Run and troubleshoot within the designer interface.

## Available Variables and Libraries
Here are the available variables and libraries that can be used within the context of execution. The most up-to-date list
can always be found in be used within the context of execution. The most up-to-date list can always be found in code.js
of the component. Below is a sample for the reference:

`console`: - more on [Node.js console](https://nodejs.org/dist/latest-v5.x/docs/api/console.html),
`process`: - Current Node.js process,
`require`: - Module require,
`setTimeout`: - more on [setTimeout](https://nodejs.org/dist/latest-v5.x/docs/api/timers.html),
`clearTimeout`: - more on [clearTimeout](https://nodejs.org/dist/latest-v5.x/docs/api/timers.html),
`setInterval`: - more on setInterval,
`clearInterval`: - more on clearInterval,
`msg`: - Incoming message containing the payload from the previous step,
`exports`: {},
`messages`: - Utility for convenient message creation,
`request`: - Http Client,
`wait`: - wait,
`emitter`: user to emit messages and errors

## Code component usage Examples

Use code is very simple, just do following:
```JavaScript
async function run(msg) {
  console.log('Incoming message is %s', JSON.stringify(msg));
  const body = { result : 'Hello world!' };
  await this.emit('data', { body });
}
```
