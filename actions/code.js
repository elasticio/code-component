"use strict";
var vm = require('vm');
var Q = require('q');
var elasticio = require('elasticio-node');
var debug = require('debug')('code');

exports.process = function (msg, conf) {
    var ctx = vm.createContext({
        console : console,
        process : process,
        require : require,
        setTimeout : setTimeout,
        clearTimeout: clearTimeout,
        setInterval : setInterval,
        clearInterval: clearInterval,
        exports : {},
        messages : elasticio.messages
    });
    debug('Running the code %s', conf.code);
    vm.runInContext(conf.code, ctx, {
        displayErrors : true
    });
    debug("No result, let's check the run object if it was created?");
    if (ctx.run && typeof ctx.run.apply == 'function') {
        debug("Run variable is a function, calling it");
        var result = ctx.run.apply(this, [msg]);
    } else {
        debug("Run function was not found, it's over now");
        this.emit('end');
    }
};
