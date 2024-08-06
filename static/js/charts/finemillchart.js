const drawFinemillhChart = (data) => {
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

const drawFinemillChart1 = (data) => {
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

// const drawFinemillChart2 = (data, target) => {
  // if (data == undefined) return;
//   const width = 900;
//   const height = 350;
//   const margin = {top: 20, right: 20, bottom: 20, left: 50};
//   const innerWidth = width - margin.left - margin.right;
//   const innerHeight = height - margin.top - margin.bottom;
  
//   const series = d3.stack()
//     .keys(d3.union(data.map(d => d.type)))
//     .value(([, D], key) => D.get(key) === undefined ? 0 : D.get(key).value)
//     (d3.index(data, d => d.date, d => d.type))

//   const x = d3.scaleBand()
//     .domain(data.map(d => d.date))
//     .range([0, innerWidth])
//     .padding(0.1);

//   const y = d3.scaleLinear()
//     // .domain([0, d3.max(series, d => d3.max(d, d => d[1]))])
//     .domain([0,  d3.max([d3.max(series, d => d3.max(d, d => d[1])), d3.max(target, d => d.value)])])
//     .rangeRound([innerHeight, 0])
//     .nice()

//   const color = d3.scaleOrdinal()
//     .domain(series.map(d => d.key))
//     .range(d3.schemePastel1)
//     .unknown("white");

//   const svg = d3.create("svg")
//     .attr("viewBox", [0, 0, width, height])

//   const innerChart = svg.append("g")
//     .attr("transform", `translate(${margin.left}, ${margin.top})`)

//   innerChart
//     .selectAll()
//     .data(series)
//     .join("g")
//       .attr("fill", d => color(d.key))
//       .attr("fill-opacity", 0.9)
//     .selectAll("rect")
//     .data(D => D.map(d => (d.key = D.key, d)))
//     .join("rect")
//       .attr("x", d => x(d.data[0]))
//       .attr("y", d => d.key.startsWith("X2") ? y(d[1]) - 5 : y(d[1]))
//       .attr("height", d => y(d[0]) - y(d[1]))
//       .attr("width", x.bandwidth())

//   innerChart.append("g")
//     .attr("transform", `translate(0, ${innerHeight})`)
//     .call(d3.axisBottom(x).tickSizeOuter(0))
//     .call(g => g.selectAll(".domain").remove())
//     .call(g => g.selectAll("text").attr("font-size", "14px"))

//   innerChart.append("g")
//     .attr("font-family", "sans-serif")
//     .attr("font-size", 15)
//   .selectAll()
//   .data(series[series.length-1])
//   .join("text")
//     .attr("text-anchor", "middle")
//     .attr("alignment-baseline", "middle")
//     .attr("x", d => x(d.data[0]) + x.bandwidth()/2)
//     .attr("y", d => y(d[1]) - 10)
//     .attr("dy", "0.35em")
//     .attr("fill", "#75485E")
//     .attr("font-weight", 600)
//     .text(d => `Σ ${d3.format("~s")(d[1])}` )

//   series.forEach(serie => {
//     innerChart.append("g")
//         .attr("font-family", "sans-serif")
//         .attr("font-size", 14)
//       .selectAll()
//       .data(serie)
//       .join("text")
//         .attr("text-anchor", "middle")
//         .attr("alignment-baseline", "middle")
//         .attr("x", d => x(d.data[0]) + x.bandwidth()/2)
//         .attr("y", d => d.key.startsWith("X2") ? y(d[1]) - (y(d[1]) - y(d[0]))/2 - 5 : y(d[1]) - (y(d[1]) - y(d[0]))/2)
//         .attr("dy", "0.1em")
//         .attr("fill", "#75485E")
//         .text(d => {
//           if (d[1] - d[0] >= 60) { return `${d3.format("~s")(d[1]-d[0])}` }
//         })
//   })
  
// //draw target lines
// const dates = data.map(d => d.date)
// target = target.filter(t => dates.includes(t.date))
// innerChart
// .selectAll()
// .data(target)
// .join("line")
//   .attr("x1", d => x(d.date))
//   .attr("y1", d => y(d.value))
//   .attr("x2", d => x(d.date) + x.bandwidth())
//   .attr("y2", d => y(d.value))
//   .attr("stroke", "#FA7070")
//   .attr("fill", "none")
//   .attr("stroke-opacity", 0.5)

// innerChart.append("g")
//   .attr("stroke-linecap", "round")
//   .attr("stroke-linejoin", "round")
//   .attr("text-anchor", "middle")
// .selectAll()
// .data(target)
// .join("text")
//   .text((d, i) => {
//     if (i == target.length-1) return d3.format("~s")(d.value);
//      else {
//        if (d.value != target[i+1].value && Math.abs(data.filter(t => t.date == d.date).reduce((total, n) => total + n.value, 0) - d.value) > 1000) return d3.format("~s")(d.value);
//      }
//   })
//   .attr("font-size", "12px")
//   .attr("dy", "0.35em")
//   .attr("x", d => x(d.date) + x.bandwidth()/2)
//   .attr("y", d => y(d.value))
//   .attr("stroke", "#75485E")
//   .attr("font-weight", 300)
//   .clone(true).lower()
//   .attr("fill", "none")
//   .attr("stroke", "white")
//   .attr("stroke-width", 6)
//    // end target line

//   svg.append("text")
//       .text("Đồng bộ")
//       .attr("text-anchor", "start")
//       .attr("alignment-baseline", "middle")
//       .attr("x", 0)
//       .attr("y", 5)
//       .attr("dy", "0.35em")
//       .attr("fill", color("whole"))
//       .attr("font-weight", 600)
//       .attr("font-size", 16)

//   svg.append("text")
//       .text("WIP")
//       .attr("text-anchor", "start")
//       .attr("alignment-baseline", "middle")
//       .attr("x", 0)
//       .attr("y", 30)
//       .attr("dy", "0.35em")
//       .attr("fill", color("wip"))
//       .attr("font-weight", 600)
//       .attr("font-size", 16)

//   svg.append("text")
//       .text("Chờ giao")
//       .attr("text-anchor", "start")
//       .attr("alignment-baseline", "middle")
//       .attr("x", 0)
//       .attr("y", 55)
//       .attr("dy", "0.35em")
//       .attr("fill", color("waiting"))
//       .attr("font-weight", 600)
//       .attr("font-size", 16)

//   svg.append("text")
//       .text("Trên truyền")
//       .attr("text-anchor", "start")
//       .attr("alignment-baseline", "middle")
//       .attr("x", 0)
//       .attr("y", 80)
//       .attr("dy", "0.35em")
//       .attr("fill", color("onconvey"))
//       .attr("font-weight", 600)
//       .attr("font-size", 16)

//   svg.append("text")
//       .text("($)")
//       .attr("text-anchor", "start")
//       .attr("alignment-baseline", "middle")
//       .attr("x", 0)
//       .attr("y", 105)
//       .attr("dy", "0.35em")
//       .attr("fill", "#75485E")
//       .attr("font-size", 16)

//   return svg.node();
// }

const drawFinemillVTChart = (data, target) => {
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
    // .domain([0, d3.max(series, d => d3.max(d, d => d[1]))])
    .domain([0,  d3.max([d3.max(series, d => d3.max(d, d => d[1])), target == undefined ? 0 : d3.max(target, d => d.value)])])
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
      .attr("fill", "#EB455F")
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
}

// efficiency
const drawFinemillEfficiencyChart = (data, manhr) => {
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

  innerChart.append("g")
    .attr("transform", `translate(0, ${innerHeight})`)
    .call(d3.axisBottom(x).tickSizeOuter(0))
    .call(g => g.selectAll(".domain").remove())
    .call(g => g.selectAll("text").attr("font-size", "12px"))

  innerChart.append("g")
    .selectAll()
    .data(data)
    .join("text")
      .text(d => d3.format(",.0f")(d.value))
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
        .text(d => `👷 ${d.hc} = ${d.workhr}h`)
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
    w.efficiency = data.find(d => d.date == w.date).value / w.workhr / 57.5 * 100
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

  if (workinghrs.length == 0) {
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
  }
  
  svg.append("text")
        .text("Demand: 57.5 $/h")
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