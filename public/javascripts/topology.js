var svg = d3.select("svg"),
  margin = {
    top: 5,
    right: 100,
    bottom: 5,
    left: 5
  },
  width = +svg.attr("width") - margin.left - margin.right,
  height = +svg.attr("height") - margin.top - margin.bottom,
  g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");


var links = [];
var nodes = [];
var rootnode;

function parseNodes(data) {
  const routingTraffic = computeRoutingTraffic(data);
  data.forEach(function(d) {
    d.lastUpdate = d.lastUpdate ? (new Date(d.lastUpdate * 1000)).toLocaleString() : null;
    d.routing = routingTraffic.nodes[d.id] ? routingTraffic.nodes[d.id] : {
      octets: 0,
      packets: 0
    };
    nodes[d.id] = d;

    const total = d.flows.reduce(function(acc, value) {
      acc.octets += value.octets;
      acc.packets += value.packets;
      return acc;
    }, {
      octets: 0,
      packets: 0
    });
    d.total = total;

    if (d.parent) {
      links.push({
        source: d.id,
        target: d.parent
      });
    } else {
      rootnode = nodes[d.id];
    }

  });

  links.forEach(function(link) {
    if (link.source in routingTraffic.links && link.target in routingTraffic.links[link.source]) {
      link.traffic = routingTraffic.links[link.source][link.target];
    } else {
      link.traffic = {
        octets: 0,
        packets: 0
      };
    }
    link.source = nodes[link.source] || (nodes[link.source] = {
      name: link.source
    });
    link.target = nodes[link.target] || (nodes[link.target] = {
      name: link.target
    });
  });
}


function tick() {
  link
    .attr("x1", function(d) {
      return d.source.x;
    })
    .attr("y1", function(d) {
      return d.source.y;
    })
    .attr("x2", function(d) {
      return d.target.x;
    })
    .attr("y2", function(d) {
      return d.target.y;
    });

  node
    .attr("transform", function(d) {
      return "translate(" + d.x + "," + d.y + ")";
    });
}

var selectednodeid = null;
// action to take on mouse click
function click(node) {
  var currentnodeid = node.id;
  var batt = parseInt(node.battery);

  if (selectednodeid === null) { //node gets bigger
    selectednodeid = currentnodeid;
    d3.select(this).select("text").transition()
      .duration(750)
      .attr("x", 40)
      .style("fill", "steelblue")
      .style("stroke", "lightsteelblue")
      .style("stroke-width", ".5px")
      .style("font", "20px sans-serif");
    d3.select(this).select("circle").transition()
      .duration(750)
      .attr("r", 30)
      .style("fill", "lightsteelblue");
    updateNode(node);
  } else if (selectednodeid == currentnodeid) {
    d3.select(this).select("circle").transition()
      .duration(750)
      .attr("r", function(d) {
        const size = 8 + Math.floor((d.total.octets + d.routing.octets) / 200);
        return size <= 20 ? size : 20;
      })
      .style("fill", function(d) {
        if (!d.parent) {
          return "#26b6cc";
        } else if (d.battery <= 20) {
          return "red";
        } else if (d.battery <= 50) {
          return "yellow";
        } else {
          return "#31cc18";
        }
      });
    d3.select(this).select("text").transition()
      .duration(750)
      .attr("x", function(d) {
        return d.parent ? 12 : 15;
      })
      .style("stroke", "none")
      .style("fill", "black")
      .style("stroke", "none")
      .style("font", "14px sans-serif");
    removeNode();
    selectednodeid = null;
  }
}


function updateNode(node) {
  $("#currentID").html(node.id);
  $("#parent").html(node.parent);
  $("#battery").html(node.battery);
  $("#lastsent").html(node.lastUpdate);

  const tableFlows = document.getElementById('table_flows');
  for (let i in node.flows) {
    const row = tableFlows.insertRow(-1);
    row.insertCell(0).innerHTML = node.flows[i].dst_node === 0 ? "broadcast" : node.flows[i].dst_node;
    row.insertCell(1).innerHTML = node.flows[i].octets;
    row.insertCell(2).innerHTML = node.flows[i].packets;
  }

  $("#total_node").html(node.total.octets.toString() + " bytes ( " + node.total.packets + ")");
  $("#total_node_routed").html(node.routing.octets.toString() + " bytes ( " + node.routing.packets + ")");
}

function removeNode() {
  $("#currentID").html("-");
  $("#parent").html("-");
  $("#battery").html("-");
  $("#lastsent").html("-");

  const tableFlows = document.getElementById('table_flows');
  const tableLength = tableFlows.rows.length;
  for (let i = 1; i < tableLength; i++) {
    tableFlows.deleteRow(1);
  }

  $("#total_node").html("-");
  $("#total_node_routed").html("-");
}

var link;
var node;

var tooltip = d3.select("body")
  .append("div")
  .style("position", "absolute")
  .style("z-index", "10")
  .style("visibility", "hidden");

var drawTopology = function() {
  var force = d3.layout.force()
    .nodes(d3.values(nodes))
    .links(links)
    .size([width, height])
    .distance(70)
    .charge(-300)
    .on("tick", tick)
    .start();

  link = svg.selectAll(".link")
    .data(force.links())
    .enter().append("line")
    .attr("class", "link")
    .style("stroke-width", function(link) {
      const width = 1 + Math.floor(link.traffic.octets / 200);
      return width <= 10 ? width : 10;
    })
    .on("mouseover", function(link) {
      return tooltip.style("visibility", "visible").text(link.traffic.octets + " bytes - " + link.traffic.packets + " packets");
    })
    .on("mousemove", function() {
      return tooltip.style("top", (event.pageY - 10) + "px").style("left", (event.pageX + 10) + "px");
    })
    .on("mouseout", function() {
      return tooltip.style("visibility", "hidden");
    });

  node = svg.selectAll(".node")
    .data(force.nodes())
    .enter().append("g")
    .attr("class", "node")
    .on("click", click)
    .call(force.drag);

  node.append("circle")
    .attr("r", function(d) {
      const size = 8 + Math.floor((d.total.octets + d.routing.octets) / 200);
      return size <= 20 ? size : 20;
    })
    .style("fill", function(d) {
      if (!d.parent) {
        return "#26b6cc";
      } else if (d.battery <= 20) {
        return "red";
      } else if (d.battery <= 50) {
        return "yellow";
      } else {
        return "#31cc18";
      }
    });

  node.append("text")
    .attr("x", function(d) {
      return d.parent ? 12 : 15;
    })
    .attr("dy", ".35em")
    .text(function(d) {
      return d.id;
    });
};

function computeMinBattery(data) {
  return data.reduce(function(minBattery, n) {
    return n.battery !== null && minBattery > n.battery ? n.battery : minBattery;
  }, 100);
}

function computeMaxBattery(data) {
  return data.reduce(function(maxBattery, n) {
    return n.battery !== null && maxBattery < n.battery ? n.battery : maxBattery;
  }, 0);
}

function computeAverageBattery(data) {
  var sumBattery = 0;
  var numberNodes = 0;
  for (let i = 0; i < data.length; i++) {
    if (data[i].battery === null) {
      continue;
    }
    sumBattery += data[i].battery;
    numberNodes++;
  }
  return numberNodes !== 0 ? sumBattery / numberNodes : 0;
}

function computeDepth(data) {
  var parents = data.reduce(function(acc, value) {
    acc[value.id] = value.parent;
    return acc;
  }, {});
  depths = {};
  for (let i = 0; i < data.length; i++) {
    let currentNodeId = data[i].id;
    let currentDepth = 0;
    if (currentNodeId in depths) {
      continue;
    }
    let currentParent = currentNodeId;
    while (parents[currentParent] !== null) {
      if (currentParent in depths) {
        currentDepth = 1 + depths[currentParent];
        break;
      }
      currentDepth++;
      currentParent = parents[currentParent];
    }
    depths[currentNodeId] = currentDepth;
  }
  return depths;
}

function computePath(src, dst, parents) {
  const srcToGateway = computePathToGateway(src, parents);
  const dstToGateway = computePathToGateway(dst, parents);

  if (dstToGateway.includes(src)) { // dst is a child of scr
    const index = dstToGateway.indexOf(src);
    return dstToGateway.slice(0, index + 1).reverse();
  } else if (srcToGateway.includes(dst)) { // src is a child of dst
    const index = srcToGateway.indexOf(dst);
    return srcToGateway.slice(0, index + 1);
  }
  const indexSrc = srcToGateway.findIndex(function(element) {
    return dstToGateway.includes(element);
  });
  const indexDst = dstToGateway.indexOf(srcToGateway[indexSrc]);
  return srcToGateway.slice(0, indexSrc + 1).concat(dstToGateway.slice(0, indexDst).reverse());
}

function computePathToGateway(src, parents) {
  const path = [src];
  var currentNode = parents[src];
  while (currentNode !== null) {
    path.push(currentNode);
    currentNode = parents[currentNode];
  }
  return path;
}

function computeRoutingTraffic(data) {
  const parents = data.reduce(function(acc, value) {
    acc[value.id] = value.parent;
    return acc;
  }, {});

  var routing = {};
  var nodesRoutingTraffic = {};
  var linksRouting = {};

  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[i].flows.length; j++) {
      const flow = data[i].flows[j];
      if (flow.src_node === 0 || flow.dst_node === 0) {
        continue;
      }
      if (!(flow.src_node in routing && flow.dst_node in routing[flow.src_node])) {
        const path = computePath(flow.src_node, flow.dst_node, parents);
        if (!(flow.src_node in routing)) {
          routing[flow.src_node] = {};
        }
        if (!(flow.dst_node in routing)) {
          routing[flow.dst_node] = {};
        }
        routing[flow.src_node][flow.dst_node] = path;
        routing[flow.dst_node][flow.src_node] = path.reverse();
      }

      const routingPath = routing[flow.src_node][flow.dst_node];
      for (let k = 1; k < routingPath.length - 1; k++) {
        const nodeId = routingPath[k];
        if (!(nodeId in nodesRoutingTraffic)) {
          nodesRoutingTraffic[nodeId] = {
            octets: 0,
            packets: 0
          };
        }
        nodesRoutingTraffic[nodeId].octets += flow.octets;
        nodesRoutingTraffic[nodeId].packets += flow.packets;
      }

      for (let k = 0; k < routingPath.length - 1; k++) {
        const src = routingPath[k];
        const dst = routingPath[k + 1];
        if (!(src in linksRouting)) {
          linksRouting[src] = {};
        }
        if (!(dst in linksRouting)) {
          linksRouting[dst] = {};
        }
        if (!(dst in linksRouting[src])) {
          linksRouting[src][dst] = {
            octets: 0,
            packets: 0
          };
        }
        if (!(src in linksRouting[dst])) {
          linksRouting[dst][src] = {
            octets: 0,
            packets: 0
          };
        }
        linksRouting[src][dst].octets += flow.octets;
        linksRouting[src][dst].packets += flow.packets;
        linksRouting[dst][src].octets += flow.octets;
        linksRouting[dst][src].packets += flow.packets;
      }
    }
  }
  return {
    nodes: nodesRoutingTraffic,
    links: linksRouting
  };
}

function computeStats(data) {
  const minBattery = computeMinBattery(data);
  const maxBattery = computeMaxBattery(data);
  const averageBattery = computeAverageBattery(data);
  const numberNodes = data.length;
  const depth = computeDepth(data);
  var maxDepth = 0;

  const keys = Object.keys(depth);
  for (let i in keys) {
    const key = keys[i];
    if (depth[key] > maxDepth) {
      maxDepth = depth[key];
    }
  }
  const totalBytes = nodes.reduce(function(acc, value) {
    return acc + value.total.octets;
  }, 0);
  const totalPackets = nodes.reduce(function(acc, value) {
    return acc + value.total.packets;
  }, 0);

  document.getElementById("number_nodes").innerHTML = numberNodes;
  document.getElementById("maximum_depth").innerHTML = maxDepth;
  document.getElementById("min_battery").innerHTML = minBattery;
  document.getElementById("total_bytes").innerHTML = totalBytes.toString() + " bytes ( " + totalPackets + " )";

}

function loadData() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var data = JSON.parse(this.responseText);
      parseNodes(data);
      computeStats(data);
      drawTopology();
    }
  };
  xhttp.open("GET", "/nodes_data", true);
  xhttp.send();
}

loadData();
