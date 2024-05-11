// import * as d3 from "./d3.v7";

d3.csv("/static/a.csv", d3.autoType).then( data => {
  console.log(data);
  drawLineChart(data);
})

const drawLineChart = (data) => {
  const margin = {top: 40, right: 170, bottom: 25, left: 40};
  const width = 1000;
  const height = 500;
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const svg = d3.select("div")
    .append("svg")
    .attr("viewBox", `0, 0, ${width}, ${height}`);

  const innerChart = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  const firstDate = d3.min(data, d => d.date)
  const lastDate = d3.max(data, d => d.date)
  const xScale = d3.scaleTime()
    .domain([firstDate, lastDate])
    .range([0, innerWidth])
  
};