  
  const margin = { top: 50, right: 0, bottom: 50, left: 70};
  const width = 900;
  const height = 350;
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const formatsInfo = [
  {id: "vinyl", label: "Vinyl", color: "#76B6C2"},
  {id: "eight_track", label: "8-Track", color: "#4CDDF7"},
  {id: "cassette", label: "Cassette", color: "#20B9BC"},
  {id: "cd", label: "CD", color: "#2F8999"},
  {id: "download", label: "Download", color: "#E39F94"},
  {id: "streaming", label: "Streaming", color: "#ED7864"},
  {id: "other", label: "Other", color: "#ABABAB"},
];

d3.csv("/static/data.csv", d3.autoType).then( data => {
  
  drawDonutCharts(data);
  drawStackedBars(data);
  drawStreamGraph(data);
})

const drawStreamGraph = (data) => {
  const svg = d3.select("#streamgraph")
    .append("svg")
      .attr("viewBox", [0, 0, width, height]);

  const innerChart = svg
    .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`)

  const stackGenerator = d3.stack()
    .keys(formatsInfo.map(f => f.id))
    .order(d3.stackOrderAscending)
    .offset(d3.stackOffsetSilhouette);
  
  const annotatedData = stackGenerator(data)
  
  const maxUpperBoundary = d3.max(annotatedData[annotatedData.length - 1], d => d[1])

  const xScale = d3.scaleBand()
    .domain(data.map(d => d.year))
    .range([0, innerWidth])
    .paddingInner(0.2);

    const minLowerBoundaries = []
    const maxUpperBoundaries = []
  
    annotatedData.forEach(series => {
      minLowerBoundaries.push(d3.min(series, d => d[0]))
      maxUpperBoundaries.push(d3.max(series, d => d[1]))
    })
  
    const minDomain = d3.min(minLowerBoundaries)
    const maxDomain = d3.max(maxUpperBoundaries)

  const yScale = d3.scaleLinear()
    .domain([minDomain, maxDomain])
    .range([innerHeight, 0])
    .nice()

  const colorScale = d3.scaleOrdinal()
    .domain(formatsInfo.map(f => f.id))
    .range(formatsInfo.map(f => f.color))

  const areaGenerator = d3.area()
    .x(d => xScale(d.data.year) + xScale.bandwidth()/2)
    .y0(d => yScale(d[0]))
    .y1(d => yScale(d[1]))
    .curve(d3.curveCatmullRom);

    const bottomAxis = d3.axisBottom(xScale)
    .tickValues(d3.range(1975, 2020, 5))
    .tickSizeOuter(0)

  innerChart
    .append("g")
      .attr("class", "x-axis-streamgraph")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(bottomAxis)

  innerChart
    .append("g")
      .attr("class", "areas-container")
    .selectAll("path")
    .data(annotatedData)
    .join("path")
      .attr("d", areaGenerator)
      .attr("fill", d => colorScale(d.key));

  const leftAxis = d3.axisLeft(yScale)
  
  innerChart
    .append("g")
    .call(leftAxis)

  const leftAxisLabel = svg
    .append("text")
      .attr("dominant-baseline", "hanging")
  leftAxisLabel
    .append("tspan")
      .text("Total revenue")
  leftAxisLabel
    .append("tspan")
      .text("million USD")
      .attr("dx", 5)
      .attr("fill-opacity", 0.5)
  leftAxisLabel
    .append("tspan")
      .text("Adjusted for inflation")
      .attr("x", 0)
      .attr("dy", 20)
      .attr("fill-opacity", 0.5)
      .attr("font-size", "14px")

  const legendItems = d3.select(".legend-container")  
    .append("ul")
      .attr("class", "color-legend")
    .selectAll(".color-legend-item")
    .data(formatsInfo)
    .join("li")
      .attr("class", "color-legend-item")

  legendItems
    .append("span")
      .attr("class", "color-legend-item-color")
      .style("backgound-color", d => d.color);
  
  legendItems
    .append("text")
      .attr("class", "color-legend-item-label")
      .text(d => d.label)
}

const drawStackedBars = (data) => {
  
  const svg = d3.select("#bars")
    .append("svg")
      .attr("viewBox", [0, 0, width, height]);
  
  const innerChart = svg
    .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

  const stackGenerator = d3.stack()
    .keys(formatsInfo.map(f => f.id))
  
  const annotatedData = stackGenerator(data);

  const colorScale = d3.scaleOrdinal()
    .domain(formatsInfo.map(f => f.id))
    .range(formatsInfo.map(f => f.color));

  const xScale = d3.scaleBand()
    .domain(data.map(d => d.year))
    .range([0, innerWidth])
    .paddingInner(0.2);

  const maxUpperBoundary = d3.max(annotatedData[annotatedData.length - 1], d => d[1])
  const yScale = d3.scaleLinear()
    .domain([0, maxUpperBoundary])
    .range([innerHeight, 0])
    .nice();

  annotatedData.forEach(serie => {
    innerChart
      .selectAll(`bar-${serie.key}`)
      .data(serie)
      .join("rect")
        .attr("class", d => `bar-${serie.key}`)
        .attr("x", d => xScale(d.data.year))
        .attr("y", d => yScale(d[1]))
        .attr("width", xScale.bandwidth())
        .attr("height", d => yScale(d[0]) - yScale(d[1]))
        .attr("fill", colorScale(serie.key));
  })

  const bottomAxis = d3.axisBottom(xScale)
    .tickValues(d3.range(1975, 2020, 5))
    .tickSizeOuter(0)
  
  innerChart
    .append("g")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(bottomAxis)
  
  const leftAxis = d3.axisLeft(yScale)
  
  innerChart
    .append("g")
      .call(leftAxis)
}

const drawDonutCharts = (data) => {
  const svg = d3.select("#donut")
    .append("svg")
      .attr("viewBox", [0, 0, width, height]);
  
  const donutContainers = svg
    .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

  const xScale = d3.scaleBand()
    .domain(data.map(d => d.year))
    .range([0, innerWidth])

  const colorScale = d3.scaleOrdinal()
    .domain(formatsInfo.map(f => f.id))
    .range(formatsInfo.map(f => f.color));

  const years = [1975, 1995, 2013];

  const formats = data.columns.filter(format => format !== "year");
  
  years.forEach(year => {
    const yearData = data.find(d => d.year === year);
    const formattedData = [];
    formats.forEach(format => {
      formattedData.push({format: format, sales: yearData[format]});
    });

    const pieGenerator = d3.pie()
      .value(d => d.sales);
    const annotatedData = pieGenerator(formattedData);
  
    const arcGenerator = d3.arc()
      .startAngle(d => d.startAngle)
      .endAngle(d => d.endAngle)
      .innerRadius(60)
      .outerRadius(100)
      .padAngle(0.02)
      .cornerRadius(3)
  
    const donutContainer = donutContainers
      .append("g")
        .attr("transform", `translate(${xScale(year)}, ${innerHeight / 2})`)

    const arcs = donutContainer
      .selectAll(`path.arc-${year}`)
      .data(annotatedData)
      .join("g")
        .attr("class", d => `arc-${year}`)

    arcs
      .append("path")
        .attr("d", arcGenerator)
        .attr("fill", d => colorScale(d.data.format))
    
    arcs
      .append("text")
        .text(d => {
          d["percentage"] = (d.endAngle - d.startAngle) / (2 * Math.PI);
          return d3.format(".0%")(d.percentage);
        })
        .attr("x", d => {
          d["centroid"] = arcGenerator
            .startAngle(d.startAngle)
            .endAngle(d.endAngle)
            .centroid();
          return d["centroid"][0];
        })
        .attr("y", d => d.centroid[1])
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .attr("fill", "#f6fafc")
        .attr("fill-opacity", d => d.percentage < 0.05 ? 0 : 1)
        .style("font-size", "16px")
        .style("font-weight", 500);

      donutContainer
        .append("text")
          .text(year)
          .attr("text-anchor", "middle")
          .attr("dominant-baseline", "middle")
          .style("font-size", "24px")
          .style("font-weight", 500);
  })

}

function chart1(data) {
  const width = 928;
  const height = 500;
  const margin = { top: 20, right: 20, bottom: 20, left: 40 }

  const xScale = d3.scaleUtc()
    .domain(d3.extent(data, d => d.date))
    .range([margin.left, width - margin.right])

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.close)])
    .range([height - margin.bottom, margin.top])

  const lineGenerator = d3.line()
    .x(d => xScale(d.date))
    .y(d => yScale(d.close))

  const axisBottom = d3.axisBottom(xScale)
    .ticks(width / 80)
    .tickSizeOuter(0)

  const axisLeft = d3.axisLeft(yScale)
    .ticks(height/40)

  const annotatedLine = lineGenerator(data)

  const svg = d3.create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto; height: intrinsic;")

  svg.append("path")
    .attr("fill", "none")
    .attr("stroke", "red")
    .attr("stroke-width", 2)
    .attr("d", annotatedLine)

  svg.append("g")
    .attr("transform", `translate(0, ${height - margin.bottom})`)
    .call(axisBottom)

  svg.append("g")
    .attr("transform", `translate(${margin.left}, 0)`)
    .call(axisLeft)
    .call(g => g.select(".domain").remove())
    .call(g => g.selectAll(".tick line").clone()
      .attr("x2", width - margin.left - margin.right)
      .attr("stroke-opacity", 0.1))
    .call(g => g.append("text")
      .text("Daily close")
      .attr("text-anchor", "start")
      .attr("x", - margin.left)
      .attr("y", 15)
      .attr("fill", "black")
      .attr("font-size", "14px")
    )

  return svg.node()
}
const aapl = await d3.csv("/static/aapl.csv", d3.autoType)
container0.append(chart1(aapl))

// const chart2 = (data) => {
//   const width = 1000;
//   const height = 500;
//   const margin = { top: 40, right: 170, bottom: 25, left: 40 }
//   const innerWidth = width - margin.left - margin.right;
//   const innerHeight = height - margin.top - margin.bottom;  

//   const aubergine = "#75485E"

//   const firstDate = new Date(2021, 0, 1)
//   const xScale = d3.scaleTime()
//     .domain([firstDate, d3.max(data, d => d.date)])
//     .range([0, innerWidth])

//   const yScale = d3.scaleLinear()
//     .domain([0, d3.max(data, d => d.max_temp_F)])
//     .range([innerHeight, 0])
    
//   const bottomAxis = d3.axisBottom(xScale)
//     .tickFormat(d3.timeFormat("%b"));

//   const leftAxis = d3.axisLeft(yScale);

//   const svg = d3.create("svg")
//     .attr("viewBox", [0, 0, width, height])

//   const innerChart = svg.append("g")
//     .attr("transform", `translate(${margin.left}, ${margin.top})`);

    

//   innerChart.append("g")
//     .attr("class", "axis-x")
//     .attr("transform", `translate(0, ${innerHeight})`)
//     .call(bottomAxis);

//   innerChart.append("g")
//     .attr("class", "axis-y")
//     .attr("transform", `translate(0, 0)`)
//     .call(leftAxis);
    
//   d3.selectAll(".axis-x.tick text")
//     .attr("y", "20px")
//     .style("font-family", "Roboto, sans-serif")
//     .style("font-size", "24px");

//   innerChart
//     .selectAll("circle")
//     .data(data)
//     .join("circle")
//       .attr("r", 4)
//       .attr("cx", d => xScale(d.date))
//       .attr("cy", d => yScale(d.avg_temp_F))
//       .attr("fill", aubergine);
    
//     return svg.node()
// }
// const a = await d3.csv("/static/a.csv", d3.autoType)
// container1.append(chart2(a))



// Load the data here
d3.csv("/static/a.csv", d3.autoType).then(data => {
  console.log("temperature data", data);
  drawLineChart(data);
});

// Create the line chart here
const drawLineChart = (data) => {

  /*******************************/
  /*    Declare the constants    */
  /*******************************/
  const margin = {top: 40, right: 170, bottom: 25, left: 40};
  const width = 1000;
  const height = 500;
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const aubergine = "#75485E";


  /*******************************/
  /*    Append the containers    */
  /*******************************/
  // Append the SVG container
  const svg = d3.select("#line_chart")
    .append("svg")
      .attr("viewBox", `0, 0, ${width}, ${height}`);

  // Append the group that will contain the inner chart
  const innerChart = svg
    .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

  
  /****************************/
  /*    Declare the scales    */
  /****************************/
  // X scale
  const firstDate = new Date(2021, 0, 1, 0, 0, 0);
  const lastDate = d3.max(data, d => d.date);
  const xScale = d3.scaleTime()
    .domain([firstDate, lastDate])
    .range([0, innerWidth]);

  // Y scale
  const maxTemp = d3.max(data, d => d.max_temp_F);
  const yScale = d3.scaleLinear()
    .domain([0, maxTemp])
    .range([innerHeight, 0]);

  
  /***************************/
  /*     Append the axes     */
  /***************************/
  // Bottom axis
  const bottomAxis = d3.axisBottom(xScale)
    .tickFormat(d3.timeFormat("%b"));
  innerChart
    .append("g")
      .attr("class", "axis-x")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(bottomAxis);
  d3.selectAll(".axis-x text")
    .attr("x", d => {
       const currentMonth = d;
       const nextMonth = new Date(2021, currentMonth.getMonth() + 1, 1);
       return (xScale(nextMonth) - xScale(currentMonth)) / 2;
    })
    .attr("y", "10px");

  // Left axis
  const leftAxis = d3.axisLeft(yScale);
  innerChart
    .append("g")
      .attr("class", "axis-y")
      .call(leftAxis);
  d3.selectAll(".axis-y text")
    .attr("x", "-5px");

  // Set the font-family and font-size property of axis labels
  // This could also be handled from a CSS file
  d3.selectAll(".axis-x text, .axis-y text")
    .style("font-family", "Roboto, sans-serif")
    .style("font-size", "14px");

  // Add label to the y-axis
  svg
    .append("text")
      .text("Temperature (°F)")
      .attr("y", 20);

  
  /************************************************/
  /*   Area chart of the temperature variability  */
  /************************************************/
  // Initialize the area generator
  const areaGenerator = d3.area()
    .x(d => xScale(d.date))
    .y0(d => yScale(d.min_temp_F))
    .y1(d => yScale(d.max_temp_F))
    .curve(d3.curveCatmullRom);

  // Draw the area
  innerChart
    .append("path")
      .attr("d", areaGenerator(data))
      .attr("fill", aubergine)
      .attr("fill-opacity", 0.2);

  
  /*********************************************/
  /*   Line chart of the average temperature   */
  /*********************************************/
  // Draw the data points
  innerChart
    .selectAll("circle")
    .data(data)
    .join("circle")
      .attr("r", 4)
      .attr("cx", d => xScale(d.date))
      .attr("cy", d => yScale(d.avg_temp_F))
      .attr("fill", aubergine);
    
  // Initialize the line/curve generator
  const curveGenerator = d3.line()
    .x(d => xScale(d.date))
    .y(d => yScale(d.avg_temp_F))
    .curve(d3.curveCatmullRom);
    
  // Draw the line/curve
  innerChart
    .append("path")
      .attr("d", curveGenerator(data))
      .attr("fill", "none")
      .attr("stroke", aubergine);

      
  /************************/
  /*      Add labels      */
  /************************/

  // Label for line chart
  innerChart
    .append("text")
      .text("Average temperature")
      .attr("x", xScale(lastDate) + 10)
      .attr("y", yScale(data[data.length - 1].avg_temp_F))
      .attr("dominant-baseline", "middle")
      .attr("fill", aubergine);

  // Annotation for max temperature
  innerChart
    .append("text")
      .text("Maximum temperature")
      .attr("x", xScale(data[data.length - 4].date) + 13)
      .attr("y", yScale(data[data.length - 4].max_temp_F) - 20)
      .attr("fill", aubergine);
  innerChart
    .append("line")
      .attr("x1", xScale(data[data.length - 4].date))
      .attr("y1", yScale(data[data.length - 4].max_temp_F) - 3)
      .attr("x2", xScale(data[data.length - 4].date) + 10)
      .attr("y2", yScale(data[data.length - 4].max_temp_F) - 20)
      .attr("stroke", aubergine)
      .attr("stroke-width", 2);

  // Annotation for min temperature
  innerChart
    .append("text")
      .text("Minimum temperature")
      .attr("x", xScale(data[data.length - 3].date) + 13)
      .attr("y", yScale(data[data.length - 3].min_temp_F) + 20)
      .attr("dominant-baseline", "hanging")
      .attr("fill", aubergine);
  innerChart
    .append("line")
      .attr("x1", xScale(data[data.length - 3].date))
      .attr("y1", yScale(data[data.length - 3].min_temp_F) + 3)
      .attr("x2", xScale(data[data.length - 3].date) + 10)
      .attr("y2", yScale(data[data.length - 3].min_temp_F) + 20)
      .attr("stroke", aubergine)
      .attr("stroke-width", 2);

};