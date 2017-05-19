const collectorEmitter = require('./collector').collectorEmitter;
const IpfixEnum = require('../libs/ipfix-enum');
const IpfixParser = require('../libs/ipfix-parser');
const Node = require('../libs/node');

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

  getOrCreate(nodeId){
    var node = this.get(nodeId);
    if(node === null){
      node = new Node(nodeId);
      this.nodes[nodeId] = node;
    }
    return node;
  }

  feedIpfix(ipfixObj){
    var node = this.getOrCreate(ipfixObj.domainId);
    node.addMessage(ipfixObj);

    this.updateStatus(ipfixObj, node, IpfixEnum.PARENT);
    this.updateStatus(ipfixObj, node, IpfixEnum.BATTERY);
  }

  updateStatus(ipfixObj, node, informationElement){
    const records = IpfixParser.getRecords(ipfixObj);
    for(var i in records){
      const record = records[i];
      for(var j in record){
        const element = record[j];
        if(element.id == informationElement.id){
          node.updateStatus(informationElement.name, element.value);
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

module.exports = {
  startNodes: function(){
    collectorEmitter.on('message', function(ipfixObj){
      onlyInstance.feedIpfix(ipfixObj);
    });
  },
  instance: onlyInstance
};
