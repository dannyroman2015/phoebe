const drawWoodRecoveryChart = (data) => {
  const width = 900;
  const height = 350;
  const margin = {top: 20, right: 20, bottom: 20, left: 20};
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  console.log(data)
  const rhdata = data.filter(d => d.prodtype == "rh")
  const branddata = data.filter(d => d.prodtype == "brand")

  const x = d3.scaleUtc()
    .domain(d3.extent(branddata, d => d.date))
    .range([0, innerWidth])

    const y = d3.scaleLinear([0, d3.max(branddata, d => d.rate)], [innerHeight, 0]);

  const svg = d3.create("svg").attr("viewBox", [0, 0, width, height])

  const innerChart = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)

    const line = d3.line()
    .x(d => x(d.date))
    .y(d => y(d.rate));
    
 
  console.log(branddata)
  console.log(line(branddata))
  innerChart.append("path")
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1.5)
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("d", line(branddata));

  return svg.node();
}