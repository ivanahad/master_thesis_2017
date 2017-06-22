const chai = require('chai');
const expect = chai.expect;
const Nodes = require('../../apps/nodes-status').instance;
const Ipfix = require('../../libs/ipfix');

const data1 = {
  version: 10,
  length: 28,
  exportTime: 0,
  seqNo: 1,
  domainId: 1,
  sets: [
    {
      id: 256,
      length: 12,
      data: [
        [
          {
            id: 32772,
            eid: 20763,
            value: 2
          },
          {
            id: 32773,
            eid: 20763,
            value: 80
          }
        ]
      ]
    }
  ]
};

const data2 = {
  version: 10,
  length: 28,
  exportTime: 0,
  seqNo: 1,
  domainId: 1,
  sets: [
    {
      id: 256,
      length: 12,
      data: [
        [
          {
            id: 32770,
            eid: 20763,
            value: 1
          },
          {
            id: 32771,
            eid: 20763,
            value: 4
          },
          {
            id: 1,
            eid: 0,
            value: 568
          },
          {
            id: 2,
            eid: 0,
            value: 4
          }
        ],
        [
          {
            id: 32770,
            eid: 20763,
            value: 1
          },
          {
            id: 32771,
            eid: 20763,
            value: 26
          },
          {
            id: 1,
            eid: 0,
            value: 875
          },
          {
            id: 2,
            eid: 0,
            value: 6
          }
        ]
      ]
    }
  ]
};

describe('Nodes status', function(){
  beforeEach(function(){
    Nodes.clean();
  });
  it('should return empty if no status', function(){
    expect(Nodes.getNodes()).to.be.empty;
  });
  it('should contain status of 1 node after feeding data', function(){
    Nodes.feedIpfix(new Ipfix(data1));
    expect(Nodes.getNodes()).to.have.keys('1');
  });
  it('should return the correct number of nodes', function(){
    expect(Nodes.getNumberNodes()).to.equal(0);
    Nodes.feedIpfix(new Ipfix(data1));
    expect(Nodes.getNumberNodes()).to.equal(1);
  });
  it('should return null when not finding specific node', function(){
    expect(Nodes.get(1)).to.be.null;
  });
  it('should not return null when finding specific node', function(){
    Nodes.feedIpfix(new Ipfix(data1));
    expect(Nodes.get(1)).to.not.be.null;
  });
  it('should be able to extract parent', function(){
    Nodes.feedIpfix(new Ipfix(data1));
    expect(Nodes.get(1).getStatus("parent")).to.equal(2);
  });
  it('should be able to extract battery', function(){
    Nodes.feedIpfix(new Ipfix(data1));
    expect(Nodes.get(1).getStatus("battery")).to.equal(80);
  });
  it('should be able to extract flows', function(){
    Nodes.feedIpfix(new Ipfix(data2));
    expect(Nodes.get(1).getStatus("flows")).to.have.lengthOf(2);
    const flow1 = Nodes.get(1).getStatus("flows")[0]
    const flow2 = Nodes.get(1).getStatus("flows")[1]
    expect(flow1).to.have.property("src_node", 1);
    expect(flow1).to.have.property("dst_node", 4);
    expect(flow1).to.have.property("octets", 568);
    expect(flow1).to.have.property("packets", 4);

    expect(flow2).to.have.property("src_node", 1);
    expect(flow2).to.have.property("dst_node", 26);
    expect(flow2).to.have.property("octets", 875);
    expect(flow2).to.have.property("packets", 6);

  });
});
