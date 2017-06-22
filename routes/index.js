var express = require('express');
var Log = require('../apps/dblog');
const InfoElem = require('../libs/informationElements');
const NodesStatus = require('../apps/nodes-status').instance;
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  Log.getLogs((objects) => {
    const volumes = objects.reduce((a, b) => {
      return a.concat(b.getValues(InfoElem.SOURCE_NODE_ID,
        InfoElem.DESTINATION_NODE_ID, InfoElem.OCTET_DELTA_COUNT, InfoElem.PACKET_DELTA_COUNT));
    }, []);
    const totalVolume = volumes.reduce((a, b) => {
      return a + b.octets;
    }, 0);
    const packets = volumes.reduce((a,b) => {
      return a + b.packets;
    }, 0);
    const numberNodes = NodesStatus.getNumberNodes();
    res.render('index', {numberNodes: numberNodes, volume: totalVolume, packets: packets});
  });
});

router.get('/topology', function(req, res, next) {
  res.render('topology');
});

router.get('/network_traffic', function(req, res, next) {
  res.render('network_traffic');

});

router.get('/node/:nodeId', function(req, res, next) {
  res.render('node');
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

router.get('/node_status/:nodeId', function(req, res, next) {
  const nodeId = req.params.nodeId;
  const node = NodesStatus.get(nodeId);
  if(node === null){
    res.json({});
  }
  console.log(node.lastMessages);
  const result = {
    id: node.id,
    lastUpdate: node.lastUpdate,
    lastMessages: node.lastMessages.map((a) => {return a.json;}),
    status: node.status
  };
  res.json(result);
});

router.get('/nodes_data', function(req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var data = NodesStatus.getMultipleStatus([InfoElem.PARENT.name, InfoElem.BATTERY.name, "flows"]);

    res.send(JSON.stringify(data));
});

module.exports = router;
