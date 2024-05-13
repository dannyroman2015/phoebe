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
})

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
  const svg = d3.select("div")
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