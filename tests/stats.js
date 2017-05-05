const chai = require('chai');
const expect = chai.expect;
const Stats = require('../libs/stats');
const ipfixEnum = require('../libs/ipfix-enum');

const infoElements = ipfixEnum.informationElements;
const entrInfoElements = ipfixEnum.entrepriseInformationElements;

const element1 = {
  domain_id: 1,
  export_time: 0,
  seq_no: 1,
  data: {
    version: 10,
    length: 20,
    exportTime: 0,
    seqNo: 1,
    domainId: 1,
    sets: [
      {
        id: 256,
        length: 20,
        data: [
          [
            {
              id: entrInfoElements.SOURCE_NODE_ID,
              eid: 20613,
              value: 1
            },
            {
              id: entrInfoElements.DESTINATION_NODE_ID,
              eid: 20613,
              value: 2
            },
            {
              id: infoElements.OCTET_DELTA_COUNT,
              eid: 0,
              value: 200
            },
          ]
        ]
      }
    ]
  }
};

const element2 = {
  domain_id: 1,
  export_time: 0,
  seq_no: 1,
  data: {
    version: 10,
    length: 20,
    exportTime: 86500,
    seqNo: 1,
    domainId: 1,
    sets: [
      {
        id: 256,
        length: 20,
        data: [
          [
            {
              id: entrInfoElements.SOURCE_NODE_ID,
              eid: 20613,
              value: 1
            },
            {
              id: entrInfoElements.DESTINATION_NODE_ID,
              eid: 20613,
              value: 2
            },
            {
              id: infoElements.OCTET_DELTA_COUNT,
              eid: 0,
              value: 200
            },
          ],
          [
            {
              id: entrInfoElements.SOURCE_NODE_ID,
              eid: 20613,
              value: 1
            },
            {
              id: entrInfoElements.DESTINATION_NODE_ID,
              eid: 20613,
              value: 3
            },
            {
              id: infoElements.OCTET_DELTA_COUNT,
              eid: 0,
              value: 300
            },
          ]
        ]
      }
    ]
  }
};

describe('Total traffic volume computation', function(){
  it('should return empty array if no data', function(){
    var stats = new Stats();
    expect(stats.computeTrafficVolume([])).to.be.empty;
  });
  it('should extract correct traffic volume for one element', function(){
    var stats = new Stats();
    var volumes = stats.computeTrafficVolume([element1]);
    expect(volumes[0].volume).to.equal(200);
  });
  it('should aggregate traffic volumes for multiple records', function(){
    var stats = new Stats();
    var volumes = stats.computeTrafficVolume([element2]);
    expect(volumes[0].volume).to.equal(500);
  });
  it('should separate traffic volume by data', function(){
    var stats = new Stats();
    var volumes = stats.computeTrafficVolume([element1, element2]);
    console.log(volumes);
    expect(volumes).to.have.lengthOf(2);
  });
});
