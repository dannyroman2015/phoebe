// import * as d3 from "./d3.v7"
const div_container = d3.select("div")
const svg = div_container.append("svg")
svg.attr("viewBox", "0 0 500 300")

d3.csv("/static/data.csv", d => {
  return {
    "name": d.name,
    "age": +d.age,
  };
}).then(data => {
  console.log(d3.max(data, d => d.age))
  console.log(d3.min(data, d => d.age))
  console.log(d3.extent(data, d => d.age))
  console.log(data.sort((a, b) => a.age - b.age))
  createViz(data);
});

const createViz = (data) => {
  const barHeight = 20;

  svg
    .selectAll("rect")
    .data(data)
    .join("rect")
      .attr("class", d => {
        console.log(d);
        return `bar bar-${d.name}`;
      })
      .attr("width", d => d.age)
      .attr("height", barHeight)
      .attr("x", 0)
      .attr("y", (d, i) => (barHeight +5) * i )
      .attr("fill", d => d.name == "trung" ? "red" : "black")
}

