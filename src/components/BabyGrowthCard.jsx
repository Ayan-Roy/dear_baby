import React, { useState, useEffect, useRef } from "react";
import { Heart, Sparkles, Scale, Ruler, ChevronLeft, ChevronRight, Info, Eye, Activity, User, Volume2, VolumeX } from "lucide-react";
import { getBabyGrowth } from "../data/babyGrowthData.js";

// Clinical fetal heart rate progression by pregnancy week
export function getFetalHeartRate(week) {
  if (week < 5) return 0; // Week 4: Primitive heart tube forming, no heartbeat yet
  if (week <= 6) return 105; // Week 5-6: Initial contractions start (~105 BPM)
  if (week <= 10) return 175; // Week 8-10: Peak fetal heart rate (~175 BPM)
  if (week <= 16) return 155; // Week 12-16: Mid-pregnancy (~155 BPM)
  if (week <= 28) return 145; // Week 20-28: Steady rhythm (~145 BPM)
  return 135; // Week 30-40: Mature full-term rate (~135 BPM)
}

// Helper component that renders distinct anatomical SVG graphics with heartbeat pulse animations
function FetusAnatomyGraphic({ svgType, inspectWeek }) {
  const heartDot = (cx, cy) => (
    <g>
      {/* Expanding acoustic heartbeat ripple ring 1 */}
      <circle cx={cx} cy={cy} r="6" fill="none" stroke="var(--rose)" strokeWidth="1.5">
        <animate attributeName="r" values="4;14;22" dur="1.2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.9;0.4;0" dur="1.2s" repeatCount="indefinite" />
      </circle>
      {/* Expanding acoustic heartbeat ripple ring 2 */}
      <circle cx={cx} cy={cy} r="6" fill="none" stroke="var(--gold)" strokeWidth="1">
        <animate attributeName="r" values="4;12;18" dur="1.2s" begin="0.2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.8;0.3;0" dur="1.2s" begin="0.2s" repeatCount="indefinite" />
      </circle>
      {/* Core beating heart dot */}
      <circle cx={cx} cy={cy} r="4" fill="var(--paper)">
        <animate attributeName="r" values="3.5;5.5;3.5" dur="1.2s" repeatCount="indefinite" />
      </circle>
    </g>
  );

  switch (svgType) {
    case "blastocyst":
      return (
        <svg width="150" height="150" viewBox="0 0 120 120" className="db-animate-float">
          <ellipse cx="60" cy="60" rx="48" ry="48" fill="none" stroke="var(--rose)" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.5" />
          <circle cx="60" cy="60" r="30" fill="var(--rose-light)" stroke="var(--rose)" strokeWidth="2" opacity="0.6" />
          <circle cx="54" cy="54" r="8" fill="var(--rose)" />
          <circle cx="68" cy="58" r="6" fill="var(--rose)" />
          <circle cx="60" cy="68" r="5" fill="var(--rose)" />
          <path d="M 40,60 Q 60,35 80,60" fill="none" stroke="var(--gold)" strokeWidth="2" strokeDasharray="2 2" />
          {heartDot(54, 54)}
        </svg>
      );

    case "limb_buds":
      return (
        <svg width="150" height="150" viewBox="0 0 120 120" className="db-animate-float">
          <ellipse cx="60" cy="60" rx="46" ry="50" fill="none" stroke="var(--rose)" strokeWidth="1.5" opacity="0.5" />
          <path d="M 50,30 C 72,28 82,50 70,72 C 60,86 42,80 40,66 C 39,56 48,50 48,42 Z" fill="var(--rose)" opacity="0.85" />
          <circle cx="56" cy="38" r="14" fill="var(--rose)" />
          <circle cx="52" cy="36" r="3" fill="#FFF" />
          <circle cx="48" cy="56" r="4" fill="var(--paper)" />
          <circle cx="54" cy="74" r="4" fill="var(--paper)" />
          <path d="M 58,60 C 42,62 38,50 28,56" fill="none" stroke="var(--gold)" strokeWidth="2" />
          {heartDot(56, 52)}
        </svg>
      );

    case "fetus_early":
      return (
        <svg width="150" height="150" viewBox="0 0 120 120" className="db-animate-float">
          <ellipse cx="60" cy="60" rx="46" ry="50" fill="none" stroke="var(--rose)" strokeWidth="1.5" opacity="0.5" />
          <path d="M 52,30 C 76,28 84,54 72,76 C 62,90 42,84 40,70 C 38,58 48,52 50,44 Z" fill="var(--rose)" opacity="0.85" />
          <circle cx="56" cy="38" r="15" fill="var(--rose)" />
          <path d="M 50,38 Q 54,40 56,38" fill="none" stroke="#FFF" strokeWidth="1.5" />
          <path d="M 54,54 C 42,56 40,66 52,64" fill="none" stroke="var(--paper)" strokeWidth="3" strokeLinecap="round" />
          <path d="M 62,72 C 48,78 44,86 56,86" fill="none" stroke="var(--paper)" strokeWidth="3" strokeLinecap="round" />
          <path d="M 58,60 C 40,62 34,48 24,56" fill="none" stroke="var(--gold)" strokeWidth="2" strokeDasharray="3 2" />
          {heartDot(58, 52)}
        </svg>
      );

    case "fetus_active":
      return (
        <svg width="150" height="150" viewBox="0 0 120 120" className="db-animate-float">
          <ellipse cx="60" cy="60" rx="48" ry="52" fill="none" stroke="var(--rose)" strokeWidth="1.5" opacity="0.5" />
          <path d="M 50,28 C 76,26 86,52 74,76 C 64,92 42,86 40,70 C 38,58 48,50 50,42 Z" fill="var(--rose)" opacity="0.88" />
          <circle cx="56" cy="36" r="16" fill="var(--rose)" />
          <path d="M 46,26 Q 56,22 66,28" fill="none" stroke="var(--paper)" strokeWidth="1" opacity="0.7" />
          <path d="M 50,36 Q 54,39 58,36" fill="none" stroke="#FFF" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M 56,52 C 42,52 38,64 54,62" fill="none" stroke="var(--paper)" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M 64,70 C 50,76 44,86 58,86" fill="none" stroke="var(--paper)" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M 58,58 C 38,60 32,46 22,54" fill="none" stroke="var(--gold)" strokeWidth="2" strokeDasharray="3 2" />
          {heartDot(58, 52)}
        </svg>
      );

    case "fetus_halfway":
      return (
        <svg width="150" height="150" viewBox="0 0 120 120" className="db-animate-float">
          <ellipse cx="60" cy="60" rx="48" ry="52" fill="none" stroke="var(--rose)" strokeWidth="1.5" opacity="0.6" />
          <circle cx="40" cy="40" r="1.5" fill="var(--paper)" />
          <circle cx="78" cy="46" r="1.5" fill="var(--paper)" />
          <circle cx="36" cy="70" r="1.5" fill="var(--paper)" />
          <path d="M 50,26 C 78,24 88,52 76,78 C 66,94 42,88 38,70 C 36,56 48,48 50,40 Z" fill="var(--rose)" opacity="0.9" />
          <circle cx="56" cy="34" r="17" fill="var(--rose)" />
          <path d="M 48,34 Q 54,38 58,34" fill="none" stroke="#FFF" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M 56,50 C 44,48 46,38 54,36" fill="none" stroke="var(--paper)" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M 64,68 C 50,76 44,86 58,86" fill="none" stroke="var(--paper)" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M 58,58 C 38,60 32,46 22,54" fill="none" stroke="var(--gold)" strokeWidth="2.5" />
          {heartDot(58, 52)}
        </svg>
      );

    case "fetus_hearing":
      return (
        <svg width="150" height="150" viewBox="0 0 120 120" className="db-animate-float">
          <ellipse cx="60" cy="60" rx="48" ry="52" fill="none" stroke="var(--rose)" strokeWidth="1.5" opacity="0.6" />
          <path d="M 72,28 Q 78,34 72,40" fill="none" stroke="var(--gold)" strokeWidth="1.5" />
          <path d="M 76,24 Q 84,34 76,44" fill="none" stroke="var(--gold)" strokeWidth="1.5" opacity="0.6" />
          <path d="M 50,26 C 78,24 88,52 76,78 C 66,94 42,88 38,70 C 36,56 48,48 50,40 Z" fill="var(--rose)" opacity="0.9" />
          <circle cx="56" cy="34" r="17" fill="var(--rose)" />
          <path d="M 48,34 Q 54,37 58,34" fill="none" stroke="#FFF" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M 56,48 Q 54,54 58,58" fill="none" stroke="var(--sage-light)" strokeWidth="1.5" opacity="0.8" />
          <path d="M 56,50 C 44,52 42,64 56,62" fill="none" stroke="var(--paper)" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M 64,68 C 50,76 44,86 58,86" fill="none" stroke="var(--paper)" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M 58,58 C 38,60 32,46 22,54" fill="none" stroke="var(--gold)" strokeWidth="2.5" />
          {heartDot(58, 52)}
        </svg>
      );

    case "fetus_dreamer":
      return (
        <svg width="150" height="150" viewBox="0 0 120 120" className="db-animate-float">
          <ellipse cx="60" cy="60" rx="48" ry="52" fill="none" stroke="var(--rose)" strokeWidth="1.5" opacity="0.6" />
          <text x="76" y="26" fontSize="10" fill="var(--gold)">✨</text>
          <path d="M 50,26 C 78,24 88,52 76,78 C 66,94 42,88 38,70 C 36,56 48,48 50,40 Z" fill="var(--rose)" opacity="0.92" />
          <circle cx="56" cy="34" r="17" fill="var(--rose)" />
          <path d="M 48,34 Q 53,38 58,34" fill="none" stroke="#FFF" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="51" y1="36" x2="50" y2="39" stroke="#FFF" strokeWidth="1" />
          <line x1="55" y1="37" x2="55" y2="40" stroke="#FFF" strokeWidth="1" />
          <path d="M 56,50 C 44,52 42,64 56,62" fill="none" stroke="var(--paper)" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M 64,68 C 50,76 44,86 58,86" fill="none" stroke="var(--paper)" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M 58,58 C 38,60 32,46 22,54" fill="none" stroke="var(--gold)" strokeWidth="2.5" />
          {heartDot(58, 52)}
        </svg>
      );

    case "fetus_headdown":
      return (
        <svg width="150" height="150" viewBox="0 0 120 120" className="db-animate-float">
          <ellipse cx="60" cy="60" rx="48" ry="52" fill="none" stroke="var(--rose)" strokeWidth="1.5" opacity="0.6" />
          <g transform="rotate(160 60 60)">
            <path d="M 50,26 C 78,24 88,52 76,78 C 66,94 42,88 38,70 C 36,56 48,48 50,40 Z" fill="var(--rose)" opacity="0.92" />
            <circle cx="56" cy="34" r="18" fill="var(--rose)" />
            <path d="M 48,34 Q 53,38 58,34" fill="none" stroke="#FFF" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M 56,50 C 44,52 42,64 56,62" fill="none" stroke="var(--paper)" strokeWidth="4" strokeLinecap="round" />
            <path d="M 64,68 C 50,76 44,86 58,86" fill="none" stroke="var(--paper)" strokeWidth="4" strokeLinecap="round" />
            {heartDot(58, 52)}
          </g>
          <path d="M 58,58 C 38,60 32,46 22,54" fill="none" stroke="var(--gold)" strokeWidth="2.5" />
        </svg>
      );

    case "fetus_fullterm":
    default:
      return (
        <svg width="150" height="150" viewBox="0 0 120 120" className="db-animate-float">
          <ellipse cx="60" cy="60" rx="48" ry="52" fill="none" stroke="var(--rose)" strokeWidth="2" />
          <g transform="rotate(165 60 60)">
            <path d="M 50,24 C 80,22 90,52 78,80 C 68,96 40,90 36,70 C 34,54 48,46 50,38 Z" fill="var(--rose)" />
            <circle cx="56" cy="33" r="19" fill="var(--rose)" />
            <path d="M 48,34 Q 53,38 58,34" fill="none" stroke="#FFF" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M 52,42 Q 56,44 60,42" fill="none" stroke="#FFF" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M 56,48 C 42,50 40,64 58,62" fill="none" stroke="var(--paper)" strokeWidth="4.5" strokeLinecap="round" />
            <path d="M 66,68 C 48,76 42,88 60,88" fill="none" stroke="var(--paper)" strokeWidth="4.5" strokeLinecap="round" />
            {heartDot(58, 52)}
          </g>
          <path d="M 58,58 C 38,60 32,46 22,54" fill="none" stroke="var(--gold)" strokeWidth="2.5" />
        </svg>
      );
  }
}

export default function BabyGrowthCard({ currentWeek = 24 }) {
  const [inspectWeek, setInspectWeek] = useState(currentWeek);
  const [activeTab, setActiveTab] = useState("anatomy"); // "anatomy" | "size" | "mom"
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const data = getBabyGrowth(inspectWeek);

  const audioCtxRef = useRef(null);
  const intervalRef = useRef(null);

  // Toggle Web Audio API Heartbeat Synthesizer
  function toggleHeartbeat() {
    if (isPlayingAudio) {
      stopHeartbeat();
    } else {
      startHeartbeat();
    }
  }

  function startHeartbeat() {
    try {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (audioCtxRef.current) audioCtxRef.current.close();

      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      
      const ctx = new AudioContext();
      audioCtxRef.current = ctx;
      setIsPlayingAudio(true);

      const bpm = getFetalHeartRate(inspectWeek);
      const intervalMs = Math.round((60 / bpm) * 1000);
      const secondBeatDelay = Math.max(70, Math.round(intervalMs * 0.28));

      function playBeat(freq, dur) {
        if (!ctx || ctx.state === "closed") return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + dur);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + dur);
      }

      // Play immediate first beat
      playBeat(130, 0.12);
      setTimeout(() => playBeat(100, 0.10), secondBeatDelay);

      // Recurring double-thump beat at dynamic week BPM
      intervalRef.current = setInterval(() => {
        playBeat(130, 0.12);
        setTimeout(() => playBeat(100, 0.10), secondBeatDelay);
      }, intervalMs);
    } catch (err) {
      console.log("Audio play error", err);
    }
  }

  function stopHeartbeat() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (audioCtxRef.current) audioCtxRef.current.close();
    setIsPlayingAudio(false);
  }

  useEffect(() => {
    if (isPlayingAudio) {
      startHeartbeat();
    }
  }, [inspectWeek]);

  useEffect(() => {
    return () => {
      stopHeartbeat();
    };
  }, []);

  const stageWeeks = [4, 8, 12, 16, 20, 24, 28, 32, 36, 40];

  function prevStage() {
    const idx = stageWeeks.indexOf(inspectWeek);
    if (idx > 0) setInspectWeek(stageWeeks[idx - 1]);
    else if (inspectWeek > 4) setInspectWeek(inspectWeek - 1);
  }

  function nextStage() {
    const idx = stageWeeks.indexOf(inspectWeek);
    if (idx !== -1 && idx < stageWeeks.length - 1) setInspectWeek(stageWeeks[idx + 1]);
    else if (inspectWeek < 40) setInspectWeek(inspectWeek + 1);
  }

  return (
    <div
      className="db-card"
      style={{
        background: "linear-gradient(135deg, var(--card) 0%, #FFFDF9 100%)",
        border: "1px solid var(--line)",
        position: "relative",
        overflow: "hidden",
        padding: "24px"
      }}
    >
      {/* Header & Week Selector */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 18 }}>
        <div>
          <div className="db-label" style={{ color: "var(--rose)", display: "flex", alignItems: "center", gap: 6 }}>
            <Sparkles size={13} color="var(--rose)" /> Interactive Pregnancy Growth Guide
          </div>
          <h2 className="db-serif" style={{ fontSize: 22, fontWeight: 600, margin: "2px 0 0 0" }}>
            Week {inspectWeek}: {data.stageName}
          </h2>
        </div>

        {/* Week Jumper & Stepper */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          {/* Heartbeat Sound Synthesizer Button */}
          {inspectWeek < 5 ? (
            <button
              className="db-btn"
              disabled
              style={{
                opacity: 0.75,
                fontSize: 12,
                padding: "6px 12px",
                background: "var(--paper)",
                borderColor: "var(--line)",
                cursor: "not-allowed",
                color: "var(--ink-soft)"
              }}
              title="At Week 4, the primitive heart tube is forming and cardiac contractions haven't started yet. Heartbeats become detectable at Week 5–6!"
            >
              🌱 Heart Tube Forming (Beats Wk 6)
            </button>
          ) : (
            <button
              className="db-btn"
              onClick={toggleHeartbeat}
              style={{
                background: isPlayingAudio ? "var(--rose-light)" : "var(--card)",
                borderColor: isPlayingAudio ? "var(--rose)" : "var(--line)",
                color: isPlayingAudio ? "var(--rose)" : "var(--ink)",
                fontSize: 12,
                padding: "6px 12px"
              }}
            >
              {isPlayingAudio ? <VolumeX size={15} /> : <Volume2 size={15} color="var(--rose)" />}
              {isPlayingAudio ? "Mute Heartbeat" : `Listen to Heartbeat (${getFetalHeartRate(inspectWeek)} BPM)`}
              {isPlayingAudio && (
                <div style={{ display: "flex", gap: 2, alignItems: "flex-end", height: 12, marginLeft: 4 }}>
                  <span style={{ width: 3, background: "var(--rose)", animation: "soundwave-bar 0.4s infinite ease-in-out" }} />
                  <span style={{ width: 3, background: "var(--rose)", animation: "soundwave-bar 0.4s infinite ease-in-out 0.15s" }} />
                  <span style={{ width: 3, background: "var(--rose)", animation: "soundwave-bar 0.4s infinite ease-in-out 0.3s" }} />
                </div>
              )}
            </button>
          )}

          <div style={{ display: "flex", alignItems: "center", border: "1px solid var(--line)", borderRadius: 10, background: "var(--paper)", padding: 2 }}>
            <button
              className="db-btn"
              onClick={prevStage}
              disabled={inspectWeek <= 4}
              style={{ border: "none", padding: "5px 8px", opacity: inspectWeek <= 4 ? 0.4 : 1 }}
            >
              <ChevronLeft size={16} />
            </button>
            <span style={{ fontSize: 13, fontWeight: 700, padding: "0 10px", color: "var(--ink)" }}>
              Week {inspectWeek}
            </span>
            <button
              className="db-btn"
              onClick={nextStage}
              disabled={inspectWeek >= 40}
              style={{ border: "none", padding: "5px 8px", opacity: inspectWeek >= 40 ? 0.4 : 1 }}
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <button
            className="db-btn"
            onClick={() => setInspectWeek(currentWeek)}
            style={{ fontSize: 12, padding: "6px 12px", background: inspectWeek === currentWeek ? "var(--rose-light)" : "var(--card)", borderColor: inspectWeek === currentWeek ? "var(--rose)" : "var(--line)" }}
          >
            My Current Week ({currentWeek})
          </button>
        </div>
      </div>

      {/* Mode View Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, borderBottom: "1px solid var(--line)", paddingBottom: 10 }}>
        <button
          className={`db-chip ${activeTab === "anatomy" ? "active" : ""}`}
          onClick={() => setActiveTab("anatomy")}
          style={{ display: "flex", alignItems: "center", gap: 6 }}
        >
          <Activity size={14} /> Fetal Anatomy Render
        </button>

        <button
          className={`db-chip ${activeTab === "size" ? "active" : ""}`}
          onClick={() => setActiveTab("size")}
          style={{ display: "flex", alignItems: "center", gap: 6 }}
        >
          <span>{data.itemIcon}</span> Baby Size Comparison
        </button>

        <button
          className={`db-chip ${activeTab === "mom" ? "active" : ""}`}
          onClick={() => setActiveTab("mom")}
          style={{ display: "flex", alignItems: "center", gap: 6 }}
        >
          <User size={14} /> Mom & Baby Highlights
        </button>
      </div>

      {/* TAB 1: FETAL ANATOMY RENDER (Default First View) */}
      {activeTab === "anatomy" && (
        <div key={inspectWeek} className="db-grid db-animate-fade" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20, alignItems: "center" }}>
          {/* Anatomical Graphic View */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div
              style={{
                width: 200,
                height: 200,
                borderRadius: "50%",
                background: "radial-gradient(circle, var(--rose-light) 0%, rgba(253, 246, 240, 0.4) 75%)",
                border: "2px dashed var(--rose)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 30px rgba(198, 118, 127, 0.15)",
                position: "relative"
              }}
            >
              <FetusAnatomyGraphic svgType={data.svgType} inspectWeek={inspectWeek} />

              <div
                style={{
                  position: "absolute",
                  bottom: 8,
                  background: "var(--card)",
                  border: "1px solid var(--line)",
                  borderRadius: 999,
                  padding: "3px 10px",
                  fontSize: 11,
                  fontWeight: 700,
                  color: "var(--ink)",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)"
                }}
              >
                Week {inspectWeek} Stage
              </div>
            </div>
            <div className="db-label" style={{ marginTop: 10 }}>Stage: {data.stageName}</div>
          </div>

          {/* Key Traits & Anatomical Features */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div className="db-label" style={{ color: "var(--rose)", display: "flex", alignItems: "center", gap: 6 }}>
              <Eye size={14} /> Anatomical Features at Week {inspectWeek}
            </div>

            {data.keyTraits.map((trait, idx) => (
              <div
                key={idx}
                style={{
                  background: "var(--paper)",
                  border: "1px solid var(--line)",
                  borderRadius: 10,
                  padding: "10px 14px",
                  fontSize: 13.5,
                  fontWeight: 500,
                  display: "flex",
                  alignItems: "center",
                  gap: 10
                }}
              >
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--rose)", flexShrink: 0 }} />
                <span>{trait}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: BABY SIZE COMPARISON */}
      {activeTab === "size" && (
        <div key={inspectWeek} className="db-grid db-animate-fade" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20, alignItems: "center" }}>
          <div
            style={{
              background: "linear-gradient(135deg, var(--paper-alt) 0%, var(--paper) 100%)",
              borderRadius: 16,
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              border: "1px solid var(--line)",
              position: "relative"
            }}
          >
            <div style={{ fontSize: 72, marginBottom: 8, filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.1))" }}>
              {data.itemIcon}
            </div>
            <div className="db-serif" style={{ fontSize: 22, fontWeight: 700, color: "var(--ink)" }}>
              {data.sizeComparison}
            </div>
            <div className="db-label" style={{ marginTop: 4, color: "var(--rose)" }}>
              {data.category}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div className="db-grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 12, padding: "14px 16px" }}>
                <div className="db-label" style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 4 }}>
                  <Ruler size={14} color="var(--rose)" /> Estimated Length
                </div>
                <div className="db-serif" style={{ fontSize: 22, fontWeight: 700, color: "var(--ink)" }}>
                  {data.lengthCm}
                </div>
                <div style={{ fontSize: 11.5, color: "var(--ink-soft)", marginTop: 2 }}>~ {data.lengthInches} head to heel</div>
              </div>

              <div style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 12, padding: "14px 16px" }}>
                <div className="db-label" style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 4 }}>
                  <Scale size={14} color="var(--sage)" /> Estimated Weight
                </div>
                <div className="db-serif" style={{ fontSize: 22, fontWeight: 700, color: "var(--ink)" }}>
                  {data.weightGrams}
                </div>
                <div style={{ fontSize: 11.5, color: "var(--ink-soft)", marginTop: 2 }}>Average stage weight</div>
              </div>
            </div>

            <div style={{ background: "var(--sage-light)", border: "1px solid var(--sage)", borderRadius: 12, padding: "14px 16px" }}>
              <div className="db-label" style={{ color: "var(--sage)", marginBottom: 4, display: "flex", alignItems: "center", gap: 6 }}>
                <Info size={13} /> Did you know?
              </div>
              <div style={{ fontSize: 13.5, fontStyle: "italic", color: "var(--ink)", lineHeight: 1.45 }}>
                "{data.funFact}"
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: MOM & BABY HIGHLIGHTS */}
      {activeTab === "mom" && (
        <div key={inspectWeek} className="db-grid db-animate-fade" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
          <div style={{ background: "var(--rose-light)", border: "1px solid var(--rose)", borderRadius: 14, padding: "16px" }}>
            <div className="db-label" style={{ color: "var(--rose)", marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
              <Heart size={14} fill="var(--rose)" /> Baby's Key Milestone
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.5, color: "var(--ink)" }}>
              {data.milestone}
            </div>
          </div>

          <div style={{ background: "var(--sage-light)", border: "1px solid var(--sage)", borderRadius: 14, padding: "16px" }}>
            <div className="db-label" style={{ color: "var(--sage)", marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
              <User size={14} /> Mom's Body Changes
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.5, color: "var(--ink)" }}>
              {data.momChanges}
            </div>
          </div>

          <div style={{ background: "var(--gold-light)", border: "1px solid var(--gold)", borderRadius: 14, padding: "16px" }}>
            <div className="db-label" style={{ color: "var(--gold)", marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
              <Sparkles size={14} color="var(--gold)" /> Stage Category
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "var(--ink)" }}>
              {data.category}
            </div>
            <div style={{ fontSize: 12.5, color: "var(--ink-soft)", marginTop: 4 }}>
              Week {inspectWeek} of 40 completed
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
