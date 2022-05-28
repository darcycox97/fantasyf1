import * as d3 from "d3";
import Axis from "./Axis";

const VIEWBOX_W = 1000;
const VIEWBOX_H = 1000;
const PADDING_PCT = 0.08;
const AXIS_HEIGHT = 20;
const FONT_SIZE = 20;

function HorizontalBarChart({ data }) {
  // data is an array of the objects {label, value}

  // show data in descending order (highest value first)
  data.sort((a, b) => b.value - a.value);

  // colors should be the same per label no matter the value.
  // so we sort by alphabetical order
  const colors = d3
    .scaleOrdinal()
    .domain(data.map((d) => d.label).sort())
    .range(d3.quantize(d3.interpolateHcl("#5490ff", "#ff9314"), 10));

  const chartXMin = PADDING_PCT * VIEWBOX_W;
  const chartXMax = VIEWBOX_W * (1 - PADDING_PCT);
  const chartYMin = PADDING_PCT * VIEWBOX_H;
  const chartYMax = VIEWBOX_H * (1 - PADDING_PCT) - AXIS_HEIGHT;

  const x = d3
    .scaleLinear()
    .domain([0, d3.max(data.map((d) => d.value))])
    .range([chartXMin, chartXMax]);

  const y = d3
    .scaleBand()
    .domain(data.map((d) => d.label))
    .range([chartYMin, chartYMax])
    .paddingInner(0.2)
    .paddingOuter(0.4);

  return (
    <svg
      viewBox="0 0 1000 1000"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid meet"
      strokeWidth={1}
      color="#F1F1F1"
      id="chart-container"
    >
      <g id="chart-labels">
        {data.map((d) => (
          // <g key={d.label} transform={`translate(0 ${y(d.label)})`}>
          <text
            textAnchor="end"
            fontSize={FONT_SIZE}
            x={x.range()[0] - 10}
            y={y.bandwidth() / 2 + y(d.label)}
            alignmentBaseline="central"
            fill="currentColor"
          >
            {d.label}
          </text>
          // </g>
        ))}
      </g>
      <g id="chart-area">
        <line
          x1={chartXMin}
          x2={chartXMin}
          y1={chartYMin}
          y2={chartYMax}
          stroke="currentColor"
        />
        {data.map((d, idx) => (
          <g key={idx}>
            <rect
              x={x.range()[0]}
              y={y(d.label)}
              width={x(d.value) - x.range()[0]}
              height={y.bandwidth()}
              fill={colors(d.label)}
              opacity={0.8}
            />
            <text
              fontSize={FONT_SIZE}
              fontWeight="normal"
              x={x(d.value) - 10}
              y={y(d.label) + y.bandwidth() / 2}
              alignmentBaseline="central"
              textAnchor="end"
              fill="currentColor"
            >
              {d.value}
            </text>
          </g>
        ))}
        <Axis
          // style={{ overflow: "visible" }}
          domain={x.domain()}
          range={x.range()} // since axis coords are relative to parent
          y={y.range()[1]}
          height={AXIS_HEIGHT}
        />
      </g>
    </svg>
  );
}

export default HorizontalBarChart;
