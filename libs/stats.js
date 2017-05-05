const ipfixEnum = require('./ipfix-enum');

const infoElem = ipfixEnum.informationElements;
const hourInSeconds = 3600;

function Stats(){}

Stats.prototype.computeTrafficVolume = function(data){
  if(data.length === 0){
    return [];
  }
  var volumes = {};
  for(var i in data){
    const ipfixObj = data[i].data;
    for(var j in ipfixObj.sets){
      const set = ipfixObj.sets[j];
      for(var k in set.data){
        const dataSet = set.data[k];
        for(var l in dataSet){
          const record = dataSet[l];
          if(record.id == infoElem.OCTET_DELTA_COUNT){
            if(!(convertTime(ipfixObj.exportTime) in volumes)){
              volumes[convertTime(ipfixObj.exportTime)] = 0;
            }
            volumes[convertTime(ipfixObj.exportTime)] = volumes[convertTime(ipfixObj.exportTime)] + record.value;
          }
        }
      }
    }
  }
  var result = [];
  for(var key in volumes){
  result.push({time: key, volume: volumes[key]});
  }
  return result;
};

function convertTime(t){
  return t - (t % hourInSeconds);
}

module.exports = Stats;
