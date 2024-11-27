function convertToHierachy(raw, parent = "MO-222") {
  let result = []

  for (let i = 0; i < raw.length; i++) {
    if (raw[i].parent == parent) {
      const dataObj = {
        ...raw[i],
      }
      const children = convertToHierachy(raw, raw[i].itemcode)
      if(children.length > 0) {
        dataObj.children = children;
      }

      result.push(dataObj);
    }
   
  }
  return result
  
}

const drawGNHHChart = (rawdata) => {
  const data = {
    "itemcode": "MO-222",
    "children": convertToHierachy(rawdata),
  }

  const width = 1080;
  const marginTop = 10;
  const marginRight = 10;
  const marginBottom = 10;
  const marginLeft = 150;

  // Rows are separated by dx pixels, columns by dy pixels. These names can be counter-intuitive
  // (dx is a height, and dy a width). This because the tree must be viewed with the root at the
  // “bottom”, in the data domain. The width of a column is based on the tree’s height.
  const root = d3.hierarchy(data);
  const dx = 30;
  const dy = (width - marginRight - marginLeft) / (1 + root.height);

  // Define the tree layout and the shape for links.
  const tree = d3.tree().nodeSize([dx, dy]);
  const diagonal = d3.linkHorizontal().x(d => d.y).y(d => d.x);

  // Create the SVG container, a layer for the links and a layer for the nodes.
  const svg = d3.create("svg")
      .attr("width", width)
      .attr("height", dx)
      .attr("viewBox", [-marginLeft, -marginTop, width, dx])
      .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif; user-select: none;");

  const gLink = svg.append("g")
      .attr("fill", "none")
      .attr("stroke", "#555")
      .attr("stroke-opacity", 0.4)
      .attr("stroke-width", 1.5);

  const gNode = svg.append("g")
      .attr("cursor", "pointer")
      .attr("pointer-events", "all");

  function update(event, source) {
    const duration = event?.altKey ? 2500 : 250; // hold the alt key to slow down the transition
    const nodes = root.descendants().reverse();
    const links = root.links();

    // Compute the new tree layout.
    tree(root);

    let left = root;
    let right = root;
    root.eachBefore(node => {
      if (node.x < left.x) left = node;
      if (node.x > right.x) right = node;
    });

    const height = right.x - left.x + marginTop + marginBottom;

    const transition = svg.transition()
        .duration(duration)
        .attr("height", height)
        .attr("viewBox", [-marginLeft, left.x - marginTop, width, height])
        .tween("resize", window.ResizeObserver ? null : () => () => svg.dispatch("toggle"));

    // Update the nodes…
    const node = gNode.selectAll("g")
      .data(nodes, d => d.id);

    // Enter any new nodes at the parent's previous position.
    const nodeEnter = node.enter().append("g")
        .attr("transform", d => `translate(${source.y0},${source.x0})`)
        .attr("fill-opacity", 0)
        .attr("stroke-opacity", 0)
        .on("click", (event, d) => {
          d.children = d.children ? null : d._children;
          update(event, d);
        });

    nodeEnter.append("circle")
        .attr("r", 2.5)
        .attr("fill", d => d._children ? "#555" : "#999")
        .attr("stroke-width", 10);

    nodeEnter.append("text")
        .attr("dy", "0.31em")
        .attr("x", d => d._children ? -6 : 6)
        .attr("text-anchor", d => d._children ? "end" : "start")
        .text(d => d.data.itemcode)
        .attr("stroke-linejoin", "round")
        .attr("stroke-width", 3)
        .attr("stroke", "white")
        .attr("paint-order", "stroke");

    // Transition nodes to their new position.
    const nodeUpdate = node.merge(nodeEnter).transition(transition)
        .attr("transform", d => `translate(${d.y},${d.x})`)
        .attr("fill-opacity", 1)
        .attr("stroke-opacity", 1);

    // Transition exiting nodes to the parent's new position.
    const nodeExit = node.exit().transition(transition).remove()
        .attr("transform", d => `translate(${source.y},${source.x})`)
        .attr("fill-opacity", 0)
        .attr("stroke-opacity", 0);

    // Update the links…
    const link = gLink.selectAll("path")
      .data(links, d => d.target.id);

    // Enter any new links at the parent's previous position.
    const linkEnter = link.enter().append("path")
        .attr("d", d => {
          const o = {x: source.x0, y: source.y0};
          return diagonal({source: o, target: o});
        });

    // Transition links to their new position.
    link.merge(linkEnter).transition(transition)
        .attr("d", diagonal);

    // Transition exiting nodes to the parent's new position.
    link.exit().transition(transition).remove()
        .attr("d", d => {
          const o = {x: source.x, y: source.y};
          return diagonal({source: o, target: o});
        });

    // Stash the old positions for transition.
    root.eachBefore(d => {
      d.x0 = d.x;
      d.y0 = d.y;
    });
  }

  // Do the first update to the initial configuration of the tree — where a number of nodes
  // are open (arbitrarily selected as the root, plus nodes with 7 letters).
  root.x0 = dy / 2;
  root.y0 = 0;
  root.descendants().forEach((d, i) => {
    d.id = i;
    d._children = d.children;
    // if (d.depth && d.data.item.length !== 7) d.children = null;
  });

  update(null, root);

  return svg.node();
}


const drawGNHHChart2 = (data) => {
  const nodeSize = 23;
  const root = d3.hierarchy(data).eachBefore((i => d => d.index = i++)(0));
  const nodes = root.descendants();
  const width = 500;
  const height = (nodes.length + 1) * nodeSize;

  const svg = d3.create("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [-nodeSize / 2, -nodeSize * 3 / 2, width, height])
      .attr("style", "max-width: 100%; height: auto; font: 12px sans-serif; overflow: visible;");

  const link = svg.append("g")
      .attr("fill", "none")
      .attr("stroke", "#999")
    .selectAll()
    .data(root.links())
    .join("path")
      .attr("d", d => `
        M${d.source.depth * nodeSize},${d.source.index * nodeSize}
        V${d.target.index * nodeSize}
        h${nodeSize}
      `);

  var defs = svg.append("defs")
  var gradient = defs.append("linearGradient")
    .attr("id", "gradient")
    .attr("x1", "0%")
    .attr("x2", "100%")
    .attr("y1", "0%")
    .attr("y2", "0%")
  gradient.append("stop")
    .attr("offset", "0%")
    .attr("stop-color", "white")
  gradient.append("stop")
    .attr("offset", "100%")
    .attr("stop-color", "#91DDCF")

  const node = svg.append("g")
    .selectAll()
    .data(nodes)
    .join("g")
      .attr("transform", d => `translate(0,${d.index * nodeSize})`);

  node.append("rect")
      .attr("x", d => d.depth * nodeSize + 6)
      .attr("y", "-0.67em")
      .attr("height", "1.3em")
      .attr("width", d => d.data.done ? (d.data.done/d.data.qty) * (474 - d.depth * nodeSize) : 0)
      .attr("fill", "url(#gradient)")
      .attr("fill-opacity", 0.5)

  node.append("circle")
      .attr("cx", d => d.depth * nodeSize)
      .attr("r", 2.5)
      .attr("fill", d => d.children ? null : "#999");

  let prevcolor = "black"
  node.append("text")
    .text(d => {
        let finallabel = d.data.itemcode;
        // if (d.data.shipmentdate != "" && d.data.shipmentdate != undefined) {
        //   const rawdays = (Date.parse(d.data.shipmentdate) - new Date())/(1000 * 3600 * 24)
        //   if (Math.abs(d.data.qty - d.data.done) > 0.005) {
        //     if (rawdays >= 1) {
        //       finallabel += ` 📆${Math.round(rawdays)}d ${Math.round(rawdays%1*24)}h`
        //     } 
        //     else if (rawdays <= 0) {
        //       finallabel += ` 💣${Math.round(rawdays*24)} hrs`
        //     }
        //     else {
        //       finallabel += ` ⏰${Math.round(rawdays*24)} hrs`
        //     }
        //   }     
        // }
        if (d.data.shipmentdate != "" && d.data.shipmentdate != undefined) {
          const rawdays = (Date.parse(d.data.shipmentdate) - new Date())/(1000 * 3600 * 24)
          const formatteddate = d3.timeFormat("%d/%m %H:%M")(d3.isoParse(d.data.shipmentdate))
          if (Math.abs(d.data.qty - d.data.done) > 0.005) {
            if (rawdays >= (1/24 * 0.25)) {
              finallabel += ` 📆${formatteddate}`
            } 
            else if (rawdays <= 0) {
              finallabel += ` 💣${formatteddate}`
            }
            else {
              finallabel += ` ⏰${Math.round(rawdays*24*60)}'`
            }
          }     
        }

        if (d.data.performer != "" && d.data.performer != undefined) {
          finallabel += ` 👷‍♂️(${d.data.performer})`
        }
        
        if (d.data.deliveryqty != undefined && d.data.deliveryqty != 0) {
          if (Math.abs(d.data.deliveryqty - d.data.done) > 0.005) {
            finallabel += ` ✈️(${d.data.deliveryqty})`
          } else {
            finallabel += ` ✈️(100%)`
          }
        }

        if (d.data.price != undefined && d.data.price != 0) {
          finallabel += ` 💰${d.data.price * d.data.qty}`
        }

        return finallabel;
        }
      )
    .attr("dy", "0.32em")
    .attr("x", d => d.depth * nodeSize + 6)
    .attr("fill", d =>  {
      if (d.data.done != 0 || d.data.performer != "") {
        return "black"
      }

      if (d.data.alert != "") {
        return "red"
      } 
      
      if (d.data.children != null || d.data.children != undefined) {
        return d.data.children.some(d => d.deliveryqty != d.qty) ? "black" : "#00BDAA"
      }
      
    })
    // .attr("class", d => ((Math.abs(d.data.qty - d.data.done) > 0.005) && (Date.parse(d.data.shipmentdate) - new Date())/(1000 * 3600) < 0.25) ? "motion-preset-blink motion-duration-2000" : "")
    .style("cursor", "pointer")
    .style("hover", "background-color: yellow;")
    .on("click", (e, d) => {
      document.getElementById("codepath").value = d.ancestors().reverse().map(d => d.data.itemcode).join("->");
      // document.getElementById("detailsearch").value = d.data.itemcode;
      // document.getElementById("detailsearch").dispatchEvent(new Event('input', {bubble: true}));
      // document.getElementById("detailsearch").click();
      // document.getElementById("iteminfobtn").click();
      document.getElementById("iteminfobtn").dispatchEvent(new Event('click', {bubble: true}));
      document.getElementById("timelinesearch").value = d.ancestors().reverse().map(d => d.data.itemcode).join("->");
      document.getElementById("timelinesearch").dispatchEvent(new Event('input', {bubble: true}));
      // document.getElementById("timelinesearch").click();
      // document.getElementById("timelinesearch").focus();
    })
    .on("mouseover", function() {
      prevcolor = this.getAttribute("fill")
      d3.select(this).attr("fill", "orange");
    })
    .on("mouseout", function() {
      d3.select(this).attr("fill", prevcolor);
    });
   
  
  node.append("title")
      .text(d => d.data.itemname)
      // .text(d => d.ancestors().reverse().map(d => d.data.itemcode).join("/"))

  svg.append("text")
    .attr("dy", "0.32em")
    .attr("y", -nodeSize)
    .attr("x", 480)
    .attr("text-anchor", "end")
    .attr("font-weight", "bold")
    .text("Done/Needed");

  node.append("text")
      .attr("dy", "0.32em")
      .attr("x", 480)
      .attr("text-anchor", "end")
      .attr("fill", d => d.children ? null : "#555")
    .data(root.copy().descendants())
      .text(d => d.data.qty ? `${d.data.done ? Math.round(d.data.done*1000)/1000 : 0}/${d.data.qty ? `${Math.round(d.data.qty*1000)/1000} (${d.data.unit.toLowerCase()})`  : ""}` : "")

  // svg.append("text")
  //   .attr("dy", "0.32em")
  //   .attr("y", -nodeSize)
  //   .attr("x", 450)
  //   .attr("text-anchor", "end")
  //   .attr("font-weight", "bold")
  //   .text("Needed");
  
  // node.append("text")
  //     .attr("dy", "0.32em")
  //     .attr("x", 450)
  //     .attr("text-anchor", "end")
  //     .attr("fill", d => d.children ? null : "#555")
  //   .data(root.copy().descendants())
  //     // .text(d => d.data.qty ? d3.format(".3f")(d.data.qty) + ` (${d.data.unit})`  : "");
  //     .text(d => d.data.qty ? `${Math.round(d.data.qty*1000)/1000} (${d.data.unit.toLowerCase()})`  : "");

  // svg.append("text")
  //   .attr("dy", "0.32em")
  //   .attr("y", -nodeSize)
  //   .attr("x", 480)
  //   .attr("text-anchor", "end")
  //   .attr("font-weight", "bold")
  //   .text("Ship Date");
    
  // node.append("text")
  //     .attr("dy", "0.32em")
  //     .attr("x", 480)
  //     .attr("text-anchor", "end")
  //     .attr("fill", d => d.children ? null : "#555")
  //   .data(root.copy().descendants())
  //     .text(d => d.data.shipmentdate);

  return svg.node();
}

const drawGNHHChart3 = (rdata) => {
  const data = {
    "name": "fff", 
    "children": rdata
  }
  const width = 500;
  const margin = {top: 10, right: 10, bottom: 10, left: 10};
  
  const root = d3.hierarchy(data);
  const dx = 20;
  const dy = (width - margin.right - margin.left) / (1 + root.height);

  const tree = d3.tree().nodeSize([dx, dy]);
  const diagonal = d3.link().x(d => d.y).y(d => d.x);

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
    .text(d => d.data.name)
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