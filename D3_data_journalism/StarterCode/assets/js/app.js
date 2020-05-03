// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 100
  };

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3.select("#scatter")
  .append("svg")
  .classed("chart", true)
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.csv("assets/data/data.csv").then(function(smokersData) {

    // Step 1: Parse Data/Cast as numbers
    // ==============================
    smokersData.forEach(function(data) {
      data.age = +data.age;
      data.smokes = +data.smokes;
    });
    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
      .domain([8, d3.max(smokersData, d => d.age)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(smokersData, d => d.smokes)])
      .range([height, 0]);

    // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // Step 5: Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
      .data(smokersData)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d.age))
      .attr("cy", d => yLinearScale(d.smokes))
      .attr("r", "10")
      .attr("fill", "#6886c5")
      .attr("opacity", ".6")
      .attr("stroke-width", "1")
      .attr("stroke", "black");

      chartGroup.select("g").selectAll("circle")
      .data(smokersData)
      .enter()
      .append("text")
      .text(d => d.abbr)
      .attr("x", d => xLinearScale(d.age))
      .attr("y", d => yLinearScale(d.smokes))
      .attr("dy",-415)
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .attr("fill", "black");


    // Step 6: Initialize tool tip
    // ==============================
    
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}<br>Age(%): ${d.age}<br>Smokers(%): ${d.smokes}`);
      });

    // Step 7: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup.on("click", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Smokers(%)");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 20})`)
      .attr("class", "axisText")
      .text("Age(Median)");
      
}).catch(function(error) {
    console.log(error);
});
