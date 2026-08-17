import React, { useState } from "react";
import { Plus, X, Search, Sparkles, Heart } from "lucide-react";
import { CURRENT_WEEK } from "../data/dummyData.js";
import { fmtDate } from "../utils.js";

const EMOJI_PRESETS = ["💖", "😍", "🥰", "😄", "😭", "💛", "🎨", "🎵", "🌸", "✨"];

export default function Timeline({ events, addEvent }) {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const todayStr = new Date().toISOString().split("T")[0];
  const hasEntryToday = events.some(e => e.date === todayStr);

  const [showForm, setShowForm] = useState(() => !hasEntryToday);
  const [draft, setDraft] = useState({
    title: "",
    date: todayStr,
    cat: "Milestone",
    note: "",
    mood: "💖",
    gold: false
  });

  const cats = ["All", "Milestone", "Medical", "Family", "Custom", "Body"];

  const sorted = [...events].sort((a, b) => new Date(b.date) - new Date(a.date));

  const filtered = sorted.filter(e => {
    const matchesCat = filter === "All" || e.cat === filter;
    const matchesSearch =
      !search ||
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      (e.note && e.note.toLowerCase().includes(search.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  function submit(e) {
    e.preventDefault();
    if (!draft.title.trim() || !draft.date) return;

    addEvent({
      ...draft,
      id: Date.now(),
      week: CURRENT_WEEK
    });

    setDraft({
      title: "",
      date: new Date().toISOString().split("T")[0],
      cat: "Milestone",
      note: "",
      mood: "🥹",
      gold: false
    });
    setShowForm(false);
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 12 }}>
        <div>
          <h1 className="db-serif db-page-title">Pregnancy Timeline</h1>
          <p className="db-page-sub">Every milestone moment, captured forever in chronological ribbon order.</p>
        </div>
        <button className="db-btn rose" onClick={() => setShowForm(s => !s)}>
          {showForm ? <X size={15} /> : <Plus size={15} />}
          {showForm ? "Close Form" : (!hasEntryToday ? "✨ Log Today's Milestone" : "Add Milestone Memory")}
        </button>
      </div>

      {/* Add Memory Form Card */}
      {showForm && (
        <form onSubmit={submit} className="db-card" style={{ marginBottom: 24, border: "2px solid var(--rose)" }}>
          <div className="db-label" style={{ marginBottom: 12, color: "var(--rose)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>{!hasEntryToday ? "🌸 Today's Milestone — Write a memory for today" : "New Milestone Entry"}</span>
            {!hasEntryToday && (
              <span className="db-chip active" style={{ fontSize: 10, padding: "2px 8px" }}>Auto-Opened for Today</span>
            )}
          </div>

          <div className="db-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginBottom: 12 }}>
            <div>
              <label style={{ fontSize: 11, color: "var(--ink-soft)", display: "block", marginBottom: 4 }}>Milestone Title *</label>
              <input
                className="db-input"
                placeholder="e.g. We felt the first kick today!"
                value={draft.title}
                onChange={e => setDraft({ ...draft, title: e.target.value })}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: 11, color: "var(--ink-soft)", display: "block", marginBottom: 4 }}>Date *</label>
              <input
                className="db-input"
                type="date"
                value={draft.date}
                onChange={e => setDraft({ ...draft, date: e.target.value })}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: 11, color: "var(--ink-soft)", display: "block", marginBottom: 4 }}>Category</label>
              <select
                className="db-input"
                value={draft.cat}
                onChange={e => setDraft({ ...draft, cat: e.target.value })}
              >
                <option value="Milestone">Milestone</option>
                <option value="Medical">Medical</option>
                <option value="Family">Family</option>
                <option value="Custom">Custom</option>
                <option value="Body">Body</option>
              </select>
            </div>
          </div>

          {/* Mood Emoji Preset Selector */}
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 11, color: "var(--ink-soft)", display: "block", marginBottom: 6 }}>Pick a Feeling Emoji</label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {EMOJI_PRESETS.map(em => (
                <button
                  key={em}
                  type="button"
                  onClick={() => setDraft({ ...draft, mood: em })}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    fontSize: 18,
                    border: draft.mood === em ? "2px solid var(--rose)" : "1px solid var(--line)",
                    background: draft.mood === em ? "var(--rose-light)" : "var(--paper)",
                    cursor: "pointer"
                  }}
                >
                  {em}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 11, color: "var(--ink-soft)", display: "block", marginBottom: 4 }}>Memory Story / Note</label>
            <textarea
              className="db-input"
              rows={3}
              placeholder="Tell the full story behind this milestone..."
              value={draft.note}
              onChange={e => setDraft({ ...draft, note: e.target.value })}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={draft.gold}
                onChange={e => setDraft({ ...draft, gold: e.target.checked })}
                style={{ accentColor: "var(--gold)" }}
              />
              <span style={{ fontWeight: 600, color: "var(--gold)" }}>⭐ Highlight as Major Milestone</span>
            </label>

            <button type="submit" className="db-btn rose">
              Save to Timeline
            </button>
          </div>
        </form>
      )}

      {/* Filter and Search Bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {cats.map(c => (
            <button
              key={c}
              className={`db-chip ${filter === c ? "active" : ""}`}
              onClick={() => setFilter(c)}
            >
              {c}
            </button>
          ))}
        </div>

        <div style={{ position: "relative", minWidth: 200 }}>
          <Search size={15} style={{ position: "absolute", left: 12, top: 11, color: "var(--ink-soft)" }} />
          <input
            className="db-input"
            style={{ paddingLeft: 36, padding: "8px 12px 8px 36px", fontSize: 13 }}
            placeholder="Search timeline..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Timeline Ribbon List */}
      <div className="db-ribbon">
        {filtered.map(e => (
          <div className="db-ribbon-item" key={e.id}>
            <div className={`db-ribbon-dot ${e.gold ? "gold" : ""}`}>
              <span style={{ fontSize: 11 }}>{e.mood || "🌸"}</span>
            </div>
            <div className="db-card db-card-hover">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <div className="db-label">
                  {fmtDate(e.date)} · Week {e.week} · {e.cat}
                </div>
                {e.gold && (
                  <span style={{ fontSize: 11, background: "var(--gold-light)", color: "var(--gold)", padding: "2px 8px", borderRadius: 6, fontWeight: 700 }}>
                    Major Milestone
                  </span>
                )}
              </div>
              <div className="db-serif" style={{ fontWeight: 600, fontSize: 17, margin: "4px 0 6px 0" }}>
                {e.title}
              </div>
              {e.note && (
                <div style={{ fontSize: 13.5, color: "var(--ink-soft)", lineHeight: 1.55 }}>
                  {e.note}
                </div>
              )}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="db-card" style={{ textAlign: "center", padding: "40px 20px", color: "var(--ink-soft)" }}>
            <Heart size={28} color="var(--rose)" style={{ opacity: 0.6, marginBottom: 8 }} />
            <div style={{ fontSize: 15, fontWeight: 500 }}>No timeline memories match your search</div>
          </div>
        )}
      </div>
    </div>
  );
}
