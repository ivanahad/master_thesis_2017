function loadVolumes() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var data = JSON.parse(this.responseText);
            drawGraphs(data);
        }
    };
    xhttp.open("GET", "/volumes", true);
    xhttp.send();
}

function plotTraffic(x, y, divId) {
  var trace = {
    type: 'scatter',
    x: x,
    y: y,
    fill: 'tozeroy'
  };

  var layout = {
    xaxis: {
      showgrid: false
    },
    yaxis: {
      title: 'Bytes'
    }
  };

  Plotly.newPlot(divId, [trace], layout, {displaylogo: false});
}

function plotStats(x, y, divId){
  var trace = {
    type: 'bar',
    x: x,
    y: y,
    width: [0.5, 0.5, 0.5],
    marker: {color: 'rgb(26, 118, 255)'},
  };

  var layout = {
    xaxis: {
      showgrid: false
    },
    yaxis: {
      title: 'Bytes'
    }
  };

  Plotly.newPlot(divId, [trace], layout, {displayModeBar: false});
}

function drawGraphs(data){
  const minTime = Math.min.apply(null, data.map(function(x){ return x.exportTime; }));
  const maxTime = Math.max.apply(null, data.map(function(x){ return x.exportTime; }));
  var x = [];
  const INTERVAL = 300; // 5 minutes
  var startTime = Math.floor(minTime / INTERVAL) * INTERVAL;
  var limitTime = Math.ceil(maxTime / INTERVAL) * INTERVAL;

  for(var incrementedTime = startTime; incrementedTime < limitTime; incrementedTime += INTERVAL){
    x.push(new Date(incrementedTime * 1000));
  }

  var numberInterval = x.length;
  var y = Array(numberInterval).fill(0);
  for(var i in data){
    const volume = data[i];
    const index = Math.floor((volume.exportTime - startTime) / INTERVAL);
    y[index] += volume.octets;
  }

  plotTraffic(x, y, 'div_traffic');

  const max = Math.max.apply(null, y);
  const min = Math.min.apply(null, y);
  const sum = y.reduce(function(a, b){ return a + b;}, 0);
  const average = Math.floor(sum / y.length);
  const packets = data.reduce(function(a, b){ return a + b.packets;}, 0);

  plotStats(["average", "max", "min"], [average, max, min] , 'div_stat');
}

loadVolumes();
