// select the canvas
const svg = d3.select('.canvas')
    .append('svg')
    .attr('height',600)
    .attr('width',1200);
    
const margin = {top: 20, right: 20, bottom: 100, left: 400};
const graphW = 1200 - margin.left - margin.right;
const graphH = 600 - margin.top - margin.bottom;
    
const graph = svg.append('g')
  .attr('width', graphW)
  .attr('height', graphH)
  .attr('transform', `translate(${margin.left}, ${margin.top})`);

// creating x axis and y axis groups
const xAxisG = graph.append('g')
  .attr('transform', `translate(0, ${graphH})`)
const yAxisG = graph.append('g');

const updateFunction = (data) =>{
  //linear scale
  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.Murder)])
    .range([graphH, 0]);
  
  //Band scale
  const x = d3.scaleBand()
    .domain(data.map(d => d.States))
    .range([0, graphW])
    .paddingInner(0.2)
    .paddingOuter(0.2);

    

  // joining data to reactangles
  const rects = graph.selectAll('rect')
    .data(data);
  
  // remove extra rectangles
  rects.exit().remove();
  
  // adding attributes to rectangle already in DOM
  rects.attr('width', x.bandwidth)
    .attr("height",  d => graphH - y(d.Murder))
    .attr('fill', 'orange')
    .attr('x', d => x(d.States))
    .attr('y', d => y(d.Murder));

  // appending the enter selection to the DOM
  rects.enter()
    .append('rect')
      .attr('width', x.bandwidth)
      .attr("height",  d => graphH - y(d.Murder))
      .attr('fill', 'orange')
      .attr('x', d => x(d.States))
      .attr('y', d => y(d.Murder));

  // creating x and y axis
  const xAxis = d3.axisBottom(x)
  const yAxis = d3.axisLeft(y)
  .tickFormat(d=>'MurderRate '+ d  );

  //call x axis and y-axis group
  xAxisG.call(xAxis);
  yAxisG.call(yAxis);
  
  //rotating texts on x-axis
  xAxisG.selectAll('text')
    .attr('fill', 'rebeccapurple')
    .attr('transform', 'rotate(-40)')
    .attr('text-anchor', 'end')

  yAxisG.selectAll('text')
    .attr('fill', 'rebeccapurple')
}

//reading data from json file
d3.json('murderrate.json').then(data => {

  //calling update function
  updateFunction(data);  

});