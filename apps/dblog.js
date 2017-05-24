const promise = require('bluebird');
const collectorEmitter = require('./collector').collectorEmitter;
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

module.exports = {
  startLogging : function(){
    collectorEmitter.on('message', function(ipfix){
      logIpfix(ipfix);
    });
  }
};
