var dataTest = [
  {date: new Date(2007, 3, 24), volume: 10},
  {date: new Date(2007, 3, 25), volume: 23},
  {date: new Date(2007, 3, 26), volume: 5},
  {date: new Date(2007, 3, 27), volume: 15},
  {date: new Date(2007, 3, 30), volume: 23},
  {date: new Date(2007, 4,  1), volume: 17},
];

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
    .x(function(d) { return x(d.date); })
    .y1(function(d) {
      return y(d.volume);
     })
    .y0(y(0));

function drawChart(data){
  // scale the range of the data
  x.domain(d3.extent(data, function(d) { return d.date; }));
  y.domain([0, d3.max(data, function(d) { return d.volume; })]);

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

drawChart(dataTest);
