const drawWhiteWhoodVTPChart = (data, plandata, inventorydata, target) => {
  if (data == undefined) return;
  const width = 900;
  const height = 350;
  const margin = {top: 20, right: 20, bottom: 20, left: 80};
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  console.log(data)
  const series = d3.stack()
    .keys(d3.union(data.map(d => d.type)))
    .value(([, D], key) => D.get(key) === undefined ? 0 : D.get(key).value)
    (d3.index(data, d => d.date, d => d.type))

  const planseries = d3.stack()
    .keys(d3.union(plandata.map(d => d.plantype)))
    .value(([, D], key) => D.get(key) === undefined ? 0 : D.get(key).plan)
    (d3.index(plandata, d => d.date, d => d.plantype))

  const x = d3.scaleBand()
    // .domain(data.map(d => d.date))
    .domain(d3.union(data.map(d=> d.date), plandata.map(d => d.date)))
    .range([0, innerWidth])
    .padding(0.1);

  const y = d3.scaleLinear()
    .domain([0,  d3.max([d3.max(series, d => d3.max(d, d => d[1])), target == undefined ? 0 : d3.max(target, d => d.value)])])
    .rangeRound([innerHeight, 0])
    .nice()

  const color = d3.scaleOrdinal()
    .domain(series.map(d => d.key))
    .range(["#DFC6A2", "#A5A0DE", "#A0D9DE"])
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
      .attr("fill-opacity", 0.9)
    .selectAll("rect")
    .data(D => D.map(d => (d.key = D.key, d)))
    .join("rect")
        .attr("x", d => x(d.data[0]) + x.bandwidth()/3)
        .attr("y", d => y(d[1]))
        .attr("height", d => y(d[0]) - y(d[1]))
        .attr("width", 2*x.bandwidth()/3)
      .append("title")
        .text(d => d[1] - d[0])

  innerChart.append("g")
    .attr("transform", `translate(0, ${innerHeight})`)
    .call(d3.axisBottom(x).tickSizeOuter(0))
    .call(g => g.selectAll(".domain").remove())
    .call(g => g.selectAll("text").attr("font-size", "12px"))

  innerChart.append("g")
    .attr("font-family", "sans-serif")
    .attr("font-size", 11)
  .selectAll()
  .data(series[series.length-1])
  .join("text")
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle")
    .attr("x", d => x(d.data[0]) + 2*x.bandwidth()/3)
    .attr("y", d => y(d[1]) - 15)
    .attr("dy", "0.35em")
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
        .attr("class", d => d.key.substring(0,2))
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .attr("x", d => x(d.data[0]) + 2*x.bandwidth()/3)
        .attr("y", d => y(d[1]) - (y(d[1]) - y(d[0]))/2)
        .attr("dy", "0.1em")
        .attr("fill", "#75485E")
        .text(d => {
          if (d[1] - d[0] >= 500) { return `${d3.format(",.0f")(d[1]-d[0])}` }
        })
  })

  svg.append("text")
    .text("RH")
    .attr("text-anchor", "start")
    .attr("alignment-baseline", "middle")
    .attr("x", 0)
    .attr("y", 5)
    .attr("dy", "0.35em")
    .attr("fill", "#A5A0DE")
    .attr("font-weight", 600)
    .attr("font-size", 12)

  svg.append("text")
      .text("Brand")
      .attr("text-anchor", "start")
      .attr("alignment-baseline", "middle")
      .attr("x", 0)
      .attr("y", 30)
      .attr("dy", "0.35em")
      .attr("fill", "#DFC6A2")
      .attr("font-weight", 600)
      .attr("font-size", 12)
      
  svg.append("text")
      .text("($)")
      .attr("text-anchor", "start")
      .attr("alignment-baseline", "middle")
      .attr("x", 0)
      .attr("y", 105)
      .attr("dy", "0.35em")
      .attr("fill", "#75485E")
      .attr("font-size", 12)

  svg.append("text")
      .text("* Rà chuột vào cột để hiện value cho loại hàng")
      .attr("class", "disappear")
      .attr("text-anchor", "start")
      .attr("alignment-baseline", "middle")
      .attr("x", 40)
      .attr("y", 5)
      .attr("dy", "0.35em")
      .attr("fill", "#75485E")
      .attr("font-size", 12)
      .style("transition", "opacity 2s ease-out")
  setTimeout(() => d3.selectAll(".disappear").attr("opacity", 0), 5000)

  // cột plan
  innerChart
    .selectAll()
    .data(planseries)
    .join("g")
      .attr("fill", d => color(d.key))
      .attr("fill-opacity", 0.9)
    .selectAll("rect")
    .data(D => D.map(d => (d.key = D.key, d)))
    .join("rect")
        .attr("x", d => x(d.data[0]))
        .attr("y", d => y(d[1]))
        .attr("height", d => y(d[0]) - y(d[1]))
        .attr("width", x.bandwidth()/3)
        .attr("stroke", "#FF9874")
      .append("title")
        .text(d => d[1] - d[0])

    const diffs = d3.rollups(plandata, D => { return {"current": D[0].plan + D[1].plan, "prev": D[0].plan + D[1].plan + D[0].change + D[1].change}} ,d => d.date)
    innerChart
      .selectAll()
      .data(diffs)
      .join("rect")
          .attr("x", d => x(d[0]))
          .attr("y", d => d[1].current >= d[1].prev ? y(d[1].current) : y(d[1].prev))
          .attr("height", d => y(0) - y(Math.abs(d[1].current-d[1].prev)))
          .attr("width", x.bandwidth()/3)
          .attr("fill", "url(#diffpattern)")
          .attr("fill-opacity", 0.3)
        .append("title")
          .text(d => Math.abs(d[1].current-d[1].prev))

    innerChart
      .selectAll()
      .data(diffs)
      .join("text")
        .text(d => {
          if (d[1].current > d[1].prev) {
            return "︽"
          }
          if (d[1].current < d[1].prev) {
            return "︾"
          }
        })
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .attr("x", d => x(d[0]) + x.bandwidth()/6)
        .attr("y", d => d[1].current >= d[1].prev ? y(d[1].current) + 10 : y(d[1].prev) + 10)
        .attr("font-weight", 900)
        .attr("fill", d => {
          if (d[1].current > d[1].prev) {
            return "#3572EF"
          }
          if (d[1].current < d[1].prev) {
            return "#C80036"
          }
        })

  planseries.forEach(planserie => {
    innerChart.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 12)
      .selectAll()
      .data(planserie)
      .join("text")
        .text(d => `${d3.format(",.0f")(d[1]-d[0])}`)
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .attr("x", d => x(d.data[0]) + x.bandwidth()/6)
        .attr("y", d => y(d[1]) - (y(d[1]) - y(d[0]))/2)
        .attr("dy", "0.1em")
        .attr("fill", "#102C57")
        .attr("transform", d => `rotate(-90, ${x(d.data[0]) + x.bandwidth()/6}, ${y(d[1]) - (y(d[1]) - y(d[0]))/2})`)
  })

  innerChart.append("text")
        .text("plan -->")
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .attr("x", x(plandata[plandata.length-1].date) + x.bandwidth()/6)
        .attr("y", y(plandata[plandata.length-1].plan + plandata[plandata.length-2].plan) - 30)
        .attr("fill", "#FA7070")
        .attr("font-size", 14)
        .attr("transform", `rotate(90, ${x(plandata[plandata.length-1].date) + x.bandwidth()/6}, ${y(plandata[plandata.length-1].plan + plandata[plandata.length-2].plan) - 30})`)

  // end cột plan

  //draw target lines
  if (target != undefined) { 
    const dates = Array.from(d3.union(plandata.map(d => d.date), data.map(d => d.date))) 
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
      .selectAll()
      .data(target)
      .join("text")
        .attr("text-anchor", "end")
        .attr("alignment-baseline", "middle")
        .text(d => `- ${d3.format("~s")(d.value)}`)
        .attr("font-size", "12px")
        .attr("x", innerWidth + 10)
        .attr("y", d => y(d.value))

    innerChart.append("text")
        .text("Target")
        .attr("text-anchor", "end")
        .attr("alignment-baseline", "middle")
        .attr("x", innerWidth)
        .attr("y", y(d3.min(target, d => d.value)) + 10)
        .attr("fill", "#FA7070")
        .attr("font-size", 12)
        .attr("transform", `rotate(-90, ${innerWidth}, ${y(d3.min(target, d => d.value)) + 10})`)

  }
  // end target line

  // inventory bar
  if (inventorydata != undefined) {
    svg.append("line")
      .attr("x1", 70)
      .attr("y1", height)
      .attr("x2", 70)
      .attr("y2", 0)
      .attr("stroke", "black")
      .attr("stroke-opacity", 0.2)

    svg.append("rect")
      .attr("x", 10)
      .attr("y", y(inventorydata[0].inventory) + margin.bottom)
      .attr("width", 45)
      .attr("height", innerHeight - y(inventorydata[0].inventory))
      .attr("fill", color(inventorydata[0].prodtype));

    svg.append("rect")
      .attr("x", 10)
      .attr("y", y(inventorydata[1].inventory) + margin.bottom - (innerHeight - y(inventorydata[0].inventory)))
      .attr("width", 45)
      .attr("height", innerHeight - y(inventorydata[1].inventory))
      .attr("fill", color(inventorydata[1].prodtype));

    svg.append("text")
      .text(`${d3.format(",.0f")(inventorydata[0].inventory)}`)
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .attr("x", 32)
      .attr("y",  y(inventorydata[0].inventory/2) + margin.bottom)
      .attr("fill", "#102C57")
      .attr("font-size", 12)

    svg.append("text")
      .text(`${d3.format(",.0f")(inventorydata[1].inventory)}`)
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .attr("x", 32)
      .attr("y",  y(inventorydata[1].inventory/2) + margin.bottom - (innerHeight - y(inventorydata[0].inventory)))
      .attr("fill", "#102C57")
      .attr("font-size", 12)

    svg.append("text")
      .text(inventorydata[1].createdatstr)
      .attr("text-anchor", "start")
      .attr("alignment-baseline", "middle")
      .attr("x", 60)
      .attr("y", y(inventorydata[1].inventory) + margin.bottom - (innerHeight - y(inventorydata[0].inventory)))
      .attr("fill", "#FA7070")
      .attr("font-size", 12)
      .attr("transform", `rotate(90, 60, ${y(inventorydata[1].inventory) + margin.bottom - (innerHeight - y(inventorydata[0].inventory))})`)
    // end inventory

    svg.append("text")
      .text("Inventory")
      .attr("text-anchor", "start")
      .attr("x", 5)
      .attr("y", height)
      .attr("dy", "-0.35em")
      .attr("fill", "#75485E")
      .attr("font-size", 12)
  } 


  return svg.node();

  function change(flag) {
    if (flag) {
      innerChart.call(g => g.selectAll(".X1").attr("opacity", 0))
      innerChart.call(g => g.selectAll(".x1total").attr("opacity", 1))
    } else {
      innerChart.call(g => g.selectAll(".X1").attr("opacity", 1))
      innerChart.call(g => g.selectAll(".x1total").attr("opacity", 0))
    }
  }
}