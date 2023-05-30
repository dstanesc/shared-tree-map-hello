import React, { useEffect, useState, useRef, useCallback } from "react";
import _ from "lodash";
import "./App.css";
import { initMap } from "@dstanesc/shared-tree-map";
import { v4 as uuid } from "uuid";
import Plot from "plotly.js-dist-min";

const isMemorySupported =
  typeof performance !== "undefined" &&
  typeof performance.memory !== "undefined";

function Cell(props) {
  return (
    <button className="dice" onClick={props.onClick}>
      {props.value}
    </button>
  );
}
function Row(props) {
  return (
    <div>
      <div className="board-row">
        {props.cells.map(([key, value]) => (
          <Cell key={key} value={value} onClick={() => props.onClick(key)} />
        ))}
      </div>
    </div>
  );
}

function App() {
  const [diceValues, setDiceValues] = useState(new Map());

  // local view
  const [sharedTreeMap, setSharedTreeMap] = useState();

  // Dice rolling state
  const [rollToggle, setRollToggle] = useState(false);

  const [rollingInterval, setRollingInterval] = useState(null);

  // Add button state
  const [addToggle, setAddToggle] = useState(false);

  const [memoryData, setMemoryData] = useState([0]);

  useEffect(() => {
    async function init() {
      const mapId = window.location.hash.substring(1) || undefined;
      console.log("mapId", mapId);
      const sharedMap = await initMap(mapId);
      if (mapId === undefined) {
        window.location.hash = sharedMap.mapId();
      }
      setSharedTreeMap(sharedMap);
      return sharedMap;
    }
    init().then((sharedMap) => {
      sharedMap.getBinder().bindOnBatch(() => {
        setDiceValues((oldState) => {
          const newState = sharedMap.asMap();
          if (isMemorySupported) {
            const usedMemory = window.performance.memory.usedJSHeapSize;
            const usedMemoryMB = Math.round(usedMemory / (1024 * 1024));
            setMemoryData((prevData) => [...prevData, usedMemoryMB]);
          }
          return newState;
        });
      });
    });
  }, []);

  useEffect(() => {
    if (rollToggle) {
      const interval = setInterval(roll, 10);
      setRollingInterval(interval);
    } else {
      clearInterval(rollingInterval);
      setRollingInterval(null);
    }
    return () => {
      clearInterval(rollingInterval);
    };
  }, [rollToggle]);

  useEffect(() => {
    if (isMemorySupported) {
      const data = {
        x: memoryData.map((_, index) => index),
        y: memoryData,
        type: "scatter",
        mode: "lines",
        line: { color: "greenyellow" },
        name: "Memory Consumption",
      };

      const layout = {
        plot_bgcolor: "black",
        paper_bgcolor: "black",
        xaxis: {
          title: "Time",
          color: "greenyellow",
        },
        yaxis: {
          title: "Memory (MB)",
          color: "greenyellow",
        },
      };

      Plot.newPlot("memory-chart", [data], layout);

      return () => {
        Plot.purge("memory-chart");
      };
    }
  }, [memoryData]);

  const roll = useCallback(() => {
    for (const key of sharedTreeMap.keys()) {
      sharedTreeMap.set(key, randomString());
    }
  }, [sharedTreeMap]);

  const cleanUp = async () => {
    for (const key of startTimes.keys()) {
      await execFn(() => {
        if (sharedTreeMap.has(key)) {
          sharedTreeMap.delete(key);
        }
      });
    }
  };

  const randomString = () => {
    const randomNumber = Math.floor(Math.random() * 1024) + 1;
    return randomNumber.toString();
  };

  const add = () => {
    sharedTreeMap.set(uuid(), randomString());
  };

  const remove = (key) => {
    sharedTreeMap.delete(key);
  };

  const toggleRolling = () => {
    setRollToggle((prevToggle) => !prevToggle);
  };

  const rollClass = () => {
    return rollToggle ? "roll-active" : "roll-inactive";
  };

  const toggleAdd = () => {
    setAddToggle(!addToggle);
  };

  const addClass = () => {
    return addToggle ? "add-active" : "add-inactive";
  };

  return (
    <div className="App">
      <div className="dices">
        <Row
          cells={Array.from(diceValues.entries())}
          onClick={(key) => remove(key)}
        />
      </div>

      <br />
      <br />

      <span
        className={addClass()}
        onClick={() => add()}
        onMouseDown={() => toggleAdd()}
        onMouseUp={() => toggleAdd()}
      >
        Add
      </span>

      <span className={rollClass()} onClick={() => toggleRolling()}>
        Roll
      </span>

      {isMemorySupported && <div id="memory-chart"></div>}
    </div>
  );
}

export default App;
