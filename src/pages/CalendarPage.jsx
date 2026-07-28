import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Heart, Stethoscope, BookOpen, X } from "lucide-react";
import { fmtDate } from "../utils.js";
import { CURRENT_WEEK } from "../data/dummyData.js";

export default function CalendarPage({ events = [], visits = [], journal = [], addEvent }) {
  // Start near June 2026 for seed data, offset 4 from Feb 2026
  const [monthOffset, setMonthOffset] = useState(4);
  const base = new Date(2026, 1, 1);
  const view = new Date(base.getFullYear(), base.getMonth() + monthOffset, 1);
  const year = view.getFullYear(), month = view.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Today string for highlighting
  const todayStr = "2026-06-22";
  const [selectedDate, setSelectedDate] = useState("2026-06-22");
  const [showAddModal, setShowAddModal] = useState(false);

  const [draft, setDraft] = useState({
    title: "",
    cat: "Milestone",
    mood: "🌸",
    note: ""
  });

  // Organize items by date string YYYY-MM-DD
  const eventsByDate = {};
  const visitsByDate = {};
  const journalByDate = {};

  events.forEach(e => {
    if (!eventsByDate[e.date]) eventsByDate[e.date] = [];
    eventsByDate[e.date].push(e);
  });

  visits.forEach(v => {
    if (!visitsByDate[v.date]) visitsByDate[v.date] = [];
    visitsByDate[v.date].push(v);
  });

  journal.forEach(j => {
    if (!journalByDate[j.date]) journalByDate[j.date] = [];
    journalByDate[j.date].push(j);
  });

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  // Selected date details
  const selEvents = selectedDate ? (eventsByDate[selectedDate] || []) : [];
  const selVisits = selectedDate ? (visitsByDate[selectedDate] || []) : [];
  const selJournal = selectedDate ? (journalByDate[selectedDate] || []) : [];
  const totalSelItems = selEvents.length + selVisits.length + selJournal.length;

  function handleAddSubmit(e) {
    e.preventDefault();
    if (!draft.title || !selectedDate) return;
    addEvent({
      ...draft,
      id: Date.now(),
      date: selectedDate,
      week: CURRENT_WEEK
    });
    setDraft({ title: "", cat: "Milestone", mood: "🌸", note: "" });
    setShowAddModal(false);
  }

  function resetToToday() {
    setMonthOffset(4); // June 2026
    setSelectedDate("2026-06-22");
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 6 }}>
        <div>
          <h1 className="db-serif db-page-title">Calendar</h1>
          <p className="db-page-sub">Click any date to inspect milestones, appointments, and journal notes.</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="db-btn" onClick={resetToToday}>
            <CalendarIcon size={14} /> Jump to today
          </button>
          {selectedDate && (
            <button className="db-btn rose" onClick={() => setShowAddModal(true)}>
              <Plus size={14} /> Log event on {selectedDate.slice(5)}
            </button>
          )}
        </div>
      </div>

      {/* Main Responsive Layout: Calendar Grid + Selected Day Inspector */}
      <div className="db-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20 }}>
        
        {/* Calendar Card */}
        <div className="db-card" style={{ height: "fit-content" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <button className="db-btn" onClick={() => setMonthOffset(m => m - 1)}><ChevronLeft size={14} /></button>
            <div className="db-serif" style={{ fontSize: 18, fontWeight: 600 }}>
              {view.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </div>
            <button className="db-btn" onClick={() => setMonthOffset(m => m + 1)}><ChevronRight size={14} /></button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6, fontSize: 11, color: "var(--ink-soft)", marginBottom: 8, textAlign: "center", fontWeight: 600 }}>
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d, i) => <div key={i}>{d}</div>)}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6 }}>
            {cells.map((d, i) => {
              if (!d) return <div key={i} style={{ aspectRatio: "1" }} />;
              
              const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
              const dayEvents = eventsByDate[dateStr] || [];
              const dayVisits = visitsByDate[dateStr] || [];
              const dayJournal = journalByDate[dateStr] || [];
              
              const hasEvents = dayEvents.length > 0;
              const hasVisits = dayVisits.length > 0;
              const hasJournal = dayJournal.length > 0;
              const hasAny = hasEvents || hasVisits || hasJournal;

              const isSelected = selectedDate === dateStr;
              const isToday = dateStr === todayStr;

              return (
                <button
                  key={i}
                  onClick={() => setSelectedDate(dateStr)}
                  style={{
                    aspectRatio: "1",
                    borderRadius: 12,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "6px 2px",
                    fontSize: 12.5,
                    fontWeight: isSelected || isToday ? 700 : 500,
                    background: isSelected
                      ? "var(--rose-light)"
                      : isToday
                      ? "var(--gold-light)"
                      : hasAny
                      ? "var(--paper-alt)"
                      : "var(--card)",
                    border: isSelected
                      ? "2px solid var(--rose)"
                      : isToday
                      ? "2px solid var(--gold)"
                      : "1px solid var(--line)",
                    color: "var(--ink)",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                    boxShadow: isSelected ? "0 2px 8px rgba(198,118,127,0.25)" : "none"
                  }}
                >
                  <span>{d}</span>
                  
                  {/* Indicators */}
                  <div style={{ display: "flex", gap: 2, alignItems: "center", justifyContent: "center", minHeight: 12 }}>
                    {hasVisits && <span title="Doctor visit" style={{ fontSize: 9 }}>🩺</span>}
                    {hasEvents && <span title="Milestone memory" style={{ fontSize: 9 }}>{dayEvents[0].mood || "🌸"}</span>}
                    {hasJournal && <span title="Journal entry" style={{ fontSize: 9 }}>📝</span>}
                  </div>
                </button>
              );
            })}
          </div>

          <div style={{ display: "flex", gap: 14, marginTop: 14, fontSize: 11.5, color: "var(--ink-soft)", justifyContent: "center", flexWrap: "wrap" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--rose)" }}></span> Selected
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--gold)" }}></span> Today
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
              🩺 Doctor visit
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
              📝 Journal
            </span>
          </div>
        </div>

        {/* Selected Date Inspector Card */}
        <div className="db-card" style={{ height: "fit-content" }}>
          <div style={{ borderBottom: "1px dashed var(--line)", paddingBottom: 12, marginBottom: 14 }}>
            <div className="db-label">Selected Date Details</div>
            <div className="db-serif" style={{ fontSize: 20, fontWeight: 600, marginTop: 2 }}>
              {selectedDate ? fmtDate(selectedDate) : "Select a date"}
            </div>
          </div>

          {totalSelItems === 0 ? (
            <div style={{ textAlign: "center", padding: "30px 10px", color: "var(--ink-soft)" }}>
              <Heart size={28} color="var(--rose)" style={{ opacity: 0.6, marginBottom: 8 }} />
              <div style={{ fontSize: 14, fontWeight: 500 }}>No entries recorded for this date</div>
              <p style={{ fontSize: 12.5, margin: "4px 0 16px 0" }}>Capture a milestone or note right from here.</p>
              <button className="db-btn rose" onClick={() => setShowAddModal(true)}>
                <Plus size={14} /> Add entry on {selectedDate ? fmtDate(selectedDate) : "this date"}
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {/* Doctor Visits */}
              {selVisits.length > 0 && (
                <div>
                  <div className="db-label" style={{ display: "flex", alignItems: "center", gap: 4, color: "var(--rose)", marginBottom: 6 }}>
                    <Stethoscope size={13} /> Doctor Appointments
                  </div>
                  {selVisits.map((v, idx) => (
                    <div key={idx} style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 10, padding: "10px 12px", marginBottom: 6 }}>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{v.doctor}</div>
                      <div style={{ fontSize: 12.5, color: "var(--ink-soft)", marginTop: 2 }}>{v.note}</div>
                      {v.bp && <div style={{ fontSize: 11.5, color: "var(--rose)", marginTop: 4, fontWeight: 600 }}>BP: {v.bp}</div>}
                    </div>
                  ))}
                </div>
              )}

              {/* Timeline Events */}
              {selEvents.length > 0 && (
                <div>
                  <div className="db-label" style={{ display: "flex", alignItems: "center", gap: 4, color: "var(--gold)", marginBottom: 6 }}>
                    <Heart size={13} /> Timeline Memories
                  </div>
                  {selEvents.map((e, idx) => (
                    <div key={idx} style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 10, padding: "10px 12px", marginBottom: 6 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>
                          {e.mood} {e.title}
                        </div>
                        <span className="db-chip" style={{ fontSize: 10, padding: "2px 8px" }}>{e.cat}</span>
                      </div>
                      {e.note && <div style={{ fontSize: 12.5, color: "var(--ink-soft)", marginTop: 4 }}>{e.note}</div>}
                    </div>
                  ))}
                </div>
              )}

              {/* Journal Letters */}
              {selJournal.length > 0 && (
                <div>
                  <div className="db-label" style={{ display: "flex", alignItems: "center", gap: 4, color: "var(--sage)", marginBottom: 6 }}>
                    <BookOpen size={13} /> Dear Baby Journal
                  </div>
                  {selJournal.map((j, idx) => (
                    <div key={idx} style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 10, padding: "10px 12px", marginBottom: 6 }}>
                      <div style={{ fontSize: 13, fontStyle: "italic", color: "var(--ink)" }}>"{j.text}"</div>
                      {j.mood && <div style={{ fontSize: 11.5, marginTop: 4 }}>Mood: {j.mood}</div>}
                    </div>
                  ))}
                </div>
              )}

              <button className="db-btn primary" onClick={() => setShowAddModal(true)} style={{ marginTop: 6 }}>
                <Plus size={14} /> Add another milestone for this day
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add Memory Modal */}
      {showAddModal && (
        <form onSubmit={handleAddSubmit} className="db-card" style={{ marginTop: 20, border: "2px solid var(--rose)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div className="db-label">Log Memory for {selectedDate ? fmtDate(selectedDate) : ""}</div>
            <button type="button" className="db-btn" onClick={() => setShowAddModal(false)} style={{ padding: 4 }}>
              <X size={14} />
            </button>
          </div>

          <div className="db-grid" style={{ gridTemplateColumns: "2fr 1fr 1fr", marginBottom: 10 }}>
            <div>
              <label style={{ fontSize: 11, color: "var(--ink-soft)", display: "block", marginBottom: 4 }}>Title</label>
              <input
                className="db-input"
                type="text"
                placeholder="e.g. First ultrasound scan"
                value={draft.title}
                onChange={e => setDraft({ ...draft, title: e.target.value })}
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
            <div>
              <label style={{ fontSize: 11, color: "var(--ink-soft)", display: "block", marginBottom: 4 }}>Mood Emoji</label>
              <input
                className="db-input"
                type="text"
                value={draft.mood}
                onChange={e => setDraft({ ...draft, mood: e.target.value })}
                placeholder="🌸"
              />
            </div>
          </div>

          <textarea
            className="db-input"
            rows={2}
            placeholder="Write a note about this moment..."
            value={draft.note}
            onChange={e => setDraft({ ...draft, note: e.target.value })}
            style={{ marginBottom: 10 }}
          />

          <button type="submit" className="db-btn rose">Save to Calendar & Timeline</button>
        </form>
      )}
    </div>
  );
}

