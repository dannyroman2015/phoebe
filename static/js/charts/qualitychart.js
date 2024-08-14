const drawQualityChart = (data) => {
  const width = 900;
  const height = 350;
  const margin = {top: 20, right: 20, bottom: 20, left: 20};
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  data.map(d => d.failedrate = Math.round(d.failedqty / d.checkedqty * 100))

  const series = d3.stack()
    .keys(d3.union(data.map(d => d.section)))
    .value(([, D], key) => D.get(key) === undefined ? 0 : D.get(key).failedrate)
    (d3.index(data, d => d.date, d => d.section))


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
    .range(d3.schemeSet3)
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
      .attr("fill-opacity", 0.7)
    .selectAll("rect")
    .data(D => D.map(d => (d.key = D.key, d)))
    .join("rect")
      .attr("x", d => x(d.data[0]))
      .attr("y", d => y(d[1]))
      .attr("height", d => y(d[0]) - y(d[1]))
      .attr("width", x.bandwidth())
      .append("title")
        .text(d => {
          const failedqty = d.data[1].get(d.key) == undefined ? "" : d.data[1].get(d.key).failedqty
          const checkedqty = d.data[1].get(d.key) == undefined ? "" : d.data[1].get(d.key).checkedqty
          return  d[1] - d[0] < 15 ? `${d.key} - ${failedqty}/${checkedqty} (${d[1]-d[0]}%)` : ""
        })

  innerChart.append("g")
    .attr("transform", `translate(0, ${innerHeight})`)
    .call(d3.axisBottom(x).tickSizeOuter(0))
    .call(g => g.selectAll(".domain").remove())
    .call(g => g.selectAll("text").attr("font-size", "12px"))

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
        .attr("y", d => y(d[1]) - (y(d[1]) - y(d[0]))/2 - 9)
        .attr("dy", "0.35em")
        .attr("fill", "#75485E")
        .attr("font-size", "12px")
        .text(d =>  d[1] - d[0] >= 15 ? d.key : "")
          .append("tspan")
            .text(d => {
              const failedqty = d.data[1].get(d.key) == undefined ? "" : d.data[1].get(d.key).failedqty
              const checkedqty = d.data[1].get(d.key) == undefined ? "" : d.data[1].get(d.key).checkedqty
              return  d[1] - d[0] >= 15 ? `${failedqty}/${checkedqty}(${d[1]-d[0]}%)` : ""
            })
            .attr("x", d => x(d.data[0]) + x.bandwidth()/2)
            .attr("dy", "1.5em")
  })

  return svg.node();
}