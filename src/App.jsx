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
  navyLight: "#16213E",
  accent: "#E040FB",
  accentLight: "#FAE5FF",
  green: "#00C853",
  greenLight: "#E0FAE9",
  red: "#FF1744",
  redLight: "#FFE5E9",
  muted: "#7986A3",
  border: "#D6DCEF",
  text: "#1A1A2E",
  textLight: "#4A5272",
  teal: "#00BCD4",
  tealLight: "#E0F7FA",
  orange: "#FF6D00",
  orangeLight: "#FFF3E0",
  yellow: "#FFD600",
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
  header: {
    background: COLORS.navy,
    padding: "28px 24px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    color: "#FFF",
    fontSize: 26,
    fontWeight: "bold",
    letterSpacing: "-0.5px",
    margin: 0,
  },
  headerSub: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 13,
    marginTop: 2,
  },
  lockBadge: {
    background: COLORS.accent,
    borderRadius: 12,
    padding: "6px 12px",
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  tabs: {
    display: "flex",
    background: COLORS.navy,
    paddingBottom: 0,
  },
  tab: {
    flex: 1,
    padding: "14px 0",
    border: "none",
    background: "transparent",
    color: "rgba(255,255,255,0.5)",
    fontSize: 15,
    cursor: "pointer",
    fontFamily: "'Georgia', serif",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderBottom: "3px solid transparent",
    transition: "all 0.2s",
  },
  tabActive: {
    color: "#fff",
    borderBottom: `3px solid ${COLORS.accent}`,
  },
  body: {
    flex: 1,
    padding: "20px 16px",
    overflowY: "auto",
  },
  sectionLabel: {
    fontSize: 11,
    fontFamily: "sans-serif",
    letterSpacing: 1.5,
    color: COLORS.muted,
    fontWeight: "bold",
    textTransform: "uppercase",
    marginBottom: 12,
    marginLeft: 4,
  },
  card: {
    background: COLORS.card,
    borderRadius: 16,
    padding: "18px 20px",
    marginBottom: 12,
    boxShadow: "0 2px 12px rgba(27,42,74,0.07)",
    border: `1px solid ${COLORS.border}`,
  },
  input: {
    width: "100%",
    padding: "14px 16px",
    fontSize: 17,
    border: `2px solid ${COLORS.border}`,
    borderRadius: 12,
    background: "#FAFAF8",
    color: COLORS.text,
    fontFamily: "'Georgia', serif",
    boxSizing: "border-box",
    outline: "none",
    transition: "border 0.2s",
  },
  inputLabel: {
    fontSize: 13,
    color: COLORS.textLight,
    fontFamily: "sans-serif",
    marginBottom: 6,
    display: "block",
  },
  btn: {
    width: "100%",
    padding: "16px",
    fontSize: 17,
    fontWeight: "bold",
    borderRadius: 14,
    border: "none",
    cursor: "pointer",
    fontFamily: "'Georgia', serif",
    transition: "all 0.15s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  btnPrimary: {
    background: "linear-gradient(135deg, #E040FB 0%, #7C4DFF 100%)",
    color: "#fff",
    boxShadow: "0 4px 16px rgba(224,64,251,0.35)",
  },
  btnSecondary: {
    background: COLORS.accentLight,
    color: COLORS.accent,
  },
  btnGreen: {
    background: "linear-gradient(135deg, #00C853 0%, #00897B 100%)",
    color: "#fff",
    boxShadow: "0 4px 16px rgba(0,200,83,0.35)",
  },
  btnSmall: {
    padding: "8px 14px",
    fontSize: 13,
    borderRadius: 10,
    width: "auto",
  },
  passwordSite: {
    fontSize: 17, // overridden by sz
    color: COLORS.text,
    fontWeight: "bold",
  },
  bubble: {
    borderRadius: 18,
    padding: "14px 18px",
    marginBottom: 10,
    maxWidth: "88%",
    fontSize: 15,
    lineHeight: 1.55,
    fontFamily: "sans-serif",
  },
  bubbleUser: {
    background: COLORS.navy,
    color: "#fff",
    alignSelf: "flex-end",
    marginLeft: "auto",
    borderBottomRightRadius: 4,
  },
  bubbleBot: {
    background: COLORS.card,
    color: COLORS.text,
    border: `1px solid ${COLORS.border}`,
    borderBottomLeftRadius: 4,
    boxShadow: "0 2px 8px rgba(27,42,74,0.06)",
  },
  tipBox: {
    background: COLORS.greenLight,
    border: `1px solid #B4DEC9`,
    borderRadius: 14,
    padding: "14px 16px",
    marginBottom: 12,
    display: "flex",
    gap: 12,
    alignItems: "flex-start",
  },
  tipText: {
    fontSize: 14,
    color: "#2A6B4E",
    fontFamily: "sans-serif",
    lineHeight: 1.5,
  },
  emptyState: {
    textAlign: "center",
    padding: "40px 20px",
    color: COLORS.muted,
    fontFamily: "sans-serif",
    fontSize: 15,
    lineHeight: 1.6,
  },
};

function generatePassword(length = 16) {
  const chars = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%&*";
  let pw = "";
  for (let i = 0; i < length; i++) {
    pw += chars[Math.floor(Math.random() * chars.length)];
  }
  return pw;
}

function getStrength(pw) {
  if (!pw) return { score: 0, label: "", color: "#eee" };
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 14) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^a-zA-Z0-9]/.test(pw)) score++;
  if (score <= 1) return { score, label: "Weak", color: COLORS.red };
  if (score <= 3) return { score, label: "Fair", color: "#E8A040" };
  return { score, label: "Strong 🛡️", color: COLORS.green };
}

// ── Help Tab ─────────────────────────────────────────────────

const CATEGORIES = [
  { emoji: "📶", label: "Internet & Wi-Fi",     opener: "I'm having trouble with my internet or Wi-Fi connection. Can you ask me one question at a time to help figure out what's going wrong?" },
  { emoji: "📱", label: "Phone & Tablet",        opener: "I'm having a problem with my phone or tablet. Can you ask me one question at a time to help figure out what's going wrong?" },
  { emoji: "💻", label: "Computer",              opener: "I'm having a problem with my computer. Can you ask me one question at a time to help figure out what's going wrong?" },
  { emoji: "📧", label: "Email",                 opener: "I'm having trouble with my email. Can you ask me one question at a time to help figure out what's going wrong?" },
  { emoji: "🖨️", label: "Printer",              opener: "I'm having trouble with my printer. Can you ask me one question at a time to help figure out what's going wrong?" },
  { emoji: "📺", label: "TV & Streaming",        opener: "I'm having trouble with my TV or a streaming service like Netflix or YouTube. Can you ask me one question at a time to help figure out what's going wrong?" },
  { emoji: "🔐", label: "Passwords & Accounts",  opener: "I'm having trouble with a password or logging into an account. Can you ask me one question at a time to help figure out what's going wrong?" },
  { emoji: "🔋", label: "Battery & Charging",    opener: "I'm having trouble with my battery or charging. Can you ask me one question at a time to help figure out what's going wrong?" },
];

function HelpTab() {
  const sz = React.useContext(SizeContext);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const chatEndRef = React.useRef(null);

  React.useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  async function sendMessage(text, isOpener = false) {
    if (!text.trim() || loading) return;

    const userMsg = isOpener ? null : { role: "user", text };
    const allMessages = isOpener ? [] : [...messages, { role: "user", text }];

    if (!isOpener) {
      setMessages(allMessages);
      setInput("");
    }
    setLoading(true);

    const apiMessages = isOpener
      ? [{ role: "user", content: text }]
      : allMessages
          .filter(m => m.role === "user" || m.role === "bot")
          .map(m => ({ role: m.role === "user" ? "user" : "assistant", content: m.text }));

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: "You are a very friendly, patient tech helper for older adults and people who are not comfortable with technology. Your approach is to ask ONE simple question at a time to diagnose the problem, then give a clear numbered solution once you understand what is wrong. Use plain English, no jargon. Use friendly emojis. Never make the person feel stupid. Keep each response short and focused. Always end with encouragement.",
          messages: apiMessages,
        })
      });
      const data = await res.json();
      const reply = data.content?.find(b => b.type === "text")?.text;
      if (reply) {
        setMessages(m => [...m, { role: "bot", text: reply }]);
      } else {
        throw new Error("No reply");
      }
    } catch (err) {
      setMessages(m => [...m, { role: "bot", text: "I\'m having trouble connecting right now. Please try again in a moment! 😊" }]);
    }
    setLoading(false);
  }

  function selectCategory(cat) {
    setActiveCategory(cat);
    setMessages([]);
    setInput("");
    sendMessage(cat.opener, true);
  }

  function resetCategory() {
    setActiveCategory(null);
    setMessages([]);
    setInput("");
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 115px)" }}>

      {/* Category strip */}
      <div style={{
        padding: "10px 12px 8px",
        borderBottom: `1px solid ${COLORS.border}`,
        flexShrink: 0,
        background: COLORS.card,
      }}>
        {!activeCategory ? (
          <>
            <p style={{ ...styles.sectionLabel, fontSize: sz.base - 5, marginBottom: 8 }}>
              What do you need help with?
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
              {CATEGORIES.map(cat => (
                <button key={cat.label} onClick={() => selectCategory(cat)} style={{
                  background: "linear-gradient(135deg, #F0F4FF, #FAF0FF)",
                  border: `1.5px solid ${COLORS.border}`,
                  borderRadius: 20,
                  padding: `${sz.base - 8}px ${sz.base - 2}px`,
                  fontSize: sz.base - 3,
                  fontFamily: "sans-serif",
                  color: COLORS.text,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  boxShadow: "0 1px 4px rgba(124,77,255,0.08)",
                  transition: "all 0.15s",
                  fontWeight: "500",
                }}>
                  <span>{cat.emoji}</span> {cat.label}
                </button>
              ))}
            </div>
          </>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button onClick={resetCategory} style={{
              background: "none", border: "none", cursor: "pointer",
              fontSize: sz.base + 2, color: COLORS.muted, padding: "4px 6px",
              borderRadius: 8, display: "flex", alignItems: "center",
            }}>←</button>
            <span style={{ fontSize: sz.base + 2 }}>{activeCategory.emoji}</span>
            <span style={{ fontSize: sz.base - 1, fontWeight: "bold", color: COLORS.text, fontFamily: "sans-serif" }}>
              {activeCategory.label}
            </span>
            <button onClick={resetCategory} style={{
              marginLeft: "auto",
              background: COLORS.accentLight,
              border: "none", cursor: "pointer",
              fontSize: sz.base - 4, color: COLORS.accent,
              padding: "5px 12px", borderRadius: 20,
              fontFamily: "sans-serif", fontWeight: "bold",
            }}>
              Change Topic
            </button>
          </div>
        )}
      </div>

      {/* Chat area */}
      <div style={{
        flex: 1,
        overflowY: "auto",
        padding: "14px 14px 4px",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(180deg, #F0F4FF 0%, #FAF0FF 100%)",
      }}>
        {messages.length === 0 && !loading && (
          <div style={{
            flex: 1, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            textAlign: "center", padding: "40px 24px", color: COLORS.muted,
          }}>
            <div style={{ fontSize: 52, marginBottom: 16 }}>🛠️</div>
            <div style={{ fontSize: sz.base + 2, fontWeight: "bold", color: COLORS.text, marginBottom: 8, fontFamily: "sans-serif" }}>
              Welcome to EasyFix!
            </div>
            <div style={{ fontSize: sz.base - 1, fontFamily: "sans-serif", lineHeight: 1.6, color: COLORS.textLight }}>
              Tap a category above to get started, or type your question below and I'll help you out.
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} style={{
            ...styles.bubble,
            ...(m.role === "user" ? styles.bubbleUser : styles.bubbleBot),
            whiteSpace: "pre-wrap",
            fontSize: sz.base,
            marginBottom: 10,
          }}>
            {m.text}
          </div>
        ))}

        {loading && (
          <div style={{
            ...styles.bubble, ...styles.bubbleBot,
            color: COLORS.muted, fontStyle: "italic",
            fontSize: sz.base, marginBottom: 10,
          }}>
            Thinking... ⏳
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input bar */}
      <div style={{
        padding: "10px 12px 16px",
        background: COLORS.card,
        borderTop: `2px solid ${COLORS.border}`,
        display: "flex",
        gap: 8,
        flexShrink: 0,
      }}>
        <input
          style={{ ...styles.input, flex: 1, fontSize: sz.base }}
          placeholder={activeCategory ? `Ask about ${activeCategory.label}...` : "Or type your own question here..."}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage(input)}
          disabled={loading}
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={!input.trim() || loading}
          style={{
            ...styles.btn,
            ...styles.btnPrimary,
            width: sz.btn + 28,
            height: sz.btn + 28,
            borderRadius: sz.radius,
            fontSize: sz.btn,
            padding: 0,
            flexShrink: 0,
            opacity: (!input.trim() || loading) ? 0.5 : 1,
          }}>
          ➤
        </button>
      </div>
    </div>
  );
}


// ── Settings Tab ─────────────────────────────────────────────
function SettingsTab({ sizeIdx, setSizeIdx }) {
  const sz = SIZE_PRESETS[sizeIdx];
  return (
    <div style={{ ...styles.body, paddingTop: 24 }}>
      <div style={{
        background: "linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)",
        borderRadius: 20, padding: "20px 20px 24px", marginBottom: 20,
        boxShadow: "0 4px 20px rgba(26,26,46,0.25)",
      }}>
        <div style={{ color: "#fff", fontSize: sz.heading, fontWeight: "bold", marginBottom: 6 }}>⚙️ Display Settings</div>
        <div style={{ color: "rgba(255,255,255,0.6)", fontSize: sz.base - 2, fontFamily: "sans-serif" }}>
          Make the app easier to read and use
        </div>
      </div>

      <p style={{ ...styles.sectionLabel, fontSize: sz.base - 4 }}>Text & Button Size</p>
      <div style={{ ...styles.card, padding: "20px 16px" }}>
        <div style={{ fontSize: sz.base, color: COLORS.text, fontFamily: "sans-serif", marginBottom: 18, lineHeight: 1.5 }}>
          Choose the size that's most comfortable for your eyes:
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {SIZE_PRESETS.map((preset, i) => (
            <button key={preset.label} onClick={() => setSizeIdx(i)} style={{
              display: "flex", alignItems: "center", gap: 16,
              padding: "16px 18px", borderRadius: 14, border: "none", cursor: "pointer",
              background: i === sizeIdx
                ? "linear-gradient(135deg, #E040FB 0%, #7C4DFF 100%)"
                : COLORS.bg,
              boxShadow: i === sizeIdx ? "0 4px 16px rgba(224,64,251,0.4)" : "none",
              transition: "all 0.2s",
            }}>
              <span style={{
                fontSize: [16, 20, 26, 32][i],
                color: i === sizeIdx ? "#fff" : COLORS.text,
                fontWeight: "bold", minWidth: 36, textAlign: "center",
              }}>A</span>
              <div style={{ textAlign: "left" }}>
                <div style={{
                  fontSize: [14, 16, 18, 20][i], fontWeight: "bold",
                  color: i === sizeIdx ? "#fff" : COLORS.text,
                  fontFamily: "sans-serif",
                }}>{preset.label}</div>
                <div style={{
                  fontSize: 12, color: i === sizeIdx ? "rgba(255,255,255,0.75)" : COLORS.muted,
                  fontFamily: "sans-serif", marginTop: 2,
                }}>
                  {["Fits more on screen", "Default size", "Easier to read", "Easiest to read"][i]}
                </div>
              </div>
              {i === sizeIdx && (
                <span style={{ marginLeft: "auto", color: "#fff", fontSize: 22 }}>✓</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <p style={{ ...styles.sectionLabel, fontSize: sz.base - 4, marginTop: 20 }}>Preview</p>
      <div style={{ ...styles.card, padding: 20 }}>
        <div style={{ fontSize: sz.title, fontWeight: "bold", color: COLORS.text, marginBottom: 8 }}>🛠️ EasyFix</div>
        <div style={{ fontSize: sz.base, color: COLORS.textLight, fontFamily: "sans-serif", lineHeight: 1.6, marginBottom: 16 }}>
          This is how text will look at the <b>{sz.label}</b> size setting. Make sure it feels comfortable to read!
        </div>
        <button style={{
          ...styles.btn,
          background: "linear-gradient(135deg, #E040FB 0%, #7C4DFF 100%)",
          color: "#fff", fontSize: sz.btn, borderRadius: sz.radius,
          boxShadow: "0 4px 16px rgba(224,64,251,0.35)",
        }}>
          Sample Button
        </button>
      </div>

      <div style={{ ...styles.tipBox, marginTop: 16, background: COLORS.tealLight, border: `1px solid #80DEEA` }}>
        <span style={{ fontSize: 22 }}>💡</span>
        <span style={{ ...styles.tipText, color: "#006064", fontSize: sz.base - 2 }}>
          Your size setting is saved automatically. You can change it any time by coming back here.
        </span>
      </div>
    </div>
  );
}

// ── App Root ─────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("help");
  const [sizeIdx, setSizeIdx] = useState(() => {
    try { return parseInt(localStorage.getItem("sg_size") || "1"); } catch { return 1; }
  });
  const [installPrompt, setInstallPrompt] = useState(null);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    localStorage.setItem("sg_size", sizeIdx);
  }, [sizeIdx]);

  useEffect(() => {
    // Detect iOS
    const ios = /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
    setIsIOS(ios);

    // Detect if already installed as PWA
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    // Capture Android install prompt
    const handler = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  async function handleInstall() {
    if (isIOS) {
      setShowInstallModal(true);
      return;
    }
    if (installPrompt) {
      installPrompt.prompt();
      const result = await installPrompt.userChoice;
      if (result.outcome === "accepted") {
        setIsInstalled(true);
        setInstallPrompt(null);
      }
    } else {
      setShowInstallModal(true);
    }
  }

  const sz = SIZE_PRESETS[sizeIdx];

  return (
    <SizeContext.Provider value={sz}>
      <div style={{ ...styles.app, fontSize: sz.base }}>
        {/* Header */}
        <div style={{
          background: "linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)",
          padding: `${sz.spacing + 4}px 24px ${sz.spacing}px`,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          boxShadow: "0 2px 16px rgba(26,26,46,0.3)",
        }}>
          <div>
            <h1 style={{ ...styles.headerTitle, fontSize: sz.title }}>🆘 EasyFix</h1>
            <div style={{ ...styles.headerSub, fontSize: sz.base - 3 }}>Simple answers to tech problems</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {!isInstalled && (
              <button onClick={handleInstall} style={{
                background: "linear-gradient(135deg, #E040FB, #7C4DFF)",
                border: "none", borderRadius: 12, padding: "8px 14px",
                color: "#fff", fontSize: sz.base - 4, fontWeight: "bold",
                cursor: "pointer", boxShadow: "0 2px 10px rgba(224,64,251,0.4)",
                fontFamily: "sans-serif", letterSpacing: 0.5,
              }}>⬇️ Install</button>
            )}
            {isInstalled && (
              <div style={{
                background: "linear-gradient(135deg, #00C853, #00897B)",
                borderRadius: 12, padding: "6px 14px", color: "#fff",
                fontSize: sz.base - 4, fontWeight: "bold", letterSpacing: 1,
                boxShadow: "0 2px 10px rgba(0,200,83,0.4)",
              }}>✓ Installed</div>
            )}
          </div>
        </div>

        {/* Install Modal */}
        {showInstallModal && (
          <div style={{
            position: "fixed", inset: 0, background: "rgba(26,26,46,0.6)",
            zIndex: 200, display: "flex", alignItems: "flex-end",
          }} onClick={() => setShowInstallModal(false)}>
            <div style={{
              background: "#fff", borderRadius: "24px 24px 0 0",
              padding: "28px 24px 48px", width: "100%", boxSizing: "border-box",
            }} onClick={e => e.stopPropagation()}>
              <div style={{ fontSize: sz.heading, fontWeight: "bold", color: COLORS.text, marginBottom: 8 }}>
                📲 Add EasyFix to Your Home Screen
              </div>
              <div style={{ fontSize: sz.base - 1, color: COLORS.textLight, fontFamily: "sans-serif", marginBottom: 20 }}>
                Install EasyFix so it lives on your home screen just like a regular app — no App Store needed!
              </div>
              {isIOS ? (
                <div style={{ fontFamily: "sans-serif" }}>
                  <div style={{ fontSize: sz.base - 1, color: COLORS.text, marginBottom: 12, fontWeight: "bold" }}>On iPhone or iPad:</div>
                  {[
                    "1.  Make sure you are using Safari (not Chrome)",
                    "2.  Tap the Share button at the bottom of the screen  📤",
                    "3.  Scroll down and tap  'Add to Home Screen'",
                    "4.  Tap  'Add'  in the top right corner",
                    "5.  EasyFix will appear on your home screen! 🎉",
                  ].map((s, i) => (
                    <div key={i} style={{
                      padding: "12px 16px", marginBottom: 8, borderRadius: 12,
                      background: COLORS.bg, fontSize: sz.base - 1, color: COLORS.text,
                      border: `1px solid ${COLORS.border}`,
                    }}>{s}</div>
                  ))}
                </div>
              ) : (
                <div style={{ fontFamily: "sans-serif" }}>
                  <div style={{ fontSize: sz.base - 1, color: COLORS.text, marginBottom: 12, fontWeight: "bold" }}>On Android:</div>
                  {[
                    "1.  Make sure you are using Chrome",
                    "2.  Tap the three dots menu  ⋮  in the top right",
                    "3.  Tap  'Add to Home Screen'  or  'Install App'",
                    "4.  Tap  'Add'  or  'Install'",
                    "5.  EasyFix will appear on your home screen! 🎉",
                  ].map((s, i) => (
                    <div key={i} style={{
                      padding: "12px 16px", marginBottom: 8, borderRadius: 12,
                      background: COLORS.bg, fontSize: sz.base - 1, color: COLORS.text,
                      border: `1px solid ${COLORS.border}`,
                    }}>{s}</div>
                  ))}
                </div>
              )}
              <button onClick={() => setShowInstallModal(false)} style={{
                width: "100%", padding: "16px", marginTop: 8,
                background: "linear-gradient(135deg, #E040FB, #7C4DFF)",
                color: "#fff", border: "none", borderRadius: 14,
                fontSize: sz.btn, fontWeight: "bold", cursor: "pointer",
                fontFamily: "sans-serif",
              }}>Got it!</button>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div style={{
          display: "flex",
          background: "linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)",
          borderBottom: "3px solid rgba(255,255,255,0.08)",
        }}>
          {[
            { id: "help", icon: "🆘", label: "Get Help" },
            { id: "settings", icon: "⚙️", label: "Settings" },
          ].map(t => (
            <button key={t.id}
              style={{
                flex: 1, padding: `${sz.spacing - 4}px 0`,
                border: "none", background: "transparent", cursor: "pointer",
                fontFamily: "'Georgia', serif", fontSize: sz.base - 2,
                color: tab === t.id ? "#fff" : "rgba(255,255,255,0.45)",
                borderBottom: tab === t.id ? "3px solid #E040FB" : "3px solid transparent",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                transition: "all 0.2s", marginBottom: -3,
              }}
              onClick={() => setTab(t.id)}>
              <span>{t.icon}</span> {t.label}
            </button>
          ))}
        </div>

        {tab === "help" && <HelpTab />}
        {tab === "settings" && <SettingsTab sizeIdx={sizeIdx} setSizeIdx={setSizeIdx} />}
      </div>
    </SizeContext.Provider>
  );
}
