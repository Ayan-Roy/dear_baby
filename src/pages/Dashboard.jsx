import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Camera, BookOpen, Stethoscope, Footprints, RotateCcw, Calendar, ArrowRight, Heart, Lock, Unlock, PartyPopper, Check, Baby, X } from "lucide-react";
import { ProgressRing, StatCard } from "../components/UI.jsx";
import BabyGrowthCard from "../components/BabyGrowthCard.jsx";
import { CURRENT_WEEK, DUE_DATE, PROMPTS } from "../data/dummyData.js";
import { daysBetween, fmtDate } from "../utils.js";

export default function Dashboard({
  user,
  events = [],
  journal = [],
  photos = [],
  visits = [],
  kickData,
  logKick,
  resetKicks,
  onMarkDelivered,
  onToggleKeepsakeMode
}) {
  const navigate = useNavigate();
  const today = new Date();

  const isDelivered = Boolean(user?.isDelivered);
  const birthDetails = user?.birthDetails;
  
  const currentWeek = user?.currentWeek || CURRENT_WEEK;
  const dueDateStr = user?.dueDate || DUE_DATE;
  const dueDateObj = new Date(dueDateStr);
  const daysLeft = Math.max(0, daysBetween(today, dueDateObj));
  const pct = isDelivered ? 100 : Math.min(100, Math.round((currentWeek / 40) * 100));
  const promptOfDay = PROMPTS[new Date().getDate() % PROMPTS.length];
  const sorted = [...events].sort((a, b) => new Date(a.date) - new Date(b.date));

  const recommendedGoal = currentWeek < 28 ? 6 : (currentWeek < 37 ? 10 : 12);

  const [kickPulsing, setKickPulsing] = useState(false);
  const [showBirthModal, setShowBirthModal] = useState(false);

  const [birthForm, setBirthForm] = useState({
    birthDate: new Date().toISOString().split("T")[0],
    birthTime: "08:30 AM",
    birthWeight: "3.4 kg",
    birthLength: "51 cm",
    birthPhoto: "/images/bump.jpg",
    note: "Welcome to the world, our precious angel!"
  });

  const [kickTargetMode, setKickTargetMode] = useState(() => {
    return localStorage.getItem("dear_baby_kick_mode") || "auto";
  });
  const [customKickTarget, setCustomKickTarget] = useState(() => {
    const saved = localStorage.getItem("dear_baby_kick_target");
    return saved ? Number(saved) : 10;
  });

  const kickTarget = kickTargetMode === "auto" ? recommendedGoal : customKickTarget;

  function handleKickClick() {
    if (isDelivered) return;
    setKickPulsing(true);
    logKick();
    setTimeout(() => setKickPulsing(false), 400);
  }

  function handleTargetChange(val) {
    if (val === "auto") {
      setKickTargetMode("auto");
      localStorage.setItem("dear_baby_kick_mode", "auto");
    } else {
      const num = Number(val);
      setKickTargetMode("custom");
      setCustomKickTarget(num);
      localStorage.setItem("dear_baby_kick_mode", "custom");
      localStorage.setItem("dear_baby_kick_target", num);
    }
  }

  function handleSaveBirth(e) {
    e.preventDefault();
    onMarkDelivered(birthForm);
    setShowBirthModal(false);
  }

  const mamaName = user?.name ? user.name.split(" ")[0] : "Mama";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Hero Banner Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <span
              className="db-chip active"
              style={{
                fontSize: 11,
                padding: "3px 10px",
                background: isDelivered ? "var(--sage)" : "var(--rose)",
                borderColor: isDelivered ? "var(--sage)" : "var(--rose)"
              }}
            >
              {isDelivered ? "🎉 Baby Arrived & Memories Preserved" : `Week ${currentWeek} · Baby ${user?.babyNickname || "Little Bean"}`}
            </span>
            <span style={{ fontSize: 13, color: "var(--ink-soft)" }}>{fmtDate(today)}</span>
          </div>
          <h1 className="db-serif db-page-title" style={{ fontSize: 32 }}>
            {isDelivered
              ? `Welcome to the world! ${user?.babyNickname || "Baby"} is here 💕`
              : `Good morning, ${mamaName}. Week ${currentWeek} looks lovely on you.`}
          </h1>
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {!isDelivered ? (
            currentWeek >= 40 ? (
              <button
                className="db-btn primary"
                onClick={() => setShowBirthModal(true)}
                style={{ background: "linear-gradient(135deg, var(--rose), #B35C66)", border: "none" }}
              >
                <PartyPopper size={15} /> 👶 Mark Baby Born / Lock Keepsake
              </button>
            ) : null
          ) : (
            <button
              className="db-btn"
              onClick={() => onToggleKeepsakeMode(false)}
              style={{ fontSize: 12, borderColor: "var(--line)", color: "var(--ink-soft)" }}
            >
              <Unlock size={14} /> Switch to Edit Mode
            </button>
          )}
        </div>
      </div>

      {/* Celebratory Birth Banner when Keepsake Mode is Active */}
      {isDelivered && (
        <div
          className="db-card"
          style={{
            background: "linear-gradient(135deg, #FFF9F2 0%, #F5EAE6 100%)",
            border: "2px solid var(--rose)",
            boxShadow: "0 10px 30px rgba(198, 118, 127, 0.15)",
            padding: 24,
            display: "flex",
            flexDirection: "column",
            gap: 16
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--rose)", fontWeight: 700, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>
                <PartyPopper size={16} /> Official Birth Memory Keepsake Archive
              </div>
              <h2 className="db-serif" style={{ fontSize: 26, margin: 0, color: "var(--ink)" }}>
                {user?.babyNickname || "Baby"} has arrived! 💕
              </h2>
            </div>
            <span
              style={{
                fontSize: 11.5,
                fontWeight: 700,
                color: "#166534",
                background: "#DCFCE7",
                padding: "4px 12px",
                borderRadius: 99,
                display: "inline-flex",
                alignItems: "center",
                gap: 5
              }}
            >
              <Lock size={12} /> 🔒 Preserved Memory Book (Read-Only)
            </span>
          </div>

          <div className="db-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
            <div style={{ background: "var(--card)", padding: 12, borderRadius: 10, border: "1px solid var(--line)" }}>
              <div className="db-label">Birth Date</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "var(--ink)" }}>
                {birthDetails?.birthDate ? fmtDate(birthDetails.birthDate) : fmtDate(today)}
              </div>
            </div>

            <div style={{ background: "var(--card)", padding: 12, borderRadius: 10, border: "1px solid var(--line)" }}>
              <div className="db-label">Birth Weight</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "var(--ink)" }}>
                {birthDetails?.birthWeight || "3.4 kg"}
              </div>
            </div>

            <div style={{ background: "var(--card)", padding: 12, borderRadius: 10, border: "1px solid var(--line)" }}>
              <div className="db-label">Birth Length</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "var(--ink)" }}>
                {birthDetails?.birthLength || "51 cm"}
              </div>
            </div>

            <div style={{ background: "var(--card)", padding: 12, borderRadius: 10, border: "1px solid var(--line)" }}>
              <div className="db-label">Total Saved Letters</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "var(--rose)" }}>
                📖 {journal.length} Letters & Memories
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top Grid: Pregnancy Progress + Journal Prompt */}
      <div className="db-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20 }}>
        {/* Progress Ring Card */}
        <div className="db-card" style={{ display: "flex", alignItems: "center", gap: 24, background: "linear-gradient(135deg, var(--card), var(--paper-alt))" }}>
          <ProgressRing pct={pct} label={isDelivered ? "100%" : `Wk ${currentWeek}`} sub={isDelivered ? "Completed" : "of 40"} />
          <div style={{ flex: 1 }}>
            <div className="db-label">{isDelivered ? "Status" : "Due Date"}</div>
            <div className="db-serif" style={{ fontSize: 20, fontWeight: 600, color: "var(--ink)", marginBottom: 10 }}>
              {isDelivered ? "Baby Delivered 🎉" : fmtDate(dueDateObj)}
            </div>
            <div className="db-label">{isDelivered ? "Keepsake Status" : "Countdown"}</div>
            <div className="db-serif" style={{ fontSize: 20, fontWeight: 600, color: "var(--rose)" }}>
              {isDelivered ? "Safely Preserved 💕" : `${daysLeft} days remaining`}
            </div>
          </div>
        </div>

        {/* Prompt of the Day Card */}
        <div className="db-card" style={{ background: "linear-gradient(135deg, var(--sage-light), #EEF3E8)", border: "1px solid var(--sage)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div className="db-label" style={{ color: "var(--sage)", display: "flex", alignItems: "center", gap: 6 }}>
              <Sparkles size={13} /> {isDelivered ? "Featured Letter Memory" : "Today's Journal Prompt"}
            </div>
            <p className="db-serif" style={{ fontStyle: "italic", fontSize: 17, margin: "10px 0 0 0", lineHeight: 1.45, color: "var(--ink)" }}>
              "{promptOfDay}"
            </p>
          </div>
          <button className="db-btn primary" style={{ alignSelf: "flex-start", marginTop: 16 }} onClick={() => navigate("/journal")}>
            <BookOpen size={14} /> {isDelivered ? "Browse Memory Letters" : "Write today's letter"}
          </button>
        </div>
      </div>

      {/* Fetal Growth Card */}
      <BabyGrowthCard currentWeek={currentWeek} />

      {/* Kick Counter Card */}
      <div className="db-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 14 }}>
          <div>
            <div className="db-label" style={{ color: "var(--rose)" }}>Fetal Movement Tracking</div>
            <h3 className="db-serif" style={{ fontSize: 18, margin: "2px 0 0 0" }}>Daily Kick Counter</h3>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 12, color: "var(--ink-soft)", fontWeight: 600 }}>Daily Goal:</span>
            <select
              disabled={isDelivered}
              value={kickTargetMode === "auto" ? "auto" : customKickTarget.toString()}
              onChange={e => handleTargetChange(e.target.value)}
              className="db-input"
              style={{ padding: "4px 8px", fontSize: 12, width: "auto" }}
            >
              <option value="auto">Auto ({recommendedGoal} kicks for Wk {currentWeek})</option>
              <option value="6">6 kicks</option>
              <option value="10">10 kicks</option>
              <option value="12">12 kicks</option>
              <option value="15">15 kicks</option>
              <option value="20">20 kicks</option>
            </select>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-around", flexWrap: "wrap", gap: 20 }}>
          <button
            onClick={handleKickClick}
            disabled={isDelivered}
            style={{
              width: 110,
              height: 110,
              borderRadius: "50%",
              background: isDelivered ? "var(--paper-alt)" : "linear-gradient(135deg, var(--rose-light), #F8D3D7)",
              border: "3px solid var(--rose)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              cursor: isDelivered ? "default" : "pointer",
              transform: kickPulsing ? "scale(0.93)" : "scale(1)",
              transition: "transform 0.15s ease",
              boxShadow: "0 6px 20px rgba(198, 118, 127, 0.2)"
            }}
          >
            <Footprints size={26} color="var(--rose)" />
            <span style={{ fontSize: 11, fontWeight: 700, color: "var(--rose)", marginTop: 2 }}>
              {isDelivered ? "Preserved" : "Tap Kick!"}
            </span>
          </button>

          <div style={{ textAlign: "center" }}>
            <div className="db-serif" style={{ fontSize: 44, fontWeight: 700, color: "var(--ink)", lineHeight: 1 }}>
              {kickData?.count || 0} <span style={{ fontSize: 20, color: "var(--ink-soft)", fontWeight: 400 }}>/ {kickTarget}</span>
            </div>
            <div style={{ fontSize: 13, color: "var(--sage)", fontWeight: 600, marginTop: 6 }}>
              {((kickData?.count || 0) >= kickTarget) ? "🎉 Goal reached for today!" : `${kickTarget - (kickData?.count || 0)} kicks left`}
            </div>
            <div style={{ fontSize: 11.5, color: "var(--ink-soft)", marginTop: 2 }}>
              Last kick: {kickData?.lastKickTime || "None logged today"}
            </div>
          </div>

          {!isDelivered && (
            <button className="db-btn" onClick={resetKicks} style={{ fontSize: 11.5 }}>
              <RotateCcw size={13} /> Reset Counter
            </button>
          )}
        </div>
      </div>

      {/* Birth Registration Modal */}
      {showBirthModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(20, 16, 28, 0.85)",
            backdropFilter: "blur(6px)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20
          }}
          onClick={() => setShowBirthModal(false)}
        >
          <form
            onSubmit={handleSaveBirth}
            className="db-card"
            style={{ maxWidth: 620, width: "100%", background: "var(--card)", borderRadius: 20, padding: "32px 36px" }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18, gap: 16 }}>
              <div style={{ flex: 1, paddingRight: 8 }}>
                <div className="db-label" style={{ color: "var(--rose)", display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                  <PartyPopper size={15} /> Congratulations!
                </div>
                <h3 className="db-serif" style={{ fontSize: 24, lineHeight: 1.3, margin: 0, color: "var(--ink)" }}>
                  Record Baby's Birth & Preserve Memories
                </h3>
              </div>
              <button type="button" className="db-btn" onClick={() => setShowBirthModal(false)} style={{ padding: "6px 10px", borderRadius: 8, flexShrink: 0 }}>
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: 13.5, color: "var(--ink-soft)", lineHeight: 1.5, marginBottom: 22 }}>
              Preserve your pregnancy journey as a lifelong read-only digital memory book for family and friends!
            </p>

            <div className="db-grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 18 }}>
              <div className="db-form-group">
                <label className="db-label" style={{ marginBottom: 6 }}>Birth Date *</label>
                <input
                  className="db-input"
                  type="date"
                  style={{ padding: "11px 14px" }}
                  value={birthForm.birthDate}
                  onChange={e => setBirthForm({ ...birthForm, birthDate: e.target.value })}
                  required
                />
              </div>

              <div className="db-form-group">
                <label className="db-label" style={{ marginBottom: 6 }}>Birth Time</label>
                <input
                  className="db-input"
                  type="text"
                  placeholder="e.g. 08:30 AM"
                  style={{ padding: "11px 14px" }}
                  value={birthForm.birthTime}
                  onChange={e => setBirthForm({ ...birthForm, birthTime: e.target.value })}
                />
              </div>

              <div className="db-form-group">
                <label className="db-label" style={{ marginBottom: 6 }}>Birth Weight</label>
                <input
                  className="db-input"
                  type="text"
                  placeholder="e.g. 3.4 kg"
                  style={{ padding: "11px 14px" }}
                  value={birthForm.birthWeight}
                  onChange={e => setBirthForm({ ...birthForm, birthWeight: e.target.value })}
                />
              </div>

              <div className="db-form-group">
                <label className="db-label" style={{ marginBottom: 6 }}>Birth Length</label>
                <input
                  className="db-input"
                  type="text"
                  placeholder="e.g. 51 cm"
                  style={{ padding: "11px 14px" }}
                  value={birthForm.birthLength}
                  onChange={e => setBirthForm({ ...birthForm, birthLength: e.target.value })}
                />
              </div>
            </div>

            <div className="db-form-group" style={{ marginBottom: 24 }}>
              <label className="db-label" style={{ marginBottom: 6 }}>Welcome Message / Note</label>
              <input
                className="db-input"
                type="text"
                placeholder="e.g. Welcome to the world, our precious angel!"
                style={{ padding: "11px 14px" }}
                value={birthForm.note}
                onChange={e => setBirthForm({ ...birthForm, note: e.target.value })}
              />
            </div>

            <button type="submit" className="db-btn primary" style={{ width: "100%", justifyContent: "center", padding: "14px 20px", fontSize: 15, borderRadius: 12 }}>
              <PartyPopper size={16} /> Confirm Birth & Lock Memory Keepsake
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
