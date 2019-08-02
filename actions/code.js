'use strict';
const vm = require('vm');
const elasticio = require('elasticio-node');
const co = require('co');
const request = require('co-request');
const _ = require('lodash');

function wait(timeout) {
    return new Promise(ok => {
        setTimeout(() => {
            console.log('Done wait');
            ok();
        }, timeout);
        this.logger.info('Start wait sec=%s', timeout);
    });
}

exports.process = async function (msg, conf) {
    const ctx = vm.createContext({
        _: _,
        console: console,
        process: process,
        require: require,
        setTimeout: setTimeout,
        clearTimeout: clearTimeout,
        setInterval: setInterval,
        clearInterval: clearInterval,
        msg: msg,
        exports: {},
        messages: elasticio.messages,
        request: request,
        wait: wait.bind(this),
        emitter: this
    });
    this.logger.info('Running the code %s', conf.code);
    vm.runInContext(conf.code, ctx, {
        displayErrors: true
    });
    this.logger.info("No result, let's check the run object if it was created?");
    if (ctx.run && typeof ctx.run.apply == 'function') {
        let result;
        if (ctx.run.constructor.name === 'GeneratorFunction') {
            this.logger.info('Run variable is a generator');
            result = co(ctx.run);
        } else {
            this.logger.info("Run variable is a function, calling it");
            result = ctx.run.apply(this, [msg]);
        }
        if (typeof result === 'object' && typeof result.then === 'function') {
            this.logger.info('Returned value is a promise, will evaluate it');
            result.then(resolved => {
                this.logger.info('Promise resolved');
                if (resolved) {
                    this.emit('data', elasticio.messages.newMessageWithBody(resolved));
                }
                return this.emit('end');
            }).catch(async err => {
                this.logger.info('Promise failed', err);
                await this.emit('error', err);
                this.emit('end');
            });
        }
    } else {
        this.logger.info("Run function was not found, it's over now");
        this.emit('end');
    }
};
