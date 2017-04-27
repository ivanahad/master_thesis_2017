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
    var ipfix_obj = ipfixMsg.parse(copyBuffer);
    ipfix_obj = parseInformationElements(ipfix_obj);
    return ipfix_obj;
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
      length: function(){return this.count;}
    });

const ipfixTemplates = new Parser()
    .array('templates', {
      type: ipfixTemplate,
      readUntil: 'eof'
    });

const ipfixSet = new Parser()
  .uint16('id')
  .uint16('length')
  .buffer('templates', {
    length: function(){return this.length;}
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

function parseInformationElements(ipfix_obj){
  if(!ipfix_obj.sets){
    return ipfix_obj;
  }
  for(var i in ipfix_obj.sets){
    if(!ipfix_obj.sets[i].templates){
      return ipfix_obj;
    }
    ipfix_obj.sets[i].templates =
        ipfixTemplates.parse(ipfix_obj.sets[i].templates).templates;
  }
  return ipfix_obj;
}


module.exports = Ipfix;
