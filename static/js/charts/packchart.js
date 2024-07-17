const drawPackChart = (data) => {
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
    .range(["#DFC6A2", "#A5A0DE", "#DFC6A2", "#A5A0DE"])
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
      .attr("fill-opacity", 0.9)
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
    .call(g => g.selectAll("text").attr("font-size", "14px"))

  innerChart.append("g")
    .attr("font-family", "sans-serif")
    .attr("font-size", 15)
  .selectAll()
  .data(series[series.length-1])
  .join("text")
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle")
    .attr("x", d => x(d.data[0]) + x.bandwidth()/2)
    .attr("y", d => y(d[1]) - 15)
    .attr("dy", "0.35em")
    .attr("fill", "#75485E")
    .attr("font-weight", 600)
    .text(d => `Σ ${d3.format("~s")(d[1])}` )

  series.forEach(serie => {
    innerChart.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 14)
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
          if (d[1] - d[0] >= 60) { return `${d3.format("~s")(d[1]-d[0])}` }
        })
  })

  svg.append("text")
      .text("($)")
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .attr("x", 30)
      .attr("y", 5)
      .attr("dy", "0.35em")
      .attr("fill", "#75485E")
      .attr("font-size", 20)

    lastX1 = series.filter(d => d.key.startsWith("X1"))[1][0]
    const factoryLabel = svg.append("text")
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .attr("x", margin.left - 20)
      .attr("y", y(lastX1[1]) + 13)
      .attr("dy", "0.35em")
      .attr("fill", "#75485E")
      .attr("font-size", "20px")

    factoryLabel.append("tspan")
      .text("F2")
      .attr("x", margin.left - 20)
      .attr("dy", -5)
      .attr("font-size", "20px")

    factoryLabel.append("tspan")
      .text("⬀")
      .attr("x", margin.left)
      .attr("dy", -20)
      .attr("font-size", "40px")

    factoryLabel.append("tspan")
      .text("F1")
      .attr("x", margin.left - 20)
      .attr("dy", 50)
      .attr("font-size", "20px")

    factoryLabel.append("tspan")
      .text("⬂")
      .attr("x", margin.left)
      .attr("dy", 30)
      .attr("font-size", "40px")

  return svg.node();
}

const drawPackChart1 = (data) => {
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
    .range(["#89CFF3", "#CDF5FD"])
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
      .attr("fill-opacity", 0.9)
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
    .call(g => g.selectAll("text").attr("font-size", "14px"))

  innerChart.append("g")
    .attr("font-family", "sans-serif")
    .attr("font-size", 15)
  .selectAll()
  .data(series[series.length-1])
  .join("text")
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle")
    .attr("x", d => x(d.data[0]) + x.bandwidth()/2)
    .attr("y", d => y(d[1]) - 15)
    .attr("dy", "0.35em")
    .attr("fill", "#75485E")
    .attr("font-weight", 600)
    .text(d => `Σ ${d3.format("~s")(d[1])}` )

  series.forEach(serie => {
    innerChart.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 14)
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
          if (d[1] - d[0] >= 60) { return `${d3.format("~s")(d[1]-d[0])}` }
        })
  })

  svg.append("text")
      .text("($)")
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .attr("x", 30)
      .attr("y", 5)
      .attr("dy", "0.35em")
      .attr("fill", "#75485E")
      .attr("font-size", 20)

  return svg.node();
}