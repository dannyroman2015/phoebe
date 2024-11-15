const drawCuttingChart = (data) => {
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
  const margin = {top: 20, right: 20, bottom: 30, left: 20};
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

const drawCuttingChart2 = (data, returndata, finedata, target_actual, prodtypedata, target) => {
  if (returndata != undefined) {
    data = data.map(d => {
      d.return = 0;
      returndata.forEach(rd => {
        if (rd.date == d.date && rd.is25 == d.is25) {
          d.qty = d.qty - rd.qty;
          d.return = rd.qty;
        }
      });
      return d;
    })
  }

  if (target == undefined) {
    target = [{"date": "", "value": 0}]
  }
  const width = 900;
  const height = 350;
  const margin = {top: 30, right: 20, bottom: 20, left: 150};
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const series = d3.stack()
    .keys(d3.union(data.map(d => d.is25)))
    .value(([, D], key) => D.get(key) === undefined ? 0 : D.get(key).qty)
    (d3.index(data, d => d.date, d => d.is25))
 
  const x = d3.scaleBand()
    .domain(d3.union(data.map(d => d.date), target.map(d => d.date)))
    .range([0, innerWidth])
    .padding(0.1);

  const maxReturn = (returndata != undefined) ? d3.max(d3.rollup(returndata, D => d3.sum(D, d => d.qty) ,d => d.date), d => d[1]) + 2 : 0;

  const y = d3.scaleLinear()
    .domain([-maxReturn,  d3.max([d3.max(series, d => d3.max(d, d => d[1])), d3.max(target, d => d.value)])])
    .rangeRound([innerHeight, 0])
    .nice()

  const color = d3.scaleOrdinal()
    .domain(series.map(d => d.key))
    // .range(["#DFC6A2", "#A5A0DE", "#A0D9DE"])
    .range(["#E4E0E1", "#FFBB70", "#A0D9DE"])
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
      .attr("width", x.bandwidth()/2)

  if (finedata != undefined) {
    const fineseries = d3.stack()
      .keys(d3.union(finedata.map(d => d.is25reeded)))
      .value(([, D], key) => D.get(key) === undefined ? 0 : D.get(key).qty)
      (d3.index(finedata, d => d.date, d => d.is25reeded))

    const color1 = d3.scaleOrdinal()
      .domain(fineseries.map(d => d.key))
      .range(["#E4E0E1", "#FFBB70", "#A0D9DE"])
      .unknown("#ccc");

    innerChart
      .selectAll()
      .data(fineseries)
      .join("g")
        .attr("fill", d => color1(d.key))
        .attr("fill-opacity", 1)
        .attr("stroke", "#00CCDD")
      .selectAll("rect")
      .data(D => D.map(d => (d.key = D.key, d)))
      .join("rect")
        .attr("x", d => x(d.data[0])+ x.bandwidth()/2)
        .attr("y", d => y(d[1]))
        .attr("height", d => y(d[0]) - y(d[1]))
        .attr("width", x.bandwidth()/2)

        innerChart.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 12)
      .selectAll()
      .data(fineseries[fineseries.length-1])
      .join("text")
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .attr("x", d => x(d.data[0]) + 3*x.bandwidth()/4)
        .attr("y", d => y(d[1]) - 10)
        .attr("dy", "0.35em")
        .attr("fill", "#75485E")
        .attr("font-size", "12px")
        .attr("font-weight", 600)
        .text(d => `${d3.format(".1f")(d[1])}`)
    
      fineseries.forEach(serie => {
        innerChart.append("g")
            .attr("font-family", "sans-serif")
            .attr("font-size", 12)
          .selectAll()
          .data(serie)
          .join("text")
            .attr("text-anchor", "middle")
            .attr("alignment-baseline", "middle")
            .attr("x", d => x(d.data[0]) + 3*x.bandwidth()/4)
            .attr("y", d => y(d[1]) - (y(d[1]) - y(d[0]))/2 )
            .attr("fill", "#75485E")
            .attr("font-size", "12px")
            .text(d => {
              if (d[1] - d[0] >= 1.5) { return d3.format(".1f")(d[1]-d[0])}
            })
      })
    // innerChart
    //   .selectAll()
    //   .data(finedata)
    //   .join("rect")
    //     .attr("x", d => x(d.date) + x.bandwidth()/2)
    //     .attr("y", d => y(d.qty))
    //     .attr("height", d => y(0) - y(d.qty))
    //     .attr("width", x.bandwidth()/2)
    //     .attr("fill", "#AFD198")
    //   .append("title")
    //     .text(d => d.qty)

    // innerChart.append("g")
    //   .selectAll()
    //   .data(finedata)
    //   .join("text")
    //     .attr("text-anchor", "middle")
    //     .attr("alignment-baseline", "middle")
    //     .attr("x", d => x(d.date) + 3*x.bandwidth()/4)
    //     .attr("y", d => y(d.qty))
    //     .attr("dy", "-0.35em")
    //     .attr("fill", "#75485E")
    //     .attr("font-size", "12px")
    //     .attr("font-weight", 600)
    //     .text(d => `${d3.format(".1f")(d.qty)}`)
  }

  if (returndata != undefined) {
    const returnseries = d3.stack()
      .keys(d3.union(returndata.map(d => d.is25)))
      .value(([, D], key) => D.get(key) === undefined ? 0 : D.get(key).qty)
      (d3.index(returndata, d => d.date, d => d.is25))
    
    const y1 = d3.scaleLinear()
      .domain([0, maxReturn])
      .rangeRound([y(0), innerHeight])
      .nice() 
      
    innerChart
      .selectAll()
      .data(returnseries)
      .join("g")
        .attr("fill", d => color(d.key))
        .attr("fill-opacity", 1)
      .selectAll("rect")
      .data(D => D.map(d => (d.key = D.key, d)))
      .join("rect")
        .attr("x", d => x(d.data[0]))
        .attr("y", d => y1(d[0]))
        .attr("height", d => y1(d[1]-d[0]) - y(0))
        .attr("width", x.bandwidth()/2)
      .append("title")
        .text(d => d[1] - d[0])

    

    // innerChart.append("g")
    //   .selectAll()
    //   .data(returnseries[returnseries.length-1])
    //   .join("text")
    //     .attr("text-anchor", "middle")
    //     .attr("alignment-baseline", "middle")
    //     .attr("x", d => x(d.data[0]) + x.bandwidth()/4)
    //     .attr("y", d => y1(d[0] + (d[1]-d[0])) + 6)
    //     .attr("dy", "0.35em")
    //     .attr("fill", "#75485E")
    //     .attr("font-size", "12px")
    //     .attr("font-weight", 600)
    //     .text(d => `${d3.format(".1f")(d[1])}`)

    returnseries.forEach(serie => {
      innerChart.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 12)
      .selectAll()
      .data(serie)
      .join("text")
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .attr("x", d => x(d.data[0]) + x.bandwidth()/4)
        .attr("y", d => y1(d[0] + (d[1]-d[0])/2))
        .attr("fill", "#75485E")
        .attr("dy", "0.15em")
        .attr("font-size", "12px")
        .text(d => {
          if (d[1] - d[0] >= 1) { return d3.format(".1f")(d[1]-d[0])}
        })
    })

    innerChart.append("line")
      .attr("x1", 0)
      .attr("y1", y(0))
      .attr("x2", innerWidth)
      .attr("y2", y(0))
      .attr("stroke", "black")
    innerChart.append("line")
      .attr("x1", innerWidth)
      .attr("y1", y(0))
      .attr("x2", innerWidth)
      .attr("y2", innerHeight)
      .attr("stroke", "black")
    svg.append("text")
      .text("Nhập lại kho")
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .attr("x", width-10)
      .attr("y", innerHeight - 5)
      .attr("dy", "0.35em")
      .attr("fill", "#75485E")
      .attr("font-size", "12px")
      .attr("font-weight", 600)
      .attr("transform", `rotate(90, ${width-10}, ${innerHeight - 5})`)
  }
  
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
    .attr("x", d => x(d.data[0]) + x.bandwidth()/4)
    .attr("y", d => y(d[1]) - 10)
    .attr("dy", "0.35em")
    .attr("fill", "#75485E")
    .attr("font-size", "12px")
    .attr("font-weight", 600)
    .text(d => `${d3.format(".1f")(d[1])}`)

  series.forEach(serie => {
    innerChart.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 12)
      .selectAll()
      .data(serie)
      .join("text")
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .attr("x", d => x(d.data[0]) + x.bandwidth()/4)
        .attr("y", d => y(d[1]) - (y(d[1]) - y(d[0]))/2 )
        .attr("dy", "0.35em")
        .attr("fill", "#75485E")
        .attr("font-size", "12px")
        .text(d => {
          if (d[1] - d[0] >= 1.5) { return d3.format(".1f")(d[1]-d[0])}
        })
  })

 //draw target lines
//  const dates = data.map(d => d.date)
//  target = target.filter(t => dates.includes(t.date))
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
  .text("Sản lượng (m³): ")
  .attr("text-anchor", "start")
  .attr("alignment-baseline", "start")
  .attr("x", 140)
  // .attr("x", 10)
  .attr("y", height)
  .attr("dy", "0.35em")
  .attr("fill", "#75485E")
  .attr("font-weight", 300)
  .attr("font-size", 12)
  .attr("transform", `rotate(-90, 140, ${height})`)
    .append("tspan")
      .text("Gỗ 25mm Reeded")
      .attr("fill", color(true))
      .attr("font-weight", 600)
    .append("tspan")
      .text(", Gỗ Còn Lại")
      .attr("fill", color(false))
      .attr("font-weight", 600)
    .append("tspan")
      .text(", Gỗ tinh")
      .attr("fill", "#00CCDD")
      .attr("font-weight", 600)
    .append("tspan")
      .text(", ")
      .attr("font-weight", 300)
      .attr("fill", "#75485E")
    .append("tspan")
      .text("Target")
      .attr("fill", "#FA7070")
      .attr("font-weight", 600)

// bieu dồ nhỏ trái 
const y1 = d3.scaleLinear()
  .domain([0,  d3.max(target_actual.detail.map(d => d.target))])
  .rangeRound([innerHeight, 0])
  .nice()

svg.append("text")
  .text(`${target_actual.name}`)
  .attr("text-anchor", "middle")
  .attr("alignment-baseline", "middle")
  .attr("x", 65)
  .attr("y", 5)
  .attr("dy", "0.35em")
  .attr("fill", "#75485E")
  .attr("font-weight", 300)
  .attr("font-size", 14)

svg.append("text")
  .text(`Tổng (m³) Gỗ Tinh từ ${target_actual.startdate} --> ${target_actual.enddate}`)
  .attr("text-anchor", "start")
  .attr("alignment-baseline", "start")
  .attr("x", 7)
  .attr("y", height)
  .attr("dy", "0.35em")
  .attr("fill", "#75485E")
  .attr("font-weight", 600)
  .attr("font-size", 14)
  .attr("transform", `rotate(-90, 7, ${height})`)

svg.append("line")
  .attr("x1", 120)
  .attr("y1", height)
  .attr("x2", 120)
  .attr("y2", 0)
  .attr("stroke", "black")
  .attr("stroke-opacity", 0.2)

svg.append("rect")
  .attr("x", 20)
  .attr("y", y1(target_actual.detail[0].target) + margin.top)
  .attr("width", 40)
  .attr("height", innerHeight - y1(target_actual.detail[0].target))
  .attr("stroke", "black")
  .attr("stroke-width", "1px")
  .attr("fill", "transparent")

svg.append("text")
  .text(`${target_actual.detail[1].type}`)
  .attr("text-anchor", "middle")
  .attr("alignment-baseline", "middle")
  .attr("x", 40)
  .attr("y", height - 10)
  .attr("fill", "#102C57")
  .attr("font-size", 10)

svg.append("text")
  .text(`${target_actual.detail[0].target}`)
  .attr("text-anchor", "middle")
  .attr("alignment-baseline", "middle")
  .attr("x", 40)
  .attr("y", y1(target_actual.detail[0].target) + margin.top - 5)
  .attr("fill", "#102C57")
  .attr("font-size", 12)

svg.append("rect")
  .attr("x", 70)
  .attr("y", y1(target_actual.detail[1].target) + margin.top)
  .attr("width", 40)
  .attr("height", innerHeight - y1(target_actual.detail[1].target))
  .attr("stroke", "black")
  .attr("stroke-width", "1px")
  .attr("fill", "transparent")

svg.append("text")
  .text(`${target_actual.detail[0].type}`)
  .attr("text-anchor", "middle")
  .attr("alignment-baseline", "middle")
  .attr("x", 90)
  .attr("y", height - 10)
  .attr("fill", "#102C57")
  .attr("font-size", 10)

svg.append("text")
  .text(`${target_actual.detail[1].target}`)
  .attr("text-anchor", "middle")
  .attr("alignment-baseline", "middle")
  .attr("x", 90)
  .attr("y", y1(target_actual.detail[1].target) + margin.top - 5)
  .attr("fill", "#102C57")
  .attr("font-size", 12)

if (prodtypedata == undefined) {
  prodtypedata = [
    {"type": false, qty: 0}, {"type": true, qty: 0}
  ]
}
      // Gỗ còn lại actual bar
svg.append("rect")
  .attr("x", 20 + 2.5)
  .attr("y", y1(prodtypedata[0].qty) + margin.top)
  .attr("width", 40 - 5)
  .attr("height", innerHeight - y1(prodtypedata[0].qty))
  .attr("fill", "#E4E0E1")
      // reeded 25 actual bar
svg.append("rect")
  .attr("x", 70 + 2.5)
  .attr("y", y1(prodtypedata[1].qty) + margin.top)
  .attr("width", 40 - 5)
  .attr("height", innerHeight - y1(prodtypedata[1].qty))
  .attr("fill", "#FFBB70")
      // Gỗ còn lại actual label
svg.append("text")
  .text(prodtypedata[0].qty > 0 ? `${d3.format(".0f")(prodtypedata[0].qty)}` : "")
  .attr("text-anchor", "middle")
  .attr("alignment-baseline", "middle")
  .attr("x", 40)
  .attr("y", y1(prodtypedata[0].qty) + margin.top - 5)
  .attr("fill", "#102C57")
  .attr("font-size", 12)
      // reeded 25 actual label
svg.append("text")
  .text(prodtypedata[1].qty > 0 ? `${d3.format(".0f")(prodtypedata[1].qty)}` : "")
  .attr("text-anchor", "middle")
  .attr("alignment-baseline", "middle")
  .attr("x", 90)
  .attr("y", y1(prodtypedata[1].qty) + margin.top - 5)
  .attr("fill", "#102C57")
  .attr("font-size", 12)
      // Gỗ còn lại % label
svg.append("text")
  .text(prodtypedata[0].qty > 0 ? `${d3.format(".0f")(prodtypedata[0].qty / target_actual.detail[0].target * 100)}%` : "")
  .attr("text-anchor", "middle")
  .attr("alignment-baseline", "middle")
  .attr("x", 40)
  .attr("y", y1(prodtypedata[0].qty/2) + margin.top)
  .attr("fill", "#102C57")
  .attr("font-size", 12)
      // reeded 25 % label
svg.append("text")
  .text(prodtypedata[1].qty > 0 ? `${d3.format(".0f")(prodtypedata[1].qty / target_actual.detail[1].target * 100)}%` : "")
  .attr("text-anchor", "middle")
  .attr("alignment-baseline", "middle")
  .attr("x", 90)
  .attr("y", y1(prodtypedata[1].qty/2) + margin.top)
  .attr("fill", "#102C57")
  .attr("font-size", 12)

  return svg.node();
}

// efficiency
const drawCuttingChart3 = (data, manhr) => {
  const width = 900;
  const height = 350;
  const margin = {top: 10, right: 10, bottom: 20, left: 30};
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const dates = new Set(data.map(d => d.date)) 

  const series = d3.stack()
    .keys(d3.union(data.map(d => d.prodtype)))
    .value(([, D], key) => D.get(key) === undefined ? 0 : D.get(key).qty)
    (d3.index(data, d => d.date, d => d.prodtype))

  const x = d3.scaleBand()
    .domain(data.map(d => d.date))
    .range([0, innerWidth])
    .padding(0.1);

  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.qty)])
    .rangeRound([innerHeight, innerHeight/2])
    .nice()

  const color = d3.scaleOrdinal()
    .domain(series.map(d => d.key))
    .range(["#A5A0DE", "#DFC6A2", "#A0D9DE"])
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
      .attr("width", x.bandwidth()/2)

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
    .attr("x", d => x(d.data[0]) + x.bandwidth()/4)
    .attr("y", d => y(d[1]) - 10)
    .attr("dy", "0.35em")
    .attr("fill", "#75485E")
    .attr("font-size", "12px")
    .attr("font-weight", 600)
    .text(d => `Σ${d3.format(".1f")(d[1])}`)

  series.forEach(serie => {
    innerChart.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 12)
      .selectAll()
      .data(serie)
      .join("text")
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .attr("x", d => x(d.data[0]) + x.bandwidth()/4)
        .attr("y", d => y(d[1]) - (y(d[1]) - y(d[0]))/2 )
        .attr("dy", "0.35em")
        .attr("fill", "#75485E")
        .attr("font-size", "12px")
        .text(d => {
          if (d[1] - d[0] >= 1) { return d3.format(".1f")(d[1]-d[0])}
        })
  })
 
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
      .attr("transform", d => `rotate(-90, ${x(d.date) + x.bandwidth()*3/4}, ${y1(d.workhr)})`)

  // efficiency line
const tmp = series[series.length-1]
workinghrs.forEach(w => {
  w.efficiency = tmp.filter(d => d.data[0] == w.date)[0][1]  / w.workhr / 0.03 * 100
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
      .attr("font-size", "12px")
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
      .attr("x", x(lastW.date) + x.bandwidth()/2 - 15)
      .attr("y", y2(lastW.efficiency) - 15)
      .attr("dy", "0.35em")
      .attr("fill","#75485E")
      .attr("font-weight", 600)
      .attr("font-size", 12)

  svg.append("text")
      .text("với ")
      .attr("text-anchor", "start")
      .attr("alignment-baseline", "start")
      .attr("x", 5)
      .attr("y", 7)
      .attr("dy", "0.35em")
      .attr("fill", "#75485E")
      .attr("font-weight", 300)
      .attr("font-size", 14)
    .append("tspan")
      .text("Demand: 0.03 m³/h")
      .attr("fill", "#75485E")
      .attr("font-weight", 600)
}

svg.append("text")
  .text("Sản lượng (m³) cắt cho hàng ")
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
      .text("Brand")
      .attr("fill", color("brand"))
      .attr("font-weight", 600)
    .append("tspan")
      .text(", RH")
      .attr("fill", color("rh"))
      .attr("font-weight", 600)
    .append("tspan")
      .text(" và ")
      .attr("font-weight", 300)
      .attr("fill", "#75485E")
    .append("tspan")
      .text(" Nhân lực")
      .attr("fill", "#90D26D")
      .attr("font-weight", 600)

  return svg.node();
}