var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {});
});

router.get('/traffic_volume', function(req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  var value = Math.random() * 100;
  res.send(JSON.stringify({ volume: value }));
});

module.exports = router;
