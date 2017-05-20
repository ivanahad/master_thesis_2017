const collectorEmitter = require('./collector').collectorEmitter;
const InfoElem = require('../libs/informationElements');
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

  feedIpfix(ipfix){
    var node = this.getOrCreate(ipfix.domainId);
    node.addMessage(ipfix);

    this.updateStatus(ipfix.json, node, InfoElem.PARENT);
    this.updateStatus(ipfix.json, node, InfoElem.BATTERY);
  }

  updateStatus(ipfix, node, informationElement){
    const records = IpfixParser.getRecords(ipfix);
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
    collectorEmitter.on('message', function(ipfix){
      onlyInstance.feedIpfix(ipfix);
    });
  },
  instance: onlyInstance
};
