const drawWoodRecoveryChart = (data) => {
  const width = 900;
  const height = 350;
  const margin = {top: 20, right: 30, bottom: 20, left: 30};
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const rhdata = data.filter(d => d.prodtype == "rh")
  const branddata = data.filter(d => d.prodtype == "brand")

  const x = d3.scaleBand()
    .domain(data.map(d => d.date))
    .range([0, innerWidth])
    .padding(0.1);

  const yBrand = d3.scaleLinear()
      .domain(d3.extent(branddata, d => d.rate))
      .range([innerHeight, innerHeight/2 + 20])
      .nice();

  const yRh = d3.scaleLinear()
      .domain(d3.extent(rhdata, d => d.rate))
      .range([innerHeight/2 - 20, 0])
      .nice();

  const color = d3.scaleOrdinal()
      .domain(data.map(d => d.prodtype))
      .range(["#DFC6A2", "#A5A0DE"]);

  const svg = d3.create("svg")
      .attr("viewBox", [0, 0, width, height])

  const innerChart = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)

  innerChart.append("g")
    .attr("transform", `translate(0, ${innerHeight/2 - 20})`)
    .call(d3.axisBottom(x).tickSizeOuter(0))
    .call(g => g.selectAll(".domain").attr("transform", `translate(0, 13)`))
    .call(g => g.selectAll("text").attr("font-size", "12px").clone(true).lower().attr("fill", "none").attr("stroke", "white").attr("stroke-width", 6))
    .call(g => g.selectAll(".tick line").clone().attr("transform", `translate(0, 20)`))
    
  // Draw the Brand line
  innerChart.append("path")
      .attr("fill", "none")
      .attr("stroke", d => color("brand"))
      .attr("stroke-width", 1.5)
      .attr("d", d => d3.line()
          .x(d => x(d.date) + x.bandwidth()/2)
          .y(d => yBrand(d.rate)).curve(d3.curveCatmullRom)(branddata));

  // Draw the Rh line
  innerChart.append("path")
      .attr("fill", "none")
      .attr("stroke", d => color("rh"))
      .attr("stroke-width", 1.5)
      .attr("d", d => d3.line()
          .x(d => x(d.date) + x.bandwidth()/2)
          .y(d => yRh(d.rate)).curve(d3.curveCatmullRom)(rhdata));

  // Append the labels of Brand
  innerChart.append("g")
      .attr("stroke-linecap", "round")
      .attr("stroke-linejoin", "round")
      .attr("text-anchor", "middle")
    .selectAll()
    .data(branddata)
    .join("text")
      .text(d => `${d.rate}%`)
      .attr("font-size", "12px")
      .attr("dy", "0.35em")
      .attr("x", d => x(d.date) + x.bandwidth()/2)
      .attr("y", d => yBrand(d.rate))
    .clone(true).lower()
      .attr("fill", "none")
      .attr("stroke", "white")
      .attr("stroke-width", 6);

  // Append the labels of Rh
  innerChart.append("g")
      .attr("stroke-linecap", "round")
      .attr("stroke-linejoin", "round")
      .attr("text-anchor", "middle")
    .selectAll()
    .data(rhdata)
    .join("text")
      .text(d => `${d.rate}%`)
      .attr("font-size", "12px")
      .attr("dy", "0.35em")
      .attr("x", d => x(d.date) + x.bandwidth()/2)
      .attr("y", d => yRh(d.rate))
    .clone(true).lower()
      .attr("fill", "none")
      .attr("stroke", "white")
      .attr("stroke-width", 6);

  innerChart.append("text")
    .text("Brand")
    .attr("text-anchor", "start")
    .attr("alignment-baseline", "middle")
    .attr("x", x(branddata[branddata.length-1].date) + x.bandwidth()/2 + 15)
    .attr("y", yBrand(branddata[branddata.length-1].rate) - 15)
    .attr("dy", "0.35em")
    .attr("fill", color("brand"))
    .attr("font-size", "14px")
    .attr("font-weight", 600)

    innerChart.append("text")
    .text("RH")
    .attr("text-anchor", "start")
    .attr("alignment-baseline", "middle")
    .attr("x", x(rhdata[rhdata.length-1].date) + x.bandwidth()/2 + 15)
    .attr("y", yRh(rhdata[rhdata.length-1].rate) - 15)
    .attr("dy", "0.35em")
    .attr("fill", color("rh"))
    .attr("font-size", "14px")
    .attr("font-weight", 600)

  svg.append("text")
    .text("Target: 60%")
    .attr("text-anchor", "start")
    .attr("alignment-baseline", "middle")
    .attr("x", 0)
    .attr("y", 5)
    .attr("dy", "0.35em")
    .attr("fill", "#75485E")
    .attr("font-size", "14px")
    .attr("font-weight", 600)

  return svg.node();
}