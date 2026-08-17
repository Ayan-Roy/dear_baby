import React, { useState } from "react";
import { Plus, BookOpen, Sparkles, Search, Heart } from "lucide-react";
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

export default function Journal({ entries, addEntry }) {
  const [text, setText] = useState("");
  const [selectedMood, setSelectedMood] = useState("Happy");
  const [search, setSearch] = useState("");

  function save(e) {
    e.preventDefault();
    if (!text.trim()) return;

    addEntry({
      id: Date.now(),
      date: new Date().toISOString().slice(0, 10),
      text: text.trim(),
      mood: MOOD_EMOJIS[selectedMood] || "💌"
    });
    setText("");
  }

  function injectPrompt(promptText) {
    setText(`Dear Baby, ${promptText.toLowerCase()} `);
  }

  const sorted = [...entries].sort((a, b) => new Date(b.date) - new Date(a.date));

  const filtered = sorted.filter(
    en => !search || en.text.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 className="db-serif db-page-title">Dear Baby Diary</h1>
          <p className="db-page-sub">A private space for letters, thoughts, and quiet conversations with your baby.</p>
        </div>
      </div>

      {/* Journal Entry Form Card */}
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
          <div style={{ fontSize: 11, color: "var(--sage)", fontWeight: 600, display: "flex", alignItems: "center", gap: 4, marginBottom: 6 }}>
            <Sparkles size={12} /> Prompt Ideas (click to start writing):
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {PROMPTS.slice(0, 3).map((pr, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => injectPrompt(pr)}
                style={{
                  background: "var(--sage-light)",
                  border: "none",
                  borderRadius: 6,
                  padding: "4px 10px",
                  fontSize: 12,
                  color: "var(--ink)",
                  cursor: "pointer",
                  textAlign: "left"
                }}
              >
                "{pr}"
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

      {/* Search Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
        <h2 className="db-serif" style={{ fontSize: 20, fontWeight: 500, margin: 0 }}>
          Saved Letters ({filtered.length})
        </h2>

        <div style={{ position: "relative", minWidth: 220 }}>
          <Search size={15} style={{ position: "absolute", left: 12, top: 11, color: "var(--ink-soft)" }} />
          <input
            className="db-input"
            style={{ paddingLeft: 36, padding: "8px 12px 8px 36px", fontSize: 13 }}
            placeholder="Search diary entries..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Diary Entries List */}
      <div className="db-grid" style={{ gap: 16 }}>
        {filtered.map(en => (
          <div className="db-card db-card-hover" key={en.id} style={{ background: "var(--card)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div className="db-label">{fmtDate(en.date)}</div>
              <span style={{ fontSize: 20 }}>{en.mood || "💌"}</span>
            </div>
            <p className="db-serif" style={{ fontSize: 16, lineHeight: 1.7, margin: 0, fontStyle: "italic", color: "var(--ink)" }}>
              "{en.text}"
            </p>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="db-card" style={{ textAlign: "center", padding: "40px 20px", color: "var(--ink-soft)" }}>
            <BookOpen size={28} color="var(--rose)" style={{ opacity: 0.6, marginBottom: 8 }} />
            <div style={{ fontSize: 15, fontWeight: 500 }}>No diary entries found</div>
          </div>
        )}
      </div>
    </div>
  );
}
