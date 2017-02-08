// Set graph
function Graph() {
    var positionInfo = document.getElementById("graph").getBoundingClientRect();

    var width = document.getElementById("graph").clientWidth,
        height = document.getElementById("graph").clientHeight,
        padding = 50;
    var zoomValue = 1.0;
    var x = 0, y = 0;
    var xMax = 10, xMin = -10;
    var yMax = 10, yMin = -10;

    console.log(width, height);

    var drag = d3.drag()
        .on("start", drag_started)
        .on("drag", dragged)
        .on("end", drag_ended);

    var zoom = d3.zoom()
        .on("zoom", zoomed);


// create an svg container
    var vis = d3.select("#graph")
        .append("svg:svg")
        .attr("width", width)
        .attr("height", height)
        .call(zoom)
        .call(drag)
        .on("mousedown.zoom", null)
        .on("touchstart.zoom", null)
        .on("touchmove.zoom", null)
        .on("touchend.zoom", null);

    var xScale = d3.scaleLinear().domain([-10, 10]).range([width - padding, padding]);
    var yScale = d3.scaleLinear().domain([-10, 10]).range([height - padding, padding]);

// define the y axis
    var yAxis = d3.axisLeft()
        .scale(yScale);

// define the y axis
    var xAxis = d3.axisBottom()
        .scale(xScale);

    var xAxisPlot = vis.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + (height - padding) + ")")
        .call(xAxis.tickSize(-height + padding * 2, 0, 0));

    var yAxisPlot = vis.append("g")
        .attr("class", "axis axis--y")
        .attr("transform", "translate(" + padding + ",0)")
        .call(yAxis.tickSize(-width + padding * 2, 0, 0));


    function drag_started(d) {
        d3.select(this).classed("dragging", true);
    }

    function dragged(d) {
        x += d3.event.dx;
        y += d3.event.dy;

        yScale.domain([(yMin + y * .1) / zoomValue, (yMax + y * .1) / zoomValue]);
        xScale.domain([(xMax - x * .1) / zoomValue, (xMin - x * .1) / zoomValue]);

        d3.select(".axis--y").call(yAxis);
        d3.select(".axis--x").call(xAxis);

    }

    function drag_ended(d) {
        d3.select(this).classed("dragging", false);
    }

    function zoomed(d) {
        zoomValue = d3.event.transform.k;

        yScale.domain([(yMin + y * .1) / zoomValue, (yMax + y * .1) / zoomValue]);
        xScale.domain([(xMax + x * .1) / zoomValue, (xMin + x * .1) / zoomValue]);

        d3.select(".axis--y").call(yAxis);
        d3.select(".axis--x").call(xAxis);
    }

}