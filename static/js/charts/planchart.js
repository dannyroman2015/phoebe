const drawPlanChart = (data) => {
  const width = 900;
  const height = 350;
  const margin = {top: 20, right: 20, bottom: 20, left: 20};
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const x = d3.scaleBand()
    .domain(data.map(d => d.date))
    .range([0, innerWidth])
    .padding(0.1);


  const y = d3.scaleLinear()
    .domain([0,  d3.max(data, d => d.plan)])
    .range([innerHeight, 0])
    .nice();

  const svg = d3.create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto;")

  const innerChart = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)
  
  innerChart.append("g")
    .attr("transform", `translate(0, ${innerHeight})`)
    .call(d3.axisBottom(x).tickSizeOuter(0))
    .call(g => g.selectAll(".domain").remove())
    .call(g => g.selectAll("text").attr("font-size", "12px"));

  innerChart.append("g")
    .selectAll("rect")
    .data(data)
    .join("rect")
      .attr("x", d => x(d.date))
      .attr("y", d => y(d.plan))
      .attr("width", d => x.bandwidth())
      .attr("height", d => y(0) - y(d.plan))
      .attr("fill", "#C6E7FF")

  innerChart.append("g")
    .selectAll("text")
    .data(data)
    .join("text")
      .text(d => d3.format(",.0f")(d.plan))
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .attr("x", d => x(d.date) + x.bandwidth()/2)
      .attr("y", d => y(d.plan) - 12)
      .attr("dy", "0.35em")
      .attr("fill", "#75485E")

  return svg.node();
}