import React, { useEffect, useState, useRef, useCallback } from "react";
import { useSharedMap } from "./useSharedMap";
import "./App.css";

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
  const [localModel, add, remove, roll] = useSharedMap();

  const [addToggle, setAddToggle] = useState(false);
  const [rollToggle, setRollToggle] = useState(false);
  const [rollingInterval, setRollingInterval] = useState(null);

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

  const toggleAdd = () => {
    setAddToggle(!addToggle);
  };

  const addClass = () => {
    return addToggle ? "add-active" : "add-inactive";
  };

  const rollClass = () => {
    return rollToggle ? "roll-active" : "roll-inactive";
  };

  const toggleRolling = () => {
    setRollToggle((prevToggle) => !prevToggle);
  };

  return (
    <div className="App">
      <div className="dices">
        <Row
          cells={Array.from(localModel.entries())}
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
    </div>
  );
}

export default App;
