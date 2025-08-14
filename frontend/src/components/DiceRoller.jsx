import React, { useState } from "react";

const DiceRoller = ({ sendMessageToDM }) => {
  const [numDice, setNumDice] = useState(1);
  const [sides, setSides] = useState(6);
  const [result, setResult] = useState(null);

  const rollDice = () => {
    const rolls = Array.from({ length: numDice }, () =>
      Math.floor(Math.random() * sides) + 1
    );
    const total = rolls.reduce((a, b) => a + b, 0);
    const message = `🎲 Rolled ${numDice}d${sides}: [${rolls.join(", ")}] = ${total}`;
    setResult(message);
    sendMessageToDM(message); // Chat integration
  };

  return (
    <div className="dice-roller">
      <h3>Dice Roller</h3>
      <label>
        Number of Dice:
        <input
          type="number"
          value={numDice}
          min={1}
          max={20}
          onChange={(e) => setNumDice(parseInt(e.target.value))}
        />
      </label>
      <label>
        Sides:
        <select value={sides} onChange={(e) => setSides(parseInt(e.target.value))}>
          {[4, 6, 8, 10, 12, 20, 100].map((side) => (
            <option key={side} value={side}>{`d${side}`}</option>
          ))}
        </select>
      </label>
      <button onClick={rollDice}>Roll</button>
      {result && <p className="dice-result">{result}</p>}
    </div>
  );
};

export default DiceRoller;
