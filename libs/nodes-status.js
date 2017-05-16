const debuglog = require('util').debuglog('status');
const ipfixEnum = require('./ipfix-enum');
const ipfix = require('./ipfix');
const Node = require('./node');

const entrInfoElements = ipfixEnum.entrepriseInformationElements;

class NodesStatus {
  constructor() {
    this.nodes = {};
  }

  getNodes(){
    return this.nodes;
  }

  get(nodeId){
    if(!(nodeId in this.nodes)){
      return null;
    }
    return this.nodes[nodeId];
  }

  feedIpfix(ipfixObj){
    this.nodes[ipfixObj.domainId] = new Node(ipfixObj.domainId);
    this.updateParent(ipfixObj, this.nodes[ipfixObj.domainId]);
    this.updateBattery(ipfixObj, this.nodes[ipfixObj.domainId]);
  }

  updateParent(ipfixObj, node){
    const records = ipfix.getRecords(ipfixObj);
    for(var i in records){
      const record = records[i];
      for(var j in record){
        const element = record[j];
        if(element.id == entrInfoElements.PARENT){
          node.setParent(element.value);
          return;
        }
      }
    }
  }

  updateBattery(ipfixObj, node){
    const records = ipfix.getRecords(ipfixObj);
    for(var i in records){
      const record = records[i];
      for(var j in record){
        const element = record[j];
          if(element.id == entrInfoElements.BATTERY){
            node.updateStatus("battery", element.value);
            return;
          }
      }
    }
  }

  clean (){
    this.nodes = {};
  }
}

const onlyInstance = new NodesStatus();

module.exports = onlyInstance;
