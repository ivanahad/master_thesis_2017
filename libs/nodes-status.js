const debuglog = require('util').debuglog('status');
const ipfixEnum = require('./ipfix-enum');

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
  for(var j in ipfixObj.sets){
    const set = ipfixObj.sets[j];
    for(var k in set.data){
      const dataSet = set.data[k];
      for(var l in dataSet){
        const record = dataSet[l];
        if(record.id == entrInfoElements.PARENT){
          nodeId.parent = record.value;
          return;
        }
      }
    }
  }
}

function updateBattery(ipfixObj, nodeId){
  for(var j in ipfixObj.sets){
    const set = ipfixObj.sets[j];
    for(var k in set.data){
      const dataSet = set.data[k];
      for(var l in dataSet){
        const record = dataSet[l];
        if(record.id == entrInfoElements.BATTERY){
          nodeId.battery = record.value;
          return;
        }
      }
    }
  }
}
