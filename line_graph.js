var margin = { top: 100, right: 50, bottom: 20, left: 200 };

var container_width = window.innerWidth - 50;
var container_height = window.innerHeight - 50;

var width = container_width - (margin.left + margin.right)
var height = container_height - (margin.top + margin.bottom)

// Load the data locally, note that chrome has issues with this. Use firefox or edge

d3.json("trial.json").then(function(data) {


d3.select("body").append("svg")
    .attr("id", "container")
    .attr("height", container_height)
    .attr('width', container_width)
      .append("g")
      .attr("id", "draw_content")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// setup axes functions to draw paths later

var timeAxes = d3
  .scaleLinear()
  .domain([0, 1])
  .range([0, width]);

var sentimentAxes = d3
  .scaleLinear()
  .domain([5, -5])
  .range([0, height]);

// color schemes found here https://github.com/d3/d3-scale-chromatic

var colorScheme = d3.scaleOrdinal(d3.schemeDark2 );

var svg = d3
    .select("#container")
    .select("#draw_content")

// draw axes and label

svg
  .append("g")
  .call(d3.axisLeft(sentimentAxes));

svg
  .append("text")
  .text("Sentiment Score")
  .attr("x", -30)
  .attr("y", height/2)
  .style("text-anchor", "middle")
  .attr("transform", "rotate(-90, -30,"+ height/2 +")");

svg
  .append("g")
  .attr("transform", "translate(" + 0 + "," + height/2 + ")")
  .call(d3.axisBottom(timeAxes))

// draw the paths for each document

var numberOfParagraphs = 1

var lineFunction = d3
  .line()
  .x(function(d, i) {
    return timeAxes(i/numberOfParagraphs);
  })
  .y(function(d) {
    return sentimentAxes(d.sentiment);
  })
  .curve(d3.curveMonotoneX);

svg
  .append("g")
  .attr("class", "paths")
  .selectAll(".linePath")
  .data(data)
  .enter()
  .append("path")
  .attr("class", "linePath")
  .attr("id", function(d){
    console.log(d)
    return d.doc_id
  })
  .attr("d", function(d) {
    numberOfParagraphs = d.para_data.length
    return lineFunction(d.para_data)
  })
  .attr("stroke", function(d, i) {
    return colorScheme(i);
  })
  .attr("stroke-width", 2)
  .attr("fill", "none")
  .attr("opacity", 0.1);

// draw a check box for each document, with interacticity

svg
  .append("g")
  .attr("class", "checkboxes")
  .selectAll(".checkBox")
  .data(data)
  .enter()
  .append("rect")
  .attr("id", function(d){
    console.log(d)
    return "block" + d.doc_id
  })
  .attr("x", -200)
  .attr("y", function(d, i) {
    return (i/data.length) * height
  })
  .attr("height", 25)
  .attr("width", 25)
  .attr("fill", function(d, i) {
    return colorScheme(i);
  })
  .attr("opacity", 0.1)
  .on("click", function(d) {
    let finder = "#" + d.doc_id
    if (d3.select(finder).attr("opacity") == 0.1) {
      d3.select(finder)
      .attr("opacity", 1);

      d3.select(this)
      .attr("opacity", 1);
    } else {
      d3.select(finder)
      .attr("opacity", 0.1);

      d3.select(this)
      .attr("opacity", 0.1);
    }
  })
  .on(
    "mouseover",
    function(d) {
      d3.select(this).style("cursor", "pointer");
    },
    "mouseout",
    function(d) {
      d3.select(this).style("cursor", "default");
    }
  )


// labels for checkbox

  svg
    .append("g")
    .attr("class", "labels")
    .selectAll(".checkBoxLabel")
    .data(data)
    .enter()
    .append("text")
    .attr("x", -170)
    .attr("y", function(d, i) {
      return (i/data.length) * height + 15
    })
    .text(function(d) {
      return d.doc_path
    })

// title

    svg
      .attr("id", "title")
      .append("text")
      .attr("x", -170)
      .attr("y", -50)
      .text("Temporal Sentiment Analysis")
      .style("font-size", "36px")

// turn some of the checkboxes on for extra visual aid

    svg
      .selectAll("#DOC_00, #DOC_01")
      .attr("opacity", 1)
    svg
      .selectAll("#blockDOC_00, #blockDOC_01")
      .attr("opacity", 1)
})
