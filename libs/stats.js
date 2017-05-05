const ipfixEnum = require('./ipfix-enum');

const infoElem = ipfixEnum.informationElements;

function Stats(){}

Stats.prototype.getTrafficVolume = function(data){
  if(data.length === 0){
    return [];
  }
  var volume = 0;
  for(var i in data){
    const ipfixObj = data[i].data;
    for(var j in ipfixObj.sets){
      const set = ipfixObj.sets[j];
      for(var k in set.data){
        const dataSet = set.data[k];
        for(var l in dataSet){
          const record = dataSet[l];
          if(record.id == infoElem.OCTET_DELTA_COUNT){
            volume = volume + record.value;
          }
        }
      }
    }
  }
  return [{volume: volume}];
};

module.exports = Stats;
