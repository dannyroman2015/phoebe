
const drawPackingChart = (data) => {
  const formatsInfo = [
    {id: "1-brand", label: "1-brand", color: "#E39F94"},
    {id: "1-rh", label: "1-rh", color: "#ABABAB"},
    {id: "2-brand", label: "2-brand", color: "blue"},
    {id: "2-rh", label: "2-rh", color: "#2F8999"},
  ];

  const margin = {top: 20, right: 20, bottom: 20, left: 40};
  const width = 900;
  const height = 350;
  const innerWidth = width - margin.left - margin.right
  const innerHeight = height - margin.top - margin.bottom

  const svg = d3.create("svg")
    .attr("viewBox", [0, 0, width, height]);

  const innerChart = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)

  const stackGenerator = d3.stack()
    .keys(formatsInfo.map(f => f.id));
  
  const annotatedData = stackGenerator(data);
 
  const colorScale = d3.scaleOrdinal()
    .domain(formatsInfo.map(f => f.id))
    .range(formatsInfo.map(f => f.color))

  const xScale = d3.scaleBand()
    .domain(data.map(d => d.date))
    .range([0, innerWidth])
    .paddingInner(0.02);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(annotatedData[annotatedData.length-1], d => d[1])])
    .range([innerHeight, 0])
    .nice();

  annotatedData.forEach(serie => {
    innerChart
      .selectAll(`bar-${serie.key}`)
      .data(serie)
      .join("rect")
        .attr("class", d => `bar-${serie.key}`)
        .attr("x", d => xScale(d.data.date))
        .attr("y", d => yScale(d[1]))
        .attr("width", xScale.bandwidth())
        .attr("height", d => yScale(d[0]) - yScale(d[1]))
        .attr("fill", colorScale(serie.key));
  })

  const bottomAxis = d3.axisBottom(xScale)
    .tickSizeOuter(0)

  innerChart.append("g")
    .attr("transform", `translate(0, ${innerHeight})`)
    .call(bottomAxis)
    .call(g => g.select(".domain").remove())

  const leftAxis = d3.axisLeft(yScale)
    .ticks(width/80, "s")

  innerChart.append("g")
    .call(leftAxis)
    .call(g => g.select(".domain").remove())
    .call(g => g.selectAll(".tick line").clone()
      .attr("x2", innerWidth)
      .attr("stroke-opacity", 0.1))
    
  annotatedData.forEach(serie => {
    innerChart.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 12)
      .selectAll()
      .data(serie)
      .join("text")
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .attr("x", d => xScale(d.data.date) + xScale.bandwidth()/2)
        .attr("y", d => yScale(d[1]) - (yScale(d[1]) - yScale(d[0]))/2 )
        .attr("dy", "0.35em")
        .attr("fill", "white")
        .text(d => {
          if (d[1] - d[0] != 0) { return d3.format(".1s")(d[1]-d[0])}
        })
  })


  return svg.node();
}