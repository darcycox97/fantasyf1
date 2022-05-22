import * as d3 from "d3";
import Axis from "./Axis";

function HorizontalBarChart({ data }) {
  console.log(data);

  // data is an array of the objects {label, value}

  data.sort((a, b) => b.value - a.value);

  const colors = d3
    .scaleOrdinal()
    .domain(data.map((d) => d.label).sort())
    .range(d3.quantize(d3.interpolateHcl("#5490ff", "#ff9314"), 10));

  const x = d3
    .scaleLinear()
    .domain([0, d3.max(data.map((d) => d.value))])
    .range([0, 800]);

  const y = d3
    .scaleBand()
    .domain(data.map((d) => d.label))
    .range([0, 800])
    .paddingInner(0.2)
    .paddingOuter(0.4);

  return (
    <svg viewBox="0 0 1000 1000" strokeWidth={1} color="#F1F1F1" id="graph">
      <g id="chart-labels">
        {data.map((d, idx) => (
          <g key={idx} transform={`translate(0 ${y(d.label)})`}>
            <text
              textAnchor="middle"
              fontSize={8}
              y={y.bandwidth() / 2}
              alignmentBaseline="central"
              fill="currentColor"
            >
              {d.label}
            </text>
          </g>
        ))}
      </g>
      <g id="chart-begin" transform="translate(20)">
        <line y2={800} stroke="currentColor" />
        {data.map((d, idx) => (
          <g key={idx} transform={`translate(0.5 ${y(d.label)})`}>
            <rect
              width={x(d.value)}
              height={y.bandwidth()}
              fill={colors(d.label)}
              opacity={0.8}
            />
            <text
              fontSize={7}
              fontWeight="normal"
              x={x(d.value) + 5}
              y={y.bandwidth() / 2}
              alignmentBaseline="central"
              fill="currentColor"
            >
              {d.value}
            </text>
          </g>
        ))}
        <Axis
          style={{ overflow: "visible" }}
          transform={`translate(0 800)`}
          domain={x.domain()}
          range={x.range()}
        />
      </g>
    </svg>
  );
}

export default HorizontalBarChart;
