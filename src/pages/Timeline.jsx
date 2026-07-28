import React, { useState } from "react";
import { Plus, X } from "lucide-react";
import { CURRENT_WEEK } from "../data/dummyData.js";
import { fmtDate } from "../utils.js";

export default function Timeline({ events, addEvent }) {
  const [filter, setFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [draft, setDraft] = useState({ title: "", date: "", cat: "Custom", note: "", mood: "🤍" });
  const cats = ["All", "Milestone", "Medical", "Family", "Custom", "Body"];

  const sorted = [...events].sort((a, b) => new Date(a.date) - new Date(b.date));
  const filtered = filter === "All" ? sorted : sorted.filter(e => e.cat === filter);

  function submit() {
    if (!draft.title || !draft.date) return;
    addEvent({ ...draft, id: Date.now(), week: CURRENT_WEEK });
    setDraft({ title: "", date: "", cat: "Custom", note: "", mood: "🤍" });
    setShowForm(false);
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1 className="db-serif db-page-title">Your pregnancy timeline</h1>
          <p className="db-page-sub">Every moment, in order, exactly as it happened.</p>
        </div>
        <button className="db-btn rose" onClick={() => setShowForm(s => !s)}>
          {showForm ? <X size={14} /> : <Plus size={14} />} {showForm ? "Cancel" : "Add memory"}
        </button>
      </div>

      {showForm && (
        <div className="db-card" style={{ marginBottom: 22 }}>
          <div className="db-grid" style={{ gridTemplateColumns: "1fr 1fr", marginBottom: 10 }}>
            <input className="db-input" placeholder="Title — e.g. We chose a name" value={draft.title} onChange={e => setDraft({ ...draft, title: e.target.value })} />
            <input className="db-input" type="date" value={draft.date} onChange={e => setDraft({ ...draft, date: e.target.value })} />
          </div>
          <textarea className="db-input" rows={2} placeholder="Tell the story..." value={draft.note} onChange={e => setDraft({ ...draft, note: e.target.value })} style={{ marginBottom: 10 }} />
          <button className="db-btn primary" onClick={submit}>Save to timeline</button>
        </div>
      )}

      <div style={{ display: "flex", gap: 8, marginBottom: 22, flexWrap: "wrap" }}>
        {cats.map(c => (
          <button key={c} className={`db-chip ${filter === c ? "active" : ""}`} onClick={() => setFilter(c)}>{c}</button>
        ))}
      </div>

      <div className="db-ribbon">
        {filtered.map(e => (
          <div className="db-ribbon-item" key={e.id}>
            <div className={`db-ribbon-dot ${e.gold ? "gold" : ""}`}><span style={{ fontSize: 11 }}>{e.mood}</span></div>
            <div className="db-card">
              <div className="db-label">{fmtDate(e.date)} · Week {e.week} · {e.cat}</div>
              <div className="db-serif" style={{ fontWeight: 600, fontSize: 16, margin: "4px 0 6px 0" }}>{e.title}</div>
              {e.note && <div style={{ fontSize: 13.5, color: "var(--ink-soft)", lineHeight: 1.5 }}>{e.note}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
