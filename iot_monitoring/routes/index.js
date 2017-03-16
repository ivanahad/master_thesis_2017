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

router.get('/test2', function(req, res, next) {
    res.render('network', {});
});

router.get('/test3', function(req, res, next) {
    res.render('courbe', {});
});


module.exports = router;
