var express = require('express');
var Log = require('../apps/dblog');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {});
});

router.get('/topology', function(req, res, next) {
  res.render('topology', {});
});

router.get('/network_traffic', function(req, res, next) {
  Log.getLogs((volumes) => {
    res.render('network_traffic', {data: JSON.stringify(volumes)});
  });
});


router.get('/nodes_data', function(req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var data = [
        {ID : "1", parent : "5", battery : "52"},
        {ID : "2", parent : "5", battery : "50"},
        {ID : "3", parent : "6", battery : "49"},
        {ID : "4", parent : "6", battery : "100"},
        {ID : "5", parent : "7", battery : "30"},
        {ID : "6", parent : "7", battery : "15"},
        {ID : "7", parent : "none", battery : "5"}
    ];
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
