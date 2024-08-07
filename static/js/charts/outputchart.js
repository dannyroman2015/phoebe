const drawRdOpTotalChart = (data) => {
  const width = 900;
  const height = 350;
  const margin = {top: 20, right: 20, bottom: 20, left: 40};
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const svg = d3.create("svg")
    .attr("viewBox", [0, 0, width, height]);
  
  const innerChart = svg
    .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

  const x = d3.scaleBand()
    .domain(data.map(d => d.section))
    .range([0, innerWidth])
    .paddingInner(0.2);

  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.qty)])
    .range([innerHeight, innerHeight/4])
    .nice();

  const y1 = d3.scaleLinear()
    .domain(d3.extent(data, d => d.avg))
    .range([innerHeight/4, 0])
    .nice();

  innerChart
    .append("g")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(d3.axisBottom(x).tickSizeOuter(0))
      .call(g => g.selectAll(".domain").remove())
      .call(g => g.selectAll("text").attr("font-size", "12px").attr("font-weight", 600).style("text-transform", "capitalize"))

  innerChart
    .selectAll(`rect`)
    .data(data)
    .join("rect")
      .attr("x", d => x(d.section))
      .attr("y", d => y(d.qty))
      .attr("width", x.bandwidth())
      .attr("height", d => y(0) - y(d.qty))
      .attr("fill", "#DCA47C");

  innerChart.append("g")
      .attr("font-family", "san-serif")
      .attr("font-size", 14)
      .attr("font-weight", 600)
    .selectAll()
    .data(data)
    .join("text")
      .text(d => d3.format(",.3s")(d.qty))
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "start")
      .attr("x", d => x(d.section) + x.bandwidth()/2)
      .attr("y", d => y(d.qty))
      .attr("dy", "-0.1em")
      .attr("fill", "#75485E")

  innerChart.append("path")
    .attr("fill", "none")
    .attr("stroke", "#75485E")
    .attr("stroke-width", 1)
    .attr("d", d => d3.line()
        .x(d => x(d.section) + x.bandwidth()/2)
        .y(d => y1(d.avg)).curve(d3.curveStep)(data));

  innerChart.append("g")
    .attr("font-family", "san-serif")
    .attr("font-size", 14)
    .attr("font-weight", 600)
  .selectAll()
  .data(data)
  .join("text")
    .text(d => d3.format(",.3s")(d.avg))
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "start")
    .attr("x", d => x(d.section) + x.bandwidth()/2)
    .attr("y", d => y1(d.avg))
    .attr("dy", "-0.1em")
    .attr("fill", "#75485E")

  svg.append("text")
    .text(`${data[0].type}(m²)`)
    .attr("font-size", "14px")
    .attr("dominant-baseline", "hanging")
    .attr("fill", "#75485E")

  innerChart.append("text")
    .text("AVG: ")
    .attr("font-size", "14px")
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "start")
    .attr("fill", "#75485E")
    .attr("x", x(data[0].section) + x.bandwidth()/2 - 30)
    .attr("y", y1(data[0].avg))
    .attr("dy", "-0.1em")
    .attr("font-weight", 600)

  return svg.node();
}