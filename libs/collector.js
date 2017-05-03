const Ipfix = require('ipfix');
const DB = require('queries');
const util = require('util');

const debuglog = util.debuglog('collector');

function Collector(){}

var ipfix = new Ipfix();

Collector.prototype.processMsg = function (ipfixMsg) {
  try {
    var ipfixObj = ipfix.parse(ipfixMsg);
    DB.logIpfix(ipfixObj);
  } catch (e) {
    debuglog("Collector: problem when processing msg");
  } 
};

module.exports = Collector;
