var Q = require('q');
var elasticio = require('elasticio-node');
var messages = elasticio.messages;

exports.process = processAction;

function processAction(msg, cfg) {
    var self = this;
    var name = cfg.name;

    function emitData() {

        console.log('About to say hello to ' + name + ' again');

        var body = {
            greeting: name + ' How are you today?',
            originalGreeting: msg.body.greeting
        };

        var data = messages.newMessageWithBody(body);

        self.emit('data', data);
    }

    function emitError(e) {
        console.log('Oops! Error occurred');

        self.emit('error', e);
    }

    function emitEnd() {
        console.log('Finished execution');

        self.emit('end');
    }

    Q().then(emitData).fail(emitError).done(emitEnd);

}
