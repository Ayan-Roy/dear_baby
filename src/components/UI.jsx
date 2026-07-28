import React from "react";

export function ProgressRing({ pct, label, sub }) {
  const r = 46, c = 2 * Math.PI * r;
  return (
    <div className="db-ring-wrap">
      <svg width="108" height="108" viewBox="0 0 108 108">
        <circle cx="54" cy="54" r={r} fill="none" stroke="var(--sage-light)" strokeWidth="10" />
        <circle
          cx="54" cy="54" r={r} fill="none" stroke="var(--rose)" strokeWidth="10"
          strokeDasharray={c} strokeDashoffset={c - (pct / 100) * c}
          strokeLinecap="round" transform="rotate(-90 54 54)"
        />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div className="db-serif" style={{ fontSize: 22, fontWeight: 600, lineHeight: 1 }}>{label}</div>
        <div style={{ fontSize: 10.5, color: "var(--ink-soft)", marginTop: 2 }}>{sub}</div>
      </div>
    </div>
  );
}

export function StatCard({ icon, value, label }) {
  return (
    <div className="db-card" style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ width: 38, height: 38, borderRadius: 10, background: "var(--rose-light)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        {icon}
      </div>
      <div>
        <div className="db-serif" style={{ fontSize: 19, fontWeight: 600, lineHeight: 1.1 }}>{value}</div>
        <div className="db-label" style={{ marginTop: 3 }}>{label}</div>
      </div>
    </div>
  );
}
