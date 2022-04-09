import { useState, useEffect, useRef } from 'react';
import './App.css';
import * as d3 from 'd3'
import { Slider, Typography } from '@mui/material'
import Axis from './Axis';

const getColour = team => {
  switch (team) {
    case "team1":
      return "blue";
    case "team2":
      return "green";
    case "team3":
      return "black";
    case "team4":
      return "purple";
    default:
      throw Error("unknown team");
  }
}

function App() {
  let data = [
    { team: "team1", score: 50 },
    { team: "team2", score: 21 },
    { team: "team3", score: 5 },
    { team: "team4", score: 10 },
  ];

  data.sort((a, b) => b.score - a.score)

  const x = d3.scaleLinear()
    .domain([0, d3.max(data.map(d => d.score))])
    .range([0, 200])

  const y = d3.scaleBand()
    .domain(data.map(d => d.team))
    .range([0, 150])
    .paddingInner(0.2)
    .paddingOuter(0.4)

  console.log(x.domain())

  return (
    <div>
      <svg viewBox="-20 -20 540 440">
        <g id="chart-labels">
          {data.map((d, idx) => (
            <g key={idx} transform={`translate(0 ${y(d.team)})`}>
              <text textAnchor='middle' fontSize={10} fontWeight="bold" y={y.bandwidth() / 2} alignmentBaseline='central'>{d.team}</text>
            </g>
          ))}
        </g>
        <g id="chart-begin" transform='translate(20)'>
          <line y2={150} stroke="black" />
          {data.map((d, idx) => (
            <g key={idx} transform={`translate(0 ${y(d.team)})`}>
              <rect width={x(d.score)} height={y.bandwidth()} fill={getColour(d.team)} />
              <text fontSize={10} fontWeight="bold" x={x(d.score) + 5} y={y.bandwidth() / 2} alignmentBaseline='central'>{d.score}</text>
            </g>
          ))}
          <Axis
            style={{ overflow: "visible" }}
            transform={`translate(0 150)`}
            domain={x.domain()} range={x.range()} />
        </g>
      </svg>

    </div>

  );
}

export default App;
