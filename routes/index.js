var express = require('express');
var router = express.Router();
var db = require('../libs/queries');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {});
});

router.get('/topology', function(req, res, next) {
  res.render('topology', {});
});

router.get('/traffic_volume', function(req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  db.getLatestMsg();
  var data = [
    {date: new Date(2007, 3, 24), volume: 10},
    {date: new Date(2007, 3, 25), volume: 23},
    {date: new Date(2007, 3, 26), volume: 5},
    {date: new Date(2007, 3, 27), volume: 15},
    {date: new Date(2007, 3, 30), volume: 23},
    {date: new Date(2007, 4,  1), volume: 17}
  ];
  res.send(JSON.stringify(data));
});

router.get('/nodes_link', function(req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  var data = [
    {source: 1, destination: 2},
    {source: 1, destination: 3},
    {source: 2, destination: 4},
    {source: 3, destination: 4},
    {source: 4, destination: 5},
    {source: 5, destination: 6}
  ];
  res.send(JSON.stringify(data));
});

module.exports = router;
