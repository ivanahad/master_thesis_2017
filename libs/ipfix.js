const Parser = require('binary-parser').Parser

function Ipfix(){}

const HEADER_LENGTH = 16

const ipfixHeader = new Parser()
    .endianess('big')
    .uint16('version')
    .uint16('length')
    .uint32('exportTime')
    .uint32('seqNo')
    .uint32('domainId');

Ipfix.prototype.parse = function (binaryBuffer) {
  if(binaryBuffer == undefined){
    return null;
  }
  else if (binaryBuffer.length < HEADER_LENGTH) {
    return null;
  }
  else{
    return ipfixHeader.parse(binaryBuffer);

  }
};

module.exports = Ipfix;
