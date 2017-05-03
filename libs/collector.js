const Ipfix = require('ipfix');
const DB = require('queries');

function Collector(){}

var ipfix = new Ipfix();

Collector.prototype.processMsg = function (ipfixMsg) {
  var ipfixObj = ipfix.parse(ipfixMsg);
  DB.logIpfix(ipfixObj);
};

module.exports = Collector;
