const promise = require('bluebird');
const util = require('util');

const debuglog = util.debuglog('db');

const options = {
  promiseLib: promise
};

const pgp = require('pg-promise')(options);
const connectionString = 'postgres://postgres:postgres@localhost:5432/ipfix';
const db = pgp(connectionString);

module.exports = {
  logIpfix : logIpfix,
  getLatestMsg: getLatestMsg,
};

function logIpfix(ipfixObj){
  db.none('INSERT INTO logs(domain_id, export_time, seq_no, data) VALUES(${domainId}, to_timestamp(${exportTime}), ${seqNo}, ${this})', ipfixObj)
    .then(() => {
        debuglog("DB: Logged data");
    })
    .catch(error => {
        debuglog("DB: Problem when logging \n");
        console.error(error);
    });
}

function getLatestMsg(){
  const epochSeconds = (new Date()).getTime() * 1000;
  const hourInSeconds = 60*60;
  const limit = epochSeconds - hourInSeconds;
  db.any("SELECT * FROM logs WHERE export_time >= now() - interval '1 hour'")
    .then(data => {
      debuglog("DB: Fetched latest messages");
      return data;
    })
    .catch(error => {
      debuglog("DB: Problem when fetching latest messages");
      console.error(error);
      return null;
    });
}
