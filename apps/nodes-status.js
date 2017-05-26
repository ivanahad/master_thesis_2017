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

    this.updateStatus(ipfix, node, InfoElem.PARENT);
    this.updateStatus(ipfix, node, InfoElem.BATTERY);
  }

  updateStatus(ipfix, node, informationElement){
    const values = ipfix.getValues(informationElement);
    if(values.length > 0){
      node.updateStatus(informationElement.name, values[0][informationElement.name]);
    }
  }

  getMultipleStatus(names){
    var result = [];
    for(var i in this.nodes){
      result.push(this.nodes[i].getMultipleStatus(names));
    }
    return result;
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
