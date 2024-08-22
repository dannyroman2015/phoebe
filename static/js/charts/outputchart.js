const drawRdOpTotalChart = (data, inventory) => {
  const width = 900;
  const height = 350;
  const margin = {top: 20, right: 120, bottom: 20, left: 40};
  let innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // inventory = data.filter(d => d.section === "Inventory")
  data = data.filter(d => d.section !== "Inventory")

  if (inventory == undefined) {
    margin.right = 20
    innerWidth = width - margin.left - margin.right;
  }

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

  const y2 = d3.scaleLinear()
    .domain([0, inventory?.qty])
    .range([innerHeight, 0])
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

  svg.append("text")
    .text(`Tổng sản lượng (m²) `)
    .attr("text-anchor", "start")
    .attr("alignment-baseline", "start")
    .attr("x", 20)
    .attr("y", height)
    .attr("dy", "0.35em")
    .attr("fill", "#75485E")
    .attr("font-weight", 300)
    .attr("font-size", 14)
    .attr("transform", `rotate(-90, 10, ${height})`)
      .append("tspan")
        .text(`${data[0].type.toUpperCase()}`)
        .attr("fill", "#75485E")
        .attr("font-weight", 600)
        .attr("font-size", 16)
      .append("tspan")
        .text(` tới ngày `)
        .attr("fill", "#75485E")
        .attr("font-weight", 300)
        .attr("font-size", 14)
      .append("tspan")
        .text(`${data[0].lastdate}`)
        .attr("fill", "#75485E")
        .attr("font-weight", 600)
        .attr("font-size", 16)

  if (inventory != undefined) {
    svg.append("line")
      .attr("x1", innerWidth + 3*x.bandwidth()/4)
      .attr("y1", height)
      .attr("x2", innerWidth + 3*x.bandwidth()/4)
      .attr("y2", 0)
      .attr("stroke", "black")
      .attr("stroke-opacity", 0.2)

    svg.append("rect")
      .attr("x", innerWidth + x.bandwidth())
      .attr("y", y2(inventory.qty) + margin.bottom)
      .attr("width", x.bandwidth())
      .attr("height", y2(0) - y2(inventory.qty))
      .attr("fill", "#DCA47C");

    svg.append("text")
      .text(inventory.section)
      .attr("text-anchor", "middle")
      .attr("x", innerWidth + 3* x.bandwidth() /2)
      .attr("y", height)
      .attr("dy", "-0.35em")
      .attr("fill", "#75485E")
      .attr("font-size", 14)

    svg.append("text")
      .text(d3.format(",.0f")(inventory.qty))
      .attr("text-anchor", "middle")
      .attr("x", innerWidth + 3* x.bandwidth() /2)
      .attr("y", y2(inventory.qty) + margin.bottom)
      .attr("dy", "-0.15em")
      .attr("fill", "#75485E")
      .attr("font-size", 14)
      .attr("font-weight", 600)

    svg.append("text")
      .text(inventory.qty != 0 ? inventory.date : "")
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "end")
      .attr("x", innerWidth + 3*x.bandwidth()/4)
      .attr("y", height/2)
      .attr("dy", "1em")
      .attr("fill", "#75485E")
      .attr("font-size", 14)
      .attr("transform", `rotate(-90, ${innerWidth + 3*x.bandwidth()/4}, ${height/2})`)
  } 

  return svg.node();
}