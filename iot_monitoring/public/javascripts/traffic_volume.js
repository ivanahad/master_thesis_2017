var svg = d3.select("svg"),
    margin = {
        top: 20,
        right: 20,
        bottom: 20,
        left: 40
    },
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var x = d3.scaleTime()
    .range([0, width]);
var y = d3.scaleLinear()
    .range([height, 0]);

var line = d3.line()
    .x(function(d) {
        return x(d.date);
    })
    .y(function(d) {
        return y(d.volume);
    });

var area = d3.area()
    .x(function(d) {
        return x(d.date);
    })
    .y1(function(d) {
        return y(d.volume);
    })
    .y0(y(0));

function drawChart(data) {
    //Clean svg
    g.selectAll("*").remove();

    // scale the range of the data
    x.domain(d3.extent(data, function(d) {
        return d.date;
    }));
    y.domain([0, d3.max(data, function(d) {
        return d.volume;
    })]);

    // add the area
    g.append("path")
        .data([data])
        .attr("class", "area")
        .attr("d", area);

    // add the valueline path.
    g.append("path")
        .data([data])
        .attr("class", "line")
        .attr("d", line);

    // add the X Axis
    g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // add the Y Axis
    g.append("g")
        .call(d3.axisLeft(y));

}

function parseDate(data){
  data.forEach(function (d) {
        var dateObj = new Date(d.date);
        d.date = dateObj;
        return d;
    });
}

function loadTraffic() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var data = JSON.parse(this.responseText);
            parseDate(data);
            drawChart(data);
        }
    };
    xhttp.open("GET", "http://localhost:3000/traffic_volume", true);
    xhttp.send();
}

setInterval(function() {
    loadTraffic();
}, 1 * 60 * 1000);
