//noinspection JSDuplicatedDeclaration
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



// var canClickOnOthers = true;
var links = [];
var nodes = [];
var rootnode;

//Structure : ID, Parent, Battery
function parseNodes(data){
    data.forEach(function(d) {
        var IDd = d.id.toString();
        var parentd;
        if(d.parent === null){
            parentd = "none";
        }else {
            parentd = d.parent.toString();
        }

        var batteryd = d.battery.toString();
        var volumed ="100";
        var lastsentd = new Date(d.lastUpdate * 1000);

        if(parentd!="none") {
            links.push({source: IDd, target: parentd});
        }
        if(parentd==="0") {
            parentd = "none";
            rootnode = {ID: IDd, parent: parentd, battery: batteryd, volume : volumed, lastsent: lastsentd};
        }
        nodes[IDd] = {ID: IDd, parent: parentd, battery: batteryd, volume : volumed, lastsent: lastsentd};
    });

    links.forEach(function(link) {
        link.source = nodes[link.source] || (nodes[link.source] = {name: link.source});
        link.target = nodes[link.target] || (nodes[link.target] = {name: link.target});
    });
}


function tick() {
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
}

var numberClicked=1;
var currentnodeid = "";
var selectednodeid="";
var aucunassign=true;

// action to take on mouse click
function click(node) {
    currentnodeid=node.ID;
    var batt = parseInt(node.battery);

    if(numberClicked % 2 == 1 && aucunassign==true){ //node gets bigger
        numberClicked++;
        selectednodeid=currentnodeid;
        aucunassign=false;
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
    }
    else if(numberClicked % 2 !=1 && aucunassign==false && selectednodeid==currentnodeid) {
        numberClicked++;
        if(node.parent == "none") {
            d3.select(this).select("circle").transition()
                .duration(750)
                .attr("r", 15)
                .style("fill", "#26b6cc");
            d3.select(this).select("text").transition()
                .duration(750)
                .attr("x", 15)
                .style("stroke", "none")
                .style("fill", "black")
                .style("stroke", "none")
                .style("font", "14px sans-serif");
            removeNode();
            aucunassign = true;
            selectednodeid = "";
        }
        else if (batt > 50 && node.parent!="none"){
            d3.select(this).select("circle").transition()
                .duration(750)
                .attr("r", 8)
                .style("fill", "#31cc18");
            d3.select(this).select("text").transition()
                .duration(750)
                .attr("x", 12)
                .style("stroke", "none")
                .style("fill", "black")
                .style("stroke", "none")
                .style("font", "14px sans-serif");
            removeNode();
            aucunassign = true;
            selectednodeid = "";
        }

        else if (batt <= 50 && batt > 20 && node.parent!="none"){
            d3.select(this).select("circle").transition()
                .duration(750)
                .attr("r", 8)
                .style("fill", "yellow");
            d3.select(this).select("text").transition()
                .duration(750)
                .attr("x", 12)
                .style("stroke", "none")
                .style("fill", "black")
                .style("stroke", "none")
                .style("font", "14px sans-serif");
            removeNode();
            aucunassign = true;
            selectednodeid = "";
        }
        else if (batt <= 20 && node.parent!="none"){
            d3.select(this).select("circle").transition()
                .duration(750)
                .attr("r", 8)
                .style("fill", "red");
            d3.select(this).select("text").transition()
                .duration(750)
                .attr("x", 12)
                .style("stroke", "none")
                .style("fill", "black")
                .style("stroke", "none")
                .style("font", "14px sans-serif");
            removeNode();
            aucunassign = true;
            selectednodeid = "";
        }

    }
}


function updateNode(node){
    document.getElementById("currentID").innerHTML = (node.ID).toString();
    document.getElementById("parent").innerHTML = (node.parent).toString();
    document.getElementById("battery").innerHTML = (node.battery).toString();
    document.getElementById("volume").innerHTML = (node.volume).toString();
    document.getElementById("lastsent").innerHTML = (node.lastsent).toString();

}

function removeNode(){
    document.getElementById("currentID").innerHTML = "-";
    document.getElementById("parent").innerHTML = "-";
    document.getElementById("battery").innerHTML = "-" ;
    document.getElementById("volume").innerHTML = "-" ;
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
        .attr("r", function (d) { if(d.parent=="none") {
            return 15;
        }
        else{
            return 8;
        }})
        .style("fill", function (d) { if(d.parent == "none"){
            return "#26b6cc";}

            else if (d.parent != "none" && d.battery > 50){
                return "#31cc18";
        }
        else if (d.parent != "none" && d.battery <= 50 && d.battery >20){
                return "yellow";
        }
        else if (d.parent != "none" && d.battery <= 20){
            return "red";
        }
    });

    node.append("text")
        .attr("x", function (d) { if(d.parent=="none") {
            return 15;
        }
        else{
            return 12;
        }})
        .attr("dy", ".35em")
        .text(function(d) { return d.ID; });
    document.getElementById("rootID").innerHTML = (rootnode.ID).toString();
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
