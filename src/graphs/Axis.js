import { useMemo } from "react";
import * as d3 from "d3";

const Axis = ({ domain, range, y, height, fontSize, ...remainingProps }) => {
  const ticks = useMemo(() => {
    const x = d3.scaleLinear().domain(domain).range(range);

    const width = range[1] - range[0];
    const pixelsPerTick = 60;
    const numTicks = Math.max(Math.floor(width / pixelsPerTick), 1);
    return x.ticks(numTicks).map((t) => ({ xOffset: x(t), value: t }));
  }, [...domain, ...range]);

  return (
    <g {...remainingProps}>
      <path
        d={`M ${range[0]} ${y + height / 2} v -${height / 2} H ${range[1]} v ${
          height / 2
        }`}
        stroke="currentColor"
        fill="none"
      />
      {ticks.map((t, idx) => (
        <g key={idx} transform={`translate(${t.xOffset})`}>
          <line y1={y} y2={y + height / 2} stroke="currentColor" />
          <text
            textAnchor="middle"
            alignmentBaseline="central"
            fontSize={fontSize}
            y={y + height}
            fill="currentColor"
          >
            {t.value}
          </text>
        </g>
      ))}
    </g>
  );
};

export default Axis;
