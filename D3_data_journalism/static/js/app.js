console.log("this is where is begins")

var svgHeight = 750;
var svgWidth = 900;

var margin = {
    top: 100,
    right: 100,
    bottom: 100,
    left: 100
};

var height = svgHeight-margin.top-margin.bottom;
var width = svgWidth-margin.right-margin.left;

var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initialize chosenXAxis
var chosenXAxis = "healthcare";
var chosenYAxis = "age";

// Create Function to update x-axis values
function xLinearScale(incomingData, chosenXAxis) {
    xScale = d3.scaleLinear()
        .domain([d3.min(incomingData, d=>d[chosenXAxis])*0.8,
                d3.max(incomingData, d=>d[chosenXAxis])])
        .range([0, width])

    return xScale;
};


function yLinearScale(incomingData, chosenYAxis) {
    yScale = d3.scaleLinear()
        .domain([d3.min(incomingData, d=>d[chosenYAxis])*.96,
                d3.max(incomingData, d=>d[chosenYAxis])*1.02])
        .range([height, 0]);

    return yScale;
};


// Function to update Circles from Event Listener on X-Axis
function updateCirclesX(circlesGroup, newXscale, chosenXAxis) {
    circlesGroup.transition()
        .duration(2000)
        .attr("cx", d => newXscale(d[chosenXAxis]));

    return circlesGroup;
};

// Function to update Circles from Event Listener on Y-Axis
function updateCirclesY(circlesGroup, newYscale, chosenYAxis) {
    circlesGroup.transition()
        .duration(2000)
        .attr("cy", d => newYscale(d[chosenYAxis]));

    return circlesGroup;
};

// Function to update x-axis from Event Listener
function renderXAxis(xAxis, newXscale) {
    var bottomAxis = d3.axisBottom(newXscale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);

    return xAxis;
};

// Function to update y-axis from event listener
function renderYAxis(yAxis, newYscale) {
    var leftAxis = d3.axisLeft(newYscale);

    yAxis.transition()
        .duration(1000)
        .call(leftAxis);

    return yAxis;
};

// Function to render Circle Text from Event Listener
function renderCircleText(circleText, chosenXAxis, chosenYAxis) {
    circleText.transition()
        .duration(2400)
        .attr("x", d => xScale(d[chosenXAxis]))
        .attr("y", d => yScale(d[chosenYAxis]));

    return circleText;
};

// Functions to update tooltip/text box for circles
function updateToolTip(circlesGroup, chosenXAxis, chosenYAxis) {

    var xLabel;
    var yLabel = "Age: ";

    if (chosenXAxis === "poverty") {
        xLabel = "Poverty";       
    } else if (chosenXAxis === "obesity") {
        xLabel = "Obesity: ";
    } else if (chosenXAxis === "smokes") {
        xLabel = "Smoking: ";
    } else {
        xLabel = "Healthcare: ";
    };

    if (chosenYAxis !== "age") {
        yLabel = "Income: $";
    };
    

    var toolTip = d3.tip()
        .attr("class", "tooltip")  
        .offset([113,89])      
        .html(function(d) {
            return (`${d.state}<br><br>${xLabel}${d[chosenXAxis]}<br>${yLabel}${d[chosenYAxis]}`);
        });

    circlesGroup.call(toolTip);

    circlesGroup
        .on("mouseover", function(d) {
            toolTip.show(d, this);
        })
        .on("mouseout", function(d){
            toolTip.hide(d);
        });

    return circlesGroup;
}; 




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

    var xScale = xLinearScale(incomingData, chosenXAxis);

    var yScale = yLinearScale(incomingData, chosenYAxis);

    var bottomAxis = d3.axisBottom(xScale);
    var leftAxis = d3.axisLeft(yScale);

    var xAxis = chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    var yAxis = chartGroup.append("g")
        .call(leftAxis);

    // Create circles for the scatter
    var circlesGroup = chartGroup.selectAll("circle")
        .data(incomingData)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d[chosenXAxis]))
        .attr("cy", d => yScale(d[chosenYAxis]))
        .attr("r", 15)
        .attr("fill", "pink")
        .attr("opacity", ".5")
        .attr("stroke", "black")
        
    var circleText = chartGroup.selectAll("cirlce")
        .data(incomingData)
        .enter()
        .append("text")
        .attr("x", d => xScale(d[chosenXAxis]))
        .attr("y", d => yScale(d[chosenYAxis]))
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        .text(d => d.abbr);

    var circlesGroup = updateToolTip(circlesGroup, chosenXAxis, chosenYAxis);
    
    var xLabelGroup = chartGroup.append("g")
        .attr("class", "xaxis-labels");
    var yLabelGroup = chartGroup.append("g");
    
    // X-Axis Label
    // Create Healthcare Label (x-axis)
    var healthcareLabel = xLabelGroup.append("text")
        .attr("y", 0 + (height + (margin.bottom/2) - 5))
        .attr("x", 0 + (svgWidth / 2) - 400)  
        .attr("dy", "1em")
        .classed("axis-text", true)
        .attr("value", "healthcare")
        .text("Healthcare");

    // Create Poverty Label (x-axis)
    var povertyLabel = xLabelGroup.append("text")
        .attr("y", 0 + (height + (margin.bottom/2) - 5))
        .attr("x", 0 + (svgWidth / 2) - 200)  
        .attr("dy", "1em")
        .classed("axis-text", true)
        .attr("value", "poverty")
        .text("Poverty");

    // Create Obesity Label (x-axis)
    var obesityLabel = xLabelGroup.append("text")
        .attr("y", 0 + (height + (margin.bottom/2) - 5))
        .attr("x", 0 + (svgWidth / 2)-25)  
        .attr("dy", "1em")
        .classed("axis-text", true)
        .attr("value", "obesity")
        .text("Obesity");

    // Create Smoking Label (x-axis)
    var smokingLabel = xLabelGroup.append("text")
        .attr("y", 0 + (height + (margin.bottom/2) - 5))
        .attr("x", 0 + (svgWidth / 2) + 150)  
        .attr("dy", "1em")
        .classed("axis-text", true)
        .attr("value", "smokes")
        .text("Smoking");
    
    // Y-Axis Label
    // create Age Label (y-axis)
    var ageLabel = yLabelGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 1)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("value", "age")
        .text("Age");
    
    // Create Income Label (y-axis)
    var incomeLabel = yLabelGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 20)
        .attr("x", 0 - (height / 2))  
        .attr("dy", "1em")
        .attr("value", "income")
        .text("Income");


    
    

    // Create Event Listener for X Labels
    xLabelGroup.selectAll("text")
        .on("click", function(){
            var value = d3.select(this).attr("value");
            
            if (value !== chosenXAxis) {
                chosenXAxis = value;
                console.log(chosenXAxis);

                // define new xScale for chosenXAxis
                xScale = xLinearScale(incomingData, chosenXAxis);

                // Use function above to update circles on graph
                updateCirclesX(circlesGroup, xScale, chosenXAxis);

                // Render x-axis based on new data
                renderXAxis(xAxis, xScale);

                // render Circle text with transition
                renderCircleText(circleText, chosenXAxis, chosenYAxis);

                // Update ToolTip
                updateToolTip(circlesGroup, chosenXAxis, chosenYAxis);
            };

            
        });

    yLabelGroup.selectAll("text")
        .on("click", function() {
            var yValue = d3.select(this).attr("value")

            if (yValue !== chosenYAxis) {
                chosenYAxis = yValue;
                console.log(yValue)
                
                // define new xScale for chosenXAxis
                yScale = yLinearScale(incomingData, chosenYAxis);

                // Use function above to update circles on graph
                updateCirclesY(circlesGroup, yScale, chosenYAxis);
                
                // Render circle text with transition
                renderCircleText(circleText, chosenXAxis, chosenYAxis);
                
                // render y-axis with transition
                renderYAxis(yAxis, yScale);

                // Update ToolTip
                updateToolTip(circlesGroup, chosenXAxis, chosenYAxis);
            };
        });

        if (chosenXAxis === "healthcare") {
            healthcareLabel.classed("axis-text:active", true)
        }

    

}).catch(function(error) {
    console.log(error)
});
