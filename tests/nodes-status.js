const chai = require('chai');
const expect = chai.expect;
const nodes = require('../libs/nodes-status');
const ipfixEnum = require('../libs/ipfix-enum');

const infoElements = ipfixEnum.informationElements;
const entrInfoElements = ipfixEnum.entrepriseInformationElements;


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
            id: entrInfoElements.PARENT,
            eid: 20613,
            value: 2
          },
          {
            id: entrInfoElements.BATTERY,
            eid: 20613,
            value: 80
          }
        ]
      ]
    }
  ]
};

describe('Nodes status', function(){
  beforeEach(function(){
    nodes.clean();
  });
  it('should return empty if no status', function(){
    expect(nodes.getAll()).to.be.empty;
  });
  it('should contain status of 1 node after feeding data', function(){
    nodes.feedData(data1);
    expect(nodes.getAll()).to.have.keys('1');
  });
  it('should return null when not finding specific node', function(){
    expect(nodes.get(1)).to.be.null;
  });
  it('should not return null when finding specific node', function(){
    nodes.feedData(data1);
    expect(nodes.get(1)).to.not.be.null;
  });
  it('should be able to extract parent', function(){
    nodes.feedData(data1);
    expect(nodes.get(1).parent).to.equal(2);
  });
  it('should be able to extract battery', function(){
    nodes.feedData(data1);
    expect(nodes.get(1).battery).to.equal(80);
  });
});
