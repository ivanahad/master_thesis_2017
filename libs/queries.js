const promise = require('bluebird');

const options = {
  // Initialization Options
  promiseLib: promise
};

const pgp = require('pg-promise')(options);
const connectionString = 'postgres://localhost:5432/ipfix';
const db = pgp(connectionString);

module.exports = {
  logIpfix : logIpfix
};

function logIpfix(ipfixObj){
  db.none('INSERT INTO log(domain_id, export_time, seq_no, data) VALUES(${domainId}, to_timestamp(${exportTime}), ${seqNo}, ${this}})', ipfixObj)
    .then(() => {
        console.log("Logged data");
    })
    .catch(error => {
        console.log("Problem when logging: \n" + ipfixObj);
    });
}
