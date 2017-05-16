class Node {
  constructor(id) {
    this.id = id;
    this.parent = null;
    this.lastMessages = [];
    this.lastUpdate = null;
    this.status = {};
  }

  getId(){
    return this.id;
  }

  setParent(parentId){
    this.parent = parentId;
  }

  getParent(){
    return this.parent;
  }

  addMessage(ipfixObj){
    const limit = 5;
    this.lastMessages.push(ipfixObj);
    if(this.lastMessages.length > 5){
      this.lastMessages.shift();
    }
    this.lastUpdate = Date.now() / 1000; // in seconds
  }

  getLastMessages(){
    return this.lastMessages;
  }

  getLastUpdate(){
    return this.lastUpdate;
  }

  updateStatus(name, value){
    this.status[name] = value;
  }

  getStatus(name){
    if(!(name in this.status)){
      return null;
    }
    return this.status[name];
  }

  getMultipleStatus(names){
    var values = {};
    for(var i in names){
      const name = names[i];
      values[name] = this.getStatus(name);
    }
    return values;
  }
}

module.exports = Node;
