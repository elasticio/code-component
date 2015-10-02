"use strict";
var vm = require('vm');
var Q = require('q');
var elasticio = require('elasticio-node');
var debug = require('debug')('code');
var co = require('co');

exports.process = function (msg, conf) {
    var ctx = vm.createContext({
        console: console,
        process: process,
        require: require,
        setTimeout: setTimeout,
        clearTimeout: clearTimeout,
        setInterval: setInterval,
        clearInterval: clearInterval,
        exports: {},
        messages: elasticio.messages
    });
    var that = this;
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
                that.emit('data', elasticio.messages.newMessageWithBody(resolved));
                that.emit('end');
            }).catch(function (err) {
                debug('Promise failed');
                that.emit('error', err);
                that.emit('end');
            });
        }
    } else {
        debug("Run function was not found, it's over now");
        this.emit('end');
    }
};
