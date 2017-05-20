const chai = require('chai');
const expect = chai.expect;
const InfoElem = require('../../libs/informationElements');
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
    },
    {
      id: 2,
      length: 2,
      templates: [
        {
          id: 256,
          count: 2,
          elements: [
            {
              id: 32772,
              eid: 20613,
              length: 2
            },
            {
              id: 32773,
              eid: 20613,
              length: 2
            }
          ]
        }
      ]
    }
  ]
};

describe('Ipfix constructor', function(){
  var ipfix;
  beforeEach(function(){
    ipfix = new Ipfix(ipfixJson);
  });

  it('should create ipfix object from json', function(){
    expect(ipfix).to.exist;
    expect(ipfix.length).to.equal(28);
    expect(ipfix.exportTime).to.equal(596);
    expect(ipfix.seqNo).to.equal(15);
    expect(ipfix.domainId).to.equal(6);
  });

  it('should load records from json', function(){
    expect(ipfix.records).to.have.lengthOf(1);
    expect(ipfix.records[0].fields[0].id).to.equal(32772);
    expect(ipfix.records[0].fields[0].eid).to.equal(20613);
    expect(ipfix.records[0].fields[0].value).to.equal(2);
    expect(ipfix.records[0].fields[1].id).to.equal(32773);
    expect(ipfix.records[0].fields[1].eid).to.equal(20613);
    expect(ipfix.records[0].fields[1].value).to.equal(80);

  });

  it('should load templates from json', function(){
    expect(ipfix.templates).to.have.lengthOf(1);
    expect(ipfix.templates[0].fields[0].id).to.equal(32772);
    expect(ipfix.templates[0].fields[0].eid).to.equal(20613);
    expect(ipfix.templates[0].fields[0].length).to.equal(2);
    expect(ipfix.templates[0].fields[1].id).to.equal(32773);
    expect(ipfix.templates[0].fields[1].eid).to.equal(20613);
    expect(ipfix.templates[0].fields[1].length).to.equal(2);

  });
});

describe('Ipfix values exctractions', function(){
  var ipfix;
  beforeEach(function(){
    ipfix = new Ipfix(ipfixJson);
  });

  it('should return all values corresponding to an information element', function(){
    var values = ipfix.getValues(InfoElem.PARENT);
    expect(values).to.have.lengthOf(1);
    expect(values).to.include({'parent': 2});
  });

  it('should return all values corresponding to multiple information elements', function(){
    var values = ipfix.getValues(InfoElem.PARENT, InfoElem.BATTERY);
    expect(values).to.have.lengthOf(1);
    expect(values).to.include({'parent': 2, 'battery': 80});
  });
});
