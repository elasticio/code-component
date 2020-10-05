// Please note only Node.js code is supported here
// eslint-disable-next-line no-unused-vars
var request = require('request');


var accessId = 'BUBd5iGwFfYRF96565Zp';
var accessKey = 'uch(avL!p)dB$3fh47!2a-!VCV8z[5uz7=J{TUcs';
var company = 'utgsolutions'

// Request Details
var httpVerb = "GET";
var epoch = (new Date).getTime();
var resourcePath = "/device/devices";

// Construct signature
var requestVars = httpVerb + epoch + resourcePath;
var crypto = require("crypto");
var hex = crypto.createHmac("sha256", accessKey).update(requestVars).digest("hex");
var signature = new Buffer(hex).toString('base64');

// Construct auth header
var auth = "LMv1 " + accessId + ":" + signature + ":" + epoch;
// Configure request options

// 	await this.emit('data', { auth });
//  this.logger.info('Execution finished');

var json = {"token": auth}


var options = {
  method: 'GET',
  json: true,
  url: 'https://utgsolutions.logicmonitor.com/santaba/rest/device/devices?size=1000\n',
  headers: {
    'Authorization':'Bearer ' + auth
  }
};

function callback(error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log(body)
  }
}
//call the request
const all_data = [];



var i = 0;
do {
  var data = request(options, callback);
  var data_items = data.items;

  data_items.forEach(function(key,value) {
    all_data.push(value);
  });
  i = i + 1000;
}
while (i <= data.total);
