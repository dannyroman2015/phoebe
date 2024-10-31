const drawPanelcncChart1 = (data) => {
  if (data == undefined) return;
  const width = 900;
  const height = 350;
  const margin = {top: 20, right: 20, bottom: 20, left: 20};
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.left;

  const fx = d3.scaleBand()
    .domain(new Set(data.map(d => d.date)))
    .rangeRound([margin.left, innerWidth])
    .paddingInner(0.15);

  const machines = new Set(data.map(d => d.machine))

  const x = d3.scaleBand()
    .domain(machines)
    .rangeRound([0, fx.bandwidth()])
    .paddingInner(0.05);

  const color = d3.scaleOrdinal()
    .domain(machines)
    .range(d3.schemeTableau10)
    .unknown("#ccc");

  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.qty)])
    .rangeRound([innerHeight, 0])
    .nice();

  const svg = d3.create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto;")

  const innerChart = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)

  innerChart.append("g")
    .selectAll()
    .data(d3.group(data, d => d.date))
    .join("g")
      .attr("transform", ([date]) => `translate(${fx(date)}, 0)`)
    .selectAll()
    .data(([, d]) => d)
    .join("rect")
        .attr("x", d => x(d.machine))
        .attr("y", d => y(d.qty))
        .attr("width", x.bandwidth())
        .attr("height", d => y(0) - y(d.qty))
        .attr("fill", d => color(d.machine))
      .append("title")
        .text(d => d.qty)

  innerChart.append("g")
    .selectAll()
    .data(d3.group(data, d => d.date))
    .join("g")
      .attr("transform", ([date]) => `translate(${fx(date)}, 0)`)
    .selectAll()
    .data(([, d]) => d)
    .join("text")
      .text(d => x.bandwidth() >= 20 ? d.qty : "")
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .attr("x", d => x(d.machine) + x.bandwidth()/2)
      .attr("y", d => y(d.qty) + 8)
      .attr("fill", "white")
      .attr("font-size", "14px")
        

  innerChart.append("g")
    .attr("transform", `translate(0, ${innerHeight})`)
    .call(d3.axisBottom(fx).tickSizeOuter(0))
    .call(g => g.selectAll(".domain").remove())
    .call(g => g.selectAll("text").attr("font-size", "12px"));

  innerChart.append("g")
    .attr("transform", `translate(${margin.left}, 0)`)
    .call(d3.axisLeft(y).ticks(null, "s"))
    .call(g => g.selectAll(".domain").remove())
    .call(g => g.selectAll("text").attr("font-size", 14))
    .call(g => g.selectAll(".tick line").clone().attr("x2", innerWidth).attr("stroke-opacity", 0.1))

  svg.append("text")
    .text("(sheet)")
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle")
    .attr("x", 60)
    .attr("y", 5)
    .attr("dy", "0.35em")
    .attr("fill", "#75485E")
    .attr("font-size", 14)

  svg.append("text")
    .text("rover c")
    .attr("text-anchor", "start")
    .attr("alignment-baseline", "middle")
    .attr("x", 890)
    .attr("y", 90)
    .attr("dy", "0.35em")
    .attr("fill", color("rover c"))
    .attr("font-size", 16)
    .attr("font-weight", 600)
    .attr("transform", d => `rotate(-90, 890, 90)`)

  svg.append("text")
    .text("panel saw 3")
    .attr("text-anchor", "start")
    .attr("alignment-baseline", "middle")
    .attr("x", 876)
    .attr("y", 90)
    .attr("dy", "0.35em")
    .attr("fill", color("panel saw 3"))
    .attr("font-size", 16)
    .attr("font-weight", 600)
    .attr("transform", d => `rotate(-90, 876, 90)`)

  svg.append("text")
    .text("panel saw 2")
    .attr("text-anchor", "start")
    .attr("alignment-baseline", "middle")
    .attr("x", 862)
    .attr("y", 90)
    .attr("dy", "0.35em")
    .attr("fill", color("panel saw 2"))
    .attr("font-size", 14)
    .attr("font-weight", 600)
    .attr("transform", d => `rotate(-90, 862, 90)`)

  svg.append("text")
    .text("panel saw 1")
    .attr("text-anchor", "start")
    .attr("alignment-baseline", "middle")
    .attr("x", 848)
    .attr("y", 90)
    .attr("dy", "0.35em")
    .attr("fill", color("panel saw 1"))
    .attr("font-size", 14)
    .attr("font-weight", 600)
    .attr("transform", d => `rotate(-90, 848, 90)`)

  svg.append("text")
    .text("nesting 2")
    .attr("text-anchor", "start")
    .attr("alignment-baseline", "middle")
    .attr("x", 834)
    .attr("y", 90)
    .attr("dy", "0.35em")
    .attr("fill", color("nesting 2"))
    .attr("font-size", 14)
    .attr("font-weight", 600)
    .attr("transform", d => `rotate(-90, 834, 90)`)

  svg.append("text")
    .text("nesting 1")
    .attr("text-anchor", "start")
    .attr("alignment-baseline", "middle")
    .attr("x", 820)
    .attr("y", 90)
    .attr("dy", "0.35em")
    .attr("fill", color("nesting 1"))
    .attr("font-size", 14)
    .attr("font-weight", 600)
    .attr("transform", d => `rotate(-90, 820, 90)`)

  return svg.node();
}

const drawPanelcncChart = (data) => {
  if (data == undefined) return;
  const width = 900;
  const height = 350;
  const margin = {top: 20, right: 20, bottom: 20, left: 20};
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const x = d3.scaleBand()
    .domain(data.map(d => d.date))
    .range([0, innerWidth])
    .padding(0.1);

  const xAxis = d3.axisBottom(x).tickSizeOuter(0);

  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.qty)])
    .range([innerHeight, 0])
    .nice();

  const svg = d3.create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto;")

  const innerChart = svg.append("g")
    .attr("class", "bars")
    .attr("fill", "#DFC6A2")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)
  
  innerChart.append("g")
    .selectAll("rect")
    .data(data)
    .join("rect")
      .attr("x", d => x(d.date))
      .attr("y", d => y(d.qty))
      .attr("width", d => x.bandwidth())
      .attr("height", d => y(0) - y(d.qty))
    .append("title") //tooltip
      .text(d => d.qty)

  innerChart.append("g")
      .attr("class", "label")
      .attr("font-family", "sans-serif")
    .selectAll("text")
    .data(data)
    .join("text")
      .text(d => d.qty)
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .attr("x", d => x(d.date) + x.bandwidth()/2)
      .attr("y", d => y(d.qty) - 12)
      .attr("dy", "0.35em")
      .attr("fill", "#75485E")
      .attr("font-weight", 600)

  innerChart.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0, ${innerHeight})`)
    .call(xAxis)
    .call(g => g.selectAll(".domain").remove())
    .call(g => g.selectAll("text").attr("font-size", "12px"));
  
  svg.append("text")
    .text("(sheet)")
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle")
    .attr("x", 30)
    .attr("y", 5)
    .attr("dy", "0.35em")
    .attr("fill", "#75485E")
    .attr("font-size", 16)

  return svg.node();
}

const drawPanelcncChart2 = (data, target) => {
  if (data == undefined) return;
  const width = 900;
  const height = 350;
  const margin = {top: 20, right: 20, bottom: 20, left: 20};
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const x = d3.scaleBand()
    .domain(data.map(d => d.date))
    .range([0, innerWidth])
    .padding(0.1);

  const xAxis = d3.axisBottom(x).tickSizeOuter(0);

  const y = d3.scaleLinear()
    // .domain([0, d3.max(data, d => d.qty)])
    .domain([0,  d3.max([d3.max(data, d => d.qty), d3.max(target, d => d.value)])])
    .range([innerHeight, 0])
    .nice();

  const svg = d3.create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto;")

  const innerChart = svg.append("g")
    .attr("class", "bars")
    .attr("fill", "#DFC6A2")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)
  
  innerChart.append("g")
    .selectAll("rect")
    .data(data)
    .join("rect")
      .attr("x", d => x(d.date))
      .attr("y", d => y(d.qty))
      .attr("width", d => x.bandwidth())
      .attr("height", d => y(0) - y(d.qty))
    .append("title")
      .text(d => d.qty)

  innerChart.append("g")
      .attr("class", "label")
      .attr("font-family", "sans-serif")
    .selectAll("text")
    .data(data)
    .join("text")
      .text(d => d.qty)
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .attr("x", d => x(d.date) + x.bandwidth()/2)
      .attr("y", d => y(d.qty) - 12)
      .attr("dy", "0.35em")
      .attr("fill", "#75485E")
      .attr("font-weight", 600)

  innerChart.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0, ${innerHeight})`)
    .call(xAxis)
    .call(g => g.selectAll(".domain").remove())
    .call(g => g.selectAll("text").attr("font-size", "12px"));
  
  //draw target lines
  const dates = data.map(d => d.date)
  target = target.filter(t => dates.includes(t.date))
  console.log(target)
  console.log(data)
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
   // end target line

  svg.append("text")
    .text("(sheet)")
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle")
    .attr("x", 30)
    .attr("y", 5)
    .attr("dy", "0.35em")
    .attr("fill", "#75485E")
    .attr("font-size", 16)

  return svg.node();
}

// efficiency
const drawPanelcncEfficiecyChart = (data, manhr) => {
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
      .append("title")
        .text(d => d.qty)

  innerChart.append("g")
    .attr("transform", `translate(0, ${innerHeight})`)
    .call(d3.axisBottom(x).tickSizeOuter(0))
    .call(g => g.selectAll(".domain").remove())
    .call(g => g.selectAll("text").attr("font-size", "12px"))

  innerChart.append("g")
    .selectAll()
    .data(data)
    .join("text")
      .text(d => d.qty >= 30 ? d3.format(".0f")(d.qty) : "")
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
    w.efficiency = data.find(d => d.date == w.date).qty / w.workhr / 5 * 100
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

  if (workinghrs.length != 0) {
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
        .text("Demand: 5 sheets/h")
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