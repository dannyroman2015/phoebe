const drawManPowerChart = (rdata) => {
  // data = {
  //   "name": "all",
  //   "children": [
  //     {
  //       "name": "01 Nov",
  //       "children": [
  //         {
  //           "name": "Active",
  //           "value": 100,
  //         },
  //         {
  //           "name": "Absence",
  //           "value": 3
  //         },
  //       ]
  //     },
  //     {
  //       "name": "02 Nov",
  //       "children": [
  //         {
  //           "name": "Active",
  //           "value": 90,
  //         },
  //         {
  //           "name": "Absence",
  //           "value": 13
  //         },
  //       ]
  //     },
  //     {
  //       "name": "03 Nov",
  //       "children": [
  //         {
  //           "name": "Active",
  //           "value": 120,
  //         },
  //         {
  //           "name": "Absence",
  //           "value": 13
  //         },
  //       ]
  //     },
  //     {
  //       "name": "04 Nov",
  //       "children": [
  //         {
  //           "name": "Active",
  //           "children": [
  //             {
  //               "name": "Assembly",
  //               "value": 33
  //             },
  //             {
  //               "name": "Rawmill",
  //               "value": 25
  //             },
  //             {
  //               "name": "Rawmill",
  //               "value": 45
  //             }
  //           ]
  //         },
  //         {
  //           "name": "Absence",
  //           "value": 23
  //         },
  //         {
  //           "name": "Off",
  //           "value": 2
  //         },
  //         {
  //           "name": "Need",
  //           "value": 22
  //         },
  //       ]
  //     }
  //   ]
  // }
  // Specify the chart’s dimensions.
  const data = {
    "name": "all",
    "children": rdata
  }
  console.log(data)
  const width = 928;
  const height = width;
  const radius = width / 6;

  // Create the color scale.
  const color = d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, data.children.length + 1));

  // Compute the layout.
  const hierarchy = d3.hierarchy(data)
      .sum(d => d.value)
      // .sort((a, b) => b.value - a.value);
  const root = d3.partition()
      .size([2 * Math.PI, hierarchy.height + 1])
    (hierarchy);
  root.each(d => d.current = d);

  // Create the arc generator.
  const arc = d3.arc()
      .startAngle(d => d.x0)
      .endAngle(d => d.x1)
      .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
      .padRadius(radius * 1.5)
      .innerRadius(d => d.y0 * radius)
      .outerRadius(d => Math.max(d.y0 * radius, d.y1 * radius - 1))

  // Create the SVG container.
  const svg = d3.create("svg")
      .attr("viewBox", [-width / 2, -height / 2, width, width])
      .style("font", "12px sans-serif");

  // Append the arcs.
  const path = svg.append("g")
    .selectAll("path")
    .data(root.descendants().slice(1))
    .join("path")
      .attr("fill", d => { while (d.depth > 1) d = d.parent; return color(d.data.name); })
      .attr("fill-opacity", d => arcVisible(d.current) ? (d.children ? 0.6 : 0.4) : 0)
      .attr("pointer-events", d => arcVisible(d.current) ? "auto" : "none")

      .attr("d", d => arc(d.current));

  // Make them clickable if they have children.
  path.filter(d => d.children)
      .style("cursor", "pointer")
      .on("click", clicked);

  const format = d3.format(",d");
  path.append("title")
      // .text(d => `${d.ancestors().map(d => d.data.name).reverse().join("/")}\n${format(d.value)}`);
      .text(d => `${d.data.name} (${d.value}) (${d3.format(".0f")(d.value/d.parent.value * 100)}%)`);

  const label = svg.append("g")
      .attr("pointer-events", "none")
      .attr("text-anchor", "middle")
      .style("user-select", "none")
    .selectAll("text")
    .data(root.descendants().slice(1))
    .join("text")
        .attr("dy", "0.35em")
        .attr("fill-opacity", d => +labelVisible(d.current))
        .attr("transform", d => labelTransform(d.current))
        .text(d => {
          if (d.depth == 1) {
            return `${d.data.name} (${d.value})`;
          }
          return `${d.data.name} (${d.value}) (${d3.format(".0f")(d.value/d.parent.value * 100)}%)`;
        })

  const parent = svg.append("circle")
      .datum(root)
      .attr("r", radius)
      .attr("fill", "none")
      .attr("pointer-events", "all")
      .on("click", clicked);

  svg.append("text")
    .text("* Click center to zoom out, click some color to see more detail")
    .attr("class", "disappear")
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle")
    .attr("x", 0)
    .attr("y", 0)
    .attr("dy", "0.35em")
    .attr("fill", "#75485E")
    .attr("font-size", 15)
    .style("transition", "opacity 2s ease-out")
  setTimeout(() => d3.selectAll(".disappear").attr("opacity", 0), 60000)

  svg.append("text")
    .text("* Change number of displaying days here ↗")
    .attr("class", "disappear")
    .attr("text-anchor", "end")
    .attr("alignment-baseline", "middle")
    .attr("x", width/2 - 20)
    .attr("y", -height/2 + 10)
    .attr("dy", "0.35em")
    .attr("fill", "#75485E")
    .attr("font-size", 15)
    .style("transition", "opacity 2s ease-out")
  setTimeout(() => d3.selectAll(".disappear").attr("opacity", 0), 60000)

  // Handle zoom on click.
  function clicked(event, p) {
    parent.datum(p.parent || root);

    root.each(d => d.target = {
      x0: Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
      x1: Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
      y0: Math.max(0, d.y0 - p.depth),
      y1: Math.max(0, d.y1 - p.depth)
    });

    const t = svg.transition().duration(750);

    // Transition the data on all arcs, even the ones that aren’t visible,
    // so that if this transition is interrupted, entering arcs will start
    // the next transition from the desired position.
    path.transition(t)
        .tween("data", d => {
          const i = d3.interpolate(d.current, d.target);
          return t => d.current = i(t);
        })
      .filter(function(d) {
        return +this.getAttribute("fill-opacity") || arcVisible(d.target);
      })
        .attr("fill-opacity", d => arcVisible(d.target) ? (d.children ? 0.6 : 0.4) : 0)
        .attr("pointer-events", d => arcVisible(d.target) ? "auto" : "none") 

        .attrTween("d", d => () => arc(d.current));

    label.filter(function(d) {
        return +this.getAttribute("fill-opacity") || labelVisible(d.target);
      }).transition(t)
        .attr("fill-opacity", d => +labelVisible(d.target))
        .attrTween("transform", d => () => labelTransform(d.current));
  }
  
  function arcVisible(d) {
    return d.y1 <= 3 && d.y0 >= 1 && d.x1 > d.x0;
  }

  function labelVisible(d) {
    return d.y1 <= 3 && d.y0 >= 1 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.03;
  }

  function labelTransform(d) {
    const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
    const y = (d.y0 + d.y1) / 2 * radius;
    return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
  }

  return svg.node();
}