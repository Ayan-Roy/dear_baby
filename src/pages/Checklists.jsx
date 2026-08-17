import React, { useState, useEffect } from "react";
import { Plus, Trash2, CheckCircle2, Circle } from "lucide-react";
import { CHECKLISTS } from "../data/dummyData.js";

export default function Checklists() {
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem("dear_baby_checklists");
    return saved ? JSON.parse(saved) : CHECKLISTS;
  });
  const [active, setActive] = useState("Hospital Bag");
  const [newItemText, setNewItemText] = useState("");

  useEffect(() => {
    localStorage.setItem("dear_baby_checklists", JSON.stringify(data));
  }, [data]);

  function toggle(cat, idx) {
    setData(prev => {
      const items = prev[cat].map((it, i) => i === idx ? { ...it, done: !it.done } : it);
      return { ...prev, [cat]: items };
    });
  }

  function addItem(e) {
    e.preventDefault();
    if (!newItemText.trim()) return;
    setData(prev => ({
      ...prev,
      [active]: [...(prev[active] || []), { t: newItemText.trim(), done: false }]
    }));
    setNewItemText("");
  }

  function deleteItem(cat, idx) {
    setData(prev => ({
      ...prev,
      [cat]: prev[cat].filter((_, i) => i !== idx)
    }));
  }

  const items = data[active] || [];
  const doneCount = items.filter(i => i.done).length;
  const donePct = items.length > 0 ? Math.round((doneCount / items.length) * 100) : 0;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 className="db-serif db-page-title">Preparation Checklists</h1>
          <p className="db-page-sub">Everything to prepare, one gentle checkbox at a time.</p>
        </div>
      </div>

      {/* Category Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {Object.keys(data).map(cat => (
          <button
            key={cat}
            className={`db-chip ${active === cat ? "active" : ""}`}
            onClick={() => setActive(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="db-card">
        {/* Progress bar and counter */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
          <div className="db-label">{doneCount} of {items.length} items completed</div>
          <div className="db-label" style={{ color: "var(--sage)", fontWeight: 700 }}>{donePct}%</div>
        </div>

        <div className="db-progressbar" style={{ marginBottom: 20 }}>
          <div style={{ width: `${donePct}%`, transition: "width 0.3s ease" }} />
        </div>

        {/* List of items */}
        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 20 }}>
          {items.map((it, idx) => (
            <div
              key={idx}
              className={`db-check-row ${it.done ? "done" : ""}`}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 8px",
                borderRadius: 8,
                transition: "background 0.15s ease",
                cursor: "pointer"
              }}
              onClick={() => toggle(active, idx)}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                {it.done ? (
                  <CheckCircle2 size={18} color="var(--sage)" fill="var(--sage-light)" />
                ) : (
                  <Circle size={18} color="var(--ink-soft)" />
                )}
                <span style={{ fontSize: 14, fontWeight: it.done ? 400 : 500 }}>{it.t}</span>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteItem(active, idx);
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--ink-soft)",
                  cursor: "pointer",
                  padding: 4,
                  opacity: 0.6,
                  transition: "opacity 0.15s"
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = 1}
                onMouseLeave={e => e.currentTarget.style.opacity = 0.6}
                title="Delete item"
              >
                <Trash2 size={15} color="#D93838" />
              </button>
            </div>
          ))}

          {items.length === 0 && (
            <div style={{ textAlign: "center", padding: "20px 0", color: "var(--ink-soft)", fontSize: 13.5 }}>
              No items in this checklist yet. Add one below!
            </div>
          )}
        </div>

        {/* Add new checklist item form */}
        <form onSubmit={addItem} style={{ display: "flex", gap: 10 }}>
          <input
            className="db-input"
            placeholder={`Add item to ${active}...`}
            value={newItemText}
            onChange={e => setNewItemText(e.target.value)}
          />
          <button type="submit" className="db-btn primary" style={{ flexShrink: 0 }}>
            <Plus size={15} /> Add
          </button>
        </form>
      </div>
    </div>
  );
}
