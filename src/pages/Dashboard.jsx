import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Camera, BookOpen, Stethoscope, Footprints, RotateCcw, Calendar, ArrowRight, Heart } from "lucide-react";
import { ProgressRing, StatCard } from "../components/UI.jsx";
import { CURRENT_WEEK, DUE_DATE, PROMPTS } from "../data/dummyData.js";
import { daysBetween, fmtDate } from "../utils.js";

export default function Dashboard({ events = [], journal = [], photos = [], visits = [], kickData, logKick, resetKicks }) {
  const navigate = useNavigate();
  const today = new Date();
  const daysLeft = Math.max(0, daysBetween(today, DUE_DATE));
  const pct = Math.min(100, Math.round((CURRENT_WEEK / 40) * 100));
  const promptOfDay = PROMPTS[new Date().getDate() % PROMPTS.length];
  const sorted = [...events].sort((a, b) => new Date(a.date) - new Date(b.date));

  const [kickPulsing, setKickPulsing] = useState(false);

  function handleKickClick() {
    setKickPulsing(true);
    logKick();
    setTimeout(() => setKickPulsing(false), 400);
  }

  const kickTarget = 10;
  const kickPct = Math.min(100, Math.round(((kickData?.count || 0) / kickTarget) * 100));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Hero Banner Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <span className="db-chip active" style={{ fontSize: 11, padding: "3px 10px", background: "var(--rose)", borderColor: "var(--rose)" }}>
              Trimester 2 · Week {CURRENT_WEEK}
            </span>
            <span style={{ fontSize: 13, color: "var(--ink-soft)" }}>{fmtDate(today)}</span>
          </div>
          <h1 className="db-serif db-page-title" style={{ fontSize: 32 }}>
            Good morning. Week {CURRENT_WEEK} looks lovely on you.
          </h1>
        </div>
      </div>

      {/* Top Grid: Pregnancy Progress + Journal Prompt */}
      <div className="db-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20 }}>
        {/* Progress Ring Card */}
        <div className="db-card" style={{ display: "flex", alignItems: "center", gap: 24, background: "linear-gradient(135deg, var(--card), var(--paper-alt))" }}>
          <ProgressRing pct={pct} label={`Wk ${CURRENT_WEEK}`} sub="of 40" />
          <div style={{ flex: 1 }}>
            <div className="db-label">Due Date</div>
            <div className="db-serif" style={{ fontSize: 20, fontWeight: 600, color: "var(--ink)", marginBottom: 10 }}>
              {fmtDate(DUE_DATE)}
            </div>
            <div className="db-label">Countdown</div>
            <div className="db-serif" style={{ fontSize: 20, fontWeight: 600, color: "var(--rose)" }}>
              {daysLeft} days remaining
            </div>
          </div>
        </div>

        {/* Prompt of the Day Card */}
        <div className="db-card" style={{ background: "linear-gradient(135deg, var(--sage-light), #EEF3E8)", border: "1px solid var(--sage)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div className="db-label" style={{ color: "var(--sage)", display: "flex", alignItems: "center", gap: 6 }}>
              <Sparkles size={13} /> Today's Journal Prompt
            </div>
            <p className="db-serif" style={{ fontStyle: "italic", fontSize: 17, margin: "10px 0 0 0", lineHeight: 1.45, color: "var(--ink)" }}>
              "{promptOfDay}"
            </p>
          </div>
          <button className="db-btn primary" style={{ alignSelf: "flex-start", marginTop: 16 }} onClick={() => navigate("/journal")}>
            <BookOpen size={14} /> Write today's letter
          </button>
        </div>
      </div>

      {/* Interactive Baby Kick & Flutter Counter Card */}
      <div className="db-card" style={{ background: "linear-gradient(135deg, var(--rose-light), #FAF0F2)", border: "1px solid var(--rose)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
          <div>
            <div className="db-label" style={{ color: "var(--rose)", display: "flex", alignItems: "center", gap: 6 }}>
              <Footprints size={15} /> Baby Kick & Flutter Tracker
            </div>
            <div className="db-serif" style={{ fontSize: 18, fontWeight: 600, marginTop: 2 }}>
              Count your baby's daily movements
            </div>
          </div>

          <button className="db-btn" onClick={resetKicks} style={{ fontSize: 12, padding: "5px 10px" }}>
            <RotateCcw size={13} /> Reset session
          </button>
        </div>

        <div className="db-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20, alignItems: "center" }}>
          {/* Large Tap to Count Button */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <button
              onClick={handleKickClick}
              style={{
                width: 110,
                height: 110,
                borderRadius: "50%",
                background: "var(--rose)",
                color: "white",
                border: "4px solid white",
                boxShadow: kickPulsing
                  ? "0 0 0 16px rgba(198,118,127,0.3)"
                  : "0 6px 20px rgba(198,118,127,0.35)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transform: kickPulsing ? "scale(0.94)" : "scale(1)",
                transition: "all 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
              }}
            >
              <Footprints size={28} />
              <span style={{ fontSize: 12, fontWeight: 700, marginTop: 4 }}>+ Record Kick</span>
            </button>
            <span style={{ fontSize: 11.5, color: "var(--ink-soft)" }}>Tap every time baby kicks or flutters</span>
          </div>

          {/* Kick Stats & Progress Bar */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <div style={{ fontSize: 32, fontWeight: 700, fontFamily: "Fraunces, serif", color: "var(--ink)" }}>
                {kickData?.count || 0} <span style={{ fontSize: 16, fontWeight: 500, color: "var(--ink-soft)" }}>kicks today</span>
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--rose)" }}>
                Last: {kickData?.lastKickTime || "Just now"}
              </div>
            </div>

            {/* Target Progress Bar */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--ink-soft)", marginBottom: 4 }}>
                <span>Daily movement goal ({kickTarget} kicks)</span>
                <span style={{ fontWeight: 600, color: "var(--ink)" }}>{kickPct}%</span>
              </div>
              <div style={{ width: "100%", height: 10, background: "rgba(255,255,255,0.7)", borderRadius: 999, overflow: "hidden" }}>
                <div
                  style={{
                    width: `${kickPct}%`,
                    height: "100%",
                    background: kickPct >= 100 ? "var(--sage)" : "var(--rose)",
                    borderRadius: 999,
                    transition: "width 0.3s ease"
                  }}
                />
              </div>
              {kickPct >= 100 && (
                <div style={{ fontSize: 12, color: "var(--sage)", fontWeight: 600, marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>
                  <Heart size={12} fill="var(--sage)" /> Target met! Baby is active & healthy today.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Shortcuts */}
      <div>
        <div className="db-label" style={{ marginBottom: 10 }}>Quick Shortcuts</div>
        <div className="db-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14 }}>
          <button className="db-card" onClick={() => navigate("/journal")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", textAlign: "left" }}>
            <BookOpen size={20} color="var(--rose)" />
            <div>
              <div style={{ fontWeight: 600, fontSize: 13.5 }}>Write Journal</div>
              <div style={{ fontSize: 11.5, color: "var(--ink-soft)" }}>Dear Baby notes</div>
            </div>
          </button>

          <button className="db-card" onClick={() => navigate("/medical")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", textAlign: "left" }}>
            <Stethoscope size={20} color="var(--rose)" />
            <div>
              <div style={{ fontWeight: 600, fontSize: 13.5 }}>Medical Checkup</div>
              <div style={{ fontSize: 11.5, color: "var(--ink-soft)" }}>Visits & weight</div>
            </div>
          </button>

          <button className="db-card" onClick={() => navigate("/gallery")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", textAlign: "left" }}>
            <Camera size={20} color="var(--rose)" />
            <div>
              <div style={{ fontWeight: 600, fontSize: 13.5 }}>Photo Gallery</div>
              <div style={{ fontSize: 11.5, color: "var(--ink-soft)" }}>Ultrasounds & bump</div>
            </div>
          </button>

          <button className="db-card" onClick={() => navigate("/calendar")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", textAlign: "left" }}>
            <Calendar size={20} color="var(--rose)" />
            <div>
              <div style={{ fontWeight: 600, fontSize: 13.5 }}>Calendar</div>
              <div style={{ fontSize: 11.5, color: "var(--ink-soft)" }}>Inspect dates</div>
            </div>
          </button>
        </div>
      </div>

      {/* Summary Stat Cards Grid */}
      <div className="db-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14 }}>
        <StatCard icon={<Sparkles size={17} color="var(--rose)" />} value={events.length} label="Milestones" />
        <StatCard icon={<Camera size={17} color="var(--rose)" />} value={photos.length} label="Photos" />
        <StatCard icon={<BookOpen size={17} color="var(--rose)" />} value={journal.length} label="Journal entries" />
        <StatCard icon={<Stethoscope size={17} color="var(--rose)" />} value={visits.length} label="Doctor visits" />
      </div>

      {/* Recent Memories Ribbon Section */}
      <div>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 12 }}>
          <h2 className="db-serif" style={{ fontSize: 20, fontWeight: 500, margin: 0 }}>Recent memories</h2>
          <button className="db-btn" onClick={() => navigate("/timeline")} style={{ fontSize: 12.5 }}>
            See full timeline <ArrowRight size={13} />
          </button>
        </div>

        <div className="db-ribbon">
          {sorted.slice(-3).reverse().map(e => (
            <div className="db-ribbon-item" key={e.id}>
              <div className={`db-ribbon-dot ${e.gold ? "gold" : ""}`}>
                <span style={{ fontSize: 11 }}>{e.mood}</span>
              </div>
              <div className="db-card" style={{ padding: "14px 18px", cursor: "pointer" }} onClick={() => navigate("/timeline")}>
                <div className="db-label">{fmtDate(e.date)} · Week {e.week} · {e.cat}</div>
                <div className="db-serif" style={{ fontWeight: 600, marginTop: 4, fontSize: 15 }}>{e.title}</div>
                {e.note && <div style={{ fontSize: 12.5, color: "var(--ink-soft)", marginTop: 4 }}>{e.note}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

