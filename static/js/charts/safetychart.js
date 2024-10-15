const drawSafetyChart = (data) => {
  const width = 900;
  const height = 350;
  const margin = {top: 20, right: 120, bottom: 50, left: 60};
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  data.map(d => d.date = new Date(d.date))
  const today = new Date()
  const lastAccident = new Date(data[0].date)
  const days = Math.round((today-lastAccident)/1000/60/60/24) 

  const x = d3.scaleUtc()
      // .domain(d3.extent(data, d => d.date))
      .domain([new Date("2024-01-01"), new Date()])
      .range([0, innerWidth])
      .clamp(true)

  const y = d3.scaleBand()
    .domain(data.map(d => d.area))
    .range([height, 0])
    .paddingOuter(0.5)

  const svg = d3.create("svg")
    .attr("viewBox", [0, 0, width, height])

  const innerChart = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)

  innerChart.append("g")
    .call(d3.axisBottom(x).ticks(width / 80).tickSizeInner(0))
    .call(g => g.select(".domain").remove())
    .call(g => g.selectAll(".tick line").clone(true).attr("y2", height).attr("opacity", 0.3))

  innerChart.append("g")
    .call(d3.axisLeft(y))
    .call(g => g.select(".domain").remove())
    .call(g => g.selectAll(".tick line").clone(true).attr("x2", innerWidth).attr("transform", `translate(0, ${ y.bandwidth()/2})`).attr("opacity", 0.3))

  innerChart.append("g")
      .attr("stroke", "black")
    .selectAll()
    .data(data)
    .join("circle")
        .attr("cx", d => x(d.date))
        .attr("cy", d => y(d.area) + y.bandwidth()/2)
        .attr("r", d => d.severity)
        .attr("fill", "red")
        .attr("opacity", 0.5)
      .append("title")
        .text(d => d.severity)

  innerChart.append("line")
      .attr("x1", x(data[0].date))
      .attr("y1", y(data[0].area) + y.bandwidth()/2)
      .attr("x2", innerWidth + 80)
      .attr("y2", y(data[0].area) + y.bandwidth()/2)
      .attr("stroke", "#75485E")

  svg.append("text")
      .text("> now")
      .attr("x", width)
      .attr("y", y(data[0].area) + y.bandwidth()/2 + margin.top)
      .attr("text-anchor", "end")
      .attr("alignment-baseline", "middle")
      .attr("fill", "#75485E")
  
  // innerChart.append("text")
  //     .text("<")
  //     .attr("x", x(data[0].date) + 25)
  //     .attr("y", y(data[0].area) + y.bandwidth()/2)
  //     .attr("text-anchor", "end")
  //     .attr("alignment-baseline", "middle")
  //     .attr("fill", "#75485E")

  innerChart.append("text")
      .text(`${days} days`)
      // .attr("x",  x(data[0].date) + (innerWidth - x(data[0].date))/2)
      .attr("x",  x(data[0].date) + 50)
      .attr("y", y(data[0].area) + y.bandwidth()/2)
      .attr("dy", "-0.5em")
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .attr("fill", "#75485E")

  innerChart.append("line")
      .attr("x1", x(data[0].date))
      .attr("y1", innerHeight + y.bandwidth()/2)
      .attr("x2", 4)
      .attr("y2", innerHeight + y.bandwidth()/2)
      .attr("stroke", "#75485E")

  innerChart.append("text")
      .text(">")
      .attr("x", x(data[0].date) + 5)
      .attr("y", innerHeight + y.bandwidth()/2)
      .attr("dy", "0.03em")
      .attr("text-anchor", "end")
      .attr("alignment-baseline", "middle")
      .attr("fill", "#75485E")
  
  innerChart.append("text")
      .text("<")
      .attr("x", 0)
      .attr("y", innerHeight + y.bandwidth()/2)
      .attr("dy", "0.03em")
      .attr("text-anchor", "start")
      .attr("alignment-baseline", "middle")
      .attr("fill", "#75485E")

  innerChart.append("text")
      .text(`${data.length} accidents`)
      .attr("x",  x(data[0].date)/2)
      .attr("y", innerHeight + y.bandwidth()/2)
      .attr("dy", "-0.5em")
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .attr("fill", "#75485E")

  return svg.node();
}