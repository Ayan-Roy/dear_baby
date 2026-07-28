import React, { useState } from "react";
import { CHECKLISTS } from "../data/dummyData.js";

export default function Checklists() {
  const [data, setData] = useState(CHECKLISTS);
  const [active, setActive] = useState("Hospital Bag");

  function toggle(cat, idx) {
    setData(prev => {
      const items = prev[cat].map((it, i) => i === idx ? { ...it, done: !it.done } : it);
      return { ...prev, [cat]: items };
    });
  }

  const items = data[active];
  const donePct = Math.round((items.filter(i => i.done).length / items.length) * 100);

  return (
    <div>
      <h1 className="db-serif db-page-title">Checklists</h1>
      <p className="db-page-sub">Everything to prepare, one gentle checkbox at a time.</p>

      <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
        {Object.keys(data).map(cat => (
          <button key={cat} className={`db-chip ${active === cat ? "active" : ""}`} onClick={() => setActive(cat)}>{cat}</button>
        ))}
      </div>

      <div className="db-card">
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <div className="db-label">{items.filter(i => i.done).length} of {items.length} done</div>
          <div className="db-label">{donePct}%</div>
        </div>
        <div className="db-progressbar" style={{ marginBottom: 16 }}><div style={{ width: `${donePct}%` }} /></div>
        {items.map((it, idx) => (
          <label className={`db-check-row ${it.done ? "done" : ""}`} key={idx}>
            <input type="checkbox" checked={it.done} onChange={() => toggle(active, idx)} />
            <span style={{ fontSize: 14 }}>{it.t}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
