const drawWoodFinishChart = (data) => {
  const width = 900;
  const height = 350;
  const margin = {top: 20, right: 20, bottom: 20, left: 50};
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const series = d3.stack()
    .keys(d3.union(data.map(d => d.type)))
    .value(([, D], key) => D.get(key) === undefined ? 0 : D.get(key).value)
    (d3.index(data, d => d.date, d => d.type))


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
    .range(["red", "blue", "red", "blue"])
    .unknown("white");

  const svg = d3.create("svg")
    .attr("viewBox", [0, 0, width, height])

  const innerChart = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)

  innerChart
    .selectAll()
    .data(series)
    .join("g")
      .attr("fill", d => color(d.key))
      .attr("fill-opacity", 0.3)
    .selectAll("rect")
    .data(D => D.map(d => (d.key = D.key, d)))
    .join("rect")
      .attr("x", d => x(d.data[0]))
      .attr("y", d => d.key.startsWith("X2") ? y(d[1]) - 5 : y(d[1]))
      .attr("height", d => y(d[0]) - y(d[1]))
      .attr("width", x.bandwidth())

  innerChart.append("g")
    .attr("transform", `translate(0, ${innerHeight})`)
    .call(d3.axisBottom(x).tickSizeOuter(0))
    .call(g => g.selectAll(".domain").remove())

  innerChart.append("g")
    .attr("font-family", "sans-serif")
    .attr("font-size", 12)
  .selectAll()
  .data(series[series.length-1])
  .join("text")
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle")
    .attr("x", d => x(d.data[0]) + x.bandwidth()/2)
    .attr("y", d => y(d[1]) - 15)
    .attr("dy", "0.35em")
    .attr("fill", "#75485E")
    .text(d => `Σ ${d3.format("~s")(d[1])}` )

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
        .attr("y", d => d.key.startsWith("X2") ? y(d[1]) - (y(d[1]) - y(d[0]))/2 - 5 : y(d[1]) - (y(d[1]) - y(d[0]))/2)
        .attr("dy", "0.1em")
        .attr("fill", "#75485E")
        .text(d => {
          // if (d[1] - d[0] >= 60 && d.key == "X1-rh") { return `🏭1-RH${d3.format("~s")(d[1]-d[0])}` }
          // else if (d[1] - d[0] >= 60 && d.key == "X1-brand") { return `🏭1-BR${d3.format("~s")(d[1]-d[0])}` }
          // else if (d[1] - d[0] >= 60 && d.key == "curve") { return `⌒${d3.format("~s")(d[1]-d[0])}` }
          // else if (d[1] - d[0] >= 60 && d.key == "reeded") { return `≊${d3.format("~s")(d[1]-d[0])}` }
          // else { if (d[1] - d[0] >= 60 && d.key == "reeded") {return d3.format("~s")(d[1]-d[0])} }
          if (d[1] - d[0] >= 60) { return `${d3.format("~s")(d[1]-d[0])}` }
        })
      let label = ''
        if (serie.key == "X1-rh") { label = "🏭1-RH"}
        else if (serie.key == "X1-brand") { label = "🏭1-BR"}
        else if (serie.key == "X2-brand") { label = "🏭2-BR"}
        else if (serie.key == "X2-rh") { label = "🏭2-RH"}
        else { label = serie.key }
    innerChart.append("text")
      .text(label)
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .attr("x", -15)
      .attr("y", d => y(serie[0]["1"] - (serie[0]["1"] - serie[0]["0"])/2))
      .attr("dy", "0.35em")
      .attr("fill", color(serie.key))
      .attr("fill-opacity", 0.6)
  })

  svg.append("text")
      .text("($)")
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .attr("x", 30)
      .attr("y", 5)
      .attr("dy", "0.35em")
      .attr("fill", "#75485E")
      .attr("font-size", 14)

  return svg.node();
}