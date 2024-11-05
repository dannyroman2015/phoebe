const drawRawwoodChart = (importdata, selectiondata) => {
  const width = 900;
  const height = 350;
  const margin = {top: 20, right: 20, bottom: 20, left: 20};
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const x = d3.scaleBand()
    .domain(importdata.map(d => d.date))
    .range([0, innerWidth])
    .padding(0.1)

  const y = d3.scaleLinear()
    .domain([0, d3.max(importdata, d => d.qty)])
    .range([innerHeight, 0])
    .nice();

  const svg = d3.create("svg").attr("viewBox", [0, 0, width, height]);

  const innerChart = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)

  innerChart.append("g")
    .attr("transform", `translate(0, ${innerHeight})`)
    .call(d3.axisBottom(x))
    .call(g => g.selectAll(".domain").remove())

  innerChart
    .selectAll()
    .data(importdata)
    .join("rect")
      .attr("x", d => x(d.date))
      .attr("y", d => y(d.qty))
      .attr("width", x.bandwidth()/2)
      .attr("height", d => innerHeight - y(d.qty))
      .attr("fill", "#DFC6A2")
      .append("title")
        .text(d => d.qty)

  innerChart
    .selectAll()
    .data(importdata)
    .join("text")
      .text(d => d3.format(".1f")(d.qty))
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .attr("x", d => x(d.date) + x.bandwidth()/4)
      .attr("y", d => y(d.qty))
      .attr("dy", "-0.3em")
      .attr("fill", "75485E")
      .attr("font-size", 12)
      

  svg.append("text")
    .text("Gỗ nhập")
    .attr("text-anchor", "start")
    .attr("alignment-baseline", "middle")
    .attr("x", 0)
    .attr("y", 10)
    .attr("fill", "#DFC6A2")
    .attr("font-size", 14)
    

  svg.append("text")
    .text("m³")
    .attr("text-anchor", "start")
    .attr("alignment-baseline", "middle")
    .attr("x", 0)
    .attr("y", 70)
    .attr("fill", "#75485E")
    .attr("font-size", 14)


  // selectionData area
  if (selectiondata != undefined) {
    const selectSeries = d3.stack()
    .keys(d3.union(selectiondata.map(d => d.woodtone)))
    .value(([, D], key) => D.get(key) === undefined ? 0 : D.get(key).qty)
    (d3.index(selectiondata, d => d.date, d => d.woodtone))

  const color = d3.scaleOrdinal()
    .domain(selectSeries.map(d => d.key))
    .range(["#A0937D", "#FAEED1", "#DFC6A2"])
    .unknown("#ccc");

  innerChart
    .selectAll()
    .data(selectSeries)
    .join("g")
      .attr("fill", d => color(d.key))
      .attr("fill-opacity", 0.9)
    .selectAll("rect")
    .data(D => D.map(d => (d.key = D.key, d)))
    .join("rect")
        .attr("x", d => x(d.data[0]) + x.bandwidth()/2)
        .attr("y", d => y(d[1]))
        .attr("height", d => y(d[0]) - y(d[1]))
        .attr("width", x.bandwidth()/2)
      .append("title")
        .text(d => d[1] - d[0])

  selectSeries.forEach(serie => {
    innerChart.append("g")
      .selectAll()
      .data(serie)
      .join("text")
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .attr("x", d => x(d.data[0]) + 3*x.bandwidth()/4)
        .attr("y", d => y(d[1]) - (y(d[1]) - y(d[0]))/2)
        .attr("fill", "#75485E")
        .attr("font-size", 12)
        .text(d => (d[1] - d[0] >= 0.1) ? `${d3.format(",.1f")(d[1]-d[0])}` : "")
  })

  svg.append("text")
    .text("Light")
    .attr("text-anchor", "start")
    .attr("alignment-baseline", "middle")
    .attr("x", 0)
    .attr("y", 30)
    .attr("fill", color("light"))
    .attr("font-size", 14)

  svg.append("text")
    .text("Dark")
    .attr("text-anchor", "start")
    .attr("alignment-baseline", "middle")
    .attr("x", 0)
    .attr("y", 50)
    .attr("fill", color("dark"))
    .attr("font-size", 14)
  }
  

  return svg.node();
}