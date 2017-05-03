const chai = require('chai');
const expect = chai.expect;
const Ipfix = require('../libs/ipfix');

// Tests data
const ipfixHeader = createIpfixHeader(10, 16, 45, 1, 1);

describe('Ipfix header parsing', function(){
  it('should return null if no data is passed', function(){
    var ipfix = new Ipfix();
    expect(ipfix.parse()).to.be.null;
  });
  it('should return null if message length less than 16 bytes', function(){
    var ipfix = new Ipfix();
    var msg = Buffer.alloc(10);
    expect(ipfix.parse(msg)).to.be.null;
  });
  it('should parse correctly ipfix version', function(){
    var ipfix = new Ipfix();
    var ipfixObj = ipfix.parse(ipfixHeader);
    expect(ipfixObj.version).to.equal(10);
  });
  it('should parse correctly ipfix length', function(){
    var ipfix = new Ipfix();
    var ipfixObj = ipfix.parse(ipfixHeader);
    expect(ipfixObj.length).to.equal(16);
  });
  it('should parse correctly ipfix exportTime', function(){
    var ipfix = new Ipfix();
    var ipfixObj = ipfix.parse(ipfixHeader);
    expect(ipfixObj.exportTime).to.equal(45);
  });
  it('should parse correctly ipfix sequence number', function(){
    var ipfix = new Ipfix();
    var ipfixObj = ipfix.parse(ipfixHeader);
    expect(ipfixObj.seqNo).to.equal(1);
  });
  it('should parse correctly ipfix domain ID', function(){
    var ipfix = new Ipfix();
    var ipfixObj = ipfix.parse(ipfixHeader);
    expect(ipfixObj.domainId).to.equal(1);
  });
});

const ipfixTemplateMsg1 = Buffer.concat([
  createIpfixHeader(10, 32, 1052, 1, 1),
  createIpfixSetHeader(2, 16),
  createIpfixSetTemplate(256, 2),
  createIpfixInfoElem(1, 8),
  createIpfixInfoElem(2, 5),
], 32);

const ipfixTemplateMsg2 = Buffer.concat([
  createIpfixHeader(10, 36, 1052, 1, 1),
  createIpfixSetHeader(2, 20),
  createIpfixSetTemplate(256, 2),
  createIpfixInfoElem(1, 8),
  createIpfixInfoElem(32780, 5, 45),
], 36);

describe('Ipfix template sets parsing', function(){
  it('should parse correctly set header id', function(){
    var ipfix = new Ipfix();
    var ipfixObj = ipfix.parse(ipfixTemplateMsg1);
    expect(ipfixObj.sets[0].id).to.equal(2);
  });
  it('should parse correctly set header length', function(){
    var ipfix = new Ipfix();
    var ipfixObj = ipfix.parse(ipfixTemplateMsg1);
    expect(ipfixObj.sets[0].length).to.equal(16);
  });
  it('should parse correctly template set id', function(){
    var ipfix = new Ipfix();
    var ipfixObj = ipfix.parse(ipfixTemplateMsg1);
    expect(ipfixObj.sets[0].templates[0].id).to.equal(256);
  });
  it('should parse correctly template set fields count', function(){
    var ipfix = new Ipfix();
    var ipfixObj = ipfix.parse(ipfixTemplateMsg1);
    expect(ipfixObj.sets[0].templates[0].count).to.equal(2);
  });
  it('should parse correctly information elements', function(){
    var ipfix = new Ipfix();
    var ipfixObj = ipfix.parse(ipfixTemplateMsg1);
    expect(ipfixObj.sets[0].templates[0].elements).to.have.lengthOf(2);
    expect(ipfixObj.sets[0].templates[0].elements[0].id).to.equal(1);
    expect(ipfixObj.sets[0].templates[0].elements[0].length).to.equal(8);
    expect(ipfixObj.sets[0].templates[0].elements[1].id).to.equal(2);
    expect(ipfixObj.sets[0].templates[0].elements[1].length).to.equal(5);
  });
  it('should retrieve the template', function(){
    var ipfix = new Ipfix();
    ipfix.parse(ipfixTemplateMsg1);
    expect(ipfix.getTemplate(1, 256)).to.be.not.null;
  });
  it('should return null when not finding template', function(){
    var ipfix = new Ipfix();
    ipfix.parse(ipfixTemplateMsg1);
    expect(ipfix.getTemplate(1, 257)).to.be.null;
  });
  it('should retrieve the eid', function(){
    var ipfix = new Ipfix();
    var ipfixObj = ipfix.parse(ipfixTemplateMsg2);
    expect(ipfixObj.sets[0].templates[0].elements[1].id).to.equal(32780);
    expect(ipfixObj.sets[0].templates[0].elements[1].eid).to.equal(45);
    expect(ipfixObj.sets[0].templates[0].elements[1].length).to.equal(5);
  });
});

const ipfixTemplateMsg3 = Buffer.concat([
  createIpfixHeader(10, 52, 1052, 1, 1),
  createIpfixSetHeader(2, 16),
  createIpfixSetTemplate(256, 2),
  createIpfixInfoElem(1, 4),
  createIpfixInfoElem(2, 4),
  createIpfixSetHeader(256, 20),
  createIpfixRecord(5, 4),
  createIpfixRecord(9, 4),
  createIpfixRecord(459, 4),
  createIpfixRecord(3654, 4)
], 52);

describe('Ipfix data sets parsing', function(){
  it('should parse correctly set header id', function(){
    var ipfix = new Ipfix();
    var ipfixObj = ipfix.parse(ipfixTemplateMsg3);
    expect(ipfixObj.sets[1].id).to.equal(256);
  });
  it('should parse correctly set header length', function(){
    var ipfix = new Ipfix();
    var ipfixObj = ipfix.parse(ipfixTemplateMsg3);
    expect(ipfixObj.sets[1].length).to.equal(20);
  });
  it('should parse correctly records', function(){
    var ipfix = new Ipfix();
    var ipfixObj = ipfix.parse(ipfixTemplateMsg3);
    expect(ipfixObj.sets[1].data).to.have.lengthOf(2);
  });
});


function createIpfixHeader(version, length, exportTime, seqNo, domainId){
  var msg = Buffer.alloc(16);
  msg.writeUInt16BE(version, 0); // IPFIX version
  msg.writeUInt16BE(length, 2); // IPFIX length
  msg.writeUInt32BE(exportTime, 4); // IPFIX Export time
  msg.writeUInt32BE(seqNo, 8); // IPFIX sequence number
  msg.writeUInt32BE(domainId, 12); // IPFIX domain ID
  return msg;
}

function createIpfixSetHeader(id, length){
  var msg = Buffer.alloc(4);
  msg.writeUInt16BE(id, 0);
  msg.writeUInt16BE(length, 2);

  return msg;
}

function createIpfixSetTemplate(id, fieldCount){
  return createIpfixSetHeader(id, fieldCount);
}

function createIpfixInfoElem(id, length, eid){
  var msg = Buffer.alloc(4);
  if(eid !== undefined){
    msg = Buffer.alloc(8);
  }
  msg.writeUInt16BE(id, 0);
  msg.writeUInt16BE(length, 2);
  if(eid !== undefined){
    msg.writeUInt32BE(eid, 4);
  }
  return msg;
}

function createIpfixRecord(value, length){
  var msg = Buffer.alloc(length);
  msg.writeUIntBE(value, 0, length);
  return msg;
}
