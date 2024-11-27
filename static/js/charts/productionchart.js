////////////////////////////////////
// value fuction chart
///////////////////////////////////
const drawProductionChart = (data) => {
  const margin = {top: 30, right: 50, bottom: 10, left: 85};
  const width = 900;
  const height = 350;
  
  const barStep = 27;
  const barPadding = 3 / barStep;
  const duration = 300;
  
  const x = d3.scaleLinear().range([margin.left, width - margin.right]);
  
  const xAxis = g => g
    .attr("class", "x-axis")
    .attr("transform", `translate(0,${margin.top})`)
    .call(d3.axisTop(x).ticks(width / 80, "s"))
    .call(g => (g.selection ? g.selection() : g).select(".domain").remove())
  
  const yAxis = g => g
    .attr("class", "y-axis")
    .attr("transform", `translate(${margin.left + 0.5},0)`)
    
  const color = d3.scaleOrdinal([true, false], ["steelblue", "#aaa"]);

  const root = d3.hierarchy(data)
    .sum(d => d.value)
    .eachAfter(d => d.index = d.parent ? d.parent.index = d.parent.index + 1 || 0 : 0);
  
  const svg = d3.create("svg")
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto;");
  
  x.domain([0, root.value]);

  svg.append("rect")
    .attr("class", "background")
    .attr("fill", "none")
    .attr("pointer-events", "all")
    .attr("width", width)
    .attr("height", height)
    .attr("cursor", "pointer")
    .on("click", (event, d) => up(svg, d));

  svg.append("g")
    .call(xAxis);

  svg.append("g")
    .call(yAxis);

  down(svg, root);

  return svg.node();

  function down(svg, d) {
    if (!d.children || d3.active(svg.node())) return;
  
    svg.select(".background").datum(d);
  
    const transition1 = svg.transition().duration(duration);
    const transition2 = transition1.transition();
  
    // Mark any currently-displayed bars as exiting.
    const exit = svg.selectAll(".enter")
        .attr("class", "exit");
  
    // Entering nodes immediately obscure the clicked-on bar, so hide it.
    exit.selectAll("rect")
        .attr("fill-opacity", p => p === d ? 0 : null);
  
    // Transition exiting bars to fade out.
    exit.transition(transition1)
        .attr("fill-opacity", 0)
        .remove();
  
    // Enter the new bars for the clicked-on data.
    // Per above, entering bars are immediately visible.
    const enter = bar(svg, down, d, ".y-axis")
        .attr("fill-opacity", 0);
  
    // Have the text fade-in, even though the bars are visible.
    enter.transition(transition1)
        .attr("fill-opacity", 1);
  
    // Transition entering bars to their new y-position.
    enter.selectAll("g")
        .attr("transform", stack(d.index))
      .transition(transition1)
        .attr("transform", stagger());
  
    // Update the x-scale domain.
    x.domain([0, d3.max(d.children, d => d.value)]);
  
    // Update the x-axis.
    svg.selectAll(".x-axis").transition(transition2)
        .call(xAxis);
  
    // Transition entering bars to the new x-scale.
    enter.selectAll("g").transition(transition2)
        .attr("transform", (d, i) => `translate(0,${barStep * i})`);
  
    // Color the bars as parents; they will fade to children if appropriate.
    enter.selectAll("rect")
        .attr("fill", color(true))
        .attr("fill-opacity", 1)
      .transition(transition2)
        .attr("fill", d => color(!!d.children))
        .attr("width", d => x(d.value) - x(0));

  }

  function up(svg, d) {
    if (!d.parent || !svg.selectAll(".exit").empty()) return;
  
    svg.select(".background").datum(d.parent);
  
    const transition1 = svg.transition().duration(duration);
    const transition2 = transition1.transition();
  
    const exit = svg.selectAll(".enter").attr("class", "exit");
  
    x.domain([0, d3.max(d.parent.children, d => d.value)]);
  
    svg.selectAll(".x-axis").transition(transition1).call(xAxis);
  
    exit.selectAll("g").transition(transition1)
        .attr("transform", stagger());
  
    // Transition exiting bars to the parent’s position.
    exit.selectAll("g").transition(transition2)
        .attr("transform", stack(d.index));
  
    // Transition exiting rects to the new scale and fade to parent color.
    exit.selectAll("rect").transition(transition1)
        .attr("width", d => x(d.value) - x(0))
        .attr("fill", color(true));
  
    // Transition exiting text to fade out.
    // Remove exiting nodes.
    exit.transition(transition2)
        .attr("fill-opacity", 0)
        .remove();
  
    // Enter the new bars for the clicked-on data's parent.
    const enter = bar(svg, down, d.parent, ".exit")
        .attr("fill-opacity", 0);
  
    enter.selectAll("g")
        .attr("transform", (d, i) => `translate(0,${barStep * i})`);
  
    // Transition entering bars to fade in over the full duration.
    enter.transition(transition2)
        .attr("fill-opacity", 1);
  
    // Color the bars as appropriate.
    // Exiting nodes will obscure the parent bar, so hide it.
    // Transition entering rects to the new x-scale.
    // When the entering parent rect is done, make it visible!
    enter.selectAll("rect")
        .attr("fill", d => color(!!d.children))
        .attr("fill-opacity", p => p === d ? 0 : null)
      .transition(transition2)
        .attr("width", d => x(d.value) - x(0))
        .on("end", function(p) { d3.select(this).attr("fill-opacity", 1); });
  }

  function bar(svg, down, d, selector) {
    x.domain([0, d3.max(d.children, d => d.value)]);

    const g = svg.insert("g", selector)
        .attr("class", "enter")
        .attr("transform", `translate(0,${margin.top + barStep * barPadding})`)
        .attr("text-anchor", "end")
        .style("font", "12px sans-serif");
        
    const bar = g.selectAll("g")
      .data(d.children)
      .join("g")
        .attr("cursor", d => !d.children ? null : "pointer")
        .on("click", (event, d) => down(svg, d));

    bar.append("text")
      .attr("text-anchor", "start")
      .attr("alignment-baseline", "middle")
      .attr("x", d => x(d.value) + 5)
      .attr("y", barStep * (1 - barPadding) / 2)
      .attr("font-size", "12px")
      .attr("fill","#75485E")
      .text(d => `${d3.format(",.0f")(d.value)}`);

    bar.append("text")
        .attr("x", margin.left - 6)
        .attr("y", barStep * (1 - barPadding) / 2)
        .attr("dy", ".35em")
        .attr("font-size", "12px")
        .text(d => d.data.name);

    bar.append("rect")
        .attr("x", x(0))
        .attr("width", d => x(d.value) - x(0))
        .attr("height", barStep * (1 - barPadding));
  
    return g;
  }

  function stack(i) {
    let value = 0;
    return d => {
      const t = `translate(${x(value) - x(0)},${barStep * i})`;
      value += d.value;
      return t;
    };
  }

  function stagger() {
    let value = 0;
    return (d, i) => {
      const t = `translate(${x(value) - x(0)},${barStep * i})`;
      value += d.value;
      return t;
    };
  }
}




////////////////////////////////////
// mtd fuction chart
///////////////////////////////////
const drawProdMtdChart = (data) => {
  const width = 900;
  const height = 350;
  const margin = {top: 20, right: 30, bottom: 20, left: 40};
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  let curmonthData = data[data.length-1].dat
  let pastDays = 0;
  let avg = 0;
  let estimateData = [];

  if (curmonthData.length > 1) {
    pastDays = curmonthData[curmonthData.length-2].days // không tính hôm nay
    avg = curmonthData[curmonthData.length-2].value / pastDays
    estimateData = [{days: pastDays + 1, value: curmonthData[curmonthData.length-2].value + avg}]
    for (let i = pastDays+2; i < 27; i++) { // làm tạm theo số ngày đã được plan trước
      estimateData.push({days: i, value: estimateData[estimateData.length-1].value + avg})
    }
  }

  // for (let i = pastDays+2; i < 31; i++) {
  //   estimateData.push({days: i, value: estimateData[estimateData.length-1].value + avg})
  // }
  

  const x = d3.scaleLinear()
    .domain([1, 31])
    .range([0, innerWidth])

  const y = d3.scaleLinear()
    // .domain([0, d3.max(data.map(d => d.dat[d.dat.length-1].value))])
    // .domain([0, estimateData[estimateData.length-1].value])
    .domain([0, d3.max(data.map(d => d.dat[d.dat.length-1]), d => d.value)])
    .range([innerHeight, 0])
    .nice();

  const color = d3.scaleOrdinal()
    .domain(data.map(d => d.month))
    .range(["#FEEFAD", "#FDDE55", "#68D2E8", "#03AED2"])

  const svg = d3.create("svg")
    .attr("viewBox", [0, 0, width, height]);
  
  const innerChart = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)

  const area = d3.area()
    .x(d => x(d.days))
    .y0(d => y(0))
    .y1(d => y(d.value))
    .curve(d3.curveCatmullRom)

  data.forEach((serie, i) => {
    innerChart.append("path")
      .attr("d", area(serie.dat))
      .attr("fill", color(serie.month))
      .attr("fill-opacity", serie == data[data.length-1] ? 0.9 : 0.4)

    innerChart.append("text")
      .text(`${serie.month} - $ ${d3.format(",.0f")(serie.dat[serie.dat.length-1].value)}`)
      .attr("font-size", "14px")
      .attr("x", (i == data.length-1 && serie.dat[serie.dat.length-1].days > 6 && serie.dat[serie.dat.length-1].days < 25) ? x(serie.dat[serie.dat.length-1].days) - 150 : x(serie.dat[serie.dat.length-1].days) + 14 )
      .attr("y", y(serie.dat[serie.dat.length-1].value) - 13)
      .attr("fill", "#75485E")

    innerChart.append("line")
      .attr("x1", x(serie.dat[serie.dat.length-1].days))
      .attr("y1", y(serie.dat[serie.dat.length-1].value) + 1)
      .attr("x2", (i == data.length-1 && serie.dat[serie.dat.length-1].days > 6 && serie.dat[serie.dat.length-1].days < 25) ? x(serie.dat[serie.dat.length-1].days) - 13 : x(serie.dat[serie.dat.length-1].days) + 13)
      .attr("y2", y(serie.dat[serie.dat.length-1].value) - 11)
      .attr("stroke", "#75485E")
      .attr("stroke-width", 1);
  })

  innerChart.append("g")
    .attr("transform", `translate(0, ${innerHeight})`)
    .call(d3.axisBottom(x).tickSizeOuter(0))
    .call(g => g.selectAll("text").attr("font-size", "14px"))
    .call(g => g.append("text")
      .text("days")
      .attr("text-anchor", "start")
      .attr("x", innerWidth - 10)
      .attr("y", 16)
      .attr("fill", "#75485E")
      .attr("font-size", "12px")
      .attr("font-family", "Roboto, sans-serif"))

  innerChart.append("g")
    .call(d3.axisLeft(y).ticks(null, "s"))
    .call(g => g.selectAll(".domain").remove())
    .call(g => g.append("text")
      .text("MTD Value")
      .attr("text-anchor", "start")
      .attr("x", -30)
      .attr("y", -10)
      .attr("fill", "#75485E")
      .attr("font-size", "12px")
      .attr("font-weight", 500)
      .attr("font-family", "Roboto, sans-serif"))

  // draw estimate line
  if (estimateData.length > 1) {
    innerChart.append("path")
    .attr("d", area(estimateData))
    .attr("fill", color(data[data.length-1].month))
    .attr("fill-opacity", 0.05)

  innerChart.append("text")
    // .text(`Estimate: $ ${estimateData[estimateData.length-1].value.toLocaleString("en-US")}`)
    .text(`Estimate: $ ${d3.format(",.0f")(estimateData[estimateData.length-1].value)}`)
    .attr("text-anchor", "end")
    .attr("alignment-baseline", "middle")
    .attr("font-size", "14px")
    .attr("x", x(estimateData[estimateData.length-1].days) - 20)
    .attr("y", y(estimateData[estimateData.length-1].value) - 10)
    .attr("fill", "#75485E")

  innerChart.append("line")
    .attr("x1",  x(estimateData[estimateData.length-1].days))
    .attr("y1", y(estimateData[estimateData.length-1].value) - 1)
    .attr("x2",  x(estimateData[estimateData.length-1].days) - 20)
    .attr("y2", y(estimateData[estimateData.length-1].value) - 5)
    .attr("stroke", "#75485E")
    .attr("stroke-width", 1);

    // innerChart.append("text")
    // .text(`$ ${d3.format(",.0f")(estimateData[estimateData.length-5].value)}`)
    // .attr("text-anchor", "end")
    // .attr("alignment-baseline", "middle")
    // .attr("font-size", "14px")
    // .attr("x", x(estimateData[estimateData.length-5].days) - 20)
    // .attr("y", y(estimateData[estimateData.length-5].value) - 18)
    // .attr("fill", "#75485E")

  // innerChart.append("line")
  //   .attr("x1",  x(estimateData[estimateData.length-5].days))
  //   .attr("y1", y(estimateData[estimateData.length-5].value) - 1)
  //   .attr("x2",  x(estimateData[estimateData.length-5].days) - 20)
  //   .attr("y2", y(estimateData[estimateData.length-5].value) - 11)
  //   .attr("stroke", "#75485E")
  //   .attr("stroke-width", 1);
  }
  
  innerChart.append("text")
    .text(`AVG of This Month up to ${pastDays}th: $ ${d3.format(",.0f")(avg)}`)
    .attr("text-anchor", "start")
    .attr("alignment-baseline", "middle")
    .attr("font-size", "14px")
    .attr("x", 100)
    .attr("y", 50)
    .attr("fill", "#75485E")

  return svg.node()
}