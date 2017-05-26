var express = require('express');
var Log = require('../apps/dblog');
const InfoElem = require('../libs/informationElements');
const NodesStatus = require('../apps/nodes-status').instance;
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {});
});

router.get('/topology', function(req, res, next) {
  res.render('topology', {});
});

router.get('/network_traffic', function(req, res, next) {
  res.render('network_traffic');

});

router.get('/volumes', function(req, res, next){
  Log.getLogs((objects) => {
    var volumes = objects.reduce((a, b) => {
      return a.concat(b.getValues(InfoElem.SOURCE_NODE_ID,
        InfoElem.DESTINATION_NODE_ID, InfoElem.OCTET_DELTA_COUNT, InfoElem.PACKET_DELTA_COUNT));
    }, []);
    var ipfix = objects.reduce((a, b) => {
      a.push({
        exportTime: b.exportTime,
        length: b.length,
        domainId: b.domainId
      });
      return a;
    }, []);
    res.json({volumes: volumes, ipfix: ipfix});
  });
});

router.get('/nodes_data', function(req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var data = NodesStatus.getMultipleStatus([InfoElem.PARENT.name, InfoElem.BATTERY.name]);
    res.send(JSON.stringify(data));
});

router.get('/nodes_link', function(req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  var data = [
      {source: "ID1", target: "ID2"},
      {source: "ID1", target: "ID0"},
      {source: "ID3", target: "ID4"},
      {source: "ID10", target: "ID4"},
      {source: "ID5", target: "ID4"},
      {source: "ID0", target: "ID4"},
      {source: "ID7", target: "ID4"},
      {source: "ID4", target: "ID0"},
      {source: "ID3", target: "ID7"},
      {source: "ID6", target: "ID7"},
      {source: "RIM", target: "ID7"},
      {source: "ID7", target: "ID6"},
      {source: "ID4", target: "ID5"},
      {source: "ID9", target: "ID5"},
      {source: "ID4", target: "ID10"},
      {source: "ID1", target: "ID10"},
      {source: "ID10", target: "ID1"},
      {source: "ID12", target: "ID11"},
      {source: "ID14", target: "ID11"},
      {source: "ID7", target: "ID3"},
      {source: "ID4", target: "ID3"},
      {source: "ID7", target: "RIM"},
      {source: "ID5", target: "ID9"}
    // {source: 1, target: 2},
    // {source: 1, target: 3},
    // {source: 2, target: 4},
    // {source: 3, target: 4},
    // {source: 4, target: 5},
    // {source: 4, target: 2}
  ];
  res.send(JSON.stringify(data));
});

module.exports = router;
