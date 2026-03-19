import React, { useState, useEffect, useRef } from "react";

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
  border: "#D6DCEF",
  text: "#1A1A2E",
  textLight: "#4A5272",
  muted: "#7986A3",
  tealLight: "#E0F7FA",
};

const CATEGORIES = [
  { emoji: "📶", label: "Internet & Wi-Fi", opener: "I'm having trouble with my internet or Wi-Fi connection." },
  { emoji: "📱", label: "Phone & Tablet", opener: "I'm having a problem with my phone or tablet." },
  { emoji: "💻", label: "Computer", opener: "I'm having a problem with my computer." },
  { emoji: "📧", label: "Email", opener: "I'm having trouble with my email." },
  { emoji: "🖨️", label: "Printer", opener: "I'm having trouble with my printer." },
  { emoji: "📺", label: "TV & Streaming", opener: "I'm having trouble with my TV or a streaming service." },
  { emoji: "🔐", label: "Passwords & Accounts", opener: "I'm having trouble with a password or account." },
  { emoji: "🔋", label: "Battery & Charging", opener: "I'm having trouble with my battery." },
];

function HelpTab() {
  const sz = React.useContext(SizeContext);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage(text, isOpener = false) {
    if (!text.trim() || loading) return;

    const newMessages = isOpener ? [] : [...messages, { role: "user", text }];
    if (!isOpener) {
      setMessages(newMessages);
      setInput("");
    }
    setLoading(true);

    // Format messages for the backend (must use 'content' for Claude)
    const apiMessages = isOpener 
      ? [{ role: "user", content: text }]
      : newMessages.map(m => ({ 
          role: m.role === "user" ? "user" : "assistant", 
          content: m.text 
        }));

    try {
      const res = await fetch("https://easyfix-backend.onrender.com/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      });

      const data = await res.json();
      if (data.reply) {
        setMessages(m => [...m, { role: "bot", text: data.reply }]);
      } else {
        throw new Error("Invalid response");
      }
    } catch (err) {
      setMessages(m => [...m, { role: "bot", text: "I'm having trouble connecting right now. Please try again! 😊" }]);
    } finally {
      setLoading(false);
    }
  }

  function selectCategory(cat) {
    setActiveCategory(cat);
    setMessages([]);
    sendMessage(cat.opener, true);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 120px)" }}>
      {/* Category Strip */}
      <div style={{ padding: "10px 12px", borderBottom: `1px solid ${COLORS.border}`, background: COLORS.card }}>
        {!activeCategory ? (
          <>
            <p style={{ fontSize: 11, fontWeight: "bold", color: COLORS.muted, textTransform: "uppercase", marginBottom: 8 }}>What do you need help with?</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
              {CATEGORIES.map(cat => (
                <button key={cat.label} onClick={() => selectCategory(cat)} style={{
                  background: "linear-gradient(135deg, #F0F4FF, #FAF0FF)", border: `1.5px solid ${COLORS.border}`,
                  borderRadius: 20, padding: `${sz.base - 8}px ${sz.base - 2}px`, fontSize: sz.base - 3,
                  cursor: "pointer", display: "flex", alignItems: "center", gap: 5, fontWeight: "500"
                }}>
                  <span>{cat.emoji}</span> {cat.label}
                </button>
              ))}
            </div>
          </>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button onClick={() => setActiveCategory(null)} style={{ background: "none", border: "none", fontSize: sz.base + 2, cursor: "pointer" }}>←</button>
            <span style={{ fontSize: sz.base - 1, fontWeight: "bold" }}>{activeCategory.label}</span>
            <button onClick={() => setActiveCategory(null)} style={{ marginLeft: "auto", background: COLORS.accentLight, border: "none", color: COLORS.accent, padding: "5px 12px", borderRadius: 20, fontSize: sz.base - 4, fontWeight: "bold", cursor: "pointer" }}>Change Topic</button>
          </div>
        )}
      </div>

      {/* Chat Area */}
      <div style={{ flex: 1, overflowY: "auto", padding: "14px", display: "flex", flexDirection: "column", background: "linear-gradient(180deg, #F0F4FF 0%, #FAF0FF 100%)" }}>
        {messages.length === 0 && !loading && (
          <div style={{ textAlign: "center", padding: "40px 24px", color: COLORS.muted }}>
            <div style={{ fontSize: 52, marginBottom: 10 }}>🛠️</div>
            <div style={{ fontSize: sz.base + 2, fontWeight: "bold", color: COLORS.text }}>Welcome to EasyFix!</div>
            <p style={{ fontSize: sz.base - 1 }}>Tap a category above or type a question below.</p>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} style={{
            background: m.role === "user" ? COLORS.navy : COLORS.card,
            color: m.role === "user" ? "white" : COLORS.text,
            padding: "14px 18px", borderRadius: 18, marginBottom: 10, maxWidth: "88%",
            alignSelf: m.role === "user" ? "flex-end" : "flex-start",
            fontSize: sz.base, boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            border: m.role === "bot" ? `1px solid ${COLORS.border}` : "none"
          }}>{m.text}</div>
        ))}
        {loading && <div style={{ background: COLORS.card, padding: "14px 18px", borderRadius: 18, alignSelf: "flex-start", fontSize: sz.base, color: COLORS.muted }}>Thinking... ⏳</div>}
        <div ref={chatEndRef} />
      </div>

      {/* Input Bar */}
      <div style={{ padding: "10px 12px 16px", background: "white", borderTop: `2px solid ${COLORS.border}`, display: "flex", gap: 8 }}>
        <input style={{ flex: 1, padding: "14px", borderRadius: 12, border: `2px solid ${COLORS.border}`, fontSize: sz.base, outline: "none" }} placeholder="Type here..." value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMessage(input)} />
        <button onClick={() => sendMessage(input)} disabled={!input.trim() || loading} style={{ background: COLORS.accent, color: "white", border: "none", borderRadius: 12, padding: "0 20px", fontWeight: "bold", opacity: loading ? 0.5 : 1 }}>➤</button>
      </div>
    </div>
  );
}

function SettingsTab({ sizeIdx, setSizeIdx }) {
  const sz = SIZE_PRESETS[sizeIdx];
  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ fontSize: sz.title, color: COLORS.navy }}>Settings</h2>
      <div style={{ background: "white", padding: "20px", borderRadius: 16, border: `1px solid ${COLORS.border}` }}>
        <p style={{ fontSize: sz.base, marginBottom: 15 }}>Adjust text size:</p>
        {SIZE_PRESETS.map((p, i) => (
          <button key={i} onClick={() => setSizeIdx(i)} style={{
            display: "flex", width: "100%", padding: "15px", marginBottom: 10, borderRadius: 12, border: "none",
            background: sizeIdx === i ? COLORS.accent : COLORS.bg, color: sizeIdx === i ? "white" : COLORS.text,
            fontSize: p.base, cursor: "pointer", fontWeight: "bold"
          }}>{p.label} {sizeIdx === i && "✓"}</button>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("help");
  const [sizeIdx, setSizeIdx] = useState(() => parseInt(localStorage.getItem("sg_size") || "1"));
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [isIOS, setIsIOS] = useState(/iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase()));

  useEffect(() => { localStorage.setItem("sg_size", sizeIdx); }, [sizeIdx]);

  const sz = SIZE_PRESETS[sizeIdx];

  return (
    <SizeContext.Provider value={sz}>
      <div style={{ fontFamily: "'Georgia', serif", minHeight: "100vh", maxWidth: 430, margin: "0 auto", background: COLORS.bg, display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <div style={{ background: COLORS.navy, padding: "20px", color: "white", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: sz.title }}>🆘 EasyFix</h1>
            <div style={{ fontSize: sz.base - 4, opacity: 0.7 }}>Simple tech answers</div>
          </div>
          <button onClick={() => setShowInstallModal(true)} style={{ background: COLORS.accent, border: "none", padding: "8px 12px", borderRadius: 10, color: "white", fontWeight: "bold", fontSize: 12 }}>Install</button>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", background: COLORS.navy }}>
          <button onClick={() => setTab("help")} style={{ flex: 1, padding: "12px", color: tab === "help" ? "white" : "#888", borderBottom: tab === "help" ? `3px solid ${COLORS.accent}` : "none", background: "none", border: "none", fontWeight: "bold", cursor: "pointer" }}>Get Help</button>
          <button onClick={() => setTab("settings")} style={{ flex: 1, padding: "12px", color: tab === "settings" ? "white" : "#888", borderBottom: tab === "settings" ? `3px solid ${COLORS.accent}` : "none", background: "none", border: "none", fontWeight: "bold", cursor: "pointer" }}>Settings</button>
        </div>

        {tab === "help" ? <HelpTab /> : <SettingsTab sizeIdx={sizeIdx} setSizeIdx={setSizeIdx} />}

        {/* Install Modal */}
        {showInstallModal && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
            <div style={{ background: "white", padding: 25, borderRadius: 20, maxWidth: 350 }}>
              <h3 style={{ marginTop: 0 }}>Install EasyFix</h3>
              <p style={{ fontSize: 14, color: "#666" }}>{isIOS ? "Tap 'Share' then 'Add to Home Screen' in Safari." : "Tap the menu dots then 'Install App' in Chrome."}</p>
              <button onClick={() => setShowInstallModal(false)} style={{ width: "100%", padding: 12, background: COLORS.accent, color: "white", border: "none", borderRadius: 10, fontWeight: "bold" }}>Got it!</button>
            </div>
          </div>
        )}
      </div>
    </SizeContext.Provider>
  );
}
