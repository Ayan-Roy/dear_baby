import React, { useState } from "react";
import { Plus, BookOpen, Sparkles, Search, Heart, Lock } from "lucide-react";
import { MOODS, PROMPTS } from "../data/dummyData.js";
import { fmtDate } from "../utils.js";

const MOOD_EMOJIS = {
  Happy: "😊",
  Excited: "🤩",
  Emotional: "💖",
  Tired: "😴",
  Hopeful: "✨",
  Loved: "🥰",
  Calm: "🌿",
  Anxious: "🥺"
};

export default function Journal({ entries, addEntry, isDelivered }) {
  const [text, setText] = useState("");
  const [selectedMood, setSelectedMood] = useState("Happy");
  const [search, setSearch] = useState("");

  function save(e) {
    e.preventDefault();
    if (isDelivered || !text.trim()) return;

    addEntry({
      id: Date.now(),
      date: new Date().toISOString().slice(0, 10),
      text: text.trim(),
      mood: MOOD_EMOJIS[selectedMood] || "💌"
    });
    setText("");
  }

  function injectPrompt(promptText) {
    if (isDelivered) return;
    setText(`Dear Baby, ${promptText.toLowerCase()} `);
  }

  const sorted = [...entries].sort((a, b) => new Date(b.date) - new Date(a.date));

  const filtered = sorted.filter(
    en => !search || en.text.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
        <div>
          <h1 className="db-serif db-page-title">Dear Baby Diary</h1>
          <p className="db-page-sub">A private space for letters, thoughts, and quiet conversations with your baby.</p>
        </div>
        {isDelivered && (
          <span style={{ fontSize: 12, fontWeight: 700, color: "#166534", background: "#DCFCE7", padding: "6px 14px", borderRadius: 99, display: "inline-flex", alignItems: "center", gap: 6 }}>
            <Lock size={12} /> 🔒 Letters Preserved in Memory Book (Read-Only)
          </span>
        )}
      </div>

      {/* Journal Entry Form Card or Keepsake Badge */}
      {!isDelivered ? (
        <form onSubmit={save} className="db-card" style={{ marginBottom: 26, background: "linear-gradient(135deg, var(--card), var(--paper-alt))" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div className="db-label">How are you feeling today?</div>
            <div style={{ fontSize: 12, color: "var(--ink-soft)" }}>{text.length} characters</div>
          </div>

          {/* Mood selector chips */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
            {MOODS.map(m => (
              <button
                key={m}
                type="button"
                className={`db-chip ${selectedMood === m ? "active" : ""}`}
                onClick={() => setSelectedMood(m)}
              >
                {MOOD_EMOJIS[m]} {m}
              </button>
            ))}
          </div>

          {/* Prompt shortcuts */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 11, color: "var(--ink-soft)", marginBottom: 6 }}>
              ✨ Prompt Ideas (click to start writing):
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {PROMPTS.slice(0, 3).map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => injectPrompt(p)}
                  style={{
                    fontSize: 11.5,
                    background: "var(--sage-light)",
                    border: "none",
                    borderRadius: 8,
                    padding: "4px 10px",
                    color: "var(--ink)",
                    cursor: "pointer"
                  }}
                >
                  "{p}"
                </button>
              ))}
            </div>
          </div>

          <textarea
            className="db-input db-serif"
            rows={5}
            placeholder="Dear Baby, today..."
            value={text}
            onChange={e => setText(e.target.value)}
            style={{ fontSize: 16, lineHeight: 1.65, background: "var(--card)" }}
          />

          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
            <button type="submit" className="db-btn primary" style={{ padding: "10px 20px" }}>
              <Plus size={15} /> Save Letter to Baby
            </button>
          </div>
        </form>
      ) : (
        <div className="db-card" style={{ marginBottom: 26, background: "linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)", border: "1px solid #166534", padding: "18px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#166534", fontWeight: 700, fontSize: 14 }}>
            <Lock size={16} /> Preserved Diary Keepsake Archive
          </div>
          <p style={{ fontSize: 13, color: "var(--ink-soft)", margin: "6px 0 0 0" }}>
            All letters written during your pregnancy journey are safely locked and preserved below for your baby and family to read forever.
          </p>
        </div>
      )}

      {/* Search Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
        <h2 className="db-serif" style={{ fontSize: 20, fontWeight: 500, margin: 0 }}>
          Saved Letters ({filtered.length})
        </h2>

        <div style={{ position: "relative", minWidth: 220 }}>
          <Search size={15} style={{ position: "absolute", left: 12, top: 11, color: "var(--ink-soft)" }} />
          <input
            className="db-input"
            type="text"
            placeholder="Search letters..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: 36, fontSize: 13 }}
          />
        </div>
      </div>

      {/* Letter List */}
      <div className="db-grid" style={{ gridTemplateColumns: "1fr", gap: 14 }}>
        {filtered.map(en => (
          <div className="db-card" key={en.id} style={{ background: "var(--card)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 22 }}>{en.mood || "💌"}</span>
                <span className="db-serif" style={{ fontWeight: 600, fontSize: 15, color: "var(--rose)" }}>
                  {fmtDate(en.date)}
                </span>
              </div>
            </div>

            <p className="db-serif" style={{ fontSize: 15.5, lineHeight: 1.65, color: "var(--ink)", margin: 0, whiteSpace: "pre-wrap" }}>
              {en.text}
            </p>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="db-card" style={{ textAlign: "center", padding: "40px 20px", color: "var(--ink-soft)" }}>
            No letters match your search.
          </div>
        )}
      </div>
    </div>
  );
}
