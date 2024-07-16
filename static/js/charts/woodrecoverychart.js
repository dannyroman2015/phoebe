const drawWoodRecoveryChart = (data) => {
  const width = 900;
  const height = 350;
  const margin = {top: 20, right: 30, bottom: 20, left: 40};
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  data.map(d => d.date = new Date(d.date))

  const x = d3.scaleUtc()
      .domain([data[0].date, data[data.length - 1].date])
      .range([0, innerWidth]);

  const y = d3.scaleLinear()
      // .domain(d3.extent(data, d => d.rate))
      .domain([d3.min(data, d => d.rate)-5, 70])
      .range([innerHeight, 0])
      .nice();

  const color = d3.scaleOrdinal()
      .domain(data.map(d => d.prodtype))
      .range(["#DFC6A2", "#A5A0DE"]);

  const svg = d3.create("svg")
      .attr("viewBox", [0, 0, width, height])

  const innerChart = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)

  innerChart.append("g")
    .attr("transform", `translate(0, ${innerHeight})`)
    .call(d3.axisBottom(x).ticks(innerWidth / 80).tickSizeOuter(0));

  // Add a container for each series.
  const serie = innerChart.append("g")
    .selectAll()
    .data(d3.group(data, d => d.prodtype))
    .join("g");

  // Draw the lines.
  serie.append("path")
      .attr("fill", "none")
      .attr("stroke", d => color(d[0]))
      .attr("stroke-width", 1.5)
      .attr("d", d => d3.line()
          .x(d => x(d.date))
          .y(d => y(d.rate))(d[1]));

  // Append the labels.
  serie.append("g")
      .attr("stroke-linecap", "round")
      .attr("stroke-linejoin", "round")
      .attr("text-anchor", "middle")
    .selectAll()
    .data(d => d[1])
    .join("text")
      .text(d => `${d.rate}%`)
      .attr("font-size", "14px")
      .attr("dy", "0.35em")
      .attr("x", d => x(d.date))
      .attr("y", d => y(d.rate))
      .call(text => text.filter((d, i, data) => i === 0)
        .append("tspan")
          .attr("font-size", "14px")
          .attr("fill", d => color(d.prodtype))
          .attr("dy", -10 )
          .text(d => ` ${d.prodtype}`))
    .clone(true).lower()
      .attr("fill", "none")
      .attr("stroke", "white")
      .attr("stroke-width", 6);

  innerChart.append("line")
    .attr("x1", 0)
    .attr("y1", y(60))
    .attr("x2", innerWidth)
    .attr("y2", y(60))
    .attr("fill", "none")
    .attr("stroke", "#06D001")

  innerChart.append("text")
    .text("target - 60%")
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle")
    .attr("x", 15)
    .attr("y", y(60) - 12)
    .attr("dy", "0.35em")
    .attr("fill", "#06D001")
    .attr("font-size", "12px")

  return svg.node();
}