var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {});
});

router.get('/topology', function(req, res, next) {
  res.render('topology', {});
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
