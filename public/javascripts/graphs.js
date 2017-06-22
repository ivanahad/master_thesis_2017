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

function addResizeProp(div) {
  window.addEventListener("resize", function() {
    Plotly.Plots.resize(div);
  });
}

function plotTraffic(x, y, z, divId) {
  const div = document.getElementById(divId);
  var traceAll = {
    type: 'scatter',
    x: x,
    y: y,
    name: "Other",
    fill: 'tozeroy'
  };

  var traceIpfix = {
    type: 'scatter',
    x: x,
    y: z,
    name: "Ipfix",
  };


  var layout = {
    height: 0.9 * div.clientHeight,
    xaxis: {
      showgrid: false
    },
    yaxis: {
      title: 'Bytes'
    }
  };

  Plotly.newPlot(divId, [traceAll, traceIpfix], layout, {
    displaylogo: false
  });

  addResizeProp(div);
}

function plotStats(x, y, divId) {
  const div = document.getElementById(divId);
  var trace = {
    type: 'bar',
    x: x,
    y: y,
    width: [0.5, 0.5, 0.5],
    marker: {
      color: 'rgb(26, 118, 255)'
    },
  };

  var layout = {
    height: 0.9 * div.clientHeight,
    xaxis: {
      showgrid: false
    },
    yaxis: {
      title: 'Bytes'
    },
    title: "without ipfix"
  };

  Plotly.newPlot(divId, [trace], layout, {
    displayModeBar: false
  });

  addResizeProp(div);
}

function plotReparition(labels, values, divId){
  const div = document.getElementById(divId);
  var data = [{
    values: values,
    labels: labels,
    type: 'pie'
  }];

  var layout = {
    height: 0.9 * div.clientHeight
  };

  Plotly.newPlot(divId, data, layout, {staticPlot: true});
  addResizeProp(div);
}

function getTopSenders(data){
  var senders = {};
  for(let i in data.ipfix){
    const volumeIpfix = data.ipfix[i];
    if(!(volumeIpfix.domainId in senders)){
      senders[volumeIpfix.domainId] = 0;
    }
    senders[volumeIpfix.domainId] -= volumeIpfix.length;
  }
  for(let i in data.volumes){
    const volume = data.volumes[i];
    if(!(volume.src_node in senders)){
      senders[volume.src_node] = 0;
    }
    senders[volume.src_node] += volume.octets;
  }

  var topSenders = Object.keys(senders).sort((a, b) => {
    return senders[b] - senders[a];
  })
  .slice(0, 5)
  .map((a) => {
    return {id: a, volume: senders[a]};
  });

  return topSenders;
}

function getTopReceivers(data){
  var receivers = {};
  for(let i in data.volumes){
    const volume = data.volumes[i];
    if(!(volume.dst_node in receivers)){
      receivers[volume.dst_node] = 0;
    }
    receivers[volume.dst_node] += volume.octets;
  }

  var topReceivers = Object.keys(receivers).sort((a, b) => {
    return receivers[b] - receivers[a];
  })
  .slice(0, 5)
  .map((a) => {
    return {id: a, volume: receivers[a]};
  });

  return topReceivers;
}

function drawGraphs(data) {
  const INTERVAL = 300; // 5 minutes
  const minTime = Math.min.apply(null, data.volumes.map(function(x) {
    return x.exportTime;
  }));
  const maxTime = Math.max.apply(null, data.volumes.map(function(x) {
    return x.exportTime;
  }));
  const startTime = Math.floor(minTime / INTERVAL) * INTERVAL;
  const limitTime = Math.ceil(maxTime / INTERVAL) * INTERVAL;

  var x = [];
  for (let incrementedTime = startTime; incrementedTime < limitTime; incrementedTime += INTERVAL) {
    x.push(new Date(incrementedTime * 1000));
  }

  var z = Array(x.length).fill(0);
  for(let i in data.ipfix) {
    const volumeIpfix = data.ipfix[i];
    const index = Math.floor((volumeIpfix.exportTime - startTime) / INTERVAL);
    z[index] += volumeIpfix.length;
  }

  var y = z.map(function(x){ return -x;});
  for (let i in data.volumes) {
    const volume = data.volumes[i];
    const index = Math.floor((volume.exportTime - startTime) / INTERVAL);
    y[index] += volume.octets;
  }

  plotTraffic(x, y, z, 'div_traffic');

  const max = Math.max.apply(null, y);
  const min = Math.min.apply(null, y);
  const sum = y.reduce(function(a, b) {
    return a + b;
  }, 0);
  const average = Math.floor(sum / y.length);
  const packets = data.volumes.reduce(function(a, b) {
    return a + b.packets;
  }, 0);
  const sumIpfix = data.ipfix.reduce(function(a, b) {
    return a + b.length;
  }, 0);

  plotStats(["average", "max", "min"], [average, max, min], 'div_stat');


  const totalBroadcast = data.volumes
    .filter(function(x){ return x.dst_node == 26;})
    .reduce(function(a, b){ return a + b.octets;}, 0);

  plotReparition(["ipfix", "broadcast", "unicast"], [sumIpfix, totalBroadcast, sum - sumIpfix - totalBroadcast], "div_repartition");



  document.getElementById('summary_total').innerHTML = sum + " Bytes";
  document.getElementById('summary_packets').innerHTML = packets;
  document.getElementById("summary_average_packet_size").innerHTML = Math.floor(sum / packets) + " Bytes";

  document.getElementById("summary_ipfix_total").innerHTML = sumIpfix + " Bytes";
  document.getElementById("summary_ipfix_packets").innerHTML = data.ipfix.length;
  document.getElementById("summary_ipfix_average_packet_size").innerHTML = Math.floor(sumIpfix / data.ipfix.length) + " Bytes";

  document.getElementById("summary_other_total").innerHTML = (sum - sumIpfix) + " Bytes";
  document.getElementById("summary_other_packets").innerHTML = (packets - data.ipfix.length);
  document.getElementById("summary_other_average_packet_size").innerHTML = Math.floor((sum - sumIpfix) / (packets - data.ipfix.length)) + " Bytes";

  const topSenders = getTopSenders(data);
  const topReceivers = getTopReceivers(data);

  const tableSender = document.getElementById('table_sender');
  for(let i in topSenders){
    const row = tableSender.insertRow(-1);
    row.insertCell(0).innerHTML = topSenders[i].id;
    row.insertCell(1).innerHTML = topSenders[i].volume;
  }

  const tableReceiver = document.getElementById('table_receiver');
  for(let i in topReceivers){
    const row = tableReceiver.insertRow(-1);
    var id = topReceivers[i].id;
    if(id == "26"){
      id = "broadcast";
    }
    row.insertCell(0).innerHTML = id;
    row.insertCell(1).innerHTML = topReceivers[i].volume;
  }
}

loadVolumes();
