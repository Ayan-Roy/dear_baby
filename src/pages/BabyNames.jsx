import React, { useState, useEffect } from "react";
import { Plus, Heart, Search, Trash2, Sparkles } from "lucide-react";
import { BABY_NAMES } from "../data/dummyData.js";

export default function BabyNames() {
  const [names, setNames] = useState(() => {
    const saved = localStorage.getItem("dear_baby_names");
    if (saved) return JSON.parse(saved);
    return BABY_NAMES.map((n, i) => ({ id: i + 1, ...n }));
  });

  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState({ name: "", meaning: "", gender: "Girl 👧" });

  useEffect(() => {
    localStorage.setItem("dear_baby_names", JSON.stringify(names));
  }, [names]);

  function vote(id) {
    setNames(prev =>
      prev.map(n => (n.id === id ? { ...n, votes: (n.votes || 0) + 1 } : n))
    );
  }

  function deleteName(id) {
    setNames(prev => prev.filter(n => n.id !== id));
  }

  function add(e) {
    e.preventDefault();
    if (!draft.name.trim()) return;
    setNames(prev => [
      ...prev,
      {
        id: Date.now(),
        name: draft.name.trim(),
        meaning: draft.meaning.trim() || "Chosen with love",
        gender: draft.gender,
        votes: 1
      }
    ]);
    setDraft({ name: "", meaning: "", gender: "Girl 👧" });
  }

  const filtered = names.filter(
    n =>
      n.name.toLowerCase().includes(search.toLowerCase()) ||
      (n.meaning && n.meaning.toLowerCase().includes(search.toLowerCase()))
  );

  const sorted = [...filtered].sort((a, b) => b.votes - a.votes);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 className="db-serif db-page-title">Baby Name Ideas</h1>
          <p className="db-page-sub">Favourites, meanings, and friendly voting with family.</p>
        </div>
      </div>

      {/* Add New Name Form Card */}
      <form onSubmit={add} className="db-card" style={{ marginBottom: 24 }}>
        <div className="db-label" style={{ marginBottom: 10 }}>Suggest a new name</div>
        <div className="db-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginBottom: 12 }}>
          <input
            className="db-input"
            placeholder="Baby Name (e.g. Maya)"
            value={draft.name}
            onChange={e => setDraft({ ...draft, name: e.target.value })}
            required
          />
          <input
            className="db-input"
            placeholder="Meaning / Origin (e.g. Princess, Water)"
            value={draft.meaning}
            onChange={e => setDraft({ ...draft, meaning: e.target.value })}
          />
          <select
            className="db-input"
            value={draft.gender}
            onChange={e => setDraft({ ...draft, gender: e.target.value })}
          >
            <option value="Girl 👧">Girl 👧</option>
            <option value="Boy 👦">Boy 👦</option>
            <option value="Unisex ✨">Unisex ✨</option>
          </select>
        </div>
        <button type="submit" className="db-btn primary">
          <Plus size={15} /> Add to name list
        </button>
      </form>

      {/* Search Input Bar */}
      <div style={{ position: "relative", marginBottom: 20 }}>
        <Search size={16} style={{ position: "absolute", left: 14, top: 13, color: "var(--ink-soft)" }} />
        <input
          className="db-input"
          style={{ paddingLeft: 40 }}
          placeholder="Search name ideas or meanings..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Names Grid */}
      <div className="db-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
        {sorted.map(n => (
          <div
            className="db-card db-card-hover"
            key={n.id}
            style={{
              display: "flex",
              justify: "space-between",
              alignItems: "center",
              padding: "16px 20px"
            }}
          >
            <div style={{ minWidth: 0, paddingRight: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span className="db-serif" style={{ fontSize: 20, fontWeight: 600 }}>{n.name}</span>
                {n.gender && (
                  <span style={{ fontSize: 11, background: "var(--paper-alt)", padding: "2px 6px", borderRadius: 6 }}>
                    {n.gender}
                  </span>
                )}
              </div>
              <div style={{ fontSize: 12.5, color: "var(--ink-soft)", marginTop: 4, lineHeight: 1.35 }}>
                {n.meaning}
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button
                type="button"
                className="db-btn"
                onClick={() => vote(n.id)}
                style={{
                  borderColor: "var(--rose-light)",
                  background: "var(--paper)",
                  padding: "6px 12px"
                }}
              >
                <Heart size={14} color="var(--rose)" fill="var(--rose)" />
                <span style={{ fontWeight: 700, fontSize: 13 }}>{n.votes}</span>
              </button>

              <button
                type="button"
                onClick={() => deleteName(n.id)}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--ink-soft)",
                  cursor: "pointer",
                  padding: 4,
                  opacity: 0.5
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = 1}
                onMouseLeave={e => e.currentTarget.style.opacity = 0.5}
                title="Remove name idea"
              >
                <Trash2 size={15} color="#D93838" />
              </button>
            </div>
          </div>
        ))}

        {sorted.length === 0 && (
          <div className="db-card" style={{ gridColumn: "1 / -1", textAlign: "center", padding: "30px 10px", color: "var(--ink-soft)" }}>
            <Sparkles size={24} color="var(--rose)" style={{ marginBottom: 6 }} />
            <div>No matching baby name ideas found.</div>
          </div>
        )}
      </div>
    </div>
  );
}
