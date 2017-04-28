const Parser = require('binary-parser').Parser;

function Ipfix(){}

var templatesStore = {};

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
    ipfix_obj = parseSetsContent(ipfix_obj);
    return ipfix_obj;
  }
};

Ipfix.prototype.getTemplate = function(domainId, templateId){
  const templates = templatesStore[domainId];
  if(!templates){
    return null;
  }
  if(!templates[templateId]){
    return null;
  }
  return templates[templateId];
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
  .buffer('buff', {
    length: function(){return this.length - 4;}
  });

const ipfixData = function(dataParser){
  return new Parser().
    array('data', {
      type: dataParser,
      readUntil: 'eof'
    });
};

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

function parseSetsContent(ipfix_obj){
  if(!ipfix_obj.sets){
    return ipfix_obj;
  }
  for(var i in ipfix_obj.sets){
    if(!ipfix_obj.sets[i].buff && !ipfix_obj.sets[i].buff.templates){
      continue;
    }
    if(ipfix_obj.sets[i].id == 2){ // Templates
      ipfix_obj.sets[i].templates =
        ipfixTemplates.parse(ipfix_obj.sets[i].buff).templates;
      updateTemplates(ipfix_obj);
    }
    else{
      const template = Ipfix.prototype.getTemplate(ipfix_obj.domainId, ipfix_obj.sets[i].id);
      var parser =
          createParserBasedOnTemplate(template);
      ipfix_obj.sets[i].data =
          ipfixData(parser).parse(ipfix_obj.sets[i].buff).data;
      ipfix_obj.sets[i].template = template;
    }
  }
  return ipfix_obj;
}

 function updateTemplates(ipfix_obj){
  if(!ipfix_obj.sets){
    return;
  }
  const domainId = ipfix_obj.domainId;
  for(var i in ipfix_obj.sets){
    if(!ipfix_obj.sets[i].templates){
      continue;
    }
    for(var j in ipfix_obj.sets[i].templates){
      var template = ipfix_obj.sets[i].templates[j];
      if(!templatesStore[domainId]){
        templatesStore[domainId] = {};
      }
      templatesStore[domainId][template.id] = template;
    }
  }
}

function createParserBasedOnTemplate(template){
  var parser = new Parser();
  for(var i in template.elements){
    const name = 'value' + i.toString();
    switch(template.elements[i].length){
      case 1:
        parser = parser.uint8(name);
        break;
      case 2:
        parser = parser.uint16(name);
        break;
      case 4:
        parser = parser.uint32(name);
        break;
      default:
        continue;
    }
  }
  return parser;
}


module.exports = Ipfix;
