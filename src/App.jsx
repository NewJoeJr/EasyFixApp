import React, { useState, useEffect, useRef } from "react";

const SIZE_PRESETS = [
  { label: "Small", base: 14, title: 20, spacing: 12, radius: 10 },
  { label: "Normal", base: 17, title: 24, spacing: 16, radius: 14 },
  { label: "Large", base: 20, title: 28, spacing: 20, radius: 18 },
  { label: "X-Large", base: 24, title: 32, spacing: 24, radius: 22 },
];

const COLORS = {
  bg: "#F0F4FF",
  card: "#FFFFFF",
  navy: "#1A1A2E",
  accent: "#E040FB",
  border: "#D6DCEF",
  text: "#1A1A2E",
  muted: "#7986A3",
};

const CATEGORIES = [
  { emoji: "📶", label: "Internet", opener: "I'm having trouble with my internet or Wi-Fi." },
  { emoji: "📱", label: "Phone", opener: "I'm having a problem with my phone or tablet." },
  { emoji: "💻", label: "Computer", opener: "I'm having a problem with my computer." },
  { emoji: "📧", label: "Email", opener: "I'm having trouble with my email." },
  { emoji: "🖨️", label: "Printer", opener: "I'm having trouble with my printer." },
  { emoji: "📺", label: "TV", opener: "I'm having trouble with my TV or streaming." },
];

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sizeIdx, setSizeIdx] = useState(1);
  const [activeCategory, setActiveCategory] = useState(null);
  const chatEndRef = useRef(null);

  const sz = SIZE_PRESETS[sizeIdx];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage(text, isFirstMsg = false) {
    if (!text.trim() || loading) return;

    const newMessages = isFirstMsg ? [] : [...messages, { role: "user", text }];
    if (!isFirstMsg) {
      setMessages(newMessages);
      setInput("");
    }
    setLoading(true);

    try {
      const res = await fetch("https://easyfix-backend.onrender.com/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: isFirstMsg 
            ? [{ role: "user", content: text }]
            : newMessages.map(m => ({ role: m.role === "user" ? "user" : "assistant", content: m.text }))
        }),
      });

      const data = await res.json();
      if (data.reply) {
        setMessages(prev => [...prev, { role: "bot", text: data.reply }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: "bot", text: "I'm having trouble connecting. Try again! 😊" }]);
    } finally {
      setLoading(false);
    }
  }

  const startTopic = (cat) => {
    setActiveCategory(cat);
    setMessages([]);
    sendMessage(cat.opener, true);
  };

  return (
    <div style={{ background: COLORS.bg, minHeight: "100vh", display: "flex", flexDirection: "column", fontFamily: "sans-serif" }}>
      <header style={{ background: COLORS.navy, color: "white", padding: "15px 20px", textAlign: "center" }}>
        <h1 style={{ margin: 0, fontSize: sz.title }}>🆘 EasyFix</h1>
        <div style={{ marginTop: "8px", display: "flex", justifyContent: "center", gap: "8px" }}>
          {SIZE_PRESETS.map((p, i) => (
            <button key={i} onClick={() => setSizeIdx(i)} style={{ background: sizeIdx === i ? COLORS.accent : "transparent", border: `1px solid ${COLORS.accent}`, color: "white", borderRadius: "4px", padding: "2px 8px", fontSize: "12px", cursor: "pointer" }}>{p.label[0]}</button>
          ))}
        </div>
      </header>

      <div style={{ flex: 1, width: "100%", maxWidth: "700px", margin: "0 auto", display: "flex", flexDirection: "column", padding: "15px" }}>
        {/* Category Buttons */}
        {!activeCategory && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "10px", marginTop: "20px" }}>
            {CATEGORIES.map(cat => (
              <button key={cat.label} onClick={() => startTopic(cat)} style={{ background: "white", border: `1px solid ${COLORS.border}`, padding: "20px", borderRadius: sz.radius, cursor: "pointer", fontSize: sz.base, textAlign: "center", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
                <div style={{ fontSize: "30px", marginBottom: "5px" }}>{cat.emoji}</div>
                <div style={{ fontWeight: "bold" }}>{cat.label}</div>
              </button>
            ))}
          </div>
        )}

        {/* Chat Messages */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {activeCategory && (
            <button onClick={() => setActiveCategory(null)} style={{ alignSelf: "flex-start", background: "none", border: "none", color: COLORS.accent, fontWeight: "bold", cursor: "pointer", marginBottom: "10px" }}>← Back to Topics</button>
          )}
          {messages.map((m, i) => (
            <div key={i} style={{ alignSelf: m.role === "user" ? "flex-end" : "flex-start", background: m.role === "user" ? COLORS.navy : COLORS.card, color: m.role === "user" ? "white" : COLORS.text, padding: "12px 16px", borderRadius: "15px", fontSize: sz.base, maxWidth: "85%", border: m.role === "bot" ? `1px solid ${COLORS.border}` : "none", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>{m.text}</div>
          ))}
          {loading && <div style={{ fontSize: sz.base, color: COLORS.muted }}>Thinking... ⏳</div>}
          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Input Bar */}
      <div style={{ background: "white", padding: "15px", borderTop: `1px solid ${COLORS.border}`, display: "flex", justifyContent: "center" }}>
        <div style={{ width: "100%", maxWidth: "700px", display: "flex", gap: "10px" }}>
          <input style={{ flex: 1, padding: "12px", fontSize: sz.base, borderRadius: sz.radius, border: `2px solid ${COLORS.border}`, outline: "none" }} value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMessage(input)} placeholder="Type here..." />
          <button onClick={() => sendMessage(input)} disabled={!input.trim() || loading} style={{ background: COLORS.accent, color: "white", border: "none", padding: "0 20px", borderRadius: sz.radius, fontWeight: "bold", cursor: "pointer", opacity: loading ? 0.5 : 1 }}>Send</button>
        </div>
      </div>
    </div>
  );
}
