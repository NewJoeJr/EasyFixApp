import React, { useState, useEffect } from "react";

const SIZE_PRESETS = [
  { label: "Small", icon: "A", base: 13, heading: 18, title: 22, btn: 14, card: 14, step: 14, radius: 12, spacing: 14 },
  { label: "Normal", icon: "A", base: 16, heading: 22, title: 26, btn: 17, card: 16, step: 16, radius: 16, spacing: 18 },
  { label: "Large", icon: "A", base: 19, heading: 26, title: 30, btn: 20, card: 19, step: 19, radius: 18, spacing: 22 },
  { label: "X-Large", icon: "A", base: 23, heading: 31, title: 35, btn: 24, card: 23, step: 23, radius: 20, spacing: 26 },
];

const SizeContext = React.createContext(SIZE_PRESETS[1]);

const COLORS = {
  bg: "#F0F4FF",
  card: "#FFFFFF",
  navy: "#1A1A2E",
  accent: "#E040FB",
  accentLight: "#FAE5FF",
  green: "#00C853",
  muted: "#7986A3",
  border: "#D6DCEF",
  text: "#1A1A2E",
  textLight: "#4A5272",
  tealLight: "#E0F7FA",
};

const styles = {
  app: {
    fontFamily: "'Georgia', serif",
    background: "linear-gradient(180deg, #F0F4FF 0%, #FAF0FF 100%)",
    minHeight: "100vh",
    maxWidth: 430,
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    position: "relative",
  },
  headerTitle: { color: "#FFF", fontWeight: "bold", letterSpacing: "-0.5px", margin: 0 },
  headerSub: { color: "rgba(255,255,255,0.55)", marginTop: 2 },
  sectionLabel: { fontSize: 11, fontFamily: "sans-serif", letterSpacing: 1.5, color: COLORS.muted, fontWeight: "bold", textTransform: "uppercase", marginBottom: 12, marginLeft: 4 },
  card: { background: COLORS.card, borderRadius: 16, padding: "18px 20px", marginBottom: 12, boxShadow: "0 2px 12px rgba(27,42,74,0.07)", border: `1px solid ${COLORS.border}` },
  input: { width: "100%", padding: "14px 16px", border: `2px solid ${COLORS.border}`, borderRadius: 12, background: "#FAFAF8", color: COLORS.text, fontFamily: "'Georgia', serif", boxSizing: "border-box", outline: "none" },
  btn: { width: "100%", padding: "16px", fontWeight: "bold", borderRadius: 14, border: "none", cursor: "pointer", fontFamily: "'Georgia', serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 },
  btnPrimary: { background: "linear-gradient(135deg, #E040FB 0%, #7C4DFF 100%)", color: "#fff", boxShadow: "0 4px 16px rgba(224,64,251,0.35)" },
  bubble: { borderRadius: 18, padding: "14px 18px", marginBottom: 10, maxWidth: "88%", lineHeight: 1.55, fontFamily: "sans-serif" },
  bubbleUser: { background: COLORS.navy, color: "#fff", alignSelf: "flex-end", marginLeft: "auto", borderBottomRightRadius: 4 },
  bubbleBot: { background: COLORS.card, color: COLORS.text, border: `1px solid ${COLORS.border}`, borderBottomLeftRadius: 4, boxShadow: "0 2px 8px rgba(27,42,74,0.06)" },
  tipBox: { borderRadius: 14, padding: "14px 16px", marginBottom: 12, display: "flex", gap: 12, alignItems: "flex-start" },
  tipText: { fontFamily: "sans-serif", lineHeight: 1.5 },
};

// ── Help Tab ─────────────────────────────────────────────────

const CATEGORIES = [
  { emoji: "📶", label: "Internet & Wi-Fi", opener: "I'm having trouble with my internet or Wi-Fi connection." },
  { emoji: "📱", label: "Phone & Tablet", opener: "I'm having a problem with my phone or tablet." },
  { emoji: "💻", label: "Computer", opener: "I'm having a problem with my computer." },
  { emoji: "📧", label: "Email", opener: "I'm having trouble with my email." },
  { emoji: "🖨️", label: "Printer", opener: "I'm having trouble with my printer." },
  { emoji: "📺", label: "TV & Streaming", opener: "I'm having trouble with my TV or streaming service." },
  { emoji: "🔐", label: "Passwords & Accounts", opener: "I'm having trouble with a password or account." },
  { emoji: "🔋", label: "Battery & Charging", opener: "I'm having trouble with my battery or charging." },
];

function HelpTab() {
  const sz = React.useContext(SizeContext);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const chatEndRef = React.useRef(null);

  React.useEffect(() => {
    if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage(text, isOpener = false) {
    if (!text.trim() || loading) return;

    const allMessages = isOpener ? [] : [...messages, { role: "user", text }];
    if (!isOpener) {
      setMessages(allMessages);
      setInput("");
    }
    setLoading(true);

    const apiMessages = isOpener
      ? [{ role: "user", content: text }]
      : allMessages.map(m => ({ role: m.role === "user" ? "user" : "assistant", content: m.text }));

    try {
      // Updated to point to your Render backend
      const res = await fetch("https://easyfix-backend.onrender.com/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      });

      const data = await res.json();
      if (data.reply) {
        setMessages(m => [...m, { role: "bot", text: data.reply }]);
      } else {
        throw new Error("No reply");
      }
    } catch (err) {
      setMessages(m => [...m, { role: "bot", text: "I'm having trouble connecting right now. Please try again! 😊" }]);
    }
    setLoading(false);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 115px)" }}>
      <div style={{ padding: "10px 12px 8px", borderBottom: `1px solid ${COLORS.border}`, flexShrink: 0, background: COLORS.card }}>
        {!activeCategory ? (
          <>
            <p style={{ ...styles.sectionLabel, fontSize: sz.base - 5 }}>What do you need help with?</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
              {CATEGORIES.map(cat => (
                <button key={cat.label} onClick={() => { setActiveCategory(cat); setMessages([]); sendMessage(cat.opener, true); }} style={{ background: "linear-gradient(135deg, #F0F4FF, #FAF0FF)", border: `1.5px solid ${COLORS.border}`, borderRadius: 20, padding: `${sz.base - 8}px ${sz.base - 2}px`, fontSize: sz.base - 3, cursor: "pointer", display: "flex", alignItems: "center", gap: 5, fontWeight: "500" }}>
                  <span>{cat.emoji}</span> {cat.label}
                </button>
              ))}
            </div>
          </>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button onClick={() => setActiveCategory(null)} style={{ background: "none", border: "none", fontSize: sz.base + 2, color: COLORS.muted }}>←</button>
            <span style={{ fontSize: sz.base - 1, fontWeight: "bold" }}>{activeCategory.label}</span>
            <button onClick={() => setActiveCategory(null)} style={{ marginLeft: "auto", background: COLORS.accentLight, border: "none", color: COLORS.accent, padding: "5px 12px", borderRadius: 20, fontSize: sz.base - 4, fontWeight: "bold" }}>Change Topic</button>
          </div>
        )}
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "14px", display: "flex", flexDirection: "column" }}>
        {messages.length === 0 && !loading && (
          <div style={{ textAlign: "center", padding: "40px 24px", color: COLORS.muted }}>
            <div style={{ fontSize: 52 }}>🛠️</div>
            <div style={{ fontSize: sz.base + 2, fontWeight: "bold", color: COLORS.text }}>Welcome to EasyFix!</div>
            <p style={{ fontSize: sz.base - 1 }}>Tap a category above or type a question below.</p>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} style={{ ...styles.bubble, ...(m.role === "user" ? styles.bubbleUser : styles.bubbleBot), fontSize: sz.base }}>{m.text}</div>
        ))}
        {loading && <div style={{ ...styles.bubble, ...styles.bubbleBot, color: COLORS.muted, fontSize: sz.base }}>Thinking... ⏳</div>}
        <div ref={chatEndRef} />
      </div>

      <div style={{ padding: "10px 12px 16px", background: COLORS.card, borderTop: `2px solid ${COLORS.border}`, display: "flex", gap: 8 }}>
        <input style={{ ...styles.input, fontSize: sz.base }} placeholder="Type your question here..." value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMessage(input)} disabled={loading} />
        <button onClick={() => sendMessage(input)} disabled={!input.trim() || loading} style={{ ...styles.btn, ...styles.btnPrimary, width: sz.btn + 28, height: sz.btn + 28, borderRadius: sz.radius, opacity: (!input.trim() || loading) ? 0.5 : 1 }}>➤</button>
      </div>
    </div>
  );
}

// ── Settings & Root ──────────────────────────────────────────

function SettingsTab({ sizeIdx, setSizeIdx }) {
  const sz = SIZE_PRESETS[sizeIdx];
  return (
    <div style={{ padding: "24px 16px" }}>
      <p style={{ ...styles.sectionLabel, fontSize: sz.base - 4 }}>Text size</p>
      <div style={styles.card}>
        {SIZE_PRESETS.map((preset, i) => (
          <button key={preset.label} onClick={() => setSizeIdx(i)} style={{ display: "flex", width: "100%", padding: "12px", marginBottom: 8, borderRadius: 10, border: "none", background: i === sizeIdx ? COLORS.accent : COLORS.bg, color: i === sizeIdx ? "#fff" : COLORS.text, cursor: "pointer" }}>
            {preset.label} {i === sizeIdx && "✓"}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("help");
  const [sizeIdx, setSizeIdx] = useState(() => parseInt(localStorage.getItem("sg_size") || "1"));
  useEffect(() => { localStorage.setItem("sg_size", sizeIdx); }, [sizeIdx]);
  const sz = SIZE_PRESETS[sizeIdx];

  return (
    <SizeContext.Provider value={sz}>
      <div style={styles.app}>
        <div style={{ background: COLORS.navy, padding: "20px", color: "#fff" }}>
          <h1 style={{ ...styles.headerTitle, fontSize: sz.title }}>🆘 EasyFix</h1>
          <div style={{ ...styles.headerSub, fontSize: sz.base - 3 }}>Simple answers to tech problems</div>
        </div>
        <div style={{ display: "flex", background: COLORS.navy }}>
          <button onClick={() => setTab("help")} style={{ flex: 1, padding: "12px", color: tab === "help" ? "#fff" : "#888", borderBottom: tab === "help" ? `3px solid ${COLORS.accent}` : "none", background: "none", border: "none", cursor: "pointer" }}>Get Help</button>
          <button onClick={() => setTab("settings")} style={{ flex: 1, padding: "12px", color: tab === "settings" ? "#fff" : "#888", borderBottom: tab === "settings" ? `3px solid ${COLORS.accent}` : "none", background: "none", border: "none", cursor: "pointer" }}>Settings</button>
        </div>
        {tab === "help" ? <HelpTab /> : <SettingsTab sizeIdx={sizeIdx} setSizeIdx={setSizeIdx} />}
      </div>
    </SizeContext.Provider>
  );
}
