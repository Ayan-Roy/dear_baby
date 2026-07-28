import React, { useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Scale, Droplet, Pill, Plus, Edit3, X } from "lucide-react";
import { StatCard } from "../components/UI.jsx";
import { fmtDate } from "../utils.js";

export default function Medical({ weightData, visits, vitals, addVisit, addWeight, updateVitals }) {
  const [showVisitForm, setShowVisitForm] = useState(false);
  const [showWeightForm, setShowWeightForm] = useState(false);
  const [showVitalsForm, setShowVitalsForm] = useState(false);

  const [visitDraft, setVisitDraft] = useState({
    doctor: "",
    date: new Date().toISOString().split("T")[0],
    note: "",
    bp: ""
  });

  const [weightDraft, setWeightDraft] = useState({ week: "", kg: "" });
  
  const [vitalsDraft, setVitalsDraft] = useState({
    currentWeight: vitals?.currentWeight || "65 kg",
    lastBp: vitals?.lastBp || "116/75",
    medicines: vitals?.medicines || "Folic Acid, Iron"
  });

  function handleVisitSubmit(e) {
    e.preventDefault();
    if (!visitDraft.doctor || !visitDraft.date) return;
    addVisit(visitDraft);
    if (visitDraft.bp) {
      updateVitals({ lastBp: visitDraft.bp });
    }
    setVisitDraft({ doctor: "", date: new Date().toISOString().split("T")[0], note: "", bp: "" });
    setShowVisitForm(false);
  }

  function handleWeightSubmit(e) {
    e.preventDefault();
    if (!weightDraft.week || !weightDraft.kg) return;
    const wWeek = Number(weightDraft.week);
    const wKg = Number(weightDraft.kg);
    addWeight({ week: wWeek, kg: wKg });
    updateVitals({ currentWeight: `${wKg} kg` });
    setWeightDraft({ week: "", kg: "" });
    setShowWeightForm(false);
  }

  function handleVitalsSubmit(e) {
    e.preventDefault();
    updateVitals(vitalsDraft);
    setShowVitalsForm(false);
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 6 }}>
        <div>
          <h1 className="db-serif db-page-title">Medical journey</h1>
          <p className="db-page-sub">Every appointment, kept — without feeling like a hospital chart.</p>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button className="db-btn" onClick={() => { setShowWeightForm(s => !s); setShowVisitForm(false); setShowVitalsForm(false); }}>
            {showWeightForm ? <X size={14} /> : <Plus size={14} />} {showWeightForm ? "Cancel" : "Log weight"}
          </button>
          <button className="db-btn" onClick={() => { setShowVitalsForm(s => !s); setShowVisitForm(false); setShowWeightForm(false); }}>
            {showVitalsForm ? <X size={14} /> : <Edit3 size={14} />} {showVitalsForm ? "Cancel" : "Edit vitals"}
          </button>
          <button className="db-btn rose" onClick={() => { setShowVisitForm(s => !s); setShowWeightForm(false); setShowVitalsForm(false); }}>
            {showVisitForm ? <X size={14} /> : <Plus size={14} />} {showVisitForm ? "Cancel" : "Add visit"}
          </button>
        </div>
      </div>

      {/* Log Weight Form */}
      {showWeightForm && (
        <form onSubmit={handleWeightSubmit} className="db-card" style={{ marginBottom: 20 }}>
          <div className="db-label" style={{ marginBottom: 12 }}>Log Weight Reading</div>
          <div className="db-grid" style={{ gridTemplateColumns: "1fr 1fr", marginBottom: 12 }}>
            <div>
              <label style={{ fontSize: 12, color: "var(--ink-soft)", display: "block", marginBottom: 4 }}>Pregnancy Week</label>
              <input
                className="db-input"
                type="number"
                placeholder="e.g. 26"
                value={weightDraft.week}
                onChange={e => setWeightDraft({ ...weightDraft, week: e.target.value })}
                required
              />
            </div>
            <div>
              <label style={{ fontSize: 12, color: "var(--ink-soft)", display: "block", marginBottom: 4 }}>Weight (kg)</label>
              <input
                className="db-input"
                type="number"
                step="0.1"
                placeholder="e.g. 66.5"
                value={weightDraft.kg}
                onChange={e => setWeightDraft({ ...weightDraft, kg: e.target.value })}
                required
              />
            </div>
          </div>
          <button type="submit" className="db-btn primary">Save weight entry</button>
        </form>
      )}

      {/* Edit Vitals Form */}
      {showVitalsForm && (
        <form onSubmit={handleVitalsSubmit} className="db-card" style={{ marginBottom: 20 }}>
          <div className="db-label" style={{ marginBottom: 12 }}>Update Vital Health Stats</div>
          <div className="db-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", marginBottom: 12 }}>
            <div>
              <label style={{ fontSize: 12, color: "var(--ink-soft)", display: "block", marginBottom: 4 }}>Current Weight</label>
              <input
                className="db-input"
                type="text"
                value={vitalsDraft.currentWeight}
                onChange={e => setVitalsDraft({ ...vitalsDraft, currentWeight: e.target.value })}
                placeholder="e.g. 65 kg"
              />
            </div>
            <div>
              <label style={{ fontSize: 12, color: "var(--ink-soft)", display: "block", marginBottom: 4 }}>Last BP Reading</label>
              <input
                className="db-input"
                type="text"
                value={vitalsDraft.lastBp}
                onChange={e => setVitalsDraft({ ...vitalsDraft, lastBp: e.target.value })}
                placeholder="e.g. 116/75"
              />
            </div>
            <div>
              <label style={{ fontSize: 12, color: "var(--ink-soft)", display: "block", marginBottom: 4 }}>Current Medicines</label>
              <input
                className="db-input"
                type="text"
                value={vitalsDraft.medicines}
                onChange={e => setVitalsDraft({ ...vitalsDraft, medicines: e.target.value })}
                placeholder="e.g. Folic Acid, Iron"
              />
            </div>
          </div>
          <button type="submit" className="db-btn primary">Update stats</button>
        </form>
      )}

      {/* Add Visit Form */}
      {showVisitForm && (
        <form onSubmit={handleVisitSubmit} className="db-card" style={{ marginBottom: 20 }}>
          <div className="db-label" style={{ marginBottom: 12 }}>Log Doctor Visit</div>
          <div className="db-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", marginBottom: 12 }}>
            <div>
              <label style={{ fontSize: 12, color: "var(--ink-soft)", display: "block", marginBottom: 4 }}>Doctor / Clinic</label>
              <input
                className="db-input"
                type="text"
                placeholder="e.g. Dr. Rahman"
                value={visitDraft.doctor}
                onChange={e => setVisitDraft({ ...visitDraft, doctor: e.target.value })}
                required
              />
            </div>
            <div>
              <label style={{ fontSize: 12, color: "var(--ink-soft)", display: "block", marginBottom: 4 }}>Visit Date</label>
              <input
                className="db-input"
                type="date"
                value={visitDraft.date}
                onChange={e => setVisitDraft({ ...visitDraft, date: e.target.value })}
                required
              />
            </div>
            <div>
              <label style={{ fontSize: 12, color: "var(--ink-soft)", display: "block", marginBottom: 4 }}>Blood Pressure</label>
              <input
                className="db-input"
                type="text"
                placeholder="e.g. 118/76"
                value={visitDraft.bp}
                onChange={e => setVisitDraft({ ...visitDraft, bp: e.target.value })}
              />
            </div>
          </div>
          <textarea
            className="db-input"
            rows={2}
            placeholder="Appointment notes, prescriptions, advice..."
            value={visitDraft.note}
            onChange={e => setVisitDraft({ ...visitDraft, note: e.target.value })}
            style={{ marginBottom: 12 }}
          />
          <button type="submit" className="db-btn primary">Save doctor visit</button>
        </form>
      )}

      {/* Weight Chart Card */}
      <div className="db-card" style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div className="db-label">Weight over time</div>
          <span style={{ fontSize: 12, color: "var(--ink-soft)" }}>{weightData.length} data points logged</span>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={weightData}>
            <CartesianGrid stroke="var(--line)" strokeDasharray="3 3" />
            <XAxis dataKey="week" tickFormatter={w => `Wk ${w}`} fontSize={11.5} stroke="var(--ink-soft)" />
            <YAxis domain={["dataMin - 2", "dataMax + 2"]} fontSize={11.5} stroke="var(--ink-soft)" />
            <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid var(--line)", fontSize: 12.5 }} />
            <Line type="monotone" dataKey="kg" stroke="#C6767F" strokeWidth={2.5} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Vitals Summary Grid */}
          <div className="db-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", marginBottom: 12 }}>
        <StatCard icon={<Scale size={17} color="var(--rose)" />} value={vitals?.currentWeight || "65 kg"} label="Current weight" />
        <StatCard icon={<Droplet size={17} color="var(--rose)" />} value={vitals?.lastBp || "116/75"} label="Last BP reading" />
        <StatCard icon={<Pill size={17} color="var(--rose)" />} value={vitals?.medicines || "Folic Acid, Iron"} label="Current medicines" />
      </div>

      {/* Doctor Visit Cards */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div className="db-label">Doctor visits</div>
        <span style={{ fontSize: 12, color: "var(--ink-soft)" }}>{visits.length} total visits</span>
      </div>
      <div className="db-grid">
        {visits.map((v, i) => (
          <div className="db-card" key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{v.doctor}</div>
              <div style={{ fontSize: 13, color: "var(--ink-soft)", marginTop: 2 }}>{v.note || "Routine appointment"}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div className="db-label">{fmtDate(v.date)}</div>
              {v.bp && <div style={{ fontSize: 12.5, marginTop: 3 }}>BP {v.bp}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

