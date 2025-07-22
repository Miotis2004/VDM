import React from "react";

function CharacterSheetViewer({ character }) {
  return (
    <div className="character-sheet">
      <h3>{character.name}</h3>
      <p><strong>Race:</strong> {character.race}</p>
      <p><strong>Class:</strong> {character.class}</p>
      <p><strong>Level:</strong> {character.level}</p>

      <h4>Stats</h4>
      <ul>
        {Object.entries(character.stats).map(([key, value]) => (
          <li key={key}>{key}: {value}</li>
        ))}
      </ul>

      <h4>Equipment</h4>
      <ul>
        {character.equipment.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>

      <p><strong>Background:</strong> {character.background}</p>
    </div>
  );
}

export default CharacterSheetViewer;
