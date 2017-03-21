var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/coucou', function(req, res, next) {
    res.render('map', {});
});

router.get('/salut', function(req, res, next) {
    res.render('directed', {});
});

router.get('/test1', function(req, res, next) {
    res.render('chart', {});
});


router.get('/data', function(req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  var value = Math.random() * 100;
  res.send(JSON.stringify({ a: value }));
});

module.exports = router;
