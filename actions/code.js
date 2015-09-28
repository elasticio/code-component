/*global console */
var vm = require('vm');
var Q = require('q');
var elasticio = require('elasticio-node');
var messages = elasticio.messages;

exports.process = function (msg, conf) {

    var context = {
        msg:msg,
        require: require,
        console: console,
        message : messages,
        elasticio: elasticio,
        Q : Q,
        this : this
    };

    try {
        vm.runInNewContext(conf.code, context);
    } catch (error) {
        this.emit('error', error);
    }
    this.emit('end');
};
