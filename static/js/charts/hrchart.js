const drawHrChart = (rawdata) => {
  
  const width = 1080;
  const margin = {top: 10, right: 10, bottom: 50, left: 140};
  
  const data = d3.stratify().id((d) => d.name).parentId((d) => d.parent)(rawdata);
  const root = d3.hierarchy(data);
  const dx = 30;
  const dy = (width - margin.right - margin.left) / (1 + root.height);
console.log(rawdata)
console.log(data)
console.log(root)
  const tree = d3.tree().nodeSize([dx, dy]);
  const diagonal = d3.linkHorizontal(d3.curveStep).x(d => d.y).y(d => d.x);

  const svg = d3.create("svg")
    .attr("width", width)
    .attr("height", dx)
    .attr("viewBox", [-margin.left, -margin.top, width, dx])

  const gLink = svg.append("g")
    .attr("fill", "none")
    .attr("stroke", "#555")
    .attr("stroke-opacity", 0.4)
    .attr("stroke-width", 1.5)

  const gNode = svg.append("g")
    .attr("cursor", "pointer")
    .attr("pointer-events", "all")
  

  function update(event, source) {
    const duration = event?.altKey ? 2500 : 250;
    const nodes = root.descendants().reverse();
    const links = root.links();

    tree(root);

    let left = root;
    let right = root;
    root.eachBefore(node => {
      if (node.x < left.x) left = node;
      if (node.x > right.x) right = node;
    })

    const height = right.x - left.x + margin.top + margin.bottom;

  const transition = svg.transition()
    .duration(duration)
    .attr("height", height)
    .attr("viewBox", [-margin.left, left.x - margin.top, width, height])
    .tween("resize", window.ResizeObserver ? null : () => () => svg.dispatch("toggle"))

  const node =gNode.selectAll("g")
    .data(nodes, d => d.id);
  
  const nodeEnter = node.enter().append("g")
    .attr("transform", d => `translate(${source.y0}, ${source.x0})`)
    .attr("fill-opacity", 0)
    .attr("stroke-opacity", 0)
    .on("click", (event, d) => {
      d.children = d.children ? null : d._children;
      update(event, d);
    })

  nodeEnter.append("circle")
    .attr("r", 2.5)
    .attr("fill", d => d._children ? "#555" : "#999")
    .attr("stroke-width", 10);

  nodeEnter.append("text")
    .text(d => d.data.data.name)
    .attr("dy", "0.35em")
    .attr("x", d => d._children ? 6 : 6)
    .attr("text-anchor", d => d._children ? "end": "start")
    .attr("stroke-linejoin", "round")
    .attr("stroke-width", 3)
    .attr("stroke", "white")
    .attr("paint-order", "stroke")
    .attr("font-size", 10)

  const nodeUpdate = node.merge(nodeEnter).transition(transition)
    .attr("transform", d => `translate(${d.y}, ${d.x})`)
    .attr("fill-opacity", 1)
    .attr("stroke-opacity", 1)

  const nodeExit = node.exit().transition(transition).remove()
    .attr("transform", d => `translate(${source}, ${source})`)
    .attr("fill-opacity", 0)
    .attr("stroke-opacity", 0)

  const link = gLink.selectAll("path")
    .data(links, d => d.target.id)
  
  const linkEnter = link.enter().append("path")
    .attr("d", d => {
      const o = {x: source.x0, y: source.y0};
      return diagonal({source: o, target: o})
    })
  
  link.merge(linkEnter).transition(transition)
    .attr("d", diagonal)

  link.exit().transition(transition).remove()
    .attr("d", d => {
      const o = {x: source.x, y: source.y}
      return diagonal({source: o, target: o})
    })

  root.eachBefore(d => {
    d.x0 = d.x;
    d.y0 = d.y;
  })
  }

  root.x0 = dy / 2;
  root.y0 = 0;
  root.descendants().forEach((d, i) => {
    d.id = i;
    d._children = d.children;
    // if (d.depth && d.data.name.length !== 7) d.children = null;
  })

  update(null, root);

  return svg.node();
}