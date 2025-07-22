import React, { useState } from "react";
import "./App.css";

function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const sendPrompt = () => {
    if (!input.trim()) return;
  
    const userMessage = { from: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
  
    let fullResponse = "";
    setMessages((prev) => [...prev, { from: "dm", text: "" }]);
  
    const eventSource = new EventSource(
      `http://localhost:8080/api/stream?prompt=${encodeURIComponent(input)}`
    );
  
    eventSource.onmessage = (event) => {
      if (!event.data || event.data === "[DONE]") {
        eventSource.close();
        return;
      }
    
      try {
        // Parse the incoming JSON event string
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
    
      // Only show error if we got no tokens at all
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

  return (
    <div className="App">
      <h2>Virtual Dungeon Master</h2>
      <textarea
        rows={3}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Describe the lair of the red dragon..."
      />
      <button onClick={sendPrompt}>Send</button>

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
  );
}

export default App;
