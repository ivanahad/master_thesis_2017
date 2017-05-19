const chai = require('chai');
const expect = chai.expect;
const Ipfix = require('../../libs/ipfix');

const ipfixJson = {
  version: 10,
  length: 28,
  exportTime: 596,
  seqNo: 15,
  domainId: 6,
  sets: [
    {
      id: 256,
      length: 12,
      data: [
        [
          {
            id: 32772,
            eid: 20613,
            value: 2
          },
          {
            id: 32773,
            eid: 20613,
            value: 80
          }
        ]
      ]
    }
  ]
};

describe('Ipfix class', function(){

  it('should create ipfix object from json', function(){
    const ipfix = new Ipfix(ipfixJson);
    expect(ipfix).to.exist;
    expect(ipfix.length).to.equal(28);
    expect(ipfix.exportTime).to.equal(596);
    expect(ipfix.seqNo).to.equal(15);
    expect(ipfix.domainId).to.equal(6);
  });

  it('should load records from json', function(){
    const ipfix = new Ipfix(ipfixJson);
    expect(ipfix.records).to.have.lengthOf(1);
    expect(ipfix.records[0].fields[0].id).to.equal(32772);
    expect(ipfix.records[0].fields[0].eid).to.equal(20613);
    expect(ipfix.records[0].fields[0].value).to.equal(2);
    expect(ipfix.records[0].fields[1].id).to.equal(32773);
    expect(ipfix.records[0].fields[1].eid).to.equal(20613);
    expect(ipfix.records[0].fields[1].value).to.equal(80);

  })
});
