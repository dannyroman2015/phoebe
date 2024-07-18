const drawPanelcncChart1 = (data) => {
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
    .range(d3.schemePastel1)
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
    // .call(zoom); //nguyên cứu sau

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

  innerChart.append("g")
    .selectAll()
    .data(d3.group(data, d => d.date))
    .join("g")
      .attr("transform", ([date]) => `translate(${fx(date)}, 0)`)
    .selectAll()
    .data(([, d]) => d)
    .join("text")
      .text(d => d.qty)
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .attr("x", d => x(d.machine) + x.bandwidth()/2)
      .attr("y", d => y(d.qty) + 8)
      .attr("fill", "#75485E")
      .attr("font-size", "14px")
      
  // innerChart
  //   .selectAll()
  //   .data(d3.group(data, d => d.date).get(data[0].date))
  //   .join("text")
  //     .text(d => d.machine)
  //     .attr("text-anchor", "start")
  //     .attr("x", d => x(d.machine) + x.bandwidth()/2)
  //     .attr("y", d => y(d.qty) - 5)
  //     .attr("fill", d => color(d.machine))
  //     .attr("font-weight", 600)
  //     .attr("transform", d => `rotate(-90, ${x(d.machine) + x.bandwidth()}, ${y(d.qty) - 20})`)
      

  innerChart.append("g")
    .attr("transform", `translate(0, ${innerHeight})`)
    .call(d3.axisBottom(fx).tickSizeOuter(0))
    .call(g => g.selectAll(".domain").remove())
    .call(g => g.selectAll("text").attr("font-size", "12px"));

  // innerChart.append("g")
  //   .attr("transform", `translate(${margin.left}, 0)`)
  //   .call(d3.axisLeft(y).ticks(null, "s"))
  //   .call(g => g.selectAll(".domain").remove())

  svg.append("text")
    .text("(sheet)")
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle")
    .attr("x", 30)
    .attr("y", 5)
    .attr("dy", "0.35em")
    .attr("fill", "#75485E")
    .attr("font-size", 12)

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
    .text("rover b")
    .attr("text-anchor", "start")
    .attr("alignment-baseline", "middle")
    .attr("x", 880)
    .attr("y", 90)
    .attr("dy", "0.35em")
    .attr("fill", color("rover b"))
    .attr("font-size", 16)
    .attr("font-weight", 600)
    .attr("transform", d => `rotate(-90, 880, 90)`)

  svg.append("text")
    .text("panel saw new")
    .attr("text-anchor", "start")
    .attr("alignment-baseline", "middle")
    .attr("x", 870)
    .attr("y", 90)
    .attr("dy", "0.35em")
    .attr("fill", color("panel saw new"))
    .attr("font-size", 14)
    .attr("font-weight", 600)
    .attr("transform", d => `rotate(-90, 870, 90)`)

  svg.append("text")
    .text("panel saw")
    .attr("text-anchor", "start")
    .attr("alignment-baseline", "middle")
    .attr("x", 860)
    .attr("y", 90)
    .attr("dy", "0.35em")
    .attr("fill", color("panel saw"))
    .attr("font-size", 14)
    .attr("font-weight", 600)
    .attr("transform", d => `rotate(-90, 860, 90)`)

  svg.append("text")
    .text("nesting new")
    .attr("text-anchor", "start")
    .attr("alignment-baseline", "middle")
    .attr("x", 850)
    .attr("y", 90)
    .attr("dy", "0.35em")
    .attr("fill", color("nesting new"))
    .attr("font-size", 14)
    .attr("font-weight", 600)
    .attr("transform", d => `rotate(-90, 850, 90)`)

  return svg.node();

  function zoom(svg) {
    const extent = [[0, 0], [innerWidth, innerHeight]];

    svg.call(d3.zoom()
      .scaleExtent([1, 8])
      .translateExtent(extent)
      .extent(extent)
      .on("zoom", zoomed));

    function zoomed(event) {
      x.range([0, innerWidth].map(d => event.transform.applyX(d)));
      svg.selectAll(".bars rect").attr("x", d => x(d.date)).attr("width", x.bandwidth());
      svg.selectAll(".x-axis").call(xAxis).call(g => g.selectAll(".domain").remove());
      svg.selectAll(".label text").attr("x", d => x(d.date) + x.bandwidth()/2).call(t => {
        if (x.bandwidth() < 50) {
          t.attr("hidden", true)
        }
        else {
          t.attr("hidden", null)
        }
      })
    }
  }
}

const drawPanelcncChart = (data) => {
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
    .call(zoom);

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
      .attr("hidden", x.bandwidth() < 50 ? true : null)

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
    
  // innerChart.append("g")
  //   .attr("class", "y-axis")
  //   .attr("transform", `translate(${margin.left}, 0)`)
  //   .call(d3.axisLeft(y))
  //   .call(g => g.selectAll(".domain").remove());

  return svg.node();

  function zoom(svg) {
    const extent = [[0, 0], [innerWidth, innerHeight]];

    svg.call(d3.zoom()
      .scaleExtent([1, 8])
      .translateExtent(extent)
      .extent(extent)
      .on("zoom", zoomed));

    function zoomed(event) {
      x.range([0, innerWidth].map(d => event.transform.applyX(d)));
      svg.selectAll(".bars rect").attr("x", d => x(d.date)).attr("width", x.bandwidth());
      svg.selectAll(".x-axis").call(xAxis).call(g => g.selectAll(".domain").remove());
      svg.selectAll(".label text").attr("x", d => x(d.date) + x.bandwidth()/2).call(t => {
        if (x.bandwidth() < 50) {
          t.attr("hidden", true)
        }
        else {
          t.attr("hidden", null)
        }
      })
    }
  }
}