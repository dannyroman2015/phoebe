const drawChart = (data) => {
  const formatsInfo = [
  {id: "vinyl", label: "Vinyl", color: "#76B6C2"},
  {id: "eight_track", label: "8-Track", color: "#4CDDF7"},
  {id: "cassette", label: "Cassette", color: "#20B9BC"},
  {id: "cd", label: "CD", color: "#2F8999"},
  {id: "download", label: "Download", color: "#E39F94"},
  {id: "streaming", label: "Streaming", color: "#ED7864"},
  {id: "other", label: "Other", color: "#ABABAB"},
];
  const width = 900;
  const height = 350;
  const margin = {top: 20, right: 20, bottom: 30, left: 40};
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const svg = d3.select("#provalcht")
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