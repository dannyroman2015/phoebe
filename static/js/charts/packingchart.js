



const drawPackingChart = (data) => {
  const formatsInfo = [
    {id: "1-BRAND", label: "1-BRAND", color: "#76B6C2"},
    {id: "1-RH", label: "1-RH", color: "#4CDDF7"},
    {id: "2-BRAND", label: "2-BRAND", color: "#20B9BC"},
    {id: "1-RH", label: "1-RH", color: "#2F8999"},
    // {id: "download", label: "Download", color: "#E39F94"},
    // {id: "streaming", label: "Streaming", color: "#ED7864"},
    // {id: "other", label: "Other", color: "#ABABAB"},
  ];

  const margin = {top: 50, right: 30, bottom: 30, left: 70};
  const width = 900;
  const height = 350;
  const innerWidth = width - margin.left - margin.right
  const innerHeight = height - margin.top - margin.bottom

  const svg = d3.create("svg")
    .attr("viewBox", [0, 0, width, height]);

  const stackGenerator = d3.stack()
    .keys(formatsInfo.map(f => f.id));
  
  const annotatedData = stackGenerator(data);
  console.log(annotatedData)
  const colorScale = d3.scaleOrdinal()
    .domain(formatsInfo.map(f => f.id))
    .range(formatsInfo.map(f => f.color))

  const xScale = d3.scaleBand()
    .domain(data.map(d => d.date))
    .range([0, innerWidth])
    .paddingInner(0.02);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(annotatedData[annotatedData.length-1], d => d[1])])
    .range([innerHeight, 0])
    .nice();

  return svg.node();
}