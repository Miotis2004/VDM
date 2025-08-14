import React from "react";

function CharacterSheetViewer({ character, onEdit, onStartAdventure }) {
  return (
    <div className="character-viewer">
      <div className="button-group">
        <button onClick={onEdit} className="btn">Edit</button>
        <button onClick={() => onStartAdventure(character)} className="btn btn-purple">Start Adventure</button>
      </div>
      <h3>{character.name || "Unnamed Hero"}</h3>
      <p><strong>Race:</strong> {character.race}</p>
      <p><strong>Class:</strong> {character.class}</p>
      <p><strong>Level:</strong> {character.level}</p>
      <p><strong>Background:</strong> {character.background}</p>
      <p><strong>Stats:</strong></p>
      <ul>
        {Object.entries(character.stats).map(([stat, value]) => (
          <li key={stat}><strong>{stat}</strong>: {value}</li>
        ))}
      </ul>
      <p><strong>Equipment:</strong></p>
      <ul>
        {character.equipment.length > 0 ? (
          character.equipment.map((item, idx) => <li key={idx}>{item}</li>)
        ) : (
          <li>None</li>
        )}
      </ul>
    </div>
  );
}

export default CharacterSheetViewer;
