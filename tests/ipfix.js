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
    var ipfix_obj = ipfix.parse(ipfixHeader);
    expect(ipfix_obj.version).to.equal(10);
  });
  it('should parse correctly ipfix length', function(){
    var ipfix = new Ipfix();
    var ipfix_obj = ipfix.parse(ipfixHeader);
    expect(ipfix_obj.length).to.equal(16);
  });
  it('should parse correctly ipfix exportTime', function(){
    var ipfix = new Ipfix();
    var ipfix_obj = ipfix.parse(ipfixHeader);
    expect(ipfix_obj.exportTime).to.equal(45);
  });
  it('should parse correctly ipfix sequence number', function(){
    var ipfix = new Ipfix();
    var ipfix_obj = ipfix.parse(ipfixHeader);
    expect(ipfix_obj.seqNo).to.equal(1);
  });
  it('should parse correctly ipfix domain ID', function(){
    var ipfix = new Ipfix();
    var ipfix_obj = ipfix.parse(ipfixHeader);
    expect(ipfix_obj.domainId).to.equal(1);
  });
});

const ipfixTemplateMsg1 = Buffer.concat([
  createIpfixHeader(10, 28, 1052, 1, 1),
  createIpfixSetHeader(2, 12),
  createIpfixSetTemplate(256, 2),
  createIpfixInfoElem(1, 8),
  createIpfixInfoElem(2, 8)
], 32);

describe('Ipfix template sets parsing', function(){
  it('should parse correctly set header id', function(){
    var ipfix = new Ipfix();
    var ipfix_obj = ipfix.parse(ipfixTemplateMsg1);
    expect(ipfix_obj.sets[0].id).to.equal(2);
  });
  it('should parse correctly set header length', function(){
    var ipfix = new Ipfix();
    var ipfix_obj = ipfix.parse(ipfixTemplateMsg1);
    expect(ipfix_obj.sets[0].length).to.equal(12);
  });
  it('should parse correctly template set id', function(){
    var ipfix = new Ipfix();
    var ipfix_obj = ipfix.parse(ipfixTemplateMsg1);
    expect(ipfix_obj.sets[0].templates[0].id).to.equal(256);
  });
  it('should parse correctly template set fields count', function(){
    var ipfix = new Ipfix();
    var ipfix_obj = ipfix.parse(ipfixTemplateMsg1);
    expect(ipfix_obj.sets[0].templates[0].count).to.equal(2);
  });
  it('should parse correctly information elements', function(){
    var ipfix = new Ipfix();
    var ipfix_obj = ipfix.parse(ipfixTemplateMsg1);
    expect(ipfix_obj.sets[0].templates[0].elements).to.have.lengthOf(2);
    expect(ipfix_obj.sets[0].templates[0].elements[0].id).to.equal(1);
    expect(ipfix_obj.sets[0].templates[0].elements[0].length).to.equal(8);
    expect(ipfix_obj.sets[0].templates[0].elements[1].id).to.equal(2);
    expect(ipfix_obj.sets[0].templates[0].elements[1].length).to.equal(8);
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
