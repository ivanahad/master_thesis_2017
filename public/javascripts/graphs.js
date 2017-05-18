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
      title: 'Mb'
    }
  };

  Plotly.newPlot(divId, [trace], layout, {displaylogo: false});
}
