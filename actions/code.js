'use strict';
const vm = require('vm');
const Q = require('q');
const elasticio = require('elasticio-node');
const debug = require('debug')('code');
const co = require('co');
const request = require('co-request');
const _ = require('lodash');

function wait(timeout) {
    return new Promise(function(ok) {
        setTimeout(function() {
            console.log('Done wait');
            ok();
        }, timeout);
        console.log('Start wait sec=%s', timeout);
    });
}

exports.process = function (msg, conf) {
    var that = this;
    var ctx = vm.createContext({
        _: _,
        console: console,
        process: process,
        require: require,
        setTimeout: setTimeout,
        clearTimeout: clearTimeout,
        setInterval: setInterval,
        clearInterval: clearInterval,
        msg : msg,
        exports: {},
        messages: elasticio.messages,
        request : request,
        wait : wait,
        emitter: that
    });
    debug('Running the code %s', conf.code);
    vm.runInContext(conf.code, ctx, {
        displayErrors: true
    });
    debug("No result, let's check the run object if it was created?");
    if (ctx.run && typeof ctx.run.apply == 'function') {
        if (ctx.run.constructor.name === 'GeneratorFunction') {
            debug('Run variable is a generator');
            result = co(ctx.run);
        } else {
            debug("Run variable is a function, calling it");
            var result = ctx.run.apply(this, [msg]);
        }
        if (typeof result === 'object' && typeof result.then === 'function') {
            debug('Returned value is a promise, will evaluate it');
            result.then(function (resolved) {
                debug('Promise resolved');
                if (resolved) {
                    that.emit('data', elasticio.messages.newMessageWithBody(resolved));
                }
                that.emit('end');
            }).catch(function (err) {
                debug('Promise failed', err);
                that.emit('error', err);
                that.emit('end');
            });
        }
    } else {
        debug("Run function was not found, it's over now");
        this.emit('end');
    }
};
