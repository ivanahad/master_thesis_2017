const chai = require('chai');
const expect = chai.expect;
const Ipfix = require('../libs/ipfix');

// Tests data
const ipfixHeader = createIpfixMessage(10, 16, 45, 1, 1);



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

function createIpfixMessage(version, length, exportTime, seqNo, domainId){
  var msg = Buffer.alloc(16);
  msg.writeUInt16BE(version, 0); // IPFIX version
  msg.writeUInt16BE(length, 2); // IPFIX length
  msg.writeUInt32BE(exportTime, 4); // IPFIX Export time
  msg.writeUInt32BE(seqNo, 8); // IPFIX sequence number
  msg.writeUInt32BE(domainId, 12); // IPFIX domain ID

  return msg;
}
