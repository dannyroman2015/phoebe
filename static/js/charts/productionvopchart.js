const drawVOPChart = (data, manhr) => {
  const width = 900;
  const height = 350;
  const margin = {top: 20, right: 40, bottom: 20, left: 20};
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const x = d3.scaleBand()
    .domain(data.map(d => d.date))
    .range([0, innerWidth])
    .padding(0.1)

  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.value)])
    .range([innerHeight, innerHeight/2])
    .nice();

  const svg = d3.create("svg").attr("viewBox", [0, 0, width, height]);

  const innerChart = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)

  const xAxis = innerChart.append("g")
    .attr("transform", `translate(0, ${innerHeight})`)
    .call(d3.axisBottom(x))
    .call(g => g.selectAll(".domain").remove())
    .call(g => g.selectAll("text").text((d, i) => (d.slice(0, 2) == "01") ? d.slice(2, 6) : d.slice(0, 2)).attr("font-size", (data.length > 30) ? "10px" :"12px"))

  innerChart
    .selectAll()
    .data(data)
    .join("rect")
      .attr("x", d => x(d.date))
      .attr("y", d => y(d.value))
      .attr("width", x.bandwidth())
      .attr("height", d => innerHeight - y(d.value))
      .attr("fill", "steelblue")
      .append("title")
        .text(d => d.value)
      

  innerChart
    .selectAll()
    .data(data)
    .join("text")
      .text(d => (d.value > 40000) ? d3.format(",.0f")(d.value) : "")
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .attr("x", d => x(d.date) + x.bandwidth()/2)
      .attr("y", d => y(d.value/2))
      .attr("dy", "0.1em")
      .attr("fill", "white")
      .attr("font-size", 12)
      .attr("transform", d => `rotate(-90, ${x(d.date) + x.bandwidth()/2}, ${y(d.value/2)})`)

  svg.append("text")
    .text("Production Value ($)")
    .attr("text-anchor", "start")
    .attr("alignment-baseline", "middle")
    .attr("x", 0)
    .attr("y", innerHeight)
    .attr("dy", "0.5em")
    .attr("fill", "steelblue")
    .attr("font-size", 14)
    .attr("transform", `rotate(-90, 0, ${innerHeight})`)
    

  // svg.append("text")
  //   .text("m³")
  //   .attr("text-anchor", "start")
  //   .attr("alignment-baseline", "middle")
  //   .attr("x", 0)
  //   .attr("y", 70)
  //   .attr("fill", "#75485E")
  //   .attr("font-size", 14)


  // vop line
  if (manhr != undefined) {
  const workinghrs = manhr
  
  workinghrs.forEach(w => {
    w.efficiency = data.find(d => d.date == w.date).value / (w.manhr / 208)
  })

  const y2 = d3.scaleLinear()
    .domain(d3.extent(workinghrs, d => d.efficiency))
    .rangeRound([innerHeight/2, 0])
    .nice()

   // target line
  innerChart.append("line")
    .attr("x1", 0)
    .attr("y1", y2(2500))
    .attr("x2", innerWidth)
    .attr("y2", y2(2500))
    .attr("stroke", "red")
    .attr("stroke-opacity", 0.4)
  innerChart.append("text")
    .text("Target: 2,500")
    .attr("text-anchor", "start")
    .attr("alignment-baseline", "middle")
    .attr("x", 0)
    .attr("y", y2(2500))
    .attr("dy", "-0.5em")
    .attr("fill", "red")
    .attr("font-weight", 600)
    .attr("font-size", 12)

  if (data.length > 15) {
    innerChart.append("g")
    .attr("transform", `translate(${innerWidth}, 0)`)
    .call(d3.axisRight(y2))
    .call(g => g.selectAll(".domain").remove())
    .call(g => g.selectAll("text").text(d => `${d3.format("~s")(d)}`).attr("font-size", "12px"))
    .call(g => g.selectAll(".tick line").clone(true).attr("x2", -innerWidth).attr("opacity", 0.2))
  }

  innerChart.append("path")
      .attr("fill", "none")
      .attr("stroke", "#75485E")
      .attr("stroke-width", 1)
      .attr("d", d => d3.line()
          .x(d => x(d.date) + x.bandwidth()/2)
          .y(d => y2(d.efficiency)).curve(d3.curveCatmullRom)(workinghrs))

  innerChart.append("g")
    .selectAll()
    .data(workinghrs)
    .join("circle")
      .attr("cx", d => x(d.date) + x.bandwidth()/2)
      .attr("cy", d => y2(d.efficiency))
      .attr("r", 3)
      .attr("fill", "#75485E")
      .append("title")
        .text(d => `${d3.format(",.0f")(d.efficiency)}$ with manhr(${d.manhr})` )
  
  if (data.length <= 15) {
    innerChart.append("g")
    .selectAll()
    .data(workinghrs)
    .join("text")
      .text(d => `${d3.format(",.0f")(d.efficiency)}`)
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .attr("font-size", "12px")
        .attr("dy", "0.35em")
        .attr("x", d => x(d.date) + x.bandwidth()/2)
        .attr("y", d => y2(d.efficiency))
      .clone(true).lower()
        .attr("fill", "none")
        .attr("stroke", "white")
        .attr("stroke-width", 6);
        
    innerChart.append("text")
      .text("$/FTE")
      .attr("text-anchor", "start")
      .attr("alignment-baseline", "middle")
      .attr("x", x(workinghrs[workinghrs.length-1].date) + x.bandwidth()/2)
      .attr("y", y2(workinghrs[workinghrs.length-1].efficiency))
      .attr("dx", "1.2em")
      .attr("dy", "0.3em")
      .attr("fill", "#75485E")
      .attr("font-weight", 600)
      .attr("font-size", 14)
  }

  if (data.length > 15) {
    xAxis
      .call(g => g.selectAll(".tick line").clone(true)
      .attr("y2", -innerHeight)
      .attr("opacity", 0.1))

    innerChart.append("text")
      .text("$/FTE")
      .attr("text-anchor", "start")
      .attr("alignment-baseline", "middle")
      .attr("x", innerWidth)
      .attr("y", innerHeight/2)
      .attr("dy", "1.5em")
      .attr("fill", "#75485E")
      .attr("font-weight", 600)
      .attr("font-size", 12)
  }
  

  }

  return svg.node();
}