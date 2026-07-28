import React, { useState } from "react";
import { Plus } from "lucide-react";
import { MOODS } from "../data/dummyData.js";
import { fmtDate } from "../utils.js";

export default function Journal({ entries, addEntry }) {
  const [text, setText] = useState("");
  const [mood, setMood] = useState("Happy");

  function save() {
    if (!text.trim()) return;
    addEntry({ id: Date.now(), date: new Date().toISOString().slice(0, 10), text, mood: "💌" });
    setText("");
  }

  const sorted = [...entries].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div>
      <h1 className="db-serif db-page-title">Dear Baby</h1>
      <p className="db-page-sub">A private diary, just for the two of you.</p>

      <div className="db-card" style={{ marginBottom: 26 }}>
        <div className="db-label" style={{ marginBottom: 8 }}>How are you feeling today?</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
          {MOODS.map(m => (
            <button key={m} className={`db-chip ${mood === m ? "active" : ""}`} onClick={() => setMood(m)}>{m}</button>
          ))}
        </div>
        <textarea
          className="db-input db-serif" rows={4} placeholder="Dear Baby, today..."
          value={text} onChange={e => setText(e.target.value)} style={{ fontSize: 15.5, lineHeight: 1.6 }}
        />
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
          <button className="db-btn primary" onClick={save}><Plus size={14} /> Save entry</button>
        </div>
      </div>

      <div className="db-grid">
        {sorted.map(en => (
          <div className="db-card" key={en.id}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <div className="db-label">{fmtDate(en.date)}</div>
              <span>{en.mood}</span>
            </div>
            <p className="db-serif" style={{ fontSize: 15.5, lineHeight: 1.7, margin: 0, fontStyle: "italic" }}>{en.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
