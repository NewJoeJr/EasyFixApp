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
  passwordRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 0",
    borderBottom: `1px solid ${COLORS.border}`,
  },
  passwordSite: {
    fontSize: 17, // overridden by sz
    color: COLORS.text,
    fontWeight: "bold",
  },
  passwordUser: {
    fontSize: 13,
    color: COLORS.muted,
    fontFamily: "sans-serif",
    marginTop: 3,
  },
  passwordValue: {
    fontFamily: "monospace",
    fontSize: 14,
    color: COLORS.textLight,
    background: "#F4F4F0",
    padding: "4px 8px",
    borderRadius: 6,
    marginTop: 4,
    letterSpacing: 1,
  },
  iconBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "8px",
    borderRadius: 8,
    fontSize: 20,
    display: "flex",
    alignItems: "center",
    color: COLORS.muted,
  },
  strengthBar: {
    height: 6,
    borderRadius: 4,
    marginTop: 8,
    transition: "width 0.3s, background 0.3s",
  },
  strengthLabel: {
    fontSize: 12,
    fontFamily: "sans-serif",
    marginTop: 4,
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
  copyToast: {
    position: "fixed",
    bottom: 90,
    left: "50%",
    transform: "translateX(-50%)",
    background: COLORS.navy,
    color: "#fff",
    padding: "10px 22px",
    borderRadius: 30,
    fontSize: 14,
    fontFamily: "sans-serif",
    boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
    zIndex: 999,
    pointerEvents: "none",
  },
  modal: {
    position: "fixed",
    inset: 0,
    background: "rgba(27,42,74,0.45)",
    display: "flex",
    alignItems: "flex-end",
    zIndex: 100,
  },
  modalSheet: {
    background: COLORS.card,
    borderRadius: "24px 24px 0 0",
    padding: "28px 20px 40px",
    width: "100%",
    maxWidth: 430,
    margin: "0 auto",
    boxSizing: "border-box",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 4,
  },
  modalSub: {
    fontSize: 13,
    color: COLORS.muted,
    fontFamily: "sans-serif",
    marginBottom: 20,
  },
  fieldGroup: {
    marginBottom: 16,
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

// ── Password Tab ─────────────────────────────────────────────
function PasswordTab() {
  const sz = React.useContext(SizeContext);
  const [passwords, setPasswords] = useState(() => {
    try { return JSON.parse(localStorage.getItem("sg_passwords") || "[]"); } catch { return []; }
  });
  const [showAdd, setShowAdd] = useState(false);
  const [site, setSite] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState({});
  const [toast, setToast] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    localStorage.setItem("sg_passwords", JSON.stringify(passwords));
  }, [passwords]);

  const strength = getStrength(password);

  function savePassword() {
    if (!site.trim() || !password.trim()) return;
    const entry = { id: Date.now(), site: site.trim(), username: username.trim(), password };
    setPasswords(p => [entry, ...p]);
    setSite(""); setUsername(""); setPassword("");
    setShowAdd(false);
    showToast("Password saved! ✓");
  }

  function deletePassword(id) {
    if (window.confirm("Remove this saved password?")) {
      setPasswords(p => p.filter(x => x.id !== id));
    }
  }

  function copyPw(pw) {
    navigator.clipboard.writeText(pw).catch(() => {});
    showToast("Copied to clipboard!");
  }

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 2200);
  }

  const filtered = passwords.filter(p =>
    p.site.toLowerCase().includes(search.toLowerCase()) ||
    p.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={styles.body}>
      {toast && <div style={styles.copyToast}>{toast}</div>}

      {/* Quick tips */}
      <div style={{ ...styles.tipBox, background: "linear-gradient(135deg, #E040FB22, #7C4DFF22)", border: "1.5px solid #D05CF0", borderRadius: 16 }}>
        <span style={{ fontSize: 22 }}>💡</span>
        <span style={{ ...styles.tipText, color: "#6A1B9A", fontSize: sz.base - 1 }}>
          A strong password is long, random, and different for every website. Let us make one for you!
        </span>
      </div>

      {/* Add button */}
      <button style={{ ...styles.btn, ...styles.btnPrimary, marginBottom: 20, fontSize: sz.btn }}
        onClick={() => setShowAdd(true)}>
        <span style={{ fontSize: sz.btn + 4 }}>＋</span> Add New Password
      </button>

      {/* Search */}
      {passwords.length > 0 && (
        <div style={{ ...styles.fieldGroup }}>
          <input
            style={{ ...styles.input, fontSize: 15 }}
            placeholder="🔍  Search your passwords..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      )}

      {/* List */}
      <p style={styles.sectionLabel}>Your Saved Passwords ({filtered.length})</p>
      <div style={styles.card}>
        {filtered.length === 0 ? (
          <div style={styles.emptyState}>
            {passwords.length === 0
              ? <>No passwords saved yet.<br />Tap <b>Add New Password</b> to get started.</>
              : "No results found."}
          </div>
        ) : (
          filtered.map((entry, i) => (
            <div key={entry.id} style={{
              ...styles.passwordRow,
              borderBottom: i === filtered.length - 1 ? "none" : undefined
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={styles.passwordSite}>{entry.site}</div>
                {entry.username && <div style={styles.passwordUser}>👤 {entry.username}</div>}
                <div style={styles.passwordValue}>
                  {showPw[entry.id] ? entry.password : "••••••••••••"}
                </div>
              </div>
              <div style={{ display: "flex", gap: 2, marginLeft: 8 }}>
                <button style={styles.iconBtn}
                  title={showPw[entry.id] ? "Hide" : "Show"}
                  onClick={() => setShowPw(s => ({ ...s, [entry.id]: !s[entry.id] }))}>
                  {showPw[entry.id] ? "🙈" : "👁️"}
                </button>
                <button style={styles.iconBtn} title="Copy" onClick={() => copyPw(entry.password)}>📋</button>
                <button style={{ ...styles.iconBtn, color: COLORS.red }} title="Delete"
                  onClick={() => deletePassword(entry.id)}>🗑️</button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Modal */}
      {showAdd && (
        <div style={styles.modal} onClick={e => { if (e.target === e.currentTarget) setShowAdd(false); }}>
          <div style={styles.modalSheet}>
            <div style={styles.modalTitle}>Add a Password</div>
            <div style={styles.modalSub}>Fill in as much or as little as you like.</div>

            <div style={styles.fieldGroup}>
              <label style={styles.inputLabel}>🌐 Website or App Name *</label>
              <input style={styles.input} placeholder="e.g. Facebook, Gmail, Amazon"
                value={site} onChange={e => setSite(e.target.value)} />
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.inputLabel}>👤 Your Username or Email (optional)</label>
              <input style={styles.input} placeholder="e.g. john@email.com"
                value={username} onChange={e => setUsername(e.target.value)} />
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.inputLabel}>🔑 Password *</label>
              <div style={{ display: "flex", gap: 8 }}>
                <input style={{ ...styles.input, flex: 1 }}
                  type="text"
                  placeholder="Type or generate one →"
                  value={password}
                  onChange={e => setPassword(e.target.value)} />
              </div>
              {/* Strength */}
              {password && (
                <>
                  <div style={{
                    ...styles.strengthBar,
                    width: `${(strength.score / 5) * 100}%`,
                    background: strength.color,
                  }} />
                  <div style={{ ...styles.strengthLabel, color: strength.color }}>
                    Password strength: <b>{strength.label}</b>
                  </div>
                </>
              )}
            </div>

            <button style={{ ...styles.btn, ...styles.btnSecondary, marginBottom: 10 }}
              onClick={() => setPassword(generatePassword())}>
              ✨ Generate a Strong Password for Me
            </button>
            <button style={{ ...styles.btn, ...styles.btnGreen }}
              onClick={savePassword}
              disabled={!site.trim() || !password.trim()}>
              💾 Save Password
            </button>
            <button style={{ ...styles.btn, background: "transparent", color: COLORS.muted, marginTop: 6 }}
              onClick={() => setShowAdd(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Help Tab ─────────────────────────────────────────────────

const QUICK_TOPICS = [
  { emoji: "📶", label: "My Wi-Fi isn't working" },
  { emoji: "🔇", label: "No sound on my device" },
  { emoji: "🐢", label: "My phone or computer is slow" },
  { emoji: "📧", label: "I can't open my email" },
  { emoji: "🔋", label: "My battery drains too fast" },
  { emoji: "📷", label: "My camera or photos aren't working" },
  { emoji: "🖨️", label: "My printer isn't working" },
  { emoji: "🔐", label: "I forgot my password" },
  { emoji: "📱", label: "My apps keep crashing" },
  { emoji: "🔔", label: "I'm getting too many notifications" },
];

function HelpTab() {
  const sz = React.useContext(SizeContext);
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hi there! 👋 I'm here to help with any tech problem. Tap a topic below to get started, or type your own question!" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage(text) {
    if (!text.trim() || loading) return;
    const userMsg = { role: "user", text };
    const allMessages = [...messages, userMsg];
    setMessages(allMessages);
    setInput("");
    setLoading(true);

    const relevant = allMessages.filter(m => m.role === "user" || m.role === "bot");
    const firstUser = relevant.findIndex(m => m.role === "user");
    const trimmed = firstUser >= 0 ? relevant.slice(firstUser) : relevant;
    const history = trimmed.map(m => ({
      role: m.role === "user" ? "user" : "assistant",
      content: m.text
    }));

    try {
      // BACKEND_URL: Replace with your Render deployment URL after deploying
      // Example: const BACKEND_URL = "https://easyfix-backend.onrender.com";
      const BACKEND_URL = "https://easyfix-backend.onrender.com";

      const res = await fetch(`${BACKEND_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });
      const data = await res.json();
      const reply = data.reply;
      if (reply) {
        setMessages(m => [...m, { role: "bot", text: reply }]);
      } else {
        throw new Error(data.error || "No reply");
      }
    } catch (err) {
      setMessages(m => [...m, { role: "bot", text: "I'm having trouble connecting right now. Please try again in a moment! 😊" }]);
    }
    setLoading(false);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 130px)" }}>

      {/* Topic chips */}
      <div style={{ padding: "14px 16px 4px", flexShrink: 0 }}>
        <p style={{ ...styles.sectionLabel, fontSize: sz.base - 4, marginBottom: 10 }}>Common Problems — Tap to Start</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 4 }}>
          {QUICK_TOPICS.map(t => (
            <button key={t.label} onClick={() => sendMessage(t.label)} style={{
              background: COLORS.card,
              border: `2px solid ${COLORS.border}`,
              borderRadius: 30,
              padding: `${sz.spacing - 8}px ${sz.spacing - 2}px`,
              fontSize: sz.base - 3,
              fontFamily: "sans-serif",
              color: COLORS.text,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
              boxShadow: "0 2px 8px rgba(124,77,255,0.08)",
              transition: "all 0.15s",
            }}>
              {t.emoji} {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chat messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "8px 16px", display: "flex", flexDirection: "column" }}>
        {messages.map((m, i) => (
          <div key={i} style={{
            ...styles.bubble,
            ...(m.role === "user" ? styles.bubbleUser : styles.bubbleBot),
            whiteSpace: "pre-wrap",
            fontSize: sz.base,
          }}>
            {m.text}
          </div>
        ))}
        {loading && (
          <div style={{ ...styles.bubble, ...styles.bubbleBot, color: COLORS.muted, fontStyle: "italic", fontSize: sz.base }}>
            Thinking... ⏳
          </div>
        )}
      </div>

      {/* Input bar */}
      <div style={{
        padding: "12px 16px 20px",
        background: "linear-gradient(180deg, #F0F4FF 0%, #FAF0FF 100%)",
        borderTop: `2px solid ${COLORS.border}`,
        display: "flex",
        gap: 10,
        flexShrink: 0,
      }}>
        <input
          style={{ ...styles.input, flex: 1, fontSize: sz.base }}
          placeholder="Describe your problem here..."
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
            width: sz.btn + 30,
            height: sz.btn + 30,
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
        <div style={{ fontSize: sz.title, fontWeight: "bold", color: COLORS.text, marginBottom: 8 }}>🔐 SimpleGuard</div>
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
  const [tab, setTab] = useState("passwords");
  const [sizeIdx, setSizeIdx] = useState(() => {
    try { return parseInt(localStorage.getItem("sg_size") || "1"); } catch { return 1; }
  });

  useEffect(() => {
    localStorage.setItem("sg_size", sizeIdx);
  }, [sizeIdx]);

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
            <h1 style={{ ...styles.headerTitle, fontSize: sz.title }}>🔐 SimpleGuard</h1>
            <div style={{ ...styles.headerSub, fontSize: sz.base - 3 }}>Your safe, simple digital helper</div>
          </div>
          <div style={{
            background: "linear-gradient(135deg, #00C853, #00897B)",
            borderRadius: 12, padding: "6px 14px", color: "#fff",
            fontSize: sz.base - 4, fontWeight: "bold", letterSpacing: 1,
            boxShadow: "0 2px 10px rgba(0,200,83,0.4)",
          }}>SECURE</div>
        </div>

        {/* Tabs */}
        <div style={{
          display: "flex",
          background: "linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)",
          borderBottom: "3px solid rgba(255,255,255,0.08)",
        }}>
          {[
            { id: "passwords", icon: "🔑", label: "Passwords" },
            { id: "help", icon: "🆘", label: "Get Help" },
            { id: "settings", icon: "⚙️", label: "Settings" },
          ].map(t => (
            <button key={t.id}
              style={{
                flex: 1, padding: `${sz.spacing - 4}px 0`,
                border: "none", background: "transparent", cursor: "pointer",
                fontFamily: "'Georgia', serif", fontSize: sz.base - 2,
                color: tab === t.id ? "#fff" : "rgba(255,255,255,0.45)",
                borderBottom: tab === t.id ? `3px solid #E040FB` : "3px solid transparent",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                transition: "all 0.2s", marginBottom: -3,
              }}
              onClick={() => setTab(t.id)}>
              <span>{t.icon}</span> {t.label}
            </button>
          ))}
        </div>

        {tab === "passwords" && <PasswordTab />}
        {tab === "help" && <HelpTab />}
        {tab === "settings" && <SettingsTab sizeIdx={sizeIdx} setSizeIdx={setSizeIdx} />}
      </div>
    </SizeContext.Provider>
  );
}
