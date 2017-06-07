const Node = require("./libs/node");
const NodesStatus = require("./apps/nodes-status").instance;

function fillData(){
  var node1 = new Node(1);
  node1.lastUpdate = 6598421;
  node1.status = {
    battery: 85,
    flows: [{src_node: 1, dst_node: 2, octets: 87, packets: 1}]
  };

  var node2 = new Node(2);
  node2.status = {
    battery: 47,
    parent: 1,
    flows: [{src_node: 2, dst_node: 0, octets: 167, packets: 2}]
  };

  var node3 = new Node(3);
  node3.lastUpdate = 150000;
  node3.status = {
    battery: 24,
    parent: 2,
    flows: [
      {src_node: 3, dst_node: 0, octets: 167, packets: 2},
      {src_node: 3, dst_node: 2, octets: 254, packets: 5}
    ]
  };

  var node4 = new Node(4);
  node4.status = {
    battery: 97,
    parent: 2,
    flows: [
      {src_node: 4, dst_node: 0, octets: 167, packets: 2},
      {src_node: 4, dst_node: 2, octets: 254, packets: 5},
      {src_node: 4, dst_node: 3, octets: 589, packets: 14}
    ]
  };

  var node5 = new Node(5);
  node5.status = {
    battery: 97,
    parent: 4,
    flows: [
      {src_node: 5, dst_node: 0, octets: 167, packets: 2},
      {src_node: 5, dst_node: 1, octets: 254, packets: 5},
      {src_node: 5, dst_node: 3, octets: 589, packets: 14}
    ]
  };

  NodesStatus.nodes = {
    1: node1,
    2: node2,
    3: node3,
    4: node4,
    5: node5
  };
}

module.exports = {fillData: fillData};
