const drawSixSChart = (data, dates, areas) => {
  const margin = {top: 0, right: 10, bottom: 30, left: 40}
  const width = 900
  const height = 300
  const innerWidth = width - margin.left - margin.right
  const innerHeight = height - margin.top - margin.bottom

  const svg = d3.create("svg")
    .append("svg")
    .attr("viewBox", [0, 0, width, height])

  const innerChart = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)

  var s6dates = dates
  var s6areas = areas
  var s6data = data

  const xScale = d3.scaleBand()
    .domain(s6areas)
    .range([0, innerWidth])
    .padding(0.01);

  const xAxis = d3.axisBottom(xScale)

  innerChart.append("g")
    .attr("transform", `translate(0, ${innerHeight})`)
    .call(xAxis)
    .call(g => g.select(".domain").remove())
    .call(g => g.selectAll(".tick text").attr("font-size", 12).attr("stroke", "75485E").style("text-transform", "uppercase"))
  const yScale = d3.scaleBand()
    .domain(s6dates)
    .range([innerHeight, 0])
    .padding(0.01);

  const yAxis = d3.axisLeft(yScale)

  innerChart.append("g")
    .call(yAxis)
    .call(g => g.select(".domain").remove())

  const colorScale = d3.scaleThreshold([1, 2, 3, 4, 5, 6, 7, 8, 9], d3.schemeRdYlGn[10]);
  
  innerChart
    .selectAll()
    .data(s6data)
    .join("rect")
        .attr("x", d => xScale(d.Area))
        .attr("y", d => yScale(d.Date))
        .attr("width", xScale.bandwidth())
        .attr("height", yScale.bandwidth())
        .style("fill", d => colorScale(d.Score))
      .append("title")
        .text(d => d.Score)
  
  return svg.node();
}