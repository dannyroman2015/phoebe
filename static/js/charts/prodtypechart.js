const drawProdTypeChart = (data, latest) => {
  const width = 300;
  const height = 200;
  const radius = 200/2;

  const arc = d3.arc()
    .startAngle(d => d.startAngle)
    .endAngle(d => d.endAngle)
    .innerRadius(radius * 0.67)
    .outerRadius(radius - 1)
    .padAngle(0.02)
    .cornerRadius(3);

  const pie = d3.pie()
    .padAngle(1/radius)
    .sort(null)
    .value(d => d.value);

  const color = d3.scaleOrdinal()
    .domain(data.map(d => d.name))
    .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), data.length).reverse());

  const svg = d3.create("svg")
    .attr("viewBox", [-width/2, -height/2, width, height])

  svg.append("g")
    .selectAll()
    .data(pie(data))
    .join("path")
      .attr("fill", d => color(d.data.name))
      .attr("d", arc)
    .append("title")
      .text(d => d.data.value);
  
  svg.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 8)
      .attr("text-anchor", "middle")
    .selectAll()
    .data(pie(data))
    .join("text")
      .attr("transform", d => `translate(${arc.centroid(d)})`)
      .call(text => text.append("tspan")
        .text(d => d.data.name)
        .attr("y", "-0.4em")
        .style("text-transform", "capitalize")
        .attr("fill", "#f6fafc")
        .attr("font-weight", 500))
      .call(text => text.filter(d => (d.endAngle - d.startAngle) > 0.25).append("tspan")
        .attr("x", 0)
        .attr("y", "0.8em")
        .attr("fill-opacity", 0.8)
        .attr("fill", "#f6fafc")
        .text(d => d3.format(".3s")(d.data.value)))

  const MTDTotal = d3.format("$,.1f")(data.reduce((total, d) => total + d.value, 0))

  svg.append("text")
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
    .append("tspan")  
      .text(MTDTotal)
      .attr("y", "0.2em")
      .attr("font-size", "20px")
      .attr("font-weight", 500)
    .append("tspan")
      .text("Value Total")
      .attr("x", "-0.25em")
      .attr("y", "-1.5em")
      .attr("font-size", "14px")
    .append("tspan")
      .text(latest)
      .attr("x", "-0.25em")
      .attr("y", "2.5em")
      .attr("font-size", "10px")
    
  return svg.node();
}