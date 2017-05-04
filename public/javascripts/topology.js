//noinspection JSDuplicatedDeclaration
var svg = d3.select("svg"),
    margin = {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20
    },
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");



// var links = [
//     {source: "ID1", target: "ID2", type: "licensing"},
//     {source: "ID1", target: "ID0", type: "licensing"},
//     {source: "ID3", target: "ID4", type: "suit"},
//     {source: "ID10", target: "ID4", type: "suit"},
//     {source: "ID5", target: "ID4", type: "resolved"},
//     {source: "ID0", target: "ID4", type: "suit"},
//     {source: "ID7", target: "ID4", type: "suit"},
//     {source: "ID4", target: "ID0", type: "suit"},
//     {source: "ID3", target: "ID7", type: "resolved"},
//     {source: "ID6", target: "ID7", type: "resolved"},
//     {source: "RIM", target: "ID7", type: "suit"},
//     {source: "ID7", target: "ID6", type: "resolved"},
//     {source: "ID4", target: "ID5", type: "resolved"},
//     {source: "ID9", target: "ID5", type: "resolved"},
//     {source: "ID4", target: "ID10", type: "suit"},
//     {source: "ID1", target: "ID10", type: "suit"},
//     {source: "ID10", target: "ID1", type: "suit"},
//     {source: "ID12", target: "ID11", type: "suit"},
//     {source: "ID14", target: "ID11", type: "suit"},
//     {source: "ID7", target: "ID3", type: "resolved"},
//     {source: "ID4", target: "ID3", type: "suit"},
//     {source: "ID7", target: "RIM", type: "suit"},
//     {source: "ID5", target: "ID9", type: "suit"}
// ];


var links = [
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
];


// var nodesbis = [];
// function parseData(data){
//     data.forEach(function(d) {
//         var source = d.source;
//         var target = d.target;
//         nodesbis[d.source] = {name: source};
//         nodesbis[d.target] = {name: target};
//     })
// }

// function parseDate(data){
//     data.forEach(function (d) {
//         var dateObj = new Date(d.date);
//         d.date = dateObj;
//         return d;
//     });
// }

console.log("coucou");

var links = [];


var nodes = [];

//
// function parseLinks(data){
//     data.forEach(function(d) {
//         var sourced = d.source.toString();
//         var targetd = d.target.toString();
//         links.push({source : sourced, target : targetd })
//
//     });
//     console.log(links.length)
//     links.forEach(function(link) {
//         link.source = nodes[link.source] || (nodes[link.source] = {name: link.source});
//         link.target = nodes[link.target] || (nodes[link.target] = {name: link.target});
//     });
//
// }

console.log("taille des links " + links.length);



/*
Parse correctement les donnees, les nodes et les links sont bien initialisés. Mais les tableaux ne sont initialises que dans la fonction et pas en dehors.
 */
// function loadData() {
//     var xhttp = new XMLHttpRequest();
//     xhttp.onreadystatechange = function() {
//         if (this.readyState == 4 && this.status == 200) {
//             var data = JSON.parse(this.responseText);
//             parseLinks(data);
//             console.log("ok");
//             // drawChart(data);
//             // updateStatistics(data);
//         }
//     };
//     xhttp.open("GET", "/nodes_link", true);
//     xhttp.send();
// }
//
// loadData();



links.forEach(function(link) {
    link.source = nodes[link.source] || (nodes[link.source] = {name: link.source});
    link.target = nodes[link.target] || (nodes[link.target] = {name: link.target});
});


var force = d3.layout.force()
    .nodes(d3.values(nodes))
    .links(links)
    .size([width, height])
    .linkDistance(60)
    .charge(-300)
    .on("tick", tick)
    .start();

var link = svg.selectAll(".link")
    .data(force.links())
    .enter().append("line")
    .attr("class", "link");

var node = svg.selectAll(".node")
    .data(force.nodes())
    .enter().append("g")
    .attr("class", "node")
    // .on("mouseover", mouseover)
    // .on("mouseout", mouseout)
    .on("click", click)
    .on("dblclick", dblclick)


node.append("circle")
    .attr("r", 8);

node.append("text")
    .attr("x", 12)
    .attr("dy", ".35em")
    .text(function(d) { return d.name; });


function tick() {
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
}


// action to take on mouse click
function click() {
    d3.select(this).select("text").transition()
        .duration(750)
        .attr("x", 22)
        .style("fill", "steelblue")
        .style("stroke", "lightsteelblue")
        .style("stroke-width", ".5px")
        .style("font", "20px sans-serif");
    d3.select(this).select("circle").transition()
        .duration(750)
        .attr("r", 30)
        .style("fill", "lightsteelblue");
    updateNode();
}

function updateNode(node){

    document.getElementById("currentID").innerHTML = (52).toString();
    document.getElementById("parent").innerHTML = (52).toString();
    document.getElementById("battery").innerHTML = (52).toString();

}

function removeNode(){

    document.getElementById("currentID").innerHTML = "-";
    document.getElementById("parent").innerHTML = "-";
    document.getElementById("battery").innerHTML = "-" ;

}
// action to take on mouse double click
function dblclick() {
    d3.select(this).select("circle").transition()
        .duration(750)
        .attr("r", 8)
        .style("fill", "#ccc");
    d3.select(this).select("text").transition()
        .duration(750)
        .attr("x", 12)
        .style("stroke", "none")
        .style("fill", "black")
        .style("stroke", "none")
        .style("font", "10px sans-serif");
    removeNode();
}



// function mouseover() {
//     d3.select(this).select("circle").transition()
//         .duration(750)
//         .attr("r", 16);
// }
//
// function mouseout() {
//     d3.select(this).select("circle").transition()
//         .duration(750)
//         .attr("r", 8);
// }



//Pour une eventuelle opacite sur les liens entre chaque noeud
// links.forEach(function(link) {
//     if (v(link.value) <= 25) {
//         link.type = "twofive";
//     } else if (v(link.value) <= 50 && v(link.value) > 25) {
//         link.type = "fivezero";
//     } else if (v(link.value) <= 75 && v(link.value) > 50) {
//         link.type = "sevenfive";
//     } else if (v(link.value) <= 100 && v(link.value) > 75) {
//         link.type = "onezerozero";
//     }
// });