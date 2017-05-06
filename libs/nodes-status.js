const debuglog = require('util').debuglog('status');
const ipfixEnum = require('./ipfix-enum');
const ipfix = require('./ipfix');

const entrInfoElements = ipfixEnum.entrepriseInformationElements;

var exports = module.exports = {};

var nodes = {};

exports.getAll = function(){
  return nodes;
};

exports.get = function(nodeId){
  if(nodeId.toString() in nodes){
    return nodes[nodeId.toString()];
  }
  return null;
};

exports.feedData = function(ipfixObj){
  nodes[ipfixObj.domainId] = createNode(ipfixObj.domainId);
  updateParent(ipfixObj, nodes[ipfixObj.domainId]);
  updateBattery(ipfixObj, nodes[ipfixObj.domainId]);
};

exports.clean = function(){
  nodes = {};
};

function createNode(nodeId){
  return {
    id: nodeId,
    parent : null,
    battery: null,
  };
}

function updateParent(ipfixObj, nodeId){
  const records = ipfix.getRecords(ipfixObj);
  for(var i in records){
    const record = records[i];
    for(var j in record){
      const element = record[j];
      if(element.id == entrInfoElements.PARENT){
        nodeId.parent = element.value;
        return;
      }
    }
  }
}

function updateBattery(ipfixObj, nodeId){
  const records = ipfix.getRecords(ipfixObj);
  for(var i in records){
    const record = records[i];
    for(var j in record){
      const element = record[j];
        if(element.id == entrInfoElements.BATTERY){
          nodeId.battery = element.value;
          return;
        }
    }
  }
}
