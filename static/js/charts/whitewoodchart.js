const drawWhiteWhoodVTPChart = (data, plandata, avgdata, inventorydata, target) => {
  if (data == undefined) return;
  const width = 900;
  const height = 350;
  const margin = {top: 20, right: 20, bottom: 20, left: 80};
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

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
    .domain(["brand", "rh", "white", "variance"])
    .range(["#DFC6A2", "#A5A0DE", "#D1D1D1", "#FFBE98"])
    .unknown("#ccc");

  const svg = d3.create("svg")
    .attr("viewBox", [0, 0, width, height])

  const innerChart = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)

  const avgData = series[series.length-1].slice(0, -1)
  // const dataAvg = d3.sum(avgData, d => d[1])/avgData.length
  const dataAvg = avgdata
  const minDate = avgData[d3.minIndex(avgData, d => d[1])].data[0]
  innerChart.append("line")
    .attr("x1", 0)
    .attr("y1", y(dataAvg))
    .attr("x2", innerWidth - x.bandwidth() - 10)
    .attr("y2", y(dataAvg))
    .attr("stroke", "#257180")
    .attr("fill", "none")
    .attr("stroke-opacity", 0.7)
  innerChart.append("text")
      .text(`AVG: ${d3.format(",.0f")(dataAvg)}`)
      .attr("text-anchor", "end")
      .attr("alignment-baseline", "middle")
      .attr("x", x(minDate) + x.bandwidth())
      .attr("y", y(dataAvg))
      .attr("dy", "-0.5em")
      .attr("fill", "#257180")
      .attr("font-weight", 600)
      .attr("font-size", 12)
  innerChart.append("text")
      .text("* của cột tiền thực tế từ đầu tháng")
      .attr("class", "disappear")
      .attr("text-anchor", "start")
      .attr("alignment-baseline", "middle")
      .attr("x", x(minDate) + 5)
      .attr("y", y(dataAvg))
      .attr("dy", "-1.8em")
      .attr("fill", "#257180")
      .attr("font-size", 12)
      .style("transition", "opacity 2s ease-out")
  setTimeout(() => d3.selectAll(".disappear").attr("opacity", 0), 40000)


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
    .attr("y", d => y(d[1]) - 10)
    .attr("dy", "0.4em") 
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
        .attr("x", d => x(d.data[0]) + 2*x.bandwidth()/3)
        .attr("y", d => y(d[1]) - (y(d[1]) - y(d[0]))/2)
        .attr("dy", "0.1em")
        .attr("fill", "#75485E")
        .text(d => (d[1] - d[0] >= 10000) ? `${d3.format(",.0f")(d[1]-d[0])}` : "")
  })

  svg.append("text")
    .text("RH")
    .attr("text-anchor", "start")
    .attr("alignment-baseline", "middle")
    .attr("x", 0)
    .attr("y", 5)
    .attr("dy", "0.35em")
    .attr("fill", color("rh"))
    .attr("font-weight", 600)
    .attr("font-size", 12)

  svg.append("text")
      .text("Brand")
      .attr("text-anchor", "start")
      .attr("alignment-baseline", "middle")
      .attr("x", 0)
      .attr("y", 25)
      .attr("dy", "0.35em")
      .attr("fill", color("brand"))
      .attr("font-weight", 600)
      .attr("font-size", 12)

  svg.append("text")
      .text("White")
      .attr("text-anchor", "start")
      .attr("alignment-baseline", "middle")
      .attr("x", 0)
      .attr("y", 45)
      .attr("dy", "0.35em")
      .attr("fill", color("white"))
      .attr("font-weight", 600)
      .attr("font-size", 12)
      
  svg.append("text")
      .text("Variance")
      .attr("text-anchor", "start")
      .attr("alignment-baseline", "middle")
      .attr("x", 0)
      .attr("y", 65)
      .attr("dy", "0.35em")
      .attr("fill", color("variance"))
      .attr("font-weight", 600)
      .attr("font-size", 12)
  
  svg.append("text")
      .text("($)")
      .attr("text-anchor", "start")
      .attr("alignment-baseline", "middle")
      .attr("x", 0)
      .attr("y", 85)
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
        .text(d => ((d[1]-d[0]) >= 10000) ? `${d3.format(",.0f")(d[1]-d[0])}` : "")
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .attr("x", d => x(d.data[0]) + x.bandwidth()/6)
        .attr("y", d => y(d[1]) - (y(d[1]) - y(d[0]))/2)
        .attr("dy", "0.1em")
        .attr("fill", "#102C57")
        .attr("transform", d => `rotate(-90, ${x(d.data[0]) + x.bandwidth()/6}, ${y(d[1]) - (y(d[1]) - y(d[0]))/2})`)
  })

  innerChart.append("text")
        .text("plan")
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "start")
        .attr("x", x(plandata[plandata.length-1].date))
        .attr("y", y(plandata[plandata.length-1].plan + plandata[plandata.length-2].plan) + 40)
        .attr("dy", "-0.2em")
        .attr("fill", "#FA7070")
        .attr("font-size", 14)
        .attr("transform", `rotate(-80, ${x(plandata[plandata.length-1].date)}, ${y(plandata[plandata.length-1].plan + plandata[plandata.length-2].plan) + 40})`)

    innerChart.append("line")
      .attr("x1", x(plandata[plandata.length-1].date))
      .attr("y1", y(plandata[plandata.length-1].plan + plandata[plandata.length-2].plan))
      .attr("x2", x(plandata[plandata.length-1].date) - 5)
      .attr("y2", y(plandata[plandata.length-1].plan + plandata[plandata.length-2].plan) + 28)
      .attr("stroke", "#75485E")
      .attr("fill", "none")
      .attr("stroke-opacity", 0.5)

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
        .attr("fill", "currentColor")

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
    const y2 = d3.scaleLinear()
      .domain([0,  inventorydata[0].inventory + inventorydata[1].inventory + 1])
      .rangeRound([3*innerHeight/4, 0])
      .nice()

    const leftInnerChart = svg.append("g")
      .attr("transform", `translate(0, ${innerHeight/4})`)

    svg.append("line")
      .attr("x1", 70)
      .attr("y1", height)
      .attr("x2", 70)
      .attr("y2", 0)
      .attr("stroke", "black")
      .attr("stroke-opacity", 0.2)

    leftInnerChart.append("rect")
      .attr("x", 10)
      .attr("y", y2(inventorydata[0].inventory) + margin.bottom)
      .attr("width", 45)
      .attr("height", 3*innerHeight/4 - y2(inventorydata[0].inventory))
      .attr("fill", color(inventorydata[0].prodtype));

      leftInnerChart.append("rect")
      .attr("x", 10)
      .attr("y", y2(inventorydata[1].inventory) + margin.bottom - (3*innerHeight/4 - y2(inventorydata[0].inventory)))
      .attr("width", 45)
      .attr("height", 3*innerHeight/4 - y2(inventorydata[1].inventory))
      .attr("fill", color(inventorydata[1].prodtype));

      leftInnerChart.append("text")
      .text(`${d3.format(",.0f")(inventorydata[0].inventory)}`)
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .attr("x", 32)
      .attr("y",  y2(inventorydata[0].inventory/2) + margin.bottom)
      .attr("fill", "#102C57")
      .attr("font-size", 12)

      leftInnerChart.append("text")
      .text(`${d3.format(",.0f")(inventorydata[1].inventory)}`)
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .attr("x", 32)
      .attr("y",  y2(inventorydata[1].inventory/2) + margin.bottom - (3*innerHeight/4 - y2(inventorydata[0].inventory)))
      .attr("fill", "#102C57")
      .attr("font-size", 12)

      leftInnerChart.append("text")
      .text(`${d3.format(",.0f")(inventorydata[0].inventory + inventorydata[1].inventory)}`)
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .attr("x", 32)
      .attr("y",  y2(inventorydata[1].inventory) + margin.bottom - (3*innerHeight/4 - y2(inventorydata[0].inventory)))
      .attr("dy", "-0.35em")
      .attr("fill", "#75485E")
      .attr("font-size", 12)

      leftInnerChart.append("text")
      .text(inventorydata[1].createdatstr)
      .attr("text-anchor", "start")
      .attr("alignment-baseline", "middle")
      .attr("x", 60)
      .attr("y", y2(inventorydata[1].inventory) + margin.bottom - (3*innerHeight/4 - y2(inventorydata[0].inventory)))
      .attr("fill", "#FA7070")
      .attr("font-size", 12)
      .attr("transform", `rotate(90, 60, ${y2(inventorydata[1].inventory) + margin.bottom - (3*innerHeight/4 - y2(inventorydata[0].inventory))})`)
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