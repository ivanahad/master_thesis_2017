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
        {ID : 1, parent : "none", battery : "52", volume : "1000"},
        {ID : "2", parent : "1", battery : "50", volume : "1000"},
        {ID : "3", parent : "1", battery : "49", volume : "1000"},
        {ID : "4", parent : "2", battery : "100", volume : "1000"},
        {ID : "5", parent : "2", battery : "30", volume : "1000"},
        {ID : "6", parent : "3", battery : "15", volume : "1000"},
        {ID : "7", parent : "3", battery : "15", volume : "1000"},
        {ID : "8", parent : "4", battery : "15", volume : "1000"},
        {ID : "9", parent : "4", battery : "15", volume : "1000"},
        {ID : "10", parent : "5", battery : "5", volume : "1000"},
        {ID : "11", parent : "5", battery : "15", volume : "1000"},
        {ID : "12", parent : "6", battery : "15", volume : "1000"},
        {ID : "13", parent : "6", battery : "15", volume : "1000"},
        {ID : "14", parent : "7", battery : "15", volume : "1000"},
        {ID : "15", parent : "7", battery : "15", volume : "1000"},
        {ID : "16", parent : "8", battery : "94", volume : "1000"},
        {ID : "17", parent : "8", battery : "34", volume : "1000"},
        {ID : "18", parent : "9", battery : "74", volume : "1000"},
        {ID : "19", parent : "9", battery : "85", volume : "1000"},
        {ID : "20", parent : "10", battery : "37", volume : "1000"},
        {ID : "21", parent : "10", battery : "54", volume : "1000"},
        {ID : "22", parent : "11", battery : "65", volume : "1000"},
        {ID : "23", parent : "11", battery : "90", volume : "1000"},
        {ID : "24", parent : "12", battery : "48", volume : "1000"},
        {ID : "25", parent : "12", battery : "36", volume : "1000"},
        {ID : "26", parent : "13", battery : "15", volume : "1000"},
        {ID : "27", parent : "13", battery : "50", volume : "1000"},
        {ID : "28", parent : "14", battery : "60", volume : "1000"},
        {ID : "29", parent : "14", battery : "15", volume : "1000"},
        {ID : "30", parent : "15", battery : "15", volume : "1000"},
        // {ID : "31", parent : "15", battery : "15", volume : "1000"},
        // {ID : "32", parent : "16", battery : "15", volume : "1000"},
        // {ID : "33", parent : "16", battery : "15", volume : "1000"},
        // {ID : "34", parent : "17", battery : "15", volume : "1000"},
        // {ID : "35", parent : "17", battery : "15", volume : "1000"},
        // {ID : "36", parent : "18", battery : "15", volume : "1000"},
        // {ID : "37", parent : "18", battery : "15", volume : "1000"},
        // {ID : "38", parent : "19", battery : "15", volume : "1000"},
        // {ID : "39", parent : "19", battery : "15", volume : "1000"},
        // {ID : "40", parent : "20", battery : "15", volume : "1000"},
        // {ID : "41", parent : "20", battery : "15", volume : "1000"},
        // {ID : "42", parent : "21", battery : "15", volume : "1000"},
        // {ID : "43", parent : "21", battery : "15", volume : "1000"},
        // {ID : "44", parent : "22", battery : "15", volume : "1000"},
        // {ID : "45", parent : "22", battery : "15", volume : "1000"},
        // {ID : "46", parent : "23", battery : "15", volume : "1000"},
        // {ID : "51", parent : "23", battery : "15", volume : "1000"},
        // {ID : "52", parent : "23", battery : "15", volume : "1000"},
        // {ID : "53", parent : "23", battery : "15", volume : "1000"},
        // {ID : "54", parent : "23", battery : "15", volume : "1000"},
        // {ID : "55", parent : "23", battery : "15", volume : "1000"},
        // {ID : "56", parent : "23", battery : "15", volume : "1000"},
        // {ID : "57", parent : "23", battery : "15", volume : "1000"},
        // {ID : "58", parent : "23", battery : "15", volume : "1000"},
        // {ID : "59", parent : "23", battery : "15", volume : "1000"},
        // {ID : "60", parent : "23", battery : "15", volume : "1000"},
        // {ID : "61", parent : "24", battery : "15", volume : "1000"},
        // {ID : "62", parent : "25", battery : "15", volume : "1000"},
        // {ID : "63", parent : "25", battery : "15", volume : "1000"},
        // {ID : "64", parent : "26", battery : "15", volume : "1000"},
        // {ID : "65", parent : "26", battery : "15", volume : "1000"},
        // {ID : "66", parent : "27", battery : "15", volume : "1000"},
        // {ID : "67", parent : "27", battery : "15", volume : "1000"},
        // {ID : "68", parent : "28", battery : "15", volume : "1000"},
        // {ID : "69", parent : "28", battery : "15", volume : "1000"},
        // {ID : "70", parent : "29", battery : "15", volume : "1000"},
        // {ID : "71", parent : "29", battery : "15", volume : "1000"},
        // {ID : "72", parent : "30", battery : "15", volume : "1000"},
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
