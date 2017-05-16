const chai = require('chai');
const expect = chai.expect;
const Node = require('../libs/node');

describe('Node class', function(){
  var node;
  beforeEach(function(){
    node = new Node(5);
  });

  it('should create a new object', function(){
    expect(node).to.exist;
    expect(node.getId()).to.equal(5);
  });

  it('should only keep 5 messages', function(){
    node.addMessage(1);
    node.addMessage(2);
    node.addMessage(3);
    node.addMessage(4);
    node.addMessage(5);
    node.addMessage(6);

    expect(node.getLastMessages()).to.have.lengthOf(5);
    expect(node.getLastMessages()).to.not.include(1);
  });

  it("should return null for no status value", function(){
    expect(node.getStatus("humidity")).to.be.null;
  });

  it('should update the status', function(){
    node.updateStatus("humidity", 25);
    node.updateStatus("humidity", 30);
    expect(node.getStatus("humidity")).to.equal(30);
  });

  it("should return multiple status", function(){
    node.updateStatus("humidity", 25);
    node.updateStatus("temperature", 14);
    node.updateStatus("battery", 85);
    const status = node.getMultipleStatus(["humidity", "temperature", "battery"]);
    expect(status).to.have.property("humidity", 25);
    expect(status).to.have.property("temperature", 14);
    expect(status).to.have.property("battery", 85);
  })
});
