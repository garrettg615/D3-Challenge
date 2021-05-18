console.log("this is where is begins")

var height = 600;
var width = 750;

var margin = {
    top: 40,
    right: 40,
    bottom: 80,
    left: 60
};

var svgHeight = height-margin.top-margin.bottom;
var svgWidth = width-margin.right-margin.left;

var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.csv("static/data/data.csv").then((incomingData) => {

    // convert data from string to integer
    incomingData.forEach((data) => {
        data.poverty = parseFloat(data.poverty);
        data.povertyMoe = parseFloat(data.Moe);
        data.age = parseFloat(data.age);
        data.ageMoe = parseFloat(data.ageMoe);
        data.income = parseFloat(data.income);
        data.incomeMoe = parseFloat(data.incomeMoe);
        data.healthcare = parseFloat(data.healthcare);
        data.healthcareLow = parseFloat(data.healthcareLow);
        data.healthcareHigh = parseFloat(data.healthcareHigh);
        data.obesity = parseFloat(data.obesity);
        data.obesityLow = parseFloat(data.obesityLow);
        data.obesityHigh = parseFloat(data.obesityHigh);
        data.smokes = parseFloat(data.smokes);
        data.smokesLow = parseFloat(data.smokesLow);
        data.smokesHigh = parseFloat(data.smokesHigh);
    });

    console.log(incomingData);

    var xScale = d3.scaleLinear()
        .domain([0, d3.max(incomingData, d => d.healthcare)])
        .range([0, svgWidth]);

    var yScale = d3.scaleLinear()
        .domain([0, d3.max(incomingData, d => d.poverty)])
        .range([svgHeight, 0]);

    var bottomAxis = d3.axisBottom(xScale);
    var leftAxis = d3.axisLeft(yScale);

    chartGroup.append("g")
        .attr("transform", `translate(0, ${svgHeight})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(leftAxis);

    // Create circles for the scatter
    var circlesGroup = chartGroup.selectAll("circle")
        .data(incomingData)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d.healthcare))
        .attr("cy", d => yScale(d.poverty))
        .attr("r", 17)
        .attr("fill", "pink")
        .attr("opacity", ".5")
        .attr("stroke", "black")
        
    var circleText = chartGroup.selectAll("cirlce")
        .data(incomingData)
        .enter()
        .append("text")
        .attr("x", d => xScale(d.healthcare))
        .attr("y", d => yScale(d.poverty))
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        .text(d => d.abbr);

    var yAxisText = chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left - 5)
        .attr("x", 0 - (svgHeight / 2))
        .attr("dy", "1em")
        .text("Poverty");

    var xAxisText = chartGroup.append("text")
        .attr("y", 0 + (svgHeight + margin.bottom/2))
        .attr("x", 0 + (width / 2) - 50)
        .attr("dy", "1em")
        .text("Healthcare");

    
        

    

}).catch(function(error) {
    console.log(error)
});
