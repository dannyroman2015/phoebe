const drawCuttingChart = (data) => {
  const width = 900;
  const height = 350;
  const margin = {top: 20, right: 20, bottom: 30, left: 40};
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const targets = [
    {"date": "04 Jul", "target": 28},
    {"date": "06 Jul", "target": 20},
  ]

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
      .call(g => g.selectAll(".domain").remove())
      .call(g => g.selectAll("text").attr("font-size", "12px"))
  
  const leftAxis = d3.axisLeft(yScale)

  // innerChart
  //   .append("g")
  //     .call(leftAxis)
  //     .call(g => g.select(".domain").remove())
  //     .call(g => g.selectAll(".tick line").clone()
  //       .attr("x2", width - margin.left - margin.right)
  //       .attr("stroke-opacity", 0.15))
  //     .call(g => g.selectAll(".tick text")
  //       .attr("font-size", "12px"))

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
      .attr("font-size", 14)
    .selectAll()
    .data(data)
    .join("text")
      .text(d => d3.format(".2")(d.qty))
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .attr("x", d => margin.left + xScale(d.date) + xScale.bandwidth()/2)
      .attr("y", d => yScale(d.qty) + 15)
      .attr("fill", "black")

  svg.append("text")
    .text("(m³)")
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle")
    .attr("x", 30)
    .attr("y", 5)
    .attr("dy", "0.35em")
    .attr("fill", "#75485E")
    .attr("font-size", "20px")

  // innerChart
  //   .selectAll()
  //   .data(targets)
  //   .join("line")
  //     .attr("x1", d => xScale(d.date))
  //     .attr("y1", d => yScale(d.target))
  //     .attr("x2", d => xScale(d.date) + xScale.bandwidth())
  //     .attr("y2", d => yScale(d.target))
  //     .attr("stroke", "black")
  //     .attr("fill", "none")

    // target line
    //   innerChart.append("g")
    //   .attr("stroke-linecap", "round")
    //   .attr("stroke-linejoin", "round")
    //   .attr("text-anchor", "middle")
    // .selectAll()
    // .data(targets)
    // .join("text")
    //   .text(d => d.target)
    //   .attr("dy", "0.35em")
    //   .attr("x", d => xScale(d.date) +xScale.bandwidth()/2)
    //   .attr("y", d => yScale(d.target))
    //   // .call(text => text.filter((d, i, data) => i === data.length - 1)
    //   //   .append("tspan")
    //   //     .attr("font-weight", "bold")
    //   //     .text(d => `asdf`))
    // .clone(true).lower()
    //   .attr("fill", "none")
    //   .attr("stroke", "white")
    //   .attr("stroke-width", 6);

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
      .call(g => g.selectAll(".domain").remove())
      .call(g => g.selectAll("text").attr("font-size", "14px").attr("font-weight", 600).style("text-transform", "capitalize"))
  
  const leftAxis = d3.axisLeft(yScale)

  // innerChart
  //   .append("g")
  //     .call(leftAxis)
  //     .call(g => g.select(".domain").remove())
  //     .call(g => g.selectAll(".tick line").clone()
  //       .attr("x2", width - margin.left - margin.right)
  //       .attr("stroke-opacity", 0.15))
  //     .call(g => g.selectAll(".tick text")
  //       .attr("font-size", "12px"))

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
      .attr("font-weight", 600)
    .selectAll()
    .data(data)
    .join("text")
      .text(d => d3.format(".3s")(d.qty))
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .attr("x", d => margin.left + xScale(d.woodtype) + xScale.bandwidth()/2)
      .attr("y", d => yScale(d.qty) + 15)
      .attr("fill", "#75485E")

  svg.append("text")
    .text("(m³)")
    .attr("font-size", "16px")
    .attr("dominant-baseline", "hanging")
    .attr("fill", "#75485E")

  return svg.node();
}

const drawCuttingChart2 = (data, target) => {
  if (target == undefined) {
    target = [{"date": "", "value": 0}]
  }
  const width = 900;
  const height = 350;
  const margin = {top: 20, right: 20, bottom: 20, left: 40};
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const series = d3.stack()
    .keys(d3.union(data.map(d => d.is25)))
    .value(([, D], key) => D.get(key) === undefined ? 0 : D.get(key).qty)
    (d3.index(data, d => d.date, d => d.is25))

  const x = d3.scaleBand()
    .domain(data.map(d => d.date))
    .range([0, innerWidth])
    .padding(0.1);

  const y = d3.scaleLinear()
    .domain([0,  d3.max([d3.max(series, d => d3.max(d, d => d[1])), d3.max(target, d => d.value)])])
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
      .attr("fill-opacity", 1)
    .selectAll("rect")
    .data(D => D.map(d => (d.key = D.key, d)))
    .join("rect")
      .attr("x", d => x(d.data[0]))
      .attr("y", d => y(d[1]))
      .attr("height", d => y(d[0]) - y(d[1]))
      .attr("width", x.bandwidth())

  innerChart.append("g")
    .attr("transform", `translate(0, ${innerHeight})`)
    .call(d3.axisBottom(x).tickSizeOuter(0))
    .call(g => g.selectAll(".domain").remove())
    .call(g => g.selectAll("text").attr("font-size", "12px"))

  innerChart.append("g")
    .attr("font-family", "sans-serif")
    .attr("font-size", 12)
  .selectAll()
  .data(series[series.length-1])
  .join("text")
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle")
    .attr("x", d => x(d.data[0]) + x.bandwidth()/2)
    .attr("y", d => y(d[1]) - 10)
    .attr("dy", "0.35em")
    .attr("fill", "#75485E")
    .attr("font-size", "15px")
    .attr("font-weight", 600)
    .text(d => `Σ ${d3.format(".3s")(d[1])}`)

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
        .attr("y", d => y(d[1]) - (y(d[1]) - y(d[0]))/2 )
        .attr("dy", "0.35em")
        .attr("fill", "#75485E")
        .attr("font-size", "14px")
        .text(d => {
          if (d[1] - d[0] != 0) { return d3.format(".2s")(d[1]-d[0])}
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
   .text((d,i) => {
      if (i == target.length-1) return d.value;
      else {
        if (d.value != target[i+1].value && Math.abs(data.filter(t => t.date == d.date).reduce((total, n) => total + n.qty, 0) - d.value) > 2) return d.value;
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

svg.append("text")
    .text("Gỗ 25")
    .attr("text-anchor", "start")
    .attr("alignment-baseline", "middle")
    .attr("x", 0)
    .attr("y", 5)
    .attr("dy", "0.35em")
    .attr("fill", "#A5A0DE")
    .attr("font-weight", 600)
    .attr("font-size", 16)

svg.append("text")
    .text("Còn lại")
    .attr("text-anchor", "start")
    .attr("alignment-baseline", "middle")
    .attr("x", 0)
    .attr("y", 30)
    .attr("dy", "0.35em")
    .attr("fill", "#DFC6A2")
    .attr("font-weight", 600)
    .attr("font-size", 16)

svg.append("text")
    .text("Target")
    .attr("text-anchor", "start")
    .attr("alignment-baseline", "middle")
    .attr("x", 0)
    .attr("y", 55)
    .attr("dy", "0.35em")
    .attr("fill", "#FA7070")
    .attr("font-weight", 600)
    .attr("font-size", 16)

svg.append("text")
    .text("(m³)")
    .attr("text-anchor", "start")
    .attr("alignment-baseline", "middle")
    .attr("x", 0)
    .attr("y", 80)
    .attr("dy", "0.35em")
    .attr("fill", "#75485E")
    .attr("font-size", 16)
 
  return svg.node();
}