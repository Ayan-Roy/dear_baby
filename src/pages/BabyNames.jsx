import React, { useState } from "react";
import { Plus, Heart } from "lucide-react";
import { BABY_NAMES } from "../data/dummyData.js";

export default function BabyNames() {
  const [names, setNames] = useState(BABY_NAMES);
  const [draft, setDraft] = useState({ name: "", meaning: "" });

  function vote(i) {
    setNames(prev => prev.map((n, idx) => idx === i ? { ...n, votes: n.votes + 1 } : n));
  }
  function add() {
    if (!draft.name) return;
    setNames(prev => [...prev, { ...draft, votes: 0 }]);
    setDraft({ name: "", meaning: "" });
  }

  const sorted = [...names].sort((a, b) => b.votes - a.votes);

  return (
    <div>
      <h1 className="db-serif db-page-title">Baby name list</h1>
      <p className="db-page-sub">Favourites, meanings, and a little friendly voting.</p>

      <div className="db-card" style={{ marginBottom: 20, display: "flex", gap: 10, flexWrap: "wrap" }}>
        <input className="db-input" placeholder="Name" value={draft.name} onChange={e => setDraft({ ...draft, name: e.target.value })} style={{ flex: 1, minWidth: 140 }} />
        <input className="db-input" placeholder="Meaning" value={draft.meaning} onChange={e => setDraft({ ...draft, meaning: e.target.value })} style={{ flex: 1.5, minWidth: 160 }} />
        <button className="db-btn primary" onClick={add} style={{ minWidth: 80 }}><Plus size={14} /> Add</button>
      </div>

      <div className="db-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
        {sorted.map((n, i) => (
          <div className="db-card" key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div className="db-serif" style={{ fontSize: 18, fontWeight: 600 }}>{n.name}</div>
              <div style={{ fontSize: 12.5, color: "var(--ink-soft)", marginTop: 2 }}>{n.meaning}</div>
            </div>
            <button className="db-btn" onClick={() => vote(names.indexOf(n))}>
              <Heart size={13} color="var(--rose)" /> {n.votes}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
