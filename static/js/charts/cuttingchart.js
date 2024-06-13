const dr = (data) => {
  const width = 900;
  const height = 350;
  const margin = {top: 20, right: 20, bottom: 30, left: 40};
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const svg = d3.create("svg")
    .append("svg")
      .attr("viewBox", [0, 0, width, height]);
  
  const innerChart = svg
    .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

  const xScale = d3.scaleBand()
    .domain(data.map(d => d.Date))
    .range([0, innerWidth])
    .paddingInner(0.2);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.Qty)])
    .range([innerHeight, 0])
    .nice();

    innerChart
      .selectAll(`rect`)
      .data(data)
      .join("rect")
        .attr("x", d => xScale(d.Date))
        .attr("y", d => yScale(d.Qty))
        .attr("width", xScale.bandwidth())
        .attr("height", d => yScale(0) - yScale(d.Qty))
        .attr("fill", "#76B6C2");

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
  return svg.node();
}