const dgram = require("dgram");
const debuglog = require('util').debuglog('collector');
const ipfix = require('../libs/ipfix');
const DB = require('../libs/queries');

const PORT = 9995;

module.exports = {};

module.exports.startCollector = function(){
  const udpserver = dgram.createSocket("udp6");

  udpserver.on("error", function (err) {
    debuglog("server error:\n" + err.stack);
    udpserver.close();
  });

  udpserver.on("message", function (msg, rinfo) {
    var buf = new Buffer(msg, 'hex');
    debuglog("Received msg from " + rinfo.address + ":" + rinfo.port +
      "( " + msg.length + " bytes)");
    try {
      var ipfixObj = ipfix.parse(msg);
      DB.logIpfix(ipfixObj);
    } catch (e) {
      debuglog("Collector: problem when processing msg");
    }
  });

  udpserver.on("listening", function () {
    var address = udpserver.address();
    debuglog("Collector listening " + address.address + ":" + address.port);
  });

  udpserver.bind(PORT);
};
