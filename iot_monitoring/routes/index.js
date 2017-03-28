var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {});
});

router.get('/topology', function(req, res, next) {
  res.render('topology', {});
});

router.get('/traffic_volume', function(req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  var data = [
    {date: new Date(2007, 3, 24), volume: 10},
    {date: new Date(2007, 3, 25), volume: 23},
    {date: new Date(2007, 3, 26), volume: 5},
    {date: new Date(2007, 3, 27), volume: 15},
    {date: new Date(2007, 3, 30), volume: 23},
    {date: new Date(2007, 4,  1), volume: 17},
  ];
  res.send(JSON.stringify(data));
});

module.exports = router;
