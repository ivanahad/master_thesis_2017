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




var selectedNode=0;
var links = [];
var nodes = [];

var nodestest = [
    {ID : 1, parent : 2, battery : 52}
];


//Structure : ID, Parent, Battery
function parseNodes(data){
    data.forEach(function(d) {
        var IDd = d.ID.toString();
        var parentd = d.parent.toString();
        var batteryd = d.battery.toString();
        if(parentd!=null) {
            links.push({source: IDd, target: parentd});
            nodes[IDd] = {ID: IDd, parent: parentd, battery: batteryd};
        }

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

// action to take on mouse click


function click(node) {
    console.log(node);
    if(selectedNode==0) {
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
        updateNode(node);
        selectedNode=selectedNode+1;
    }
}

function updateNode(node){

    // document.getElementById("currentID").innerHTML = (52).toString();
    // document.getElementById("parent").innerHTML = (52).toString();
    // document.getElementById("battery").innerHTML = (52).toString();
    // console.log("updateNode node :"+ node.ID);
    // document.getElementById("currentID").innerHTML = (nodestest[0].ID).toString();
    // document.getElementById("parent").innerHTML = (nodestest[0].parent).toString();
    // document.getElementById("battery").innerHTML = (nodestest[0].battery).toString();

    document.getElementById("currentID").innerHTML = (node.ID).toString();
    document.getElementById("parent").innerHTML = (node.parent).toString();
    document.getElementById("battery").innerHTML = (node.battery).toString();

}

function removeNode(){

    document.getElementById("currentID").innerHTML = "-";
    document.getElementById("parent").innerHTML = "-";
    document.getElementById("battery").innerHTML = "-" ;

}


// action to take on mouse double click
function dblclick() {
    if(selectedNode == 1) {
        console.log(this);
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
            .style("font", "14px sans-serif");
        removeNode();
        selectedNode = selectedNode-1;
    }
}

var force;
var link;
var node;

var drawTopology = function() {
    force = d3.layout.force()
        .nodes(d3.values(nodes))
        .links(links)
        .size([width, height])
        .linkDistance(60)
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
        .on("dblclick", dblclick);

    node.append("circle")
        .attr("r", 8);

    node.append("text")
        .attr("x", 12)
        .attr("dy", ".35em")
        .text(function(d) { return d.ID; });
        // .text(function(d) { return d.name; });
};

svg.selectAll(".bar").on('click', function(d, i) {
    console.log(d);
    console.log(i);
    console.log(d3.event);
});

/*
 Parse correctement les donnees, les nodes et les links sont bien initialisés. Mais les tableaux ne sont initialises que dans la fonction et pas en dehors.
 */
function loadData() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var data = JSON.parse(this.responseText);
            // parseLinks(data);
            parseNodes(data);
            drawTopology();
        }
    };
    // xhttp.open("GET", "/nodes_link", true);
    xhttp.open("GET", "/nodes_data", true);
    xhttp.send();
}

loadData();

// var inter = setInterval(function() {
//     updateData();
// }, 5000);



// ** Update data section (Called from the onclick)
// function updateData() {
//
//     // Get the data again
//     d3.csv("data-alt.csv", function(error, data) {
//         data.forEach(function(d) {
//             d.date = parseDate(d.date);
//             d.close = +d.close;
//         });
//
//         // Scale the range of the data again
//         x.domain(d3.extent(data, function(d) { return d.date; }));
//         y.domain([0, d3.max(data, function(d) { return d.close; })]);
//
//         // Select the section we want to apply our changes to
//         var svg = d3.select("body").transition();
//
//         // Make the changes
//         svg.select(".line")   // change the line
//             .duration(750)
//             .attr("d", valueline(data));
//         svg.select(".x.axis") // change the x axis
//             .duration(750)
//             .call(xAxis);
//         svg.select(".y.axis") // change the y axis
//             .duration(750)
//             .call(yAxis);
//
//     });
// }



// path.enter().append("path")
//     .attr("fill", function(d, i) { return color(i); })
//     .attr("d", arc)
//     .each(function(d) {this._current = d;} );
//
// path.transition()
//     .attrTween("d", arcTween);
//
// path.exit().remove()







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

// function parseLinks(data){
//     data.forEach(function(d) {
//         var sourced = d.source.toString();
//         var targetd = d.target.toString();
//         links.push({source : sourced, target : targetd})
//
//     });
//     links.forEach(function(link){
//         console.log("source : " + link.source + " target : " + link.target);
//     });
//     links.forEach(function(link) {
//         link.source = nodes[link.source] || (nodes[link.source] = {name: link.source});
//         link.target = nodes[link.target] || (nodes[link.target] = {name: link.target});
//     });
//     links.forEach(function(link){
//         console.log("source : " + link.source + " target : " + link.target);
//     });
// }
/*
todo list :
- ajouter l'opacité sur les links en fonction du volume total échangé ? (optionnel)
- Mettre à jour la topologie en fonction du flux de données reçu (!!!). chaque 5 minutes
- changer les couleurs en fonction du dernier message
- RDV 14h30 18 may
- Modulability of the software
 */