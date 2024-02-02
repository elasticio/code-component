/* eslint-disable import/no-extraneous-dependencies */
const _ = require('lodash');
const axios = require('axios');
const vm = require('vm');
const { messages } = require('elasticio-node');
const co = require('co');
const request = require('co-request');

function wait(timeout) {
  return new Promise((ok) => {
    setTimeout(() => {
      this.logger.debug('Done wait');
      ok();
    }, timeout);
    this.logger.debug('Start wait sec=%s', timeout);
  });
}

// eslint-disable-next-line consistent-return,func-names
exports.process = async function (msg, conf, snapshot) {
  const vmExports = {};
  const ctx = vm.createContext({
    // Node Globals
    Buffer,
    clearInterval,
    clearTimeout,
    console,
    exports: vmExports,
    global: {},
    module: { exports: vmExports },
    process,
    require,
    setInterval,
    setTimeout,
    URL,
    URLSearchParams,

    // EIO Specific Functionality
    emitter: this,
    messages,
    msg,

    // Other Libraries
    _,
    axios,
    request,
    wait: wait.bind(this),
  });
  this.logger.debug('Running the code...');
  vm.runInContext(conf.code, ctx, {
    displayErrors: true,
  });
  this.logger.debug("No result, let's check the run object if it was created?");
  if (ctx.run && typeof ctx.run.apply === 'function') {
    let result;
    if (ctx.run.constructor.name === 'GeneratorFunction') {
      this.logger.debug('Run variable is a generator');
      const fn = co.wrap(ctx.run);
      result = fn.apply(this, [msg, conf, snapshot]);
    } else {
      this.logger.debug('Run variable is a function, calling it');
      result = ctx.run.apply(this, [msg, conf, snapshot]);
    }
    if (typeof result === 'object' && typeof result.then === 'function') {
      this.logger.debug('Returned value is a promise, will evaluate it');
      let returnResult;
      try {
        returnResult = await result;
        this.logger.debug('Promise resolved');
        if (returnResult) {
          return messages.newMessageWithBody(returnResult);
        }
        this.emit('end');
      } catch (e) {
        this.logger.error('Promise failed');
        throw e;
      }
    }
  } else {
    this.logger.debug("Run function was not found, it's over now");
    this.emit('end');
  }
};
