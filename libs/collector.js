const ipfix = require('./ipfix');
const DB = require('./queries');
const debuglog = require('util').debuglog('collector');

var exports = module.exports = {};

exports.processMsg = function (ipfixMsg) {
  try {
    var ipfixObj = ipfix.parse(ipfixMsg);
    DB.logIpfix(ipfixObj);
  } catch (e) {
    debuglog("Collector: problem when processing msg");
  }
};
