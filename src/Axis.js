import { useMemo } from 'react';
import * as d3 from 'd3';

const Axis = ({ domain, range, ...remainingProps }) => {
    const ticks = useMemo(() => {
        const x = d3.scaleLinear()
            .domain(domain)
            .range(range)

        const width = range[1] - range[0];
        const pixelsPerTick = 30;
        const numTicks = Math.max(Math.floor(width / pixelsPerTick), 1);
        return x.ticks(numTicks).map(t => ({ xOffset: x(t), value: t }));
    }, [...domain, ...range]);

    return (
        <g {...remainingProps}>
            <path d={`M ${range[0]} 6 v -6 H ${range[1]} v 6`} stroke="black" fill="none" />
            {ticks.map(t => (
                <g transform={`translate(${t.xOffset})`}>
                    <line y2={6} stroke="black" />
                    <text textAnchor='middle' alignmentBaseline='central' fontSize={8} y={12}>{t.value}</text>
                </g>
            ))}
        </g>
    );
}

export default Axis;