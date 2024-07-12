const drawCuttingChart = (data) => {
  console.log(data)
  const width = 900;
  const height = 350;
  const margin = {top: 20, right: 20, bottom: 30, left: 40};
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const svg = d3.create("svg")
    .attr("viewBox", [0, 0, width, height]);
  
  const innerChart = svg
    .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

  const xScale = d3.scaleBand()
    .domain(data.map(d => d.date))
    .range([0, innerWidth])
    .paddingInner(0.2);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.qty)])
    .range([innerHeight, 0])
    .nice();

  const bottomAxis = d3.axisBottom(xScale)
    .tickSizeOuter(0)

  innerChart
    .append("g")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(bottomAxis)
  
  const leftAxis = d3.axisLeft(yScale)

  innerChart
    .append("g")
      .call(leftAxis)
      .call(g => g.select(".domain").remove())
      .call(g => g.selectAll(".tick line").clone()
        .attr("x2", width - margin.left - margin.right)
        .attr("stroke-opacity", 0.15))
      .call(g => g.selectAll(".tick text")
        .attr("font-size", "12px"))

  innerChart
    .selectAll(`rect`)
    .data(data)
    .join("rect")
      .attr("x", d => xScale(d.date))
      .attr("y", d => yScale(d.qty))
      .attr("width", xScale.bandwidth())
      .attr("height", d => yScale(0) - yScale(d.qty))
      .attr("fill", "#DCA47C");

  svg.append("g")
      .attr("font-family", "san-serif")
      .attr("font-size", 16)
    .selectAll()
    .data(data)
    .join("text")
      .text(d => d.qty)
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .attr("x", d => margin.left + xScale(d.date) + xScale.bandwidth()/2)
      .attr("y", d => yScale(d.qty) + 15)
      .attr("fill", "black")
  return svg.node();
}

const drawCuttingChart1 = (data) => {
  const width = 900;
  const height = 350;
  const margin = {top: 20, right: 20, bottom: 30, left: 40};
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const svg = d3.create("svg")
    .attr("viewBox", [0, 0, width, height]);
  
  const innerChart = svg
    .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

  const xScale = d3.scaleBand()
    .domain(data.map(d => d.woodtype))
    .range([0, innerWidth])
    .paddingInner(0.2);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.qty)])
    .range([innerHeight, 0])
    .nice();

  const bottomAxis = d3.axisBottom(xScale)
    .tickSizeOuter(0)

  innerChart
    .append("g")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(bottomAxis)
  
  const leftAxis = d3.axisLeft(yScale)

  innerChart
    .append("g")
      .call(leftAxis)
      .call(g => g.select(".domain").remove())
      .call(g => g.selectAll(".tick line").clone()
        .attr("x2", width - margin.left - margin.right)
        .attr("stroke-opacity", 0.15))
      .call(g => g.selectAll(".tick text")
        .attr("font-size", "12px"))

  innerChart
    .selectAll(`rect`)
    .data(data)
    .join("rect")
      .attr("x", d => xScale(d.woodtype))
      .attr("y", d => yScale(d.qty))
      .attr("width", xScale.bandwidth())
      .attr("height", d => yScale(0) - yScale(d.qty))
      .attr("fill", "#DCA47C");

  svg.append("g")
      .attr("font-family", "san-serif")
      .attr("font-size", 16)
    .selectAll()
    .data(data)
    .join("text")
      .text(d => d.qty)
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .attr("x", d => margin.left + xScale(d.woodtype) + xScale.bandwidth()/2)
      .attr("y", d => yScale(d.qty) + 15)
      .attr("fill", "black")
  return svg.node();
}