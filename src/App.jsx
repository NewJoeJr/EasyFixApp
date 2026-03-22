import React, { useState, useEffect, useRef } from "react";

const SIZE_PRESETS = [
  { label: "Small",  base: 13, heading: 18, title: 20, radius: 10, spacing: 12 },
  { label: "Normal", base: 16, heading: 21, title: 24, radius: 12, spacing: 16 },
  { label: "Large",  base: 19, heading: 25, title: 28, radius: 14, spacing: 20 },
  { label: "X-Large",base: 23, heading: 30, title: 33, radius: 16, spacing: 24 },
];

const SizeContext = React.createContext(SIZE_PRESETS[1]);

const C = {
  bg:        "#F4F7FD",
  white:     "#FFFFFF",
  blue:      "#1D4ED8",
  blueMid:   "#3B82F6",
  blueLight: "#DBEAFE",
  blueFaint: "#EFF6FF",
  text:      "#0F172A",
  textMid:   "#334155",
  muted:     "#94A3B8",
  border:    "#CBD5E1",
};

const CATEGORIES = [
  { emoji: "📶", label: "Internet & Wi-Fi",      opener: "I'm having trouble with my internet or Wi-Fi connection." },
  { emoji: "📱", label: "Phone & Tablet",         opener: "I'm having a problem with my phone or tablet." },
  { emoji: "💻", label: "Computer",               opener: "I'm having a problem with my computer." },
  { emoji: "📧", label: "Email",                  opener: "I'm having trouble with my email." },
  { emoji: "🖨️", label: "Printer",               opener: "I'm having trouble with my printer." },
  { emoji: "📺", label: "TV & Streaming",         opener: "I'm having trouble with my TV or a streaming service." },
  { emoji: "🔐", label: "Passwords & Accounts",   opener: "I'm having trouble with a password or account." },
  { emoji: "🔋", label: "Battery & Charging",     opener: "I'm having trouble with my battery." },
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

    const apiMessages = isOpener
      ? [{ role: "user", content: text }]
      : newMessages.map(m => ({
          role: m.role === "user" ? "user" : "assistant",
          content: m.text,
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
    } catch {
      setMessages(m => [...m, { role: "bot", text: "Couldn't connect right now. Please try again." }]);
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
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 110px)" }}>
      {/* Topic selector or active topic bar */}
      <div style={{ background: C.white, borderBottom: `1px solid ${C.border}`, padding: "14px 16px" }}>
        {!activeCategory ? (
          <>
            <p style={{ fontSize: sz.base - 2, color: C.muted, marginBottom: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Choose a topic
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {CATEGORIES.map(cat => (
                <button
                  key={cat.label}
                  onClick={() => selectCategory(cat)}
                  style={{
                    background: C.blueFaint,
                    border: `1px solid ${C.blueLight}`,
                    borderRadius: sz.radius,
                    padding: "10px 12px",
                    fontSize: sz.base - 2,
                    fontWeight: 600,
                    color: C.blue,
                    cursor: "pointer",
                    textAlign: "left",
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                  }}
                >
                  <span style={{ fontSize: sz.base + 2 }}>{cat.emoji}</span>
                  {cat.label}
                </button>
              ))}
            </div>
          </>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: sz.base + 2 }}>{activeCategory.emoji}</span>
            <span style={{ fontSize: sz.base, fontWeight: 700, color: C.text }}>{activeCategory.label}</span>
            <button
              onClick={() => { setActiveCategory(null); setMessages([]); }}
              style={{
                marginLeft: "auto",
                fontSize: sz.base - 3,
                background: C.blueLight,
                color: C.blue,
                border: "none",
                borderRadius: 20,
                padding: "5px 12px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Change Topic
            </button>
          </div>
        )}
      </div>

      {/* Chat area */}
      <div style={{
        flex: 1, overflowY: "auto", padding: "16px",
        display: "flex", flexDirection: "column", background: C.bg,
      }}>
        {messages.length === 0 && !loading && (
          <div style={{ textAlign: "center", paddingTop: 60, color: C.muted }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🛠️</div>
            <div style={{ fontSize: sz.heading, fontWeight: 700, color: C.textMid, marginBottom: 6 }}>
              Welcome to EasyFix
            </div>
            <div style={{ fontSize: sz.base - 1 }}>Select a topic above or type your question below.</div>
          </div>
        )}

        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              background: m.role === "user" ? C.blue : C.white,
              color: m.role === "user" ? C.white : C.text,
              border: m.role === "bot" ? `1px solid ${C.border}` : "none",
              padding: "12px 16px",
              borderRadius: sz.radius + 4,
              marginBottom: 10,
              maxWidth: "86%",
              alignSelf: m.role === "user" ? "flex-end" : "flex-start",
              fontSize: sz.base,
              lineHeight: 1.55,
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
            }}
          >
            {m.text}
          </div>
        ))}

        {loading && (
          <div style={{
            background: C.white, border: `1px solid ${C.border}`,
            padding: "12px 16px", borderRadius: sz.radius + 4,
            alignSelf: "flex-start", fontSize: sz.base, color: C.muted,
          }}>
            Thinking…
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input bar */}
      <div style={{
        display: "flex", gap: 8, padding: "10px 14px 16px",
        background: C.white, borderTop: `1px solid ${C.border}`,
      }}>
        <input
          style={{
            flex: 1, padding: "13px 14px", borderRadius: sz.radius,
            border: `1.5px solid ${C.border}`, fontSize: sz.base,
            outline: "none", color: C.text, background: C.bg,
          }}
          placeholder="Type your question…"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage(input)}
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={!input.trim() || loading}
          style={{
            background: C.blue, color: C.white, border: "none",
            borderRadius: sz.radius, padding: "0 20px",
            fontWeight: 700, fontSize: sz.base,
            opacity: (!input.trim() || loading) ? 0.45 : 1,
            cursor: "pointer",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

function SettingsTab({ sizeIdx, setSizeIdx }) {
  const sz = SIZE_PRESETS[sizeIdx];
  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ fontSize: sz.heading, color: C.blue, marginBottom: 16 }}>Settings</h2>
      <div style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.border}`, overflow: "hidden" }}>
        <p style={{ fontSize: sz.base - 1, color: C.muted, padding: "14px 16px 0", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
          Text Size
        </p>
        {SIZE_PRESETS.map((p, i) => (
          <button
            key={i}
            onClick={() => setSizeIdx(i)}
            style={{
              display: "flex", width: "100%", padding: "14px 16px",
              borderTop: i > 0 ? `1px solid ${C.border}` : "none",
              background: sizeIdx === i ? C.blueFaint : "transparent",
              border: "none", color: sizeIdx === i ? C.blue : C.text,
              fontSize: p.base, cursor: "pointer", fontWeight: sizeIdx === i ? 700 : 400,
              textAlign: "left", alignItems: "center", justifyContent: "space-between",
            }}
          >
            {p.label}
            {sizeIdx === i && <span style={{ fontSize: p.base - 2, color: C.blueMid }}>✓ Selected</span>}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("help");
  const [sizeIdx, setSizeIdx] = useState(() => parseInt(localStorage.getItem("sg_size") || "1"));
  const [showInstallModal, setShowInstallModal] = useState(false);
  const isIOS = /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());

  useEffect(() => { localStorage.setItem("sg_size", sizeIdx); }, [sizeIdx]);

  const sz = SIZE_PRESETS[sizeIdx];

  return (
    <SizeContext.Provider value={sz}>
      <div style={{
        fontFamily: "'Georgia', serif", minHeight: "100vh",
        maxWidth: 430, margin: "0 auto", background: C.bg,
        display: "flex", flexDirection: "column",
      }}>
        {/* Header */}
        <div style={{
          background: C.blue, padding: "16px 20px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <div>
            <h1 style={{ margin: 0, fontSize: sz.title, color: C.white, fontWeight: 800, letterSpacing: "-0.01em" }}>
              EasyFix
            </h1>
            <div style={{ fontSize: sz.base - 4, color: "rgba(255,255,255,0.65)", marginTop: 2 }}>
              Simple tech answers
            </div>
          </div>
          <button
            onClick={() => setShowInstallModal(true)}
            style={{
              background: "rgba(255,255,255,0.15)", border: "1.5px solid rgba(255,255,255,0.35)",
              color: C.white, padding: "7px 14px", borderRadius: 8,
              fontWeight: 600, fontSize: sz.base - 3, cursor: "pointer",
            }}
          >
            Install
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", background: C.white, borderBottom: `1px solid ${C.border}` }}>
          {["help", "settings"].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                flex: 1, padding: "13px", background: "none", border: "none",
                borderBottom: tab === t ? `2px solid ${C.blue}` : "2px solid transparent",
                color: tab === t ? C.blue : C.muted,
                fontWeight: tab === t ? 700 : 500,
                fontSize: sz.base - 2, cursor: "pointer", textTransform: "capitalize",
              }}
            >
              {t === "help" ? "Get Help" : "Settings"}
            </button>
          ))}
        </div>

        {tab === "help" ? <HelpTab /> : <SettingsTab sizeIdx={sizeIdx} setSizeIdx={setSizeIdx} />}

        {/* Install Modal */}
        {showInstallModal && (
          <div style={{
            position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)",
            zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
          }}>
            <div style={{ background: C.white, padding: 24, borderRadius: 16, maxWidth: 340, width: "100%" }}>
              <h3 style={{ marginTop: 0, fontSize: sz.heading, color: C.text }}>Install EasyFix</h3>
              <p style={{ fontSize: sz.base - 1, color: C.textMid, lineHeight: 1.5 }}>
                {isIOS
                  ? "In Safari, tap the Share button then choose 'Add to Home Screen'."
                  : "In Chrome, tap the menu then choose 'Install App'."}
              </p>
              <button
                onClick={() => setShowInstallModal(false)}
                style={{
                  width: "100%", padding: "13px", background: C.blue,
                  color: C.white, border: "none", borderRadius: 10,
                  fontWeight: 700, fontSize: sz.base, cursor: "pointer",
                }}
              >
                Got it
              </button>
            </div>
          </div>
        )}
      </div>
    </SizeContext.Provider>
  );
}
