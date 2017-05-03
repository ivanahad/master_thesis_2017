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
    var ipfixObj = parseMessage(copyBuffer);
    return ipfixObj;
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

 function updateTemplates(template, templateId, domainId){
  if(!templatesStore[domainId]){
    templatesStore[domainId] = {};
  }
  templatesStore[domainId][template.id] = template;
}

function parseMessage(buff){
  var ipfixObj = parseHeader(buff);

  buff = buff.slice(16);
  ipfixObj.sets = parseSets(buff, ipfixObj.domainId);

  return ipfixObj;
}

function parseHeader(buff){
  var obj = {};
  obj.version = buff.readUInt16BE();
  obj.length = buff.readUInt16BE(2);
  obj.exportTime = buff.readUInt32BE(4);
  obj.seqNo = buff.readUInt32BE(8);
  obj.domainId = buff.readUInt32BE(12);

  return obj;
}

function parseSets(buff, domainId){
  var sets = [];
  var offset = 0;

  while(offset < buff.length){
    var set_obj = {};
    set_obj.id = buff.readUInt16BE(offset);
    set_obj.length = buff.readUInt16BE(offset+2);

    if(set_obj.id == 2){ // Templates set
      set_obj.templates = parseTemplates(buff.slice(offset+4, offset+set_obj.length), domainId);
    }
    else{  // Data set
      set_obj.data = parseData(buff.slice(offset+4, offset+set_obj.length), set_obj.id, domainId);
    }
    sets.push(set_obj);
    offset = offset + set_obj.length;
  }
  return sets;
}

function parseTemplates(buff, domainId){
  var offset = 0;
  var templates = [];
  while (offset < buff.length) {  // Templates
    var template_obj = {};
    template_obj.id = buff.readUInt16BE(offset);
    template_obj.count = buff.readUInt16BE(offset+2);
    template_obj.elements = [];

    offset = offset + 4;
    for(var i = 0; i < template_obj.count; i++){  // Information elements
      var element = {};
      element.id = buff.readUInt16BE(offset);
      element.length = buff.readUInt16BE(offset+2);
      offset = offset + 4;
      if(element.id > 32768){
        element.eid = buff.readUInt32BE(offset);
        offset = offset + 4;
      }
      else{
        element.eid = 0;
      }
      template_obj.elements.push(element);
    }
    templates.push(template_obj);
    updateTemplates(template_obj, template_obj.id, domainId);
  }
  return templates;
}

function parseData(buff, templateId, domainId){
  var records = [];
  var offset = 0;
  const template = Ipfix.prototype.getTemplate(domainId, templateId);

  while(offset < buff.length){
    var record = [];

    for(var i = 0; i < template.elements.length; i++){
      var value = {};
      value.id = template.elements[i].id;
      value.eid = template.elements[i].eid;
      value.value = parseValue(buff, template.elements[i].length, offset);
      record.push(value);
      offset = offset + template.elements[i].length;
    }
    records.push(record);
  }
  return records;
}

function parseValue(buff, length, offset){
  switch(length){
    case 1:
      return buff.readUInt8BE(offset);
    case 2:
      return buff.readUInt16BE(offset);
    case 4:
      return buff.readUInt32BE(offset);
    default:
      return null;
  }
}


module.exports = Ipfix;
