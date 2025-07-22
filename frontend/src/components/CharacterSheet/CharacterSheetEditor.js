import React, { useEffect, useState } from "react";
import { loadCharacterFromBackend } from "../../loadCharacter";
import { saveCharacterToBackend } from "../../saveCharacter";


function CharacterSheetEditor({ character, onSave }) {
  const [formData, setFormData] = useState({ ...character });

  const defaultCharacter = {
    name: "",
    race: "",
    class: "",
    level: 1,
    stats: {
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10,
    },
    equipment: [],
    background: "",
  };

  // Load character data from backend on mount
  useEffect(() => {
    async function fetchCharacter() {
      try {
        const loaded = await loadCharacterFromBackend();
        if (loaded) {
          setFormData({
            ...defaultCharacter,
            ...loaded,
            stats: { ...defaultCharacter.stats, ...loaded.stats },
            equipment: loaded.equipment ?? [],
          });
        }
      } catch (error) {
        console.error("Failed to load character:", error);
      }
    }
  
    fetchCharacter();
  }, []);
  

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleStatChange = (stat, value) => {
    const intVal = parseInt(value) || 0;
    setFormData((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        [stat]: intVal,
      },
    }));
  };

  const handleEquipmentChange = (index, value) => {
    const updated = [...formData.equipment];
    updated[index] = value;
    setFormData((prev) => ({ ...prev, equipment: updated }));
  };

  const addEquipment = () => {
    setFormData((prev) => ({
      ...prev,
      equipment: [...prev.equipment, ""],
    }));
  };

  const removeEquipment = (index) => {
    const updated = [...formData.equipment];
    updated.splice(index, 1);
    setFormData((prev) => ({ ...prev, equipment: updated }));
  };

  const handleSave = async () => {
    try {
        await saveCharacterToBackend(formData);     // persist to backend
      onSave(formData);                  // update parent
    } catch (err) {
      console.error("Failed to save character:", err);
    }
  };

  return (
    <div className="character-editor">
      <label>
        Name:
        <input
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />
      </label>

      <label>
        Race:
        <input
          value={formData.race}
          onChange={(e) => handleChange("race", e.target.value)}
        />
      </label>

      <label>
        Class:
        <input
          value={formData.class}
          onChange={(e) => handleChange("class", e.target.value)}
        />
      </label>

      <label>
        Level:
        <input
          type="number"
          value={formData.level}
          onChange={(e) => handleChange("level", parseInt(e.target.value))}
        />
      </label>

      <h4>Stats</h4>
      {Object.keys(formData.stats).map((stat) => (
        <label key={stat}>
          {stat}:
          <input
            type="number"
            value={formData.stats[stat]}
            onChange={(e) => handleStatChange(stat, e.target.value)}
          />
        </label>
      ))}

      <h4>Equipment</h4>
      {formData.equipment.map((item, index) => (
        <div key={index} style={{ display: "flex", alignItems: "center" }}>
          <input
            value={item}
            onChange={(e) => handleEquipmentChange(index, e.target.value)}
          />
          <button type="button" onClick={() => removeEquipment(index)}>
            ✕
          </button>
        </div>
      ))}
      <button type="button" onClick={addEquipment}>
        + Add Equipment
      </button>

      <label>
        Background:
        <input
          value={formData.background}
          onChange={(e) => handleChange("background", e.target.value)}
        />
      </label>

      <div style={{ marginTop: "1rem" }}>
        <button onClick={() => saveCharacterToBackend(formData)}>Save</button>
    </div>


    </div>
  );
}

export default CharacterSheetEditor;
