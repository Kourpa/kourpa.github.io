// Set graph
var width = document.getElementById("graph").clientWidth,
    height = document.getElementById("graph").clientHeight,
    padding = 50;
var zoomValue = 1.0;
var x = 0, y = 0;
var xMax = 10, xMin = -10;
var yMax = 10, yMin = -10;
var rowVectors = 20;
var columnVectors = 20;
var vectorLength = .5;
var data;

var adjustY = 0.0375;
var adjustX = 0.0265;

var drag = d3.drag()
    .on("start", drag_started)
    .on("drag", dragged)
    .on("end", drag_ended);

var zoom = d3.zoom()
    .on("zoom", zoomed);


// create an svg container
var graph = d3.select("#graph")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .call(zoom)
    .call(drag)
    .on("mousedown.zoom", null)
    .on("touchstart.zoom", null)
    .on("touchmove.zoom", null)
    .on("touchend.zoom", null);


var xScale = d3.scaleLinear().domain([-10, 10]).range([0, width - 0]);
var yScale = d3.scaleLinear().domain([-10, 10]).range([height - 0, 0]);

// define the y axis
var yAxis = d3.axisLeft()
    .scale(yScale)

// define the y axis
var xAxis = d3.axisBottom()
    .scale(xScale);

graph.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + (height - 0) + ")")
    .call(xAxis.tickSize(-height + 0 * 2, 0, 0))
    .selectAll("text")
    .attr("transform", "translate(0, -15)");

graph.append("g")
    .attr("class", "axis axis--y")
    .attr("transform", "translate(" + 0 + ",0)")
    .call(yAxis.tickSize(-width + 0 * 2, 0, 0))
    .selectAll("text")
    .attr("transform", "translate(15, 0)")
    .style("text-anchor", "start");

var path = d3.line()
    .x(function(d) {
        return xScale(d[0]);
    })
    .y(function(d) {
        return yScale(d[1]);
    });


var initVectors = function(minX, minY, maxX, maxY){
    var stepX = (maxX - minX)/columnVectors;
    var stepY = (maxY - minY)/rowVectors;
    var m, x1, x2, y1, y2, v =[], theta;
    data = [];

    for(var x = minX; x <= maxX; x += stepX){
        for(var y = minY; y <= maxY; y += stepY) {
            scope[independentVariable] = x;
            scope[dependentVariable] = y;
            m = equation.eval(scope);
            theta = math.atan(m);
            data.push([[x, y], [x + (vectorLength / zoomValue) * math.cos(theta),
                y + (vectorLength / zoomValue) * math.sin(theta)]]);
        }
    }

    graph.selectAll("path")
        .data(data)
        .enter().append("path")
        .attr("class", "vector")
        .attr("d", path);
};

var updateVectors = function(minX, minY, maxX, maxY){
    var stepX = (maxX - minX)/columnVectors;
    var stepY = (maxY - minY)/rowVectors;
    var m, theta;

    for(var i = 0; i < data.length; i++){
        var p = data[i];

        var validX = false, validY = false;
        var first = p[0];
        var second = p[1];
        var x = first[0];
        var y = first[1];

        if(first[0] > maxX || second[0] > maxX){
            x = minX + (first[0] - maxX);
        }
        else if(first[0] < minX || second[0] < minX){
            x = maxX + (first[0] - minX);
        }
        else validX = true;


        if(first[1] > maxY || second[1] > maxY){
            y = minY + (first[1] - maxY);
        }
        else if(first[1] < minY || second[1] < minY){
            y = maxY + (first[1] - minY);
        }
        else validY = true;

        if(validX && validY) continue;

        scope[independentVariable] = x;
        scope[dependentVariable] = y;
        m = equation.eval(scope);
        theta = math.atan(m);
        data[i] = [[x, y], [x + (vectorLength / zoomValue) * math.cos(theta),
            y + (vectorLength / zoomValue) * math.sin(theta)]];
    }

    graph.selectAll("path")
        .data(data)
        .attr("d", path);
};

var zoomVectors = function(minX, minY, maxX, maxY){
    var stepX = (maxX - minX)/columnVectors;
    var stepY = (maxY - minY)/rowVectors;
    var m, theta;
    data = [];

    var i = 0;
    for(var x = minX; x <= maxX; x += stepX){
        for(var y = minY; y <= maxY; y += stepY) {
            scope[independentVariable] = x;
            scope[dependentVariable] = y;
            m = equation.eval(scope);
            theta = math.atan(m);
            data[i] = [[x, y], [x + (vectorLength / zoomValue) * math.cos(theta),
                y + (vectorLength / zoomValue) * math.sin(theta)]];
            i++;
        }
    }

    graph.selectAll("path")
        .data(data)
        .attr("d", path);
};

function drag_started(d) {
    d3.select(this).classed("dragging", true);
}

function dragged(d) {
    x += d3.event.dx;
    y += d3.event.dy;

    var domainMinY = (yMin + y * adjustY) / zoomValue;
    var domainMaxY = (yMax + y * adjustY) / zoomValue;
    var domainMinX = (xMin - x * adjustX) / zoomValue;
    var domainMaxX = (xMax - x * adjustX) / zoomValue;

    yScale.domain([domainMinY, domainMaxY]);
    xScale.domain([domainMinX, domainMaxX]);

    updateVectors(domainMinX, domainMinY, domainMaxX, domainMaxY);


    d3.select(".axis--y").call(yAxis)
        .selectAll("text")
        .attr("transform", "translate(15, 0)")
        .style("text-anchor", "start");

    d3.select(".axis--x")
        .call(xAxis)
        .selectAll("text")
        .attr("transform", "translate(0, -15)");

}


function drag_ended(d) {
    d3.select(this).classed("dragging", false);
}

function zoomed(d) {
    zoomValue = d3.event.transform.k;
    var minX, maxX, minY, maxY;
    minY = (yMin + y * adjustY) / zoomValue;
    maxY = (yMax + y * adjustY) / zoomValue;
    minX = (xMin - x * adjustX) / zoomValue;
    maxX = (xMax - x * adjustX) / zoomValue;

    yScale.domain([minY, maxY]);
    xScale.domain([minX, maxX]);

    zoomVectors(minX, minY, maxX, maxY);

    d3.select(".axis--y")
        .call(yAxis)
        .selectAll("text")
        .attr("transform", "translate(15, 0)")
        .style("text-anchor", "start");

    d3.select(".axis--x")
        .call(xAxis)
        .selectAll("text")
        .attr("transform", "translate(0, -15)");

}

