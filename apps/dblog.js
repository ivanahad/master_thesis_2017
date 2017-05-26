const promise = require('bluebird');
const collectorEmitter = require('./collector').collectorEmitter;
const Ipfix = require('../libs/ipfix');
const InfoElem = require('../libs/informationElements');
const debuglog = require('util').debuglog('db');


const options = {
  promiseLib: promise
};

const pgp = require('pg-promise')(options);
const connectionString = 'postgres://postgres:postgres@localhost:5432/ipfix';
const db = pgp(connectionString);

logIpfix = function(ipfix){
  db.none('INSERT INTO logs(domain_id, export_time, seq_no, data) VALUES(${domainId}, to_timestamp(${exportTime}), ${seqNo}, ${this})', ipfix.json)
    .then(() => {
        debuglog("DB: Logged data");
    })
    .catch(error => {
        debuglog("DB: Problem when logging \n");
        console.error(error);
    });
};

getLogs = function(callback){
  db.any('SELECT * FROM logs')
    .then((data) => {
      debuglog("DB: Got data");
      var objects = data.map((row) => {
        return new Ipfix(row.data);
      });
      var volumes = objects.reduce((a, b) => {
        return a.concat(b.getValues(InfoElem.SOURCE_NODE_ID,
          InfoElem.DESTINATION_NODE_ID, InfoElem.OCTET_DELTA_COUNT, InfoElem.PACKET_DELTA_COUNT));
      }, []);
      callback(volumes);
    })
    .catch(error => {
      debuglog("DB: Problem when fetching logs \n");
      console.error(error);
    });
};

module.exports = {
  startLogging : function(){
    collectorEmitter.on('message', function(ipfix){
      logIpfix(ipfix);
    });
  },

  getLogs: getLogs
};
