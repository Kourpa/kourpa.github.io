// Set graph
var width = document.getElementById("graph").clientWidth,
    height = document.getElementById("graph").clientHeight;
var zoomValue = 1.0;
var x = 0, y = 0;
var xMax = 10, xMin = -10;
var yMax = 10, yMin = -10;
var rowVectors = 25;
var columnVectors = 25;
var vectorLength = .4;
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


var xScale = d3.scaleLinear().domain([-10, 10]).range([0, width]);
var yScale = d3.scaleLinear().domain([-10, 10]).range([height, 0]);

// define the y axis
var yAxis = d3.axisLeft()
    .scale(yScale);

// define the y axis
var xAxis = d3.axisBottom()
    .scale(xScale);

graph.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis.tickSize(-height, 0, 0))
    .selectAll("text")
    .attr("transform", "translate(0, -15)");

graph.append("g")
    .attr("class", "axis axis--y")
    .attr("transform", "translate(" + 0 + ",0)")
    .call(yAxis.tickSize(-width, 0, 0))
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

var initGraph = function(){
    initializeVariables();

    var stepX = (xMax - xMin)/columnVectors;
    var stepY = (yMax - yMin)/rowVectors;
    var m, theta;

    var i = 0;
    var xx = xMax;
    for(var x = 0; x < rowVectors; x ++){
        var yy = yMin;
        for(var y = 0; y < columnVectors; y ++) {
            scope[independentVariable] = xx;
            scope[dependentVariable] = yy;
            m = equation.eval(scope);
            theta = math.atan(m);
            data.push([[xx, yy], [xx + (vectorLength / zoomValue) * math.cos(theta),
                yy + (vectorLength / zoomValue) * math.sin(theta)]]);
            i++;
            yy += stepY;
        }
        xx += stepX;
    }

    zoomed();
};

var initializeVariables = function(){
    xMax = parseFloat($("#xMax")[0].value);
    xMin = parseFloat($("#xMin")[0].value);
    yMax = parseFloat($("#yMax")[0].value);
    yMin = parseFloat($("#yMin")[0].value);
    rowVectors = parseFloat($("#rowVectors")[0].value);
    columnVectors = parseFloat($("#columnVectors")[0].value);
    data = [];
};

var resize = function(){
    width = document.getElementById("graph").clientWidth;
    height = document.getElementById("graph").clientHeight;

    graph
        .attr("width", width)
        .attr("height", height)
        .select(".axis--x")
            .attr("transform", "translate(0," + height + ")");

    xScale.range([0, width]);
    yScale.range([height, 0]);
    yAxis.tickSize(-width, 0, 0);
    xAxis.tickSize(-height, 0, 0);

    zoomed();
};

var initVectors = function(minX, minY, maxX, maxY){
    var stepX = (maxX - minX)/columnVectors;
    var stepY = (maxY - minY)/rowVectors;
    var m, theta;
    data = [];

    var i = 0;
    var xx = minX;
    for(var x = 0; x < rowVectors; x++){
        var yy = minY;
        for(var y = 0; y < columnVectors; y++) {
            scope[independentVariable] = xx;
            scope[dependentVariable] = yy;
            m = equation.eval(scope);
            theta = math.atan(m);
            data.push([[xx, yy], [xx + (vectorLength / zoomValue) * math.cos(theta),
                yy + (vectorLength / zoomValue) * math.sin(theta)]]);
            i++;
            yy += stepY;
        }
        xx += stepX;
    }

    graph.append("defs").append("marker")
        .attr("id", "marker")
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 10)
        .attr("refY", 0)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M0,-5L10,0L0,5");

    graph.selectAll("path")
        .data(data)
        .enter().append("path")
        .attr("class", "vector")
        .attr("d", path)
        .attr("marker-end", "url(#marker)");
};

var updateVectors = function(minX, minY, maxX, maxY){
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

    graph.append("defs").append("marker")
        .attr("id", "marker")
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 10)
        .attr("refY", 0)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M0,-5L10,0L0,5");

    graph.selectAll("path")
        .data(data)
        .attr("d", path)
        .attr("marker", "url(#marker)");
};

var zoomVectors = function(minX, minY, maxX, maxY, old_minX){
    var stepX = (maxX - minX)/columnVectors;
    var stepY = (maxY - minY)/rowVectors;
    var m, theta;

    var i = 0;
    var cx = minX + data[0][0][0] - old_minX;
    for(var j = 0; j < rowVectors; j++){
        var cy = minY;
        for(var k = 0; k < columnVectors; k++) {
            scope[independentVariable] = cx;
            scope[dependentVariable] = cy;
            m = equation.eval(scope);
            theta = math.atan(m);
            data[i] = [[cx, cy], [cx + (vectorLength / zoomValue) * math.cos(theta),
                cy + (vectorLength / zoomValue) * math.sin(theta)]];
            i++;
            cy += stepY;
        }
        cx += stepX;
    }

    updateVectors(minX, minY, maxX, maxY);
};

function drag_started(d) {
    d3.select(this).classed("dragging", true);
}

function dragged(d) {
    x += d3.event.dx || 0;
    y += d3.event.dy || 0;

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
    var old_minX = (xMin - x * adjustX) / zoomValue;

    if(!d3.event) zoomValue = zoomValue || 1;
    else zoomValue = d3.event.transform.k;

    var minX, maxX, minY, maxY;
    minY = (yMin + y * adjustY) / zoomValue;
    maxY = (yMax + y * adjustY) / zoomValue;
    minX = (xMin - x * adjustX) / zoomValue;
    maxX = (xMax - x * adjustX) / zoomValue;

    yScale.domain([minY, maxY]);
    xScale.domain([minX, maxX]);

    d3.select(".axis--y")
        .call(yAxis)
        .selectAll("text")
        .attr("transform", "translate(15, 0)")
        .style("text-anchor", "start");

    d3.select(".axis--x")
        .call(xAxis)
        .selectAll("text")
        .attr("transform", "translate(0, -15)");

    zoomVectors(minX, minY, maxX, maxY, old_minX);
}

