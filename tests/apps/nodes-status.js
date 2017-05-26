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
  it('should return null when not finding specific node', function(){
    expect(Nodes.get(1)).to.be.null;
  });
  it('should not return null when finding specific node', function(){
    Nodes.feedIpfix(new Ipfix(data1));
    expect(Nodes.get(1)).to.not.be.null;
  });
  it('should be able to extract parent', function(){
    Nodes.feedIpfix(new Ipfix(data1));
    expect(Nodes.get(1).getParent()).to.equal(2);
  });
  it('should be able to extract battery', function(){
    Nodes.feedIpfix(new Ipfix(data1));
    expect(Nodes.get(1).getStatus("battery")).to.equal(80);
  });
});
