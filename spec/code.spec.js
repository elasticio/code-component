var EventEmitter = require('events').EventEmitter;
var util = require('util');

function TaskExec() {
    EventEmitter.call(this);
    this.errorCount = 0;
}
util.inherits(TaskExec, EventEmitter);
var fn = require('../actions/code');
function testFn(code, cb) {
    var executor = new TaskExec();
    executor.data = [];
    executor.on('end', function () {
        "use strict";
        cb(executor);
    });
    executor.on('data', function (value) {
        "use strict";
        this.data.push(value);
    });
    fn.process.apply(executor, [{}, {
        code: code
    }]);
}

describe('ES5 code block', function() {
    "use strict";


    it('Processes hello code normally', function (done) {
        testFn("console.log('Hello code!');", function () {
            "use strict";
            done();
        });
    });

    it('Processes hello code with run function', function (done) {
        testFn("function run(msg) { console.log('Hello code!'); this.emit('end');}", function () {
            "use strict";
            done();
        });
    });


    it('Processes hello code emitting', function (done) {
        testFn("function run(message) {" +
            "this.emit('data', messages.newMessageWithBody({message: 'hello world'}));" +
            "this.emit('end'); " +
            "}",
            function (executor) {
                "use strict";
                expect(executor.data.length).toEqual(1);
                done();
            });
    });

});

describe('ES6 Code Block', function () {

    it('Promise that resolves', function (done) {
        "use strict";
        testFn("function run(message) {" +
            "return new Promise(function(resolve, reject) {" +
            "resolve(true);" +
            "})" +
            "};", function (executor) {
            expect(executor.data.length).toEqual(1);
            done();
        });
    });

    it('Promise that resolves 2', function (done) {
        "use strict";
        testFn("function run(message) { console.log('Hello promise!'); return new Promise(function(accept, reject) { accept('Hello code!'); }); }"
            , function (executor) {
            expect(executor.data.length).toEqual(1);
            done();
        });
    });
});