import React, { useState, useEffect, useRef } from "react";

const SIZE_PRESETS = [
  { label: "Small",   base: 13, heading: 18, title: 20, radius: 10 },
  { label: "Normal",  base: 16, heading: 21, title: 24, radius: 12 },
  { label: "Large",   base: 19, heading: 25, title: 28, radius: 14 },
  { label: "X-Large", base: 23, heading: 30, title: 33, radius: 16 },
];

const LIGHT = {
  bg:        "#F4F7FD",
  surface:   "#FFFFFF",
  blue:      "#1D4ED8",
  blueMid:   "#3B82F6",
  blueLight: "#DBEAFE",
  blueFaint: "#EFF6FF",
  text:      "#0F172A",
  textMid:   "#334155",
  muted:     "#94A3B8",
  border:    "#CBD5E1",
  inputBg:   "#F4F7FD",
  userBubble:"#1D4ED8",
  userText:  "#FFFFFF",
  botBubble: "#FFFFFF",
  botText:   "#0F172A",
};

const DARK = {
  bg:        "#0F172A",
  surface:   "#1E293B",
  blue:      "#3B82F6",
  blueMid:   "#60A5FA",
  blueLight: "#1E3A5F",
  blueFaint: "#172036",
  text:      "#F1F5F9",
  textMid:   "#CBD5E1",
  muted:     "#64748B",
  border:    "#334155",
  inputBg:   "#0F172A",
  userBubble:"#2563EB",
  userText:  "#FFFFFF",
  botBubble: "#1E293B",
  botText:   "#F1F5F9",
};

const ThemeContext = React.createContext({ dark: false, C: LIGHT });
const SizeContext  = React.createContext(SIZE_PRESETS[1]);

const CATEGORIES = [
  { emoji: "📶", label: "Internet & Wi-Fi",    opener: "I'm having trouble with my internet or Wi-Fi connection." },
  { emoji: "📱", label: "Phone & Tablet",       opener: "I'm having a problem with my phone or tablet." },
  { emoji: "💻", label: "Computer",             opener: "I'm having a problem with my computer." },
  { emoji: "📧", label: "Email",                opener: "I'm having trouble with my email." },
  { emoji: "🖨️", label: "Printer",             opener: "I'm having trouble with my printer." },
  { emoji: "📺", label: "TV & Streaming",       opener: "I'm having trouble with my TV or a streaming service." },
  { emoji: "🔐", label: "Passwords & Accounts", opener: "I'm having trouble with a password or account." },
  { emoji: "🔋", label: "Battery & Charging",   opener: "I'm having trouble with my battery." },
];

function HelpTab() {
  const sz          = React.useContext(SizeContext);
  const { C }       = React.useContext(ThemeContext);
  const [messages, setMessages]             = useState([]);
  const [input, setInput]                   = useState("");
  const [loading, setLoading]               = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage(text, isOpener = false) {
    if (!text.trim() || loading) return;
    const newMessages = isOpener ? [] : [...messages, { role: "user", text }];
    if (!isOpener) { setMessages(newMessages); setInput(""); }
    setLoading(true);

    const apiMessages = isOpener
      ? [{ role: "user", content: text }]
      : newMessages.map(m => ({ role: m.role === "user" ? "user" : "assistant", content: m.text }));

    try {
      const res  = await fetch("https://easyfix-backend.onrender.com/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      });
      const data = await res.json();
      if (data.reply) {
        setMessages(m => [...m, { role: "bot", text: data.reply }]);
      } else throw new Error();
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
      {/* Topic bar */}
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "14px 16px" }}>
        {!activeCategory ? (
          <>
            <p style={{ fontSize: sz.base - 2, color: C.muted, marginBottom: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Choose a topic
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {CATEGORIES.map(cat => (
                <button key={cat.label} onClick={() => selectCategory(cat)} style={{
                  background: C.blueFaint, border: `1px solid ${C.blueLight}`,
                  borderRadius: sz.radius, padding: "10px 12px",
                  fontSize: sz.base - 2, fontWeight: 600, color: C.blue,
                  cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 7,
                }}>
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
            <button onClick={() => { setActiveCategory(null); setMessages([]); }} style={{
              marginLeft: "auto", fontSize: sz.base - 3,
              background: C.blueLight, color: C.blue,
              border: "none", borderRadius: 20, padding: "5px 12px", fontWeight: 700, cursor: "pointer",
            }}>
              Change Topic
            </button>
          </div>
        )}
      </div>

      {/* Chat area */}
      <div style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", background: C.bg }}>
        {messages.length === 0 && !loading && (
          <div style={{ textAlign: "center", paddingTop: 60, color: C.muted }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🛠️</div>
            <div style={{ fontSize: sz.heading, fontWeight: 700, color: C.textMid, marginBottom: 6 }}>Welcome to EasyFix</div>
            <div style={{ fontSize: sz.base - 1 }}>Select a topic above or type your question below.</div>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} style={{
            background: m.role === "user" ? C.userBubble : C.botBubble,
            color: m.role === "user" ? C.userText : C.botText,
            border: m.role === "bot" ? `1px solid ${C.border}` : "none",
            padding: "12px 16px", borderRadius: sz.radius + 4, marginBottom: 10,
            maxWidth: "86%", alignSelf: m.role === "user" ? "flex-end" : "flex-start",
            fontSize: sz.base, lineHeight: 1.55, boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
          }}>
            {m.text}
          </div>
        ))}
        {loading && (
          <div style={{
            background: C.botBubble, border: `1px solid ${C.border}`,
            padding: "12px 16px", borderRadius: sz.radius + 4,
            alignSelf: "flex-start", fontSize: sz.base, color: C.muted,
          }}>
            Thinking…
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input bar */}
      <div style={{ display: "flex", gap: 8, padding: "10px 14px 16px", background: C.surface, borderTop: `1px solid ${C.border}` }}>
        <input
          style={{
            flex: 1, padding: "13px 14px", borderRadius: sz.radius,
            border: `1.5px solid ${C.border}`, fontSize: sz.base,
            outline: "none", color: C.text, background: C.inputBg,
          }}
          placeholder="Type your question…"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage(input)}
        />
        <button onClick={() => sendMessage(input)} disabled={!input.trim() || loading} style={{
          background: C.blue, color: "#fff", border: "none",
          borderRadius: sz.radius, padding: "0 20px",
          fontWeight: 700, fontSize: sz.base,
          opacity: (!input.trim() || loading) ? 0.45 : 1, cursor: "pointer",
        }}>
          Send
        </button>
      </div>
    </div>
  );
}

function SettingsTab({ sizeIdx, setSizeIdx, dark, setDark }) {
  const sz    = SIZE_PRESETS[sizeIdx];
  const { C } = React.useContext(ThemeContext);

  return (
    <div style={{ padding: 20, background: C.bg, minHeight: "100%" }}>
      <h2 style={{ fontSize: sz.heading, color: C.blue, marginBottom: 16 }}>Settings</h2>

      {/* Dark mode toggle */}
      <div style={{ background: C.surface, borderRadius: 14, border: `1px solid ${C.border}`, marginBottom: 16, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px" }}>
          <span style={{ fontSize: sz.base, color: C.text, fontWeight: 600 }}>
            {dark ? "🌙 Dark Mode" : "☀️ Light Mode"}
          </span>
          <button onClick={() => setDark(d => !d)} style={{
            width: 52, height: 30, borderRadius: 15, border: "none",
            background: dark ? C.blue : C.border,
            position: "relative", cursor: "pointer", transition: "background 0.2s",
            flexShrink: 0,
          }}>
            <span style={{
              position: "absolute", top: 3,
              left: dark ? 24 : 3,
              width: 24, height: 24, borderRadius: "50%",
              background: "#fff", transition: "left 0.2s",
              boxShadow: "0 1px 3px rgba(0,0,0,0.25)",
            }} />
          </button>
        </div>
      </div>

      {/* Text size */}
      <div style={{ background: C.surface, borderRadius: 14, border: `1px solid ${C.border}`, overflow: "hidden" }}>
        <p style={{ fontSize: sz.base - 1, color: C.muted, padding: "14px 16px 0", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
          Text Size
        </p>
        {SIZE_PRESETS.map((p, i) => (
          <button key={i} onClick={() => setSizeIdx(i)} style={{
            display: "flex", width: "100%", padding: "14px 16px",
            borderTop: i > 0 ? `1px solid ${C.border}` : "none",
            background: sizeIdx === i ? C.blueFaint : "transparent",
            border: "none", color: sizeIdx === i ? C.blue : C.text,
            fontSize: p.base, cursor: "pointer",
            fontWeight: sizeIdx === i ? 700 : 400,
            textAlign: "left", alignItems: "center", justifyContent: "space-between",
          }}>
            {p.label}
            {sizeIdx === i && <span style={{ fontSize: p.base - 2, color: C.blueMid }}>✓ Selected</span>}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [tab, setTab]         = useState("help");
  const [sizeIdx, setSizeIdx] = useState(() => parseInt(localStorage.getItem("sg_size") || "1"));
  const [dark, setDark]       = useState(() => localStorage.getItem("sg_dark") === "1");
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [showSizePicker, setShowSizePicker]     = useState(() => !sessionStorage.getItem("sg_size_set"));
  const [pendingSizeIdx, setPendingSizeIdx]     = useState(() => parseInt(localStorage.getItem("sg_size") || "1"));
  const [pendingDark, setPendingDark]           = useState(() => localStorage.getItem("sg_dark") === "1");
  const isIOS = /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());

  useEffect(() => { localStorage.setItem("sg_size", sizeIdx); }, [sizeIdx]);
  useEffect(() => { localStorage.setItem("sg_dark", dark ? "1" : "0"); }, [dark]);
  useEffect(() => { setDark(pendingDark); }, [pendingDark]);

  function confirmSize() {
    setSizeIdx(pendingSizeIdx);
    setDark(pendingDark);
    setShowSizePicker(false);
    sessionStorage.setItem("sg_size_set", "1");
  }

  const sz = SIZE_PRESETS[sizeIdx];
  const C  = dark ? DARK : LIGHT;

  return (
    <ThemeContext.Provider value={{ dark, C }}>
      <SizeContext.Provider value={sz}>
        <div style={{
          fontFamily: "'Georgia', serif", minHeight: "100vh",
          maxWidth: 430, margin: "0 auto", background: C.bg,
          display: "flex", flexDirection: "column",
        }}>
          {/* Header */}
          <div style={{ background: C.blue, padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h1 style={{ margin: 0, fontSize: sz.title, color: "#fff", fontWeight: 800, letterSpacing: "-0.01em" }}>EasyFix</h1>
              <div style={{ fontSize: sz.base - 4, color: "rgba(255,255,255,0.65)", marginTop: 2 }}>Simple tech answers</div>
            </div>
            <button onClick={() => setShowInstallModal(true)} style={{
              background: "rgba(255,255,255,0.15)", border: "1.5px solid rgba(255,255,255,0.35)",
              color: "#fff", padding: "7px 14px", borderRadius: 8,
              fontWeight: 600, fontSize: sz.base - 3, cursor: "pointer",
            }}>
              Install
            </button>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", background: C.surface, borderBottom: `1px solid ${C.border}` }}>
            {["help", "settings"].map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                flex: 1, padding: "13px", background: "none", border: "none",
                borderBottom: tab === t ? `2px solid ${C.blue}` : "2px solid transparent",
                color: tab === t ? C.blue : C.muted,
                fontWeight: tab === t ? 700 : 500,
                fontSize: sz.base - 2, cursor: "pointer", textTransform: "capitalize",
              }}>
                {t === "help" ? "Get Help" : "Settings"}
              </button>
            ))}
          </div>

          {tab === "help"
            ? <HelpTab />
            : <SettingsTab sizeIdx={sizeIdx} setSizeIdx={setSizeIdx} dark={dark} setDark={setDark} />
          }

          {/* First-launch Size Picker Modal */}
          {showSizePicker && (() => {
            const MC = pendingDark ? DARK : LIGHT;
            const MP = SIZE_PRESETS[pendingSizeIdx];
            return (
            <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.65)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
              <div style={{ background: MC.surface, borderRadius: 18, padding: 28, maxWidth: 340, width: "100%" }}>
                <h2 style={{ margin: "0 0 6px", fontSize: MP.heading, color: MC.blue, fontWeight: 800 }}>
                  Welcome to EasyFix
                </h2>
                <p style={{ fontSize: MP.base, color: MC.textMid, marginBottom: 20, lineHeight: 1.5 }}>
                  Set things up the way you like before we get started.
                </p>

                {/* Dark mode toggle */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: MC.bg, borderRadius: 12, padding: "14px 16px", marginBottom: 20 }}>
                  <span style={{ fontSize: MP.base, color: MC.text, fontWeight: 600 }}>
                    {pendingDark ? "🌙 Dark Mode" : "☀️ Light Mode"}
                  </span>
                  <button onClick={() => setPendingDark(d => !d)} style={{
                    width: 52, height: 30, borderRadius: 15, border: "none",
                    background: pendingDark ? MC.blue : MC.border,
                    position: "relative", cursor: "pointer", flexShrink: 0,
                  }}>
                    <span style={{
                      position: "absolute", top: 3,
                      left: pendingDark ? 24 : 3,
                      width: 24, height: 24, borderRadius: "50%",
                      background: "#fff", transition: "left 0.2s",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.25)",
                    }} />
                  </button>
                </div>

                <p style={{ fontSize: MP.base - 2, color: MC.muted, marginBottom: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Text Size
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
                  {SIZE_PRESETS.map((p, i) => (
                    <button key={i} onClick={() => setPendingSizeIdx(i)} style={{
                      padding: "14px 16px", borderRadius: 12,
                      border: `2px solid ${pendingSizeIdx === i ? MC.blue : MC.border}`,
                      background: pendingSizeIdx === i ? MC.blueFaint : MC.surface,
                      color: pendingSizeIdx === i ? MC.blue : MC.text,
                      fontSize: p.base, fontWeight: pendingSizeIdx === i ? 700 : 400,
                      cursor: "pointer", textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center",
                    }}>
                      {p.label}
                      {pendingSizeIdx === i && <span style={{ fontSize: p.base - 2 }}>✓</span>}
                    </button>
                  ))}
                </div>
                <button onClick={confirmSize} style={{
                  width: "100%", padding: "14px", background: MC.blue, color: "#fff",
                  border: "none", borderRadius: 12,
                  fontSize: MP.base, fontWeight: 700, cursor: "pointer",
                }}>
                  Looks good — let's go!
                </button>
              </div>
            </div>
            );
          })()}

          {/* Install Modal */}
          {showInstallModal && (
            <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
              <div style={{ background: C.surface, padding: 24, borderRadius: 16, maxWidth: 340, width: "100%" }}>
                <h3 style={{ marginTop: 0, fontSize: sz.heading, color: C.text }}>Install EasyFix</h3>
                <p style={{ fontSize: sz.base - 1, color: C.textMid, lineHeight: 1.5 }}>
                  {isIOS
                    ? "In Safari, tap the Share button then choose 'Add to Home Screen'."
                    : "In Chrome, tap the menu then choose 'Install App'."}
                </p>
                <button onClick={() => setShowInstallModal(false)} style={{
                  width: "100%", padding: "13px", background: C.blue,
                  color: "#fff", border: "none", borderRadius: 10,
                  fontWeight: 700, fontSize: sz.base, cursor: "pointer",
                }}>
                  Got it
                </button>
              </div>
            </div>
          )}
        </div>
      </SizeContext.Provider>
    </ThemeContext.Provider>
  );
}
