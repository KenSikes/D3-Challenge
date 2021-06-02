// @TODO: YOUR CODE HERE!

//set X & Y axis variables.
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

function xScale(data, chosenXAxis, chartWidth) {
    //create scales.
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[chosenXAxis]) * .8,
            d3.max(data, d => d[chosenXAxis]) * 1.1])
        .range([0, chartWidth]);
    return xLinearScale;
}

//function for updating x axis
function renderXAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);
    return xAxis;
}
//function for updating y scale
function yScale(data, chosenYAxis, chartHeight) {
    //create scales.
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[chosenYAxis]) * .8,
            d3.max(data, d => d[chosenYAxis]) * 1.2])
        .range([chartHeight, 0]);
    return yLinearScale;
}
//function  for updating y axis
function renderYAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);
    yAxis.transition()
        .duration(1000)
        .call(leftAxis);
    return yAxis;
}

//function for updating circles transition to new circles.
function renderCircles(circlesGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {
    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]))
        .attr("cy", d => newYScale(d[chosenYAxis]));
    return circlesGroup;
}
//function for updating text in circles transition to new text.
function renderText(circletextGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {
    circletextGroup.transition()
        .duration(1000)
        .attr("x", d => newXScale(d[chosenXAxis]))
        .attr("y", d => newYScale(d[chosenYAxis]));
    return circletextGroup;
}
//function for updating circles group with new tooltip.
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, textGroup) {
    //conditional for x Axis.
    if (chosenXAxis === "poverty") {
        var xlabel = "Poverty: ";
    } else if (chosenXAxis === "income") {
        var xlabel = "Median Income: "
    } else {
        var xlabel = "Age: "
    }
    //conditional for y Axis.
    if (chosenYAxis === "healthcare") {
        var ylabel = "Lacks Healthcare: ";
    } else if (chosenYAxis === "smokes") {
        var ylabel = "Smokers: "
    } else {
        var ylabel = "Obesity: "
    }

//Tooltip
var toolTip = d3.tip()
.offset([120, -60])
.attr("class", "d3-tip")
.html(function(d) {
    if (chosenXAxis === "age") {
        return (`${d.state}<hr>${xlabel} ${d[chosenXAxis]}<br>${ylabel}${d[chosenYAxis]}%`);
        } else if (chosenXAxis !== "poverty" && chosenXAxis !== "age") {
        return (`${d.state}<hr>${xlabel}$${d[chosenXAxis]}<br>${ylabel}${d[chosenYAxis]}%`);
        } else {
        return (`${d.state}<hr>${xlabel}${d[chosenXAxis]}%<br>${ylabel}${d[chosenYAxis]}%`);
        }      
});
circlesGroup.call(toolTip);
circlesGroup
.on("mouseover", function(data) {
    toolTip.show(data, this);
})
.on("mouseout", function(data) {
    toolTip.hide(data);
});
textGroup
.on("mouseover", function(data) {
    toolTip.show(data, this);
})
.on("mouseout", function(data) {
    toolTip.hide(data);
});
return circlesGroup;
}
function makeResponsive() {
var svgArea = d3.select("#scatter").select("svg");
if (!svgArea.empty()) {
svgArea.remove();
}
var svgHeight = window.innerHeight/1.2;
var svgWidth = window.innerWidth/1.7;
var margin = {
top: 50,
right: 50,
bottom: 100,
left: 80
};

//chart area
var chartHeight = svgHeight - margin.top - margin.bottom;
var chartWidth = svgWidth - margin.left - margin.right;
//SVG wrapper
var svg = d3
.select("#scatter")
.append("svg")
.attr("width", svgWidth)
.attr("height", svgHeight);
//append an SVG group
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);
d3.csv("assets/data/data.csv").then(function(demoData, err) {
    if (err) throw err;
    //parse data.
    demoData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
        data.age = +data.age;
        data.smokes = +data.smokes;
        data.income = +data.income;
        data.obesity = data.obesity;
    });

            //x/y linear scales.
            var xLinearScale = xScale(demoData, chosenXAxis, chartWidth);
            var yLinearScale = yScale(demoData, chosenYAxis, chartHeight);
            //initial axis functions.
            var bottomAxis =d3.axisBottom(xLinearScale);
            var leftAxis = d3.axisLeft(yLinearScale);
            //append x axis.
            var xAxis = chartGroup.append("g")
                .attr("transform", `translate(0, ${chartHeight})`)
                .call(bottomAxis);
            //append y axis.
            var yAxis = chartGroup.append("g")
                .call(leftAxis);
            //data for circles.
            var circlesGroup = chartGroup.selectAll("circle")
                .data(demoData);
            //bind data.
            var elemEnter = circlesGroup.enter();
            //create circles.
            var circle = elemEnter.append("circle")
                .attr("cx", d => xLinearScale(d[chosenXAxis]))
                .attr("cy", d => yLinearScale(d[chosenYAxis]))
                .attr("r", 15)
                .classed("stateCircle", true);
            //create circle text.
            var circleText = elemEnter.append("text")            
                .attr("x", d => xLinearScale(d[chosenXAxis]))
                .attr("y", d => yLinearScale(d[chosenYAxis]))
                .attr("dy", ".35em") 
                .text(d => d.abbr)
                .classed("stateText", true);