import React, { useState } from "react";
import "./App.css";
import CharacterSheetViewer from "./components/CharacterSheet/CharacterSheetViewer";
import CharacterSheetEditor from "./components/CharacterSheet/CharacterSheetEditor";
import DiceRoller from "./components/DiceRoller";

function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

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

  const [character, setCharacter] = useState(defaultCharacter);
  const [activeTab, setActiveTab] = useState("view");

  const sendPrompt = (overridePrompt = null) => {
    const promptToSend = overridePrompt || input;
    if (!promptToSend.trim()) return;

    const userMessage = { from: "user", text: promptToSend };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    let fullResponse = "";
    setMessages((prev) => [...prev, { from: "dm", text: "" }]);

    const eventSource = new EventSource(
      `http://localhost:8080/api/stream?prompt=${encodeURIComponent(promptToSend)}`
    );

    eventSource.onmessage = (event) => {
      if (!event.data || event.data === "[DONE]") {
        eventSource.close();
        return;
      }

      try {
        const parsed = JSON.parse(event.data);
        const token = parsed.response;

        if (token) {
          fullResponse += token;

          setMessages((prev) => {
            const updated = [...prev];
            const last = updated[updated.length - 1];
            if (last.from === "dm") {
              updated[updated.length - 1] = { ...last, text: fullResponse };
            }
            return updated;
          });
        }
      } catch (err) {
        console.error("JSON Parse Error:", err);
      }
    };

    eventSource.onerror = (err) => {
      console.error("SSE Error:", err);
      eventSource.close();

      if (!fullResponse.trim()) {
        setMessages((prev) => [
          ...prev,
          { from: "dm", text: "⚠️ Error communicating with the DM." },
        ]);
      }
    };
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendPrompt();
  };

  const startAdventure = () => {
    const prompt = `
The following is the character I will be playing:
Name: ${character.name}
Race: ${character.race}
Class: ${character.class}
Level: ${character.level}
Stats: ${Object.entries(character.stats).map(([k, v]) => `${k}: ${v}`).join(", ")}
Equipment: ${character.equipment.join(", ")}
Background: ${character.background}

Start a simple D&D-style adventure for this character. Set the scene and ask me what I want to do.
    `.trim();

    sendPrompt(prompt);
  };

  return (
    <div className="main-container">
      <div className="chat-panel">
        <h2>Virtual Dungeon Master</h2>
        <textarea
          rows={3}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe the lair of the red dragon..."
        />
        <button onClick={() => sendPrompt()}>Send</button>

        <div className="messages">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${msg.from === "user" ? "user" : "dm"}`}
            >
              <strong>{msg.from === "user" ? "You" : "DM"}:</strong>{" "}
              <span>{msg.text}</span>
            </div>
          ))}
        </div>
      </div>

      <DiceRoller sendMessageToDM={(msg) => {
        setMessages(prev => [...prev, { from: "user", text: msg }]);
      }} />

      <div className="character-panel">
        <div className="tabs">
          <button
            className={activeTab === "view" ? "active" : ""}
            onClick={() => setActiveTab("view")}
          >
            View
          </button>
          <button
            className={activeTab === "edit" ? "active" : ""}
            onClick={() => setActiveTab("edit")}
          >
            Edit
          </button>
        </div>

        <div className="tab-content">
          {activeTab === "view" ? (
            <>
              <CharacterSheetViewer character={character} />
              <button onClick={startAdventure} style={{ marginTop: "1rem" }}>
                🎲 Start Adventure
              </button>
            </>
          ) : (
            <CharacterSheetEditor character={character} onSave={setCharacter} />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
