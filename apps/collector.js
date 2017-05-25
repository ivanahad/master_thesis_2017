const dgram = require("dgram");
const IpfixParser = require('../libs/ipfix-parser');
const EventEmitter = require('events');
const debuglog = require('util').debuglog('collector');

const PORT = 9995;
const udpserver = dgram.createSocket("udp6");

class CollectorEmitter extends EventEmitter {}
const collectorEmitter = new CollectorEmitter();

udpserver.on("error", function (err) {
  debuglog("server error:\n" + err.stack);
  udpserver.close();
});

udpserver.on("message", function (msg, rinfo) {
  var buf = new Buffer(msg, 'hex');
  debuglog("Received msg from " + rinfo.address + ":" + rinfo.port +
    "( " + msg.length + " bytes)");
  try {
    var ipfix = IpfixParser.parse(msg);
    collectorEmitter.emit('message', ipfix);
  } catch (e) {
    debuglog("Collector: problem when processing msg");
    console.error(e);
  }
});

udpserver.on("listening", function () {
  var address = udpserver.address();
  debuglog("Collector listening " + address.address + ":" + address.port);
});

module.exports = {
  startCollector : function(){
    udpserver.bind(PORT);
  },
  collectorEmitter: collectorEmitter
};
