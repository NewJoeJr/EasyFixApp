import React, { useState, useEffect } from "react";

const SIZE_PRESETS = [
  { label: "Small", base: 14, title: 22, spacing: 12 },
  { label: "Normal", base: 17, title: 26, spacing: 16 },
  { label: "Large", base: 20, title: 30, spacing: 20 },
  { label: "X-Large", base: 24, title: 34, spacing: 24 },
];

const COLORS = {
  bg: "#F0F4FF",
  card: "#FFFFFF",
  navy: "#1A1A2E",
  accent: "#E040FB",
  border: "#D6DCEF",
  text: "#1A1A2E",
};

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sizeIdx, setSizeIdx] = useState(1); // Default to "Normal"

  const sz = SIZE_PRESETS[sizeIdx];

  async function sendMessage(text) {
    if (!text.trim() || loading) return;

    const newMessages = [...messages, { role: "user", text }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("https://easyfix-backend.onrender.com/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map(m => ({
            role: m.role === "user" ? "user" : "assistant",
            content: m.text
          }))
        }),
      });

      const data = await res.json();
      if (data.reply) {
        setMessages(prev => [...prev, { role: "bot", text: data.reply }]);
      } else {
        throw new Error("No reply");
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: "bot", text: "I'm having trouble connecting. Please try again! 😊" }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ 
      background: COLORS.bg, 
      minHeight: "100vh", 
      display: "flex", 
      flexDirection: "column", 
      fontFamily: "'Georgia', serif",
      width: "100%" 
    }}>
      {/* Responsive Header */}
      <header style={{ 
        background: COLORS.navy, 
        color: "white", 
        padding: `${sz.spacing}px`, 
        textAlign: "center",
        boxShadow: "0 2px 10px rgba(0,0,0,0.2)"
      }}>
        <h1 style={{ margin: 0, fontSize: sz.title }}>🆘 EasyFix</h1>
        <div style={{ marginTop: "10px", display: "flex", justifyContent: "center", gap: "10px" }}>
          {SIZE_PRESETS.map((p, i) => (
            <button 
              key={p.label} 
              onClick={() => setSizeIdx(i)}
              style={{
                background: sizeIdx === i ? COLORS.accent : "transparent",
                border: `1px solid ${COLORS.accent}`,
                color: "white",
                borderRadius: "5px",
                padding: "4px 8px",
                fontSize: "12px",
                cursor: "pointer"
              }}
            >
              {p.label[0]}
            </button>
          ))}
        </div>
      </header>

      {/* Main Chat Area - Centered for larger screens */}
      <div style={{ 
        flex: 1, 
        width: "100%", 
        maxWidth: "800px", // Limits width on desktop so it doesn't look stretched
        margin: "0 auto", 
        padding: `${sz.spacing}px`,
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        overflowY: "auto"
      }}>
        {messages.map((m, i) => (
          <div key={i} style={{
            alignSelf: m.role === "user" ? "flex-end" : "flex-start",
            background: m.role === "user" ? COLORS.navy : COLORS.card,
            color: m.role === "user" ? "white" : COLORS.text,
            padding: "15px 20px",
            borderRadius: "18px",
            fontSize: sz.base,
            maxWidth: "85%",
            lineHeight: "1.5",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            border: m.role === "bot" ? `1px solid ${COLORS.border}` : "none"
          }}>
            {m.text}
          </div>
        ))}
        {loading && <div style={{ fontSize: sz.base, color: "#888" }}>Thinking... ⏳</div>}
      </div>

      {/* Responsive Input Bar */}
      <div style={{ 
        background: "white", 
        padding: `${sz.spacing}px`, 
        borderTop: `2px solid ${COLORS.border}`,
        display: "flex",
        justifyContent: "center"
      }}>
        <div style={{ width: "100%", maxWidth: "800px", display: "flex", gap: "10px" }}>
          <input 
            style={{ 
              flex: 1, 
              padding: "14px", 
              fontSize: sz.base, 
              borderRadius: "12px", 
              border: `2px solid ${COLORS.border}`,
              outline: "none"
            }}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
            placeholder="Type your question..."
          />
          <button 
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || loading}
            style={{ 
              background: COLORS.accent, 
              color: "white", 
              border: "none", 
              padding: "0 25px", 
              borderRadius: "12px", 
              fontSize: sz.base,
              fontWeight: "bold", 
              cursor: "pointer", 
              opacity: loading ? 0.5 : 1 
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
