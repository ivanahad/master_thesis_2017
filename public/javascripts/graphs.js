function plotScatter(x, y, divId) {
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

function plotBar(x, y, divId){
  var trace = {
    type: 'bar',
    x: x,
    y: y,
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
