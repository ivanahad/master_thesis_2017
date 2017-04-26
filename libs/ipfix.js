const Parser = require('binary-parser').Parser;

function Ipfix(){}

Ipfix.HEADER_LENGTH = 16;

// TODO throw errors
Ipfix.prototype.parse = function (binaryBuffer) {
  if(!binaryBuffer){
    return null;
  }
  else if (binaryBuffer.length < Ipfix.HEADER_LENGTH) {
    return null;
  }
  else{
    const copyBuffer = Buffer.alloc(binaryBuffer.length);
    binaryBuffer.copy(copyBuffer);
    return ipfixMsg.parse(copyBuffer);
  }
};

const ipfixInfoElem = new Parser()
    .uint16('id')
    .uint16('length');

const ipfixTemplate = new Parser()
    .uint16('id')
    .uint16('count')
    .array('elements', {
      type: ipfixInfoElem,
      length: 2
    });

const ipfixSet = new Parser()
  .uint16('id')
  .uint16('length')
  .array('templates', {
    type: ipfixTemplate,
    length: 1
  });

const ipfixMsg = new Parser()
  // Header
  .uint16('version')
  .uint16('length')
  .uint32('exportTime')
  .uint32('seqNo')
  .uint32('domainId')
  // Sets
  .array('sets', {
    type: ipfixSet,
    readUntil: 'eof'
  });

module.exports = Ipfix;
