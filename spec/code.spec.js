"use strict";

var EventEmitter = require('events').EventEmitter;
var util = require('util');
var co = require('co');

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

describe('ES6 code tests', function () {
    it('Generator function recognition', function () {
        var generator = function* () {
        };
        expect(typeof generator).toEqual('function');
        expect(typeof generator.apply).toEqual('function');
        var result = generator();
        expect(typeof result.next).toEqual('function');
        expect(generator.constructor.name).toEqual('GeneratorFunction');
    });
});

describe('ES5 code block', function () {
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
    
    it('simple script emitting data', function (done) {
        testFn("emitter.emit('data', messages.newMessageWithBody({message: 'hello world'}));" +
            "emitter.emit('end'); ",
            function (executor) {
                "use strict";
                expect(executor.data.length).toEqual(1);
                done();
            });
    });

});

describe('ES6 Code Block with promises', function () {

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

describe('ES6 Code Block with generator', function () {

    it('Simple generator', function (done) {
        testFn("function* run(message) { console.log('Hello generator!'); }"
            , function (executor) {
                expect(executor.data.length).toEqual(0);
                done();
            });
    });

    it('Simple generator returning data', function (done) {
        testFn("function* run(message) { console.log('Hello generator!'); return 'Resolved!'; }"
            , function (executor) {
                expect(executor.data.length).toEqual(1);
                done();
            });
    });

    it('Simple generator returning data with wait', function (done) {
        testFn("function* run(message) { console.log('Hello generator!'); yield wait(500); return 'Resolved!'; }"
            , function (executor) {
                expect(executor.data.length).toEqual(1);
                done();
            });
    });

    it('Simple generator returning data from URL', function (done) {
        testFn("function* run(message) { console.log('Hello async request!'); var result = yield request.get('http://www.google.com'); return result.statusCode; }"
            , function (executor) {
                expect(executor.data.length).toEqual(1);
                expect(executor.data[0].body).toEqual(200);
                done();
            });
    });


});
