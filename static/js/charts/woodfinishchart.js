const drawWoodFinishChart = (data) => {
  if (data == undefined) return;
  const width = 900;
  const height = 350;
  const margin = {top: 20, right: 20, bottom: 20, left: 30};
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  
  const series = d3.stack()
    .keys(d3.union(data.map(d => d.type)))
    .value(([, D], key) => D.get(key) === undefined ? 0 : D.get(key).value)
    (d3.index(data, d => d.date, d => d.type))

  const x = d3.scaleBand()
    .domain(data.map(d => d.date))
    .range([0, innerWidth])
    .padding(0.1);

  const y = d3.scaleLinear()
    .domain([0, d3.max(series, d => d3.max(d, d => d[1]))])
    .rangeRound([innerHeight, 0])
    .nice()

  const color = d3.scaleOrdinal()
    .domain(series.map(d => d.key))
    .range(["#DFC6A2", "#A5A0DE", "#DFC6A2", "#A5A0DE"])
    .unknown("white");

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
      .attr("x", d => x(d.data[0]))
      .attr("y", d => d.key.startsWith("X2") ? y(d[1]) - 5 : y(d[1]))
      .attr("height", d => y(d[0]) - y(d[1]))
      .attr("width", x.bandwidth())

  innerChart.append("g")
    .attr("transform", `translate(0, ${innerHeight})`)
    .call(d3.axisBottom(x).tickSizeOuter(0))
    .call(g => g.selectAll(".domain").remove())
    .call(g => g.selectAll("text").attr("font-size", "14px"))

  innerChart.append("g")
    .attr("font-family", "sans-serif")
    .attr("font-size", 15)
  .selectAll()
  .data(series[series.length-1])
  .join("text")
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle")
    .attr("x", d => x(d.data[0]) + x.bandwidth()/2)
    .attr("y", d => y(d[1]) - 15)
    .attr("dy", "0.35em")
    .attr("fill", "#75485E")
    .attr("font-weight", 600)
    .text(d => `Σ ${d3.format("~s")(d[1])}` )

  series.forEach(serie => {
    innerChart.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 14)
      .selectAll()
      .data(serie)
      .join("text")
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .attr("x", d => x(d.data[0]) + x.bandwidth()/2)
        .attr("y", d => d.key.startsWith("X2") ? y(d[1]) - (y(d[1]) - y(d[0]))/2 - 5 : y(d[1]) - (y(d[1]) - y(d[0]))/2)
        .attr("dy", "0.1em")
        .attr("fill", "#75485E")
        .attr("fill", d => d.key.startsWith("X1") ? "#EB455F" : "#102C57")
        .text(d => {
          if (d[1] - d[0] >= 60) { return `${d3.format("~s")(d[1]-d[0])}` }
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
      .attr("font-size", 16)

  svg.append("text")
      .text("Brand")
      .attr("text-anchor", "start")
      .attr("alignment-baseline", "middle")
      .attr("x", 0)
      .attr("y", 30)
      .attr("dy", "0.35em")
      .attr("fill", "#DFC6A2")
      .attr("font-weight", 600)
      .attr("font-size", 16) 

  svg.append("text")
      .text("Xưởng 2")
      .attr("text-anchor", "start")
      .attr("alignment-baseline", "middle")
      .attr("x", 0)
      .attr("y", 55)
      .attr("dy", "0.35em")
      .attr("fill", "#102C57")
      .attr("font-weight", 600)
      .attr("font-size", 16) 

  svg.append("text")
      .text("Xưởng 1")
      .attr("text-anchor", "start")
      .attr("alignment-baseline", "middle")
      .attr("x", 0)
      .attr("y", 80)
      .attr("dy", "0.35em")
      .attr("fill", "#EB455F")
      .attr("font-weight", 600)
      .attr("font-size", 16)
      
  svg.append("text")
      .text("($)")
      .attr("text-anchor", "start")
      .attr("alignment-baseline", "middle")
      .attr("x", 0)
      .attr("y", 105)
      .attr("dy", "0.35em")
      .attr("fill", "#75485E")
      .attr("font-size", 16)
 
    // lastX1 = series.filter(d => d.key.startsWith("X1"))[1][0]
    // const factoryLabel = svg.append("text")
    //   .attr("text-anchor", "start")
    //   .attr("alignment-baseline", "middle")
    //   .attr("x", 0)
    //   .attr("y", y(lastX1[1]) + 13)
    //   .attr("dy", "0.35em")
    //   .attr("fill", "#75485E")
    //   .attr("font-size", "20px")

    // factoryLabel.append("tspan")
    //   .text("X2")
    //   .attr("x", 0)
    //   .attr("dy", -5)
    //   .attr("font-size", "20px")

    // factoryLabel.append("tspan")
    //   .text("⬀")
    //   .attr("x", 20)
    //   .attr("dy", -20)
    //   .attr("font-size", "40px")

    // factoryLabel.append("tspan")
    //   .text("X1")
    //   .attr("x", 0)
    //   .attr("dy", 50)
    //   .attr("font-size", "20px")

    // factoryLabel.append("tspan")
    //   .text("⬂")
    //   .attr("x", 20)
    //   .attr("dy", 30)
    //   .attr("font-size", "40px")

  return svg.node();
}

const drawWoodFinishChart1 = (data) => {
  if (data == undefined) return;
  const width = 900;
  const height = 350;
  const margin = {top: 20, right: 20, bottom: 20, left: 50};
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  
  const series = d3.stack()
    .keys(d3.union(data.map(d => d.type)))
    .value(([, D], key) => D.get(key) === undefined ? 0 : D.get(key).value)
    (d3.index(data, d => d.date, d => d.type))

  const x = d3.scaleBand()
    .domain(data.map(d => d.date))
    .range([0, innerWidth])
    .padding(0.1);

  const y = d3.scaleLinear()
    .domain([0, d3.max(series, d => d3.max(d, d => d[1]))])
    .rangeRound([innerHeight, 0])
    .nice()

  const color = d3.scaleOrdinal()
    .domain(series.map(d => d.key))
    .range(d3.schemePastel1)
    .unknown("white");

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
      .attr("x", d => x(d.data[0]))
      .attr("y", d => d.key.startsWith("X2") ? y(d[1]) - 5 : y(d[1]))
      .attr("height", d => y(d[0]) - y(d[1]))
      .attr("width", x.bandwidth())

  innerChart.append("g")
    .attr("transform", `translate(0, ${innerHeight})`)
    .call(d3.axisBottom(x).tickSizeOuter(0))
    .call(g => g.selectAll(".domain").remove())
    .call(g => g.selectAll("text").attr("font-size", "14px"))

  innerChart.append("g")
    .attr("font-family", "sans-serif")
    .attr("font-size", 15)
  .selectAll()
  .data(series[series.length-1])
  .join("text")
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle")
    .attr("x", d => x(d.data[0]) + x.bandwidth()/2)
    .attr("y", d => y(d[1]) - 10)
    .attr("dy", "0.35em")
    .attr("fill", "#75485E")
    .attr("font-weight", 600)
    .text(d => `Σ ${d3.format("~s")(d[1])}` )

  series.forEach(serie => {
    innerChart.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 14)
      .selectAll()
      .data(serie)
      .join("text")
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .attr("x", d => x(d.data[0]) + x.bandwidth()/2)
        .attr("y", d => d.key.startsWith("X2") ? y(d[1]) - (y(d[1]) - y(d[0]))/2 - 5 : y(d[1]) - (y(d[1]) - y(d[0]))/2)
        .attr("dy", "0.1em")
        .attr("fill", "#75485E")
        .text(d => {
          if (d[1] - d[0] >= 60) { return `${d3.format("~s")(d[1]-d[0])}` }
        })
  })
  
  svg.append("text")
      .text("Đồng bộ")
      .attr("text-anchor", "start")
      .attr("alignment-baseline", "middle")
      .attr("x", 0)
      .attr("y", 5)
      .attr("dy", "0.35em")
      .attr("fill", color("whole"))
      .attr("font-weight", 600)
      .attr("font-size", 16)

  svg.append("text")
      .text("WIP")
      .attr("text-anchor", "start")
      .attr("alignment-baseline", "middle")
      .attr("x", 0)
      .attr("y", 30)
      .attr("dy", "0.35em")
      .attr("fill", color("wip"))
      .attr("font-weight", 600)
      .attr("font-size", 16)

  svg.append("text")
      .text("Chờ giao")
      .attr("text-anchor", "start")
      .attr("alignment-baseline", "middle")
      .attr("x", 0)
      .attr("y", 55)
      .attr("dy", "0.35em")
      .attr("fill", color("waiting"))
      .attr("font-weight", 600)
      .attr("font-size", 16)

  svg.append("text")
      .text("Trên truyền")
      .attr("text-anchor", "start")
      .attr("alignment-baseline", "middle")
      .attr("x", 0)
      .attr("y", 80)
      .attr("dy", "0.35em")
      .attr("fill", color("onconvey"))
      .attr("font-weight", 600)
      .attr("font-size", 16)

  svg.append("text")
      .text("($)")
      .attr("text-anchor", "start")
      .attr("alignment-baseline", "middle")
      .attr("x", 0)
      .attr("y", 105)
      .attr("dy", "0.35em")
      .attr("fill", "#75485E")
      .attr("font-size", 16)

  return svg.node();
}

const drawWoodFinishChart2 = (data, target) => {
  if (data == undefined) return;
  const width = 900;
  const height = 350;
  const margin = {top: 20, right: 20, bottom: 20, left: 50};
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  
  const series = d3.stack()
    .keys(d3.union(data.map(d => d.type)))
    .value(([, D], key) => D.get(key) === undefined ? 0 : D.get(key).value)
    (d3.index(data, d => d.date, d => d.type))

  const x = d3.scaleBand()
    .domain(data.map(d => d.date))
    .range([0, innerWidth])
    .padding(0.1);

  const y = d3.scaleLinear()
    // .domain([0, d3.max(series, d => d3.max(d, d => d[1]))])
    .domain([0,  d3.max([d3.max(series, d => d3.max(d, d => d[1])), d3.max(target, d => d.value)])])
    .rangeRound([innerHeight, 0])
    .nice()

  const color = d3.scaleOrdinal()
    .domain(series.map(d => d.key))
    .range(d3.schemePastel1)
    .unknown("white");

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
      .attr("x", d => x(d.data[0]))
      .attr("y", d => d.key.startsWith("X2") ? y(d[1]) - 5 : y(d[1]))
      .attr("height", d => y(d[0]) - y(d[1]))
      .attr("width", x.bandwidth())

  innerChart.append("g")
    .attr("transform", `translate(0, ${innerHeight})`)
    .call(d3.axisBottom(x).tickSizeOuter(0))
    .call(g => g.selectAll(".domain").remove())
    .call(g => g.selectAll("text").attr("font-size", "14px"))

  innerChart.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 15)
    .selectAll()
    .data(series[series.length-1])
    .join("text")
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .attr("x", d => x(d.data[0]) + x.bandwidth()/2)
      .attr("y", d => y(d[1]) - 10)
      .attr("dy", "0.35em")
      .attr("fill", "#75485E")
      .attr("font-weight", 600)
      .text(d => `Σ ${d3.format("~s")(d[1])}`)

  series.forEach(serie => {
    innerChart.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 14)
      .selectAll()
      .data(serie)
      .join("text")
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .attr("x", d => x(d.data[0]) + x.bandwidth()/2)
        .attr("y", d => d.key.startsWith("X2") ? y(d[1]) - (y(d[1]) - y(d[0]))/2 - 5 : y(d[1]) - (y(d[1]) - y(d[0]))/2)
        .attr("dy", "0.1em")
        .attr("fill", "#75485E")
        .text(d => {
          if (d[1] - d[0] >= 60) { return `${d3.format("~s")(d[1]-d[0])}` }
        })
  })

//draw target lines
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
  .text((d, i) => {
    if (i == target.length-1) return d3.format("~s")(d.value);
     else {
       if (d.value != target[i+1].value && Math.abs(data.filter(t => t.date == d.date).reduce((total, n) => total + n.value, 0) - d.value) > 1000) return d3.format("~s")(d.value);
     }
  })
  .attr("font-size", "12px")
  .attr("dy", "0.35em")
  .attr("x", d => x(d.date) + x.bandwidth()/2)
  .attr("y", d => y(d.value))
  .attr("stroke", "#75485E")
  .attr("font-weight", 300)
  .clone(true).lower()
  .attr("fill", "none")
  .attr("stroke", "white")
  .attr("stroke-width", 6)
   // end target line

  svg.append("text")
      .text("Đồng bộ")
      .attr("text-anchor", "start")
      .attr("alignment-baseline", "middle")
      .attr("x", 0)
      .attr("y", 5)
      .attr("dy", "0.35em")
      .attr("fill", color("whole"))
      .attr("font-weight", 600)
      .attr("font-size", 16)

  svg.append("text")
      .text("WIP")
      .attr("text-anchor", "start")
      .attr("alignment-baseline", "middle")
      .attr("x", 0)
      .attr("y", 30)
      .attr("dy", "0.35em")
      .attr("fill", color("wip"))
      .attr("font-weight", 600)
      .attr("font-size", 16)

  svg.append("text")
      .text("Chờ giao")
      .attr("text-anchor", "start")
      .attr("alignment-baseline", "middle")
      .attr("x", 0)
      .attr("y", 55)
      .attr("dy", "0.35em")
      .attr("fill", color("waiting"))
      .attr("font-weight", 600)
      .attr("font-size", 16)

  svg.append("text")
      .text("Trên truyền")
      .attr("text-anchor", "start")
      .attr("alignment-baseline", "middle")
      .attr("x", 0)
      .attr("y", 80)
      .attr("dy", "0.35em")
      .attr("fill", color("onconvey"))
      .attr("font-weight", 600)
      .attr("font-size", 16)

  svg.append("text")
      .text("($)")
      .attr("text-anchor", "start")
      .attr("alignment-baseline", "middle")
      .attr("x", 0)
      .attr("y", 105)
      .attr("dy", "0.35em")
      .attr("fill", "#75485E")
      .attr("font-size", 16)

  return svg.node();
}

const drawWoodFinishVTChart = (data, target) => {
  if (data == undefined) return;
  const width = 900;
  const height = 350;
  const margin = {top: 20, right: 20, bottom: 20, left: 40};
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  
  let flag = true;

  let series = d3.stack()
    .keys(d3.union(data.map(d => d.type).sort()))
    .value(([, D], key) => D.get(key) === undefined ? 0 : D.get(key).value)
    (d3.index(data, d => d.date, d => d.type))

  const x = d3.scaleBand()
    .domain(data.map(d => d.date))
    .range([0, innerWidth])
    .padding(0.1);

  const y = d3.scaleLinear()
    // .domain([0, d3.max(series, d => d3.max(d, d => d[1]))])
    .domain([0,  d3.max([d3.max(series, d => d3.max(d, d => d[1])), target == undefined ? 0 : d3.max(target, d => d.value)])])
    .rangeRound([innerHeight, 0])
    .nice()

  const color = d3.scaleOrdinal()
    // .domain(series.map(d => d.key))
    .domain(["X1-brand", "X1-rh", "X2-brand", "X2-rh"])
    .range(["#DFC6A2", "#A5A0DE", "#DFC6A2", "#A5A0DE"])
    .unknown("white");

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
        .attr("x", d => x(d.data[0]))
        .attr("y", d => d.key.startsWith("X2") ? y(d[1]) - 5 : y(d[1]))
        .attr("height", d => y(d[0]) - y(d[1]))
        .attr("width", x.bandwidth())
        .on("mouseover", e => {
          flag = !flag;
          change(flag);
        })
      .append("title")
        .text(d => d[1] - d[0])

  innerChart.append("g")
    .attr("transform", `translate(0, ${innerHeight})`)
    .call(d3.axisBottom(x).tickSizeOuter(0))
    .call(g => g.selectAll(".domain").remove())
    .call(g => g.selectAll("text").attr("font-size", "12px"))

  innerChart.append("g")
    .attr("font-family", "sans-serif")
    .attr("font-size", 14)
  .selectAll()
  .data(series[series.length-1])
  .join("text")
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle")
    .attr("x", d => x(d.data[0]) + x.bandwidth()/2)
    .attr("y", d => y(d[1]) - 15)
    .attr("dy", "0.35em")
    .attr("fill", "#75485E")
    .attr("font-weight", 600)
    .text(d => `Σ ${d3.format(",.0f")(d[1])}` )

  series.forEach(serie => {
    innerChart.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 14)
      .selectAll()
      .data(serie)
      .join("text")
        .attr("class", d => d.key.substring(0,2))
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .attr("x", d => x(d.data[0]) + x.bandwidth()/2)
        .attr("y", d => d.key.startsWith("X2") ? y(d[1]) - (y(d[1]) - y(d[0]))/2 - 5 : y(d[1]) - (y(d[1]) - y(d[0]))/2)
        .attr("dy", "0.1em")
        .attr("fill", d => d.key.startsWith("X1") ? "#921A40" : "#102C57")
        .text(d => {
          if (d[1] - d[0] >= 3500) { return `${d3.format(",.0f")(d[1]-d[0])}` }
        })
  })

  const x1data = series.filter(s => s.key.startsWith("X1"))
  const x1rhdata = x1data[x1data.length-1]
  if (x1rhdata != undefined) {
    innerChart.append("g")
      .selectAll()
      .data(x1rhdata)
      .join("text")
        .text(d => `Σ ${d3.format(",.0f")(d[1])}`)
        .attr("class", "x1total")
        .attr("text-anchor", "middle")
        // .attr("alignment-baseline", "middle")
        .attr("dominant-baseline", "hanging")
        .attr("x", d => x(d.data[0]) + x.bandwidth()/2)
        .attr("y", d => y(d[0]))
        .attr("dy", "0.1em")
        .attr("fill", "#921A40")
        .attr("font-size", 14)
        .attr("opacity", 0)
    // let flag = true;
    // innerChart.call(g => g.selectAll(".X1").attr("opacity", 0))
    // innerChart.call(g => g.selectAll(".x1total").attr("opacity", 1))
    // setInterval(() => {
      if (flag) {
        innerChart.call(g => g.selectAll(".X1").attr("opacity", 1))
        innerChart.call(g => g.selectAll(".x1total").attr("opacity", 0))
      } else {
        innerChart.call(g => g.selectAll(".X1").attr("opacity", 0))
        innerChart.call(g => g.selectAll(".x1total").attr("opacity", 1))
      }
    //   flag = !flag
    // }, 10000);
  }

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
      .text("Xưởng 2")
      .attr("text-anchor", "start")
      .attr("alignment-baseline", "middle")
      .attr("x", 0)
      .attr("y", 55)
      .attr("dy", "0.35em")
      .attr("fill", "#102C57")
      .attr("font-weight", 600)
      .attr("font-size", 12) 

  svg.append("text")
      .text("Xưởng 1")
      .attr("text-anchor", "start")
      .attr("alignment-baseline", "middle")
      .attr("x", 0)
      .attr("y", 80)
      .attr("dy", "0.35em")
      .attr("fill", "#921A40")
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

const drawWoodFinishVTPChart = (data, plandata, inventorydata, target) => {
  if (data == undefined) return;
  const width = 900;
  const height = 350;
  const margin = {top: 20, right: 20, bottom: 20, left: 80};
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  
  let flag = true;

  data.sort((a, b) => a.type.localeCompare(b.type))

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
    // .domain([0, d3.max(series, d => d3.max(d, d => d[1]))])
    .domain([0,  d3.max([d3.max(series, d => d3.max(d, d => d[1])), target == undefined ? 0 : d3.max(target, d => d.value)])])
    .rangeRound([innerHeight, 0])
    .nice()

  const color = d3.scaleOrdinal()
    .domain(["X1-brand", "X1-rh", "X2-brand", "X2-rh", "brand", "rh"])
    .range(["#DFC6A2", "#A5A0DE", "#DFC6A2", "#A5A0DE", "#DFC6A2", "#A5A0DE"])
    .unknown("white");

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
        .attr("y", d => d.key.startsWith("X2") ? y(d[1]) - 5 : y(d[1]))
        .attr("height", d => y(d[0]) - y(d[1]))
        .attr("width", 2*x.bandwidth()/3)
        .on("mouseover", e => {
          flag = !flag;
          change(flag);
        })
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
        .attr("y", d => d.key.startsWith("X2") ? y(d[1]) - (y(d[1]) - y(d[0]))/2 - 5 : y(d[1]) - (y(d[1]) - y(d[0]))/2)
        .attr("dy", "0.1em")
        .attr("fill", d => d.key.startsWith("X1") ? "#921A40" : "#102C57")
        .text(d => {
          if (d[1] - d[0] >= 3500) { return `${d3.format(",.0f")(d[1]-d[0])}` }
        })
  })

  const x1data = series.filter(s => s.key.startsWith("X1"))
  const x1rhdata = x1data[x1data.length-1]
  if (x1rhdata != undefined) {
    innerChart.append("g")
      .selectAll()
      .data(x1rhdata)
      .join("text")
        .text(d => d[1] > 3500 ? `Σ${d3.format(",.0f")(d[1])}` : "")
        .attr("class", "x1total")
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "hanging")
        .attr("x", d => x(d.data[0]) + 2*x.bandwidth()/3)
        .attr("y", d => y(d[0]))
        .attr("dy", "0.1em")
        .attr("fill", "#921A40")
        .attr("font-size", 12)
        .attr("opacity", 0)

      if (flag) {
        innerChart.call(g => g.selectAll(".X1").attr("opacity", 1))
        innerChart.call(g => g.selectAll(".x1total").attr("opacity", 0))
      } else {
        innerChart.call(g => g.selectAll(".X1").attr("opacity", 0))
        innerChart.call(g => g.selectAll(".x1total").attr("opacity", 1))
      }
  }

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
      .attr("y", 20)
      .attr("dy", "0.35em")
      .attr("fill", "#DFC6A2")
      .attr("font-weight", 600)
      .attr("font-size", 12)
     
  svg.append("text")
      .text("Xưởng 2")
      .attr("text-anchor", "start")
      .attr("alignment-baseline", "middle")
      .attr("x", 0)
      .attr("y", 35)
      .attr("dy", "0.35em")
      .attr("fill", "#102C57")
      .attr("font-weight", 600)
      .attr("font-size", 12) 

  svg.append("text")
      .text("Xưởng 7")
      .attr("text-anchor", "start")
      .attr("alignment-baseline", "middle")
      .attr("x", 0)
      .attr("y", 50)
      .attr("dy", "0.35em")
      .attr("fill", "#921A40")
      .attr("font-weight", 600)
      .attr("font-size", 12)
      
  svg.append("text")
      .text("($)")
      .attr("text-anchor", "start")
      .attr("alignment-baseline", "middle")
      .attr("x", 0)
      .attr("y", 65)
      .attr("dy", "0.35em")
      .attr("fill", "#75485E")
      .attr("font-size", 12)

  svg.append("text")
      .text(`Total: `)
      .attr("text-anchor", "start")
      .attr("alignment-baseline", "start")
      .attr("x", 80)
      .attr("y", 8)
      .attr("dy", "0.35em")
      .attr("fill", "#75485E")
      .attr("font-size", 14)
    .append("tspan")
      .text(`$${d3.format(",.0f")(d3.sum(data, d => d.value))}`)
      .attr("text-anchor", "start")
      .attr("alignment-baseline", "start")
      .attr("fill", "#75485E")
      .attr("font-size", 16)
      .attr("font-weight", 600)

  svg.append("text")
      .text(" <-- Giá trị total actual dựa theo số ngày trên chart")
      .attr("class", "disappear")
      .attr("text-anchor", "start")
      .attr("alignment-baseline", "middle")
      .attr("x", 200)
      .attr("y", 8)
      .attr("fill", "#75485E")
      .attr("font-size", 12)
      .style("transition", "opacity 2s ease-out")
  setTimeout(() => d3.selectAll(".disappear").attr("opacity", 0), 5000)

  svg.append("text")
      .text("* Rà chuột vào cột để hiện value cho loại hàng")
      .attr("class", "disappear")
      .attr("text-anchor", "start")
      .attr("alignment-baseline", "middle")
      .attr("x", 80)
      .attr("y", 25)
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
        .attr("y", d =>  y(d[1]))
        .attr("height", d => y(d[0]) - y(d[1]))
        .attr("width", x.bandwidth()/3)
        .attr("stroke", "#FF9874")
        .on("mouseover", e => {
          flag = !flag;
          change(flag);
        })

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
          .attr("fill-opacity", 0.6)
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
      .domain([0, d3.sum(inventorydata, d => d.inventory)])
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
      .attr("fill", color(inventorydata[0].type));

    leftInnerChart.append("rect")
      .attr("x", 10)
      .attr("y", y2(inventorydata[1].inventory) + margin.bottom - (3*innerHeight/4 - y2(inventorydata[0].inventory)))
      .attr("width", 45)
      .attr("height", 3*innerHeight/4 - y2(inventorydata[1].inventory))
      .attr("fill", color(inventorydata[1].type));

    leftInnerChart.append("rect")
      .attr("x", 10)
      .attr("y", y2(inventorydata[2].inventory) + margin.bottom - (3*innerHeight/4 - y2(inventorydata[0].inventory + inventorydata[1].inventory)) - 5)
      .attr("width", 45)
      .attr("height", 3*innerHeight/4 - y2(inventorydata[2].inventory))
      .attr("fill", color(inventorydata[2].type));

    leftInnerChart.append("rect")
      .attr("x", 10)
      .attr("y", y2(inventorydata[3].inventory) + margin.bottom - (3*innerHeight/4 - y2(inventorydata[0].inventory + inventorydata[1].inventory + inventorydata[2].inventory)) - 5)
      .attr("width", 45)
      .attr("height", 3*innerHeight/4 - y2(inventorydata[3].inventory))
      .attr("fill", color(inventorydata[3].type));

    leftInnerChart.append("text")
      .text((inventorydata[0].inventory != 0) ? `${d3.format(",.0f")(inventorydata[0].inventory)}` : "")
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .attr("x", 32)
      .attr("y", y2(inventorydata[0].inventory/2) + margin.bottom)
      .attr("fill", "#921A40")
      .attr("font-size", 12)

    leftInnerChart.append("text")
      .text((inventorydata[1].inventory != 0) ? `${d3.format(",.0f")(inventorydata[1].inventory)}` : "")
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .attr("x", 32)
      .attr("y", y2(inventorydata[1].inventory/2) + margin.bottom - (3*innerHeight/4 - y2(inventorydata[0].inventory)))
      .attr("fill", "#921A40")
      .attr("font-size", 12)

    leftInnerChart.append("text")
      .text((inventorydata[2].inventory != 0) ? `${d3.format(",.0f")(inventorydata[2].inventory)}` : "")
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .attr("x", 32)
      .attr("y", y2(inventorydata[2].inventory/2) + margin.bottom - (3*innerHeight/4 - y2(inventorydata[0].inventory + inventorydata[1].inventory)) - 5)
      .attr("fill", "#102C57")
      .attr("font-size", 12)

    leftInnerChart.append("text")
      .text((inventorydata[3].inventory != 0) ? `${d3.format(",.0f")(inventorydata[3].inventory)}` : "")
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .attr("x", 32)
      .attr("y", y2(inventorydata[3].inventory/2) + margin.bottom - (3*innerHeight/4 - y2(inventorydata[0].inventory + inventorydata[1].inventory + inventorydata[2].inventory)) - 5)
      .attr("fill", "#102C57")
      .attr("font-size", 12)

    leftInnerChart.append("text")
      .text(`${d3.format(",.0f")(d3.sum(inventorydata, d => d.inventory))}`)
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .attr("x", 32)
      .attr("y", y2(inventorydata[3].inventory) + margin.bottom - (3*innerHeight/4 - y2(inventorydata[0].inventory + inventorydata[1].inventory + inventorydata[2].inventory)) - 5)
      .attr("dy", "-0.35em")
      .attr("fill", "#75485E")
      .attr("font-size", 12)

    leftInnerChart.append("text")
      .text(inventorydata[0].createdat)
      .attr("text-anchor", "start")
      .attr("alignment-baseline", "middle")
      .attr("x", 60)
      .attr("y", y2(inventorydata[3].inventory) + margin.bottom - (3*innerHeight/4 - y2(inventorydata[0].inventory + inventorydata[1].inventory + inventorydata[2].inventory)) - 5)
      .attr("fill", "#FA7070")
      .attr("font-size", 12)
      .attr("transform", `rotate(90, 60, ${y2(inventorydata[3].inventory) + margin.bottom - (3*innerHeight/4 - y2(inventorydata[0].inventory + inventorydata[1].inventory + inventorydata[2].inventory)) - 5})`)
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

// efficiency
const drawWfEfficiencyChart = (data, manhr) => {
  if (data == undefined) return;
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
    .domain([0, d3.max(data, d => d.value)])
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
        .attr("y", d => y(d.value))
        .attr("height", d => y(0) - y(d.value))
        .attr("width", x.bandwidth()/2)
        .attr("fill", "#DFC6A2")
      .append("title")
        .text(d => d.value)

  innerChart.append("g")
    .attr("transform", `translate(0, ${innerHeight})`)
    .call(d3.axisBottom(x).tickSizeOuter(0))
    .call(g => g.selectAll(".domain").remove())
    .call(g => g.selectAll("text").attr("font-size", "12px"))

  innerChart.append("g")
    .selectAll()
    .data(data)
    .join("text")
      .text(d => d.value > 15000 ? d3.format(",.0f")(d.value) : "")
      .attr("text-anchor", "end")
      .attr("alignment-baseline", "middle")
      .attr("x", d => x(d.date) + x.bandwidth()/4)
      .attr("y", d => y(d.value))
      .attr("dy", "0.35em")
      .attr("fill", "#75485E")
      .attr("font-size", "12px")
      .attr("font-weight", 600)
      .attr("transform", d => `rotate(-90, ${x(d.date) + x.bandwidth()/4}, ${y(d.value)})`)
      
svg.append("text")
    .text("Sản lượng($)")
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
    w.efficiency = data.find(d => d.date == w.date).value / w.workhr / 81.4 * 100
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
      .text(d => `${d3.format(".2s")(d.efficiency)}%`)
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
        .text("Demand: 81.4 $/h")
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