const drawLaminationChart = (data) => {
  const width = 900;
  const height = 350;
  const margin = {top: 20, right: 20, bottom: 20, left: 20};
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const series = d3.stack()
    .keys(d3.union(data.map(d => d.prodtype)))
    .value(([, D], key) => D.get(key) === undefined ? 0 : D.get(key).qty)
    (d3.index(data, d => d.date, d => d.prodtype))

  const x = d3.scaleBand()
    .domain(data.map(d => d.date))
    .range([0, innerWidth])
    .padding(0.1);

  const y = d3.scaleLinear()
    .domain([0, d3.max(series, d => d3.max(d, d => d[1]))])
    .rangeRound([innerHeight, 0])
    .nice()

  const color = d3.scaleOrdinal()
    .domain(series.map(d => d.key))
    .range(["#DFC6A2", "#A5A0DE", "#A0D9DE"])
    .unknown("#ccc");

  const svg = d3.create("svg")
    .attr("viewBox", [0, 0, width, height])

  const innerChart = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)

  innerChart
    .selectAll()
    .data(series)
    .join("g")
      .attr("fill", d => color(d.key))
      .attr("fill-opacity", 1)
    .selectAll("rect")
    .data(D => D.map(d => (d.key = D.key, d)))
    .join("rect")
      .attr("x", d => x(d.data[0]))
      .attr("y", d => y(d[1]))
      .attr("height", d => y(d[0]) - y(d[1]))
      .attr("width", x.bandwidth())

  innerChart.append("g")
    .attr("transform", `translate(0, ${innerHeight})`)
    .call(d3.axisBottom(x).tickSizeOuter(0))
    .call(g => g.selectAll(".domain").remove())
    .call(g => g.selectAll("text").attr("font-size", "12px"))

  innerChart.append("g")
    .attr("font-family", "sans-serif")
    .attr("font-size", 12)
  .selectAll()
  .data(series[series.length-1])
  .join("text")
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle")
    .attr("x", d => x(d.data[0]) + x.bandwidth()/2)
    .attr("y", d => y(d[1]) - 10)
    .attr("dy", "0.35em")
    .attr("fill", "#75485E")
    .attr("font-size", "14px")
    .attr("font-weight", 600)
    .text(d => `Σ ${d3.format(".3s")(d[1])}` )

  series.forEach(serie => {
    innerChart.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 12)
      .selectAll()
      .data(serie)
      .join("text")
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .attr("x", d => x(d.data[0]) + x.bandwidth()/2)
        .attr("y", d => y(d[1]) - (y(d[1]) - y(d[0]))/2 - 4)
        .attr("dy", "0.35em")
        .attr("fill", "#75485E")
        .attr("font-size", "14px")
        .text(d => {
          if (d[1] - d[0] >= 30) { return d3.format(".3s")(d[1]-d[0])}
        })
  })

  svg.append("text")
      .text("(m²)")
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .attr("x", 30)
      .attr("y", 5)
      .attr("dy", "0.35em")
      .attr("fill", "#75485E")
      .attr("font-size", "16px")

  const maxOne = series[1].find(d => d[1] == d3.max(series[1], d => d[1]))
innerChart.append("text")
    .text("RH")
    .attr("text-anchor", "start")
    .attr("alignment-baseline", "middle")
    .attr("x", x(maxOne.data[0]) - 30)
    .attr("y", y(maxOne[1]) - 20)
    .attr("dy", "0.35em")
    .attr("fill", color("rh"))
    .attr("font-size", "14px")
    .attr("font-weight", 900)

innerChart.append("line")
    .attr("x1", x(maxOne.data[0]) - 20)
    .attr("y1", y(maxOne[1]) - 10)
    .attr("x2", x(maxOne.data[0]))
    .attr("y2", y(maxOne[1]))
    .attr("stroke", "#75485E")
    .attr("stroke-width", 1)

innerChart.append("text")
    .text("BRAND")
    .attr("text-anchor", "start")
    .attr("alignment-baseline", "middle")
    .attr("x", x(maxOne.data[0]) + x.bandwidth())
    .attr("y", y(maxOne[1]) - 30)
    .attr("dy", "0.35em")
    .attr("fill", color("brand"))
    .attr("font-size", "14px")
    .attr("font-weight", 900)

innerChart.append("line")
  .attr("x1", x(maxOne.data[0]) + x.bandwidth() + 20)
  .attr("y1", y(maxOne[1]) - 20)
  .attr("x2", x(maxOne.data[0]) + x.bandwidth() - 20)
  .attr("y2", y(maxOne[0]/2) - 5)
  .attr("stroke", "#75485E")
  .attr("stroke-width", 1)

  return svg.node();
}