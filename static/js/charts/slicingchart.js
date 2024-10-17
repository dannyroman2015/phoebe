// giống drawLaminationChart nhưng thêm target
const drawSlicingVTChart = (data, target) => {
  const width = 900;
  const height = 350;
  const margin = {top: 20, right: 20, bottom: 20, left: 20};
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const series = d3.stack()
    .keys(d3.union(data.map(d => d.prodtype).sort()))
    .value(([, D], key) => D.get(key) === undefined ? 0 : D.get(key).qty)
    (d3.index(data, d => d.date, d => d.prodtype))

  const x = d3.scaleBand()
    .domain(data.map(d => d.date))
    .range([0, innerWidth])
    .padding(0.1);

  const y = d3.scaleLinear()
    .domain([0, d3.max(series, d => d3.max(d, d => d[1]))])
    // .domain([0,  d3.max([d3.max(series, d => d3.max(d, d => d[1])), target == undefined ? 0 : d3.max(target, d => d.value)])])
    .rangeRound([innerHeight, 0])
    .nice()

  const color = d3.scaleOrdinal()
    .domain(series.map(d => d.key).sort())
    .range(["#FFCCCC", "#DFC6A2", "#A0D9DE"])
    .unknown("#ccc");

  const svg = d3.create("svg")
    .attr("viewBox", [0, 0, width, height])

  const innerChart = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)

  innerChart
    .selectAll()
    .data(series)
    .join("g")
      .attr("fill", d => color(d.key))
      .attr("fill-opacity", 1)
    .selectAll("rect")
    .data(D => D.map(d => (d.key = D.key, d)))
    .join("rect")
        .attr("x", d => x(d.data[0]))
        .attr("y", d => y(d[1]))
        .attr("height", d => y(d[0]) - y(d[1]))
        .attr("width", x.bandwidth())
      .append("title")
        .text(d => d[1]-d[0])

  const dateTotal = new Set(data.map(d => d.date)).size
  innerChart.append("g")
    .attr("transform", `translate(0, ${innerHeight})`)
    .call(d3.axisBottom(x).tickSizeOuter(0))
    .call(g => g.selectAll(".domain").remove())
    .call(g => g.selectAll("text").text((d, i) => (i == 0 || i == dateTotal-1 || d.slice(0, 2) == "01") ? d : d.slice(0, 2)).attr("font-size", "12px"))

  innerChart.append("g")
    .attr("font-family", "sans-serif")
    .attr("font-size", 12)
  .selectAll()
  .data(series[series.length-1])
  .join("text")
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle")
    .attr("x", d => x(d.data[0]) + x.bandwidth()/2)
    .attr("y", d => y(d[1]) - 5)
    .attr("fill", "#75485E")
    .attr("font-weight", 600)
    .text(d => `${d3.format(",.0f")(d[1])}` )

  series.forEach(serie => {
    innerChart.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 12)
      .selectAll()
      .data(serie)
      .join("text")
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .attr("x", d => x(d.data[0]) + x.bandwidth()/2)
        .attr("y", d => y(d[1]) - (y(d[1]) - y(d[0]))/2)
        .attr("fill", "#75485E")
        .text(d => {
          if (d[1] - d[0] >= 30) { return d3.format(",.0f")(d[1]-d[0])}
        })
  })

//draw target lines
if (target != undefined) { 
  const dates = data.map(d => d.date)
target = target.filter(t => dates.includes(t.date))
innerChart
.selectAll()
.data(target)
.join("line")
  .attr("x1", d => x(d.date))
  .attr("y1", d => y(d.value))
  .attr("x2", d => x(d.date) + x.bandwidth())
  .attr("y2", d => y(d.value))
  .attr("stroke", "#FA7070")
  .attr("fill", "none")
  .attr("stroke-opacity", 0.5)

innerChart.append("g")
  .attr("stroke-linecap", "round")
  .attr("stroke-linejoin", "round")
  .attr("text-anchor", "middle")
.selectAll()
.data(target)
.join("text")
  .text((d,i) => {
     if (i == target.length-1) return d.value;
     else {
       if (d.value != target[i+1].value && Math.abs(data.filter(t => t.date == d.date).reduce((total, n) => total + n.qty, 0) - d.value) > 15) return d.value;
     }
   })
  .attr("font-size", "14px")
  .attr("dy", "0.35em")
  .attr("x", d => x(d.date) + x.bandwidth()/2)
  .attr("y", d => y(d.value))
  .attr("stroke", "#75485E")
  .attr("font-weight", 300)
  .clone(true).lower()
  .attr("fill", "none")
  .attr("stroke", "white")
  .attr("stroke-width", 6)
}
   // end target line

const maxOne = series[1].find(d => d[1] == d3.max(series[1], d => d[1]))
// innerChart.append("text")
//     .text("RH")
//     .attr("text-anchor", "start")
//     .attr("alignment-baseline", "middle")
//     .attr("x", x(maxOne.data[0]) + x.bandwidth())
//     .attr("y", y(maxOne[1]) - 30)
//     .attr("dy", "0.35em")
//     .attr("fill", color("rh"))
//     .attr("font-size", "14px")
//     .attr("font-weight", 900)

// innerChart.append("line")
//     .attr("x1", x(maxOne.data[0]) + x.bandwidth() + 10)
//     .attr("y1", y(maxOne[1]) - 20)
//     .attr("x2", x(maxOne.data[0]) + x.bandwidth())
//     .attr("y2", y(maxOne[1]))
//     .attr("stroke", "#75485E")
//     .attr("stroke-width", 1)

// innerChart.append("text")
//     .text("BRAND")
//     .attr("text-anchor", "start")
//     .attr("alignment-baseline", "middle")
//     .attr("x", x(maxOne.data[0]) - 30)
//     .attr("y", y(maxOne[1]) - 30)
//     .attr("dy", "0.35em")
//     .attr("fill", color("brand"))
//     .attr("font-size", "14px")
//     .attr("font-weight", 900)

// innerChart.append("line")
//   .attr("x1", x(maxOne.data[0]) - 10)
//   .attr("y1", y(maxOne[1]) - 20)
//   .attr("x2", x(maxOne.data[0]) + 5)
//   .attr("y2", y(maxOne[0]/2) - 5)
//   .attr("stroke", "#75485E")
//   .attr("stroke-width", 1)

  svg.append("text")
  .text("Sản lượng (m²) theo gỗ ")
  .attr("text-anchor", "start")
  .attr("alignment-baseline", "start")
  .attr("x", 10)
  .attr("y", height-margin.bottom)
  .attr("dy", "0.35em")
  .attr("fill", "#75485E")
  .attr("font-weight", 300)
  .attr("font-size", 14)
  .attr("transform", `rotate(-90, 10, ${height-margin.bottom})`)
    .append("tspan")
      .text("Fir")
      .attr("fill", color("fir"))
      .attr("font-weight", 600)
    .append("tspan")
      .text(", Reeded")
      .attr("fill", color("reeded"))
      .attr("font-weight", 600)
    .append("tspan")
      .text(" với ")
      .attr("font-weight", 300)
      .attr("fill", "#75485E")
    .append("tspan")
      .text(" Target")
      .attr("fill", "#FA7070")
      .attr("font-weight", 600)

  return svg.node();
}

// efficiency
const drawSlicingVMChart2 = (data, manhr) => {
  const width = 900;
  const height = 350;
  const margin = {top: 20, right: 20, bottom: 20, left: 40};
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const dates = new Set(data.map(d => d.date)) 

  const x = d3.scaleBand()
    .domain(data.map(d => d.date))
    .range([0, innerWidth])
    .padding(0.1);

  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.qty)])
    .rangeRound([innerHeight, innerHeight/3])
    .nice()

  const svg = d3.create("svg")
    .attr("viewBox", [0, 0, width, height])

  const innerChart = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)

  innerChart
    .selectAll()
    .data(data)
    .join("rect")
      .attr("x", d => x(d.date))
      .attr("y", d => y(d.qty))
      .attr("height", d => y(0) - y(d.qty))
      .attr("width", x.bandwidth()/2)
      .attr("fill", "#DFC6A2")

  innerChart.append("g")
    .attr("transform", `translate(0, ${innerHeight})`)
    .call(d3.axisBottom(x).tickSizeOuter(0))
    .call(g => g.selectAll(".domain").remove())
    .call(g => g.selectAll("text").attr("font-size", "12px"))

  innerChart.append("g")
    .selectAll()
    .data(data)
    .join("text")
      .text(d => d3.format(".3s")(d.qty))
      .attr("text-anchor", "end")
      .attr("alignment-baseline", "middle")
      .attr("x", d => x(d.date) + x.bandwidth()/4)
      .attr("y", d => y(d.qty))
      .attr("dy", "0.35em")
      .attr("fill", "#75485E")
      .attr("font-size", "12px")
      .attr("font-weight", 600)
      .attr("transform", d => `rotate(-90, ${x(d.date) + x.bandwidth()/4}, ${y(d.qty)})`)
      
svg.append("text")
    .text("Sản lượng(m²)")
    .attr("text-anchor", "start")
    .attr("alignment-baseline", "middle")
    .attr("x", 0)
    .attr("y", 30)
    .attr("dy", "0.35em")
    .attr("fill", "#DFC6A2")
    .attr("font-weight", 600)
    .attr("font-size", 14)
 
  if (manhr != undefined) {
    const workinghrs = manhr.filter(d => dates.has(d.date))
    
    const y1 = d3.scaleLinear()
      .domain([0, d3.max(manhr, d => d.workhr)])
      .rangeRound([innerHeight, innerHeight/3])
      .nice()

    innerChart.append("g")
      .selectAll()
      .data(workinghrs)
      .join("rect")
        .attr("x", d => x(d.date) + x.bandwidth()/2)
        .attr("y", d => y1(d.workhr))
        .attr("height", d => y1(0) - y1(d.workhr))
        .attr("width", x.bandwidth()/2)
        .attr("fill", "#90D26D")
        .attr("fill-opacity", 0.3)
      
    innerChart.append("g")
      .selectAll()
      .data(workinghrs)
      .join("text")
        .text(d => `👷 ${d.hc} = ${d3.format(".0f")(d.workhr)}h`)
        .attr("text-anchor", "end")
        .attr("alignment-baseline", "middle")
        .attr("x", d => x(d.date) + x.bandwidth()*3/4)
        .attr("y", d => y1(d.workhr))
        .attr("fill", "#75485E")
        .attr("font-size", 12)
        .attr("transform", d => `rotate(-90, ${x(d.date) + x.bandwidth()*3/4 }, ${y1(d.workhr)})`)

    svg.append("text")
        .text("manhr (h)")
        .attr("text-anchor", "start")
        .attr("alignment-baseline", "middle")
        .attr("x", 0)
        .attr("y", 55)
        .attr("dy", "0.35em")
        .attr("fill","#90D26D")
        .attr("font-weight", 600)
        .attr("font-size", 14)

    // efficiency line
  workinghrs.forEach(w => {
    w.efficiency = data.find(d => d.date == w.date).qty / w.workhr / 2 * 100
  })

  const y2 = d3.scaleLinear()
      .domain(d3.extent(workinghrs, d => d.efficiency))
      .rangeRound([innerHeight/3, 0])
      .nice()

  innerChart.append("path")
      .attr("fill", "none")
      .attr("stroke", "#75485E")
      .attr("stroke-width", 1)
      .attr("d", d => d3.line()
          .x(d => x(d.date) + x.bandwidth()/2)
          .y(d => y2(d.efficiency)).curve(d3.curveCatmullRom)(workinghrs));

  innerChart.append("g")
    .selectAll()
    .data(workinghrs)
    .join("text")
      .text(d => `${d3.format(".3s")(d.efficiency)}%`)
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .attr("font-size", "14px")
        .attr("dy", "0.35em")
        .attr("x", d => x(d.date) + x.bandwidth()/2)
        .attr("y", d => y2(d.efficiency))
      .clone(true).lower()
        .attr("fill", "none")
        .attr("stroke", "white")
        .attr("stroke-width", 6);

  const lastW = workinghrs[workinghrs.length-1]
  innerChart.append("text")
        .text("Efficiency")
        .attr("text-anchor", "start")
        .attr("alignment-baseline", "middle")
        .attr("x", x(lastW.date) + x.bandwidth()/2 - 5)
        .attr("y", y2(lastW.efficiency) - 15)
        .attr("dy", "0.35em")
        .attr("fill","#75485E")
        .attr("font-weight", 600)
        .attr("font-size", 12)

  svg.append("text")
        .text("Demand: 2 m²/h")
        .attr("text-anchor", "start")
        .attr("alignment-baseline", "middle")
        .attr("x", 0)
        .attr("y", 5)
        .attr("dy", "0.35em")
        .attr("fill", "#75485E")
        .attr("font-weight", 600)
        .attr("font-size", 14)
  }

  return svg.node();
}