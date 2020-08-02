/**
 * Copyright © 2020, Mary B. Feezell
 *
 * Lab Assignment, Module 11, Geologic Time line to Linear Scale
 * various events plotted on a single, linear scale from early Hadean
 * to present, Quaternary Period.
 *
 * Chart designed in Javascript, with D3 Library, Data-Driven Documents,
 *   https://d3js.org/
 *
 *
 * @summary Geological Events Chart in javascript and D3 library
 * @author Mary Brinson Feezell - mk@feezell.com
 *
 * Last Modified  : 2020-07-30
 *
 */

var margin = {top: 10, right: 0, bottom: 10, left: 80},
  width = 900 - margin.left - margin.right,
  height = 100000 - margin.top - margin.bottom;

var maxYA = 4580000000,
  yScale, yAxisValues,yAxisTicks, periods, periodBlocks, periodLabels;

var periodWidth = .80,
  eraWidth = .10;

var spanWidth = {Period: periodWidth * width, Era: eraWidth * width, Eon: width * (1 - periodWidth - eraWidth), Supereon: (periodWidth + eraWidth) * width},
  spanX = {Period: 0, Era: width * periodWidth, Eon: width * (periodWidth + eraWidth), Supereon: 0},
  spanFontSize = {Period: '12px', Era: '15px', Eon: '20px', Supereon: '12px'},
  spanRot = {Period: 0, Era: 90, Eon: 90, Supereon: 0}; // degree of rotation for labels

//define the chart area
var svg = d3.select('#timescale')
  .append('svg')
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  // .style('background', "AliceBlue")
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.right + ')')

yScale = d3.scaleLinear() // Scale 0-4,600 MYA date range onto height of chart
  .domain([0, maxYA])
  .range([height - margin.bottom, margin.top]);

// Add Geologic Time Spans, i.e., Eons, Eras, and Periods
d3.csv("./data/Mod11LabSpans.csv", function(d) { // parse csv span data; convert numerical strings to numbers
  return {
    name: d.name,
    span: d.span,
    begin: +d.begin,
    end: +d.end,
    color: d.color,
    comment: d.comment
  };
}).then(function(data) {
  console.log(data);

  // yScale = d3.scaleLinear()
  //   .domain([0, maxYA])
  //   .range([height - margin.bottom, margin.top]);

  // console.log(yScale(20000));

  // yAxisValues = d3.scaleLinear()
  //   .domain([0, maxYA])
  //   .range([height - margin.bottom, margin.top]);

  yAxisTicks = d3.axisLeft(yScale)
    .ticks(160)

  spans = svg
      .selectAll('foo').data(data)
      .enter();

  spanBlocks = spans // draw rectangles defining spans
      .append('rect')
      .attr("x", function(d) {return spanX[d.span]})
      .attr("y", function(d) {return yScale(d.begin)})
      .attr("width", function(d) { return spanWidth[d.span]})
      .attr("height", function(d) {
        return yScale(d.end) - yScale(d.begin);})

      .style("fill", function(d) {return d.color})
      .style("fill-opacity", "0.4")
      .style('stroke', 'black')
      .attr("stroke-width", ".25");

    spanLabels = spans // add span labels
      .append('g')
      .attr("transform", function(d) {
        if ( (d.span == 'Period') || (d.span == 'Supereon')) { // rotate labels for eons and eras 90°
          return 'translate(' + (spanX[d.span]+spanWidth[d.span]/2)
            + ', ' + (yScale(d.begin) + 15)
            + ') rotate(' +spanRot[d.span] +')'
          } else {
            return 'translate(' + (spanX[d.span]+spanWidth[d.span]/2)
              + ', ' + (yScale(d.begin) + (yScale(d.end) - yScale(d.begin))/2)
              + ') rotate(' +spanRot[d.span] +')'
          } // end else
      })
      .append('text')
      .attr("text-anchor", "middle")
      .text(function(d) {
        return d.name + ' ' + d.span + ' (' + d.begin/1000000 + ' - ' + d.end/1000000 + ' MYA)'})
      .attr("font-family", "sans-serif")
      .attr("font-weight", 600)
      .attr("font-size", function(d) {return spanFontSize[d.span]})
      .attr("fill", "black");

    // add Y Axis guide along left
    yGuide = d3.select('#timescale svg').append('g')
      .attr('transform', 'translate(80,0)')
      .call(yAxisTicks);

}); // end d3.csv(Mod11LabPeriods)



// Add selected events
d3.csv("./data/Mod11LabEvents.csv", function(d) { // parse csv event data; convert numerical strings to numbers
  return {
    year: +d.Year,
    event: d.Event
  };
}).then(function(data) {
  console.log(data);

  // yScale = d3.scaleLinear()
  //   .domain([0, maxYA])
  //   .range([height - margin.bottom, margin.top]);

  svg.selectAll("dot")  // plot event markers
    .data(data)
    .enter().append("circle")
      .attr("r", 2)
      .attr("cx", 20)
      .attr("cy", function(d) {return yScale(d.year);})

  svg.selectAll("events") // add labels to markers
    .data(data)
    .enter().append("text")
      .attr('font-size', 10)
      .attr('x', 24)
      .attr('y', function(d) {return yScale(d.year) - 2 ;}) // lift labels slightly above markers
      .text(function(d) {return d.event;});

}); //end d3.csv - Events
