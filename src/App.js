import { useState, useEffect, useRef } from "react";
import "./App.css";
import * as d3 from "d3";
import { Slider, Typography } from "@mui/material";
import HorizontalBarChart from "./graphs/HorizontalBarChart";
import { getResults } from "./api/api";

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    let fetcher = async () => {
      const results = await getResults();
      let barChartData = [];
      for (const tName in results) {
        const elem = results[tName];
        barChartData.push({
          label: tName,
          value: elem.points,
        });
      }
      setData(barChartData);
    };

    fetcher();
  }, []);

  return (
    <div id="graph-container">
      <HorizontalBarChart data={data} />;
    </div>
  );
}

export default App;
