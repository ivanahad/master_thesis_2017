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
  data.forEach(function(d) {
    const IDd = d.id;
    const parentd = d.parent;

    nodes[IDd] = {
      ID: IDd,
      parent: parentd,
      battery: d.battery,
      volume: "100",
      lastsent: new Date(d.lastUpdate * 1000)
    };

    if (parentd) {
      links.push({
        source: IDd,
        target: parentd
      });
    } else {
      rootnode = nodes[IDd];
    }

  });

  links.forEach(function(link) {
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
  var currentnodeid = node.ID;
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
        console.log(d);
        return d.parent ? 8 : 15;
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
  document.getElementById("currentID").innerHTML = node.ID;
  document.getElementById("parent").innerHTML = node.parent;
  document.getElementById("battery").innerHTML = node.battery;
  document.getElementById("volume").innerHTML = node.volume;
  document.getElementById("lastsent").innerHTML = node.lastsent;

}

function removeNode() {
  document.getElementById("currentID").innerHTML = "-";
  document.getElementById("parent").innerHTML = "-";
  document.getElementById("battery").innerHTML = "-";
  document.getElementById("volume").innerHTML = "-";
  document.getElementById("lastsent").innerHTML = "-";
}

var force;
var link;
var node;


var drawTopology = function() {
  force = d3.layout.force()
    .nodes(d3.values(nodes))
    .links(links)
    .size([width, height])
    .linkDistance(15)
    .charge(-300)
    .on("tick", tick)
    .start();

  link = svg.selectAll(".link")
    .data(force.links())
    .enter().append("line")
    .attr("class", "link");

  node = svg.selectAll(".node")
    .data(force.nodes())
    .enter().append("g")
    .attr("class", "node")
    .on("click", click)
    .call(force.drag);

  node.append("circle")
    .attr("r", function(d) {
      return d.parent ? 8 : 15;
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
      return d.ID;
    });
};

/*
 Parse correctement les donnees, les nodes et les links sont bien initialisés.
 */
function loadData() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var data = JSON.parse(this.responseText);
      parseNodes(data);
      drawTopology();
    }
  };
  xhttp.open("GET", "/nodes_data", true);
  xhttp.send();
}

loadData();
