import React, { useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Scale, Droplet, Pill, Plus, Edit3, X, Activity, TrendingUp, Calendar, MessageSquare, Paperclip, FileText, Download, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { StatCard } from "../components/UI.jsx";
import { fmtDate } from "../utils.js";

// Clinical Blood Pressure Status Evaluator
export function evaluateBpStatus(bpStr) {
  if (!bpStr) return { label: "Recorded", color: "var(--ink-soft)", bg: "var(--paper-alt)" };
  const parts = bpStr.split("/").map(p => parseInt(p.trim(), 10));
  if (parts.length !== 2 || isNaN(parts[0]) || isNaN(parts[1])) {
    return { label: "Recorded", color: "var(--ink-soft)", bg: "var(--paper-alt)" };
  }
  const [sys, dia] = parts;
  if (sys >= 180 || dia >= 120) {
    return { label: "Crisis 🚨", color: "#991B1B", bg: "#FEE2E2" };
  }
  if (sys >= 140 || dia >= 90) {
    return { label: "High BP ⚠️", color: "#9A3412", bg: "#FFEDD5" };
  }
  if (sys >= 130 || dia >= 80) {
    return { label: "Elevated 🟡", color: "#854D0E", bg: "#FEF9C3" };
  }
  if (sys >= 120 && dia < 80) {
    return { label: "Elevated 🟡", color: "#854D0E", bg: "#FEF9C3" };
  }
  if (sys < 90 || dia < 60) {
    return { label: "Low BP 🔵", color: "#1E40AF", bg: "#DBEAFE" };
  }
  return { label: "Normal 🟢", color: "#166534", bg: "#DCFCE7" };
}

export default function Medical({ weightData, visits, vitals, addVisit, addWeight, updateVitals }) {
  const [showVisitForm, setShowVisitForm] = useState(false);
  const [showWeightForm, setShowWeightForm] = useState(false);
  const [showVitalsForm, setShowVitalsForm] = useState(false);

  // Modal State for viewing report attachments
  const [activeReportVisit, setActiveReportVisit] = useState(null);
  const [selectedFileIdx, setSelectedFileIdx] = useState(0);

  const [visitDraft, setVisitDraft] = useState({
    doctor: "",
    date: new Date().toISOString().split("T")[0],
    note: "",
    bp: "",
    attachments: [] // Array of { id, name, url }
  });

  const [weightDraft, setWeightDraft] = useState({ week: "", kg: "", bp: "116/75", note: "" });
  
  const [vitalsDraft, setVitalsDraft] = useState({
    currentWeight: vitals?.currentWeight || "65 kg",
    lastBp: vitals?.lastBp || "116/75",
    medicines: vitals?.medicines || "Folic Acid, Iron"
  });

  function handleVisitFilesChange(e) {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setVisitDraft(d => ({
          ...d,
          attachments: [
            ...(d.attachments || []),
            {
              id: Date.now() + Math.random(),
              name: file.name,
              url: reader.result
            }
          ]
        }));
      };
      reader.readAsDataURL(file);
    });
  }

  function removeAttachment(id) {
    setVisitDraft(d => ({
      ...d,
      attachments: (d.attachments || []).filter(a => a.id !== id)
    }));
  }

  function handleVisitSubmit(e) {
    e.preventDefault();
    if (!visitDraft.doctor || !visitDraft.date) return;
    addVisit(visitDraft);
    if (visitDraft.bp) {
      updateVitals({ lastBp: visitDraft.bp });
    }
    setVisitDraft({
      doctor: "",
      date: new Date().toISOString().split("T")[0],
      note: "",
      bp: "",
      attachments: []
    });
    setShowVisitForm(false);
  }

  function handleWeightSubmit(e) {
    e.preventDefault();
    if (!weightDraft.week || !weightDraft.kg) return;
    const wWeek = Number(weightDraft.week);
    const wKg = Number(weightDraft.kg);
    addWeight({
      week: wWeek,
      kg: wKg,
      bp: weightDraft.bp || vitals?.lastBp || "116/75",
      note: weightDraft.note.trim()
    });
    updateVitals({
      currentWeight: `${wKg} kg`,
      lastBp: weightDraft.bp || vitals?.lastBp || "116/75"
    });
    setWeightDraft({ week: "", kg: "", bp: "116/75", note: "" });
    setShowWeightForm(false);
  }

  function handleVitalsSubmit(e) {
    e.preventDefault();
    updateVitals(vitalsDraft);
    setShowVitalsForm(false);
  }

  // Calculate starting weight and total gain
  const startWeight = weightData.length > 0 ? weightData[0].kg : 58;
  const currentWeightNum = weightData.length > 0 ? weightData[weightData.length - 1].kg : 65;
  const totalGainNum = (currentWeightNum - startWeight);
  const totalGainFormatted = totalGainNum >= 0 ? `+${totalGainNum.toFixed(1)}` : `${totalGainNum.toFixed(1)}`;

  function openReportViewer(visitRecord, fileIndex = 0) {
    setActiveReportVisit(visitRecord);
    setSelectedFileIdx(fileIndex);
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 14 }}>
        <div>
          <h1 className="db-serif db-page-title">Medical & Health Log</h1>
          <p className="db-page-sub">Track your weight gain trajectory, blood pressure history, lab reports & prescriptions.</p>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button className="db-btn" onClick={() => { setShowWeightForm(s => !s); setShowVisitForm(false); setShowVitalsForm(false); }}>
            {showWeightForm ? <X size={14} /> : <Plus size={14} />} {showWeightForm ? "Cancel" : "Log Weight & BP"}
          </button>
          <button className="db-btn" onClick={() => { setShowVitalsForm(s => !s); setShowVisitForm(false); setShowWeightForm(false); }}>
            {showVitalsForm ? <X size={14} /> : <Edit3 size={14} />} {showVitalsForm ? "Cancel" : "Edit Vitals"}
          </button>
          <button className="db-btn primary" onClick={() => { setShowVisitForm(s => !s); setShowWeightForm(false); setShowVitalsForm(false); }}>
            {showVisitForm ? <X size={14} /> : <Plus size={14} />} {showVisitForm ? "Cancel" : "Add Doctor Visit"}
          </button>
        </div>
      </div>

      {/* Log Weight & BP Form */}
      {showWeightForm && (
        <form onSubmit={handleWeightSubmit} className="db-card" style={{ marginBottom: 20, border: "1px solid var(--rose)" }}>
          <div className="db-label" style={{ marginBottom: 12, color: "var(--rose)", fontSize: 12 }}>Log Weight & Blood Pressure Entry</div>
          <div className="db-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginBottom: 12 }}>
            <div className="db-form-group">
              <label className="db-label">Pregnancy Week *</label>
              <input
                className="db-input"
                type="number"
                placeholder="e.g. 24"
                value={weightDraft.week}
                onChange={e => setWeightDraft({ ...weightDraft, week: e.target.value })}
                required
              />
            </div>
            <div className="db-form-group">
              <label className="db-label">Weight (kg) *</label>
              <input
                className="db-input"
                type="number"
                step="0.1"
                placeholder="e.g. 65.5"
                value={weightDraft.kg}
                onChange={e => setWeightDraft({ ...weightDraft, kg: e.target.value })}
                required
              />
            </div>
            <div className="db-form-group">
              <label className="db-label">Blood Pressure (BP)</label>
              <input
                className="db-input"
                type="text"
                placeholder="e.g. 116/75"
                value={weightDraft.bp}
                onChange={e => setWeightDraft({ ...weightDraft, bp: e.target.value })}
              />
            </div>
          </div>
          <div className="db-form-group" style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
              <label className="db-label">Notes / Health Observations (Max 100 chars)</label>
              <span style={{ fontSize: 11, color: "var(--ink-soft)" }}>{weightDraft.note.length}/100</span>
            </div>
            <input
              className="db-input"
              type="text"
              maxLength={100}
              placeholder="e.g. Morning reading after breakfast, feeling energetic"
              value={weightDraft.note}
              onChange={e => setWeightDraft({ ...weightDraft, note: e.target.value })}
            />
          </div>
          <button type="submit" className="db-btn primary">Save Vitals Entry</button>
        </form>
      )}

      {/* Edit Vitals Form */}
      {showVitalsForm && (
        <form onSubmit={handleVitalsSubmit} className="db-card" style={{ marginBottom: 20 }}>
          <div className="db-label" style={{ marginBottom: 12 }}>Update Vital Health Stats</div>
          <div className="db-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", marginBottom: 12 }}>
            <div>
              <label className="db-label" style={{ marginBottom: 4 }}>Current Weight</label>
              <input
                className="db-input"
                type="text"
                value={vitalsDraft.currentWeight}
                onChange={e => setVitalsDraft({ ...vitalsDraft, currentWeight: e.target.value })}
                placeholder="e.g. 65 kg"
              />
            </div>
            <div>
              <label className="db-label" style={{ marginBottom: 4 }}>Last BP Reading</label>
              <input
                className="db-input"
                type="text"
                value={vitalsDraft.lastBp}
                onChange={e => setVitalsDraft({ ...vitalsDraft, lastBp: e.target.value })}
                placeholder="e.g. 116/75"
              />
            </div>
            <div>
              <label className="db-label" style={{ marginBottom: 4 }}>Current Medicines</label>
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

      {/* Add Visit Form with Multiple Attachments Support */}
      {showVisitForm && (
        <form onSubmit={handleVisitSubmit} className="db-card" style={{ marginBottom: 20, border: "1.5px solid var(--rose)" }}>
          <div className="db-label" style={{ marginBottom: 12, color: "var(--rose)", fontSize: 12 }}>Log Doctor Visit & Multiple Report Attachments</div>
          <div className="db-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginBottom: 12 }}>
            <div className="db-form-group">
              <label className="db-label" style={{ marginBottom: 4 }}>Doctor / Clinic *</label>
              <input
                className="db-input"
                type="text"
                placeholder="e.g. Dr. Rahman"
                value={visitDraft.doctor}
                onChange={e => setVisitDraft({ ...visitDraft, doctor: e.target.value })}
                required
              />
            </div>
            <div className="db-form-group">
              <label className="db-label" style={{ marginBottom: 4 }}>Visit Date *</label>
              <input
                className="db-input"
                type="date"
                value={visitDraft.date}
                onChange={e => setVisitDraft({ ...visitDraft, date: e.target.value })}
                required
              />
            </div>
            <div className="db-form-group">
              <label className="db-label" style={{ marginBottom: 4 }}>Blood Pressure (BP)</label>
              <input
                className="db-input"
                type="text"
                placeholder="e.g. 118/76"
                value={visitDraft.bp}
                onChange={e => setVisitDraft({ ...visitDraft, bp: e.target.value })}
              />
            </div>
          </div>

          <div className="db-form-group" style={{ marginBottom: 14 }}>
            <label className="db-label" style={{ marginBottom: 4 }}>Appointment Notes & Advice</label>
            <textarea
              className="db-input"
              rows={2}
              placeholder="Appointment notes, prescriptions, advice..."
              value={visitDraft.note}
              onChange={e => setVisitDraft({ ...visitDraft, note: e.target.value })}
            />
          </div>

          {/* Multiple Attachments Upload Section */}
          <div className="db-form-group" style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <label className="db-label" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Paperclip size={13} color="var(--rose)" /> Multiple Attachments ({visitDraft.attachments?.length || 0} attached)
              </label>
              {visitDraft.attachments?.length > 0 && (
                <label className="db-btn" style={{ fontSize: 11, padding: "3px 10px", cursor: "pointer" }}>
                  <Plus size={12} /> Add More Files
                  <input
                    type="file"
                    multiple
                    accept="image/*,.pdf"
                    onChange={handleVisitFilesChange}
                    style={{ display: "none" }}
                  />
                </label>
              )}
            </div>

            {visitDraft.attachments?.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {visitDraft.attachments.map(att => (
                  <div
                    key={att.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      background: "var(--paper)",
                      border: "1px solid var(--line)",
                      borderRadius: 10,
                      padding: "8px 12px"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10, overflow: "hidden" }}>
                      <FileText size={18} color="var(--rose)" style={{ flexShrink: 0 }} />
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 12.5, fontWeight: 600, color: "var(--ink)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {att.name}
                        </div>
                        <div style={{ fontSize: 10.5, color: "var(--sage)", fontWeight: 600 }}>Ready to save</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeAttachment(att.id)}
                      style={{ background: "none", border: "none", color: "var(--ink-soft)", cursor: "pointer", padding: 4 }}
                    >
                      <X size={15} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <label className="db-file-dropzone" style={{ padding: "16px 12px" }}>
                <Paperclip size={24} color="var(--rose)" />
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>
                  Click to select multiple reports / prescriptions or drag & drop
                </div>
                <div style={{ fontSize: 11, color: "var(--ink-soft)" }}>
                  Upload multiple PDFs, ultrasound scans, blood test reports, and prescriptions at once
                </div>
                <input
                  type="file"
                  multiple
                  accept="image/*,.pdf"
                  onChange={handleVisitFilesChange}
                  style={{ display: "none" }}
                />
              </label>
            )}
          </div>

          <button type="submit" className="db-btn primary" style={{ width: "100%", justifyContent: "center" }}>
            <Plus size={16} /> Save Doctor Visit Record
          </button>
        </form>
      )}

      {/* Weight & Vitals Summary Cards */}
      <div className="db-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", marginBottom: 20 }}>
        <StatCard icon={<Scale size={17} color="var(--rose)" />} value={vitals?.currentWeight || "65 kg"} label="Current Weight" />
        <StatCard icon={<Droplet size={17} color="var(--rose)" />} value={vitals?.lastBp || "116/75"} label="Last BP Reading" />
        <StatCard icon={<TrendingUp size={17} color="var(--gold)" />} value={`${totalGainFormatted} kg`} label="Total Gain (from Wk 6)" />
        <StatCard icon={<Pill size={17} color="var(--sage)" />} value={vitals?.medicines || "Folic Acid, Iron"} label="Current Medicines" />
      </div>

      {/* Weight Chart Card */}
      <div className="db-card" style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div>
            <div className="db-label" style={{ color: "var(--rose)" }}>Weight Trajectory</div>
            <h3 className="db-serif" style={{ fontSize: 18, margin: "2px 0 0 0" }}>Pregnancy Weight Gain Curve</h3>
          </div>
          <span style={{ fontSize: 12, color: "var(--ink-soft)", fontWeight: 600 }}>{weightData.length} data points logged</span>
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

      {/* Vitals History Log Table */}
      <div className="db-card" style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <div className="db-label" style={{ color: "var(--sage)" }}>Vitals Log Book</div>
            <h3 className="db-serif" style={{ fontSize: 18, margin: "2px 0 0 0" }}>Weight & Blood Pressure History</h3>
          </div>
          <button className="db-btn" onClick={() => setShowWeightForm(true)} style={{ fontSize: 12, padding: "5px 10px" }}>
            <Plus size={14} /> Log Entry
          </button>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 13.5 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--line)", color: "var(--ink-soft)", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                <th style={{ padding: "10px 12px" }}>Pregnancy Stage</th>
                <th style={{ padding: "10px 12px" }}>Weight (kg)</th>
                <th style={{ padding: "10px 12px" }}>Gain Change</th>
                <th style={{ padding: "10px 12px" }}>Blood Pressure (BP)</th>
                <th style={{ padding: "10px 12px" }}>Health Status</th>
                <th style={{ padding: "10px 12px" }}>Notes / Observations</th>
              </tr>
            </thead>
            <tbody>
              {weightData.map((w, idx) => {
                const prevKg = idx > 0 ? weightData[idx - 1].kg : w.kg;
                const diff = (w.kg - prevKg);
                let gainFormatted = "Baseline";
                if (idx > 0) {
                  gainFormatted = diff >= 0 ? `+${diff.toFixed(1)} kg` : `${diff.toFixed(1)} kg`;
                }

                const bpVal = w.bp || (idx === weightData.length - 1 ? (vitals?.lastBp || "116/75") : "112/72");
                const status = evaluateBpStatus(bpVal);

                return (
                  <tr key={idx} style={{ borderBottom: "1px solid var(--paper-alt)", transition: "background 0.15s ease" }}>
                    <td style={{ padding: "12px", fontWeight: 600 }}>
                      <span className="db-chip active" style={{ fontSize: 11, padding: "2px 8px" }}>
                        Week {w.week}
                      </span>
                    </td>
                    <td style={{ padding: "12px", fontWeight: 700, fontSize: 14 }}>
                      {w.kg} kg
                    </td>
                    <td style={{ padding: "12px" }}>
                      {idx === 0 ? (
                        <span style={{ fontSize: 12, color: "var(--ink-soft)" }}>Baseline</span>
                      ) : (
                        <span style={{ fontSize: 12, fontWeight: 600, color: diff >= 0 ? "var(--sage)" : "var(--rose)", background: diff >= 0 ? "var(--sage-light)" : "var(--rose-light)", padding: "2px 8px", borderRadius: 6 }}>
                          {gainFormatted}
                        </span>
                      )}
                    </td>
                    <td style={{ padding: "12px", fontWeight: 600, color: "var(--ink)" }}>
                      <Droplet size={12} color="var(--rose)" style={{ verticalAlign: -1, marginRight: 4 }} />
                      {bpVal} mmHg
                    </td>
                    <td style={{ padding: "12px" }}>
                      <span
                        style={{
                          fontSize: 11.5,
                          fontWeight: 700,
                          color: status.color,
                          background: status.bg,
                          padding: "3px 9px",
                          borderRadius: 99,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4
                        }}
                      >
                        {status.label}
                      </span>
                    </td>
                    <td style={{ padding: "12px", maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={w.note || ""}>
                      {w.note ? (
                        <span style={{ fontSize: 12.5, color: "var(--ink-soft)" }}>
                          <MessageSquare size={12} style={{ verticalAlign: -1, marginRight: 4, color: "var(--rose)" }} />
                          {w.note}
                        </span>
                      ) : (
                        <span style={{ fontSize: 11.5, color: "rgba(107, 100, 120, 0.4)", fontStyle: "italic" }}>No notes</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Doctor Visit Cards with Multiple Report & Prescription Attachments */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div>
          <div className="db-label" style={{ color: "var(--rose)" }}>Prenatal Medical Appointments</div>
          <h3 className="db-serif" style={{ fontSize: 18, margin: "2px 0 0 0" }}>Doctor Visits & Lab Reports</h3>
        </div>
        <span style={{ fontSize: 12, color: "var(--ink-soft)", fontWeight: 600 }}>{visits.length} total visits</span>
      </div>

      <div className="db-grid" style={{ gridTemplateColumns: "1fr", gap: 14 }}>
        {visits.map((v, i) => {
          // Normalizing single attachment legacy data vs multi-attachments
          const fileList = v.attachments && v.attachments.length > 0
            ? v.attachments
            : (v.attachmentName ? [{ id: "legacy_1", name: v.attachmentName, url: v.attachmentUrl }] : []);

          return (
            <div className="db-card" key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: "var(--ink)" }}>{v.doctor}</div>
                  {v.bp && (
                    <span className="db-chip active" style={{ fontSize: 10, padding: "2px 8px" }}>
                      BP {v.bp}
                    </span>
                  )}
                  {fileList.length > 0 && (
                    <span style={{ fontSize: 11, fontWeight: 700, color: "var(--rose)", background: "var(--rose-light)", padding: "2px 8px", borderRadius: 99 }}>
                      📎 {fileList.length} {fileList.length === 1 ? "Attachment" : "Attachments"}
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 13.5, color: "var(--ink-soft)", marginTop: 4 }}>{v.note || "Routine appointment"}</div>
                
                {/* Multi-Attachment Pill Buttons */}
                {fileList.length > 0 && (
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
                    {fileList.map((att, attIdx) => (
                      <button
                        key={att.id || attIdx}
                        className="db-btn"
                        onClick={() => openReportViewer(v, attIdx)}
                        style={{
                          fontSize: 11.5,
                          padding: "4px 10px",
                          background: "var(--paper)",
                          borderColor: "var(--rose)",
                          color: "var(--rose)",
                          fontWeight: 600
                        }}
                      >
                        <Paperclip size={12} /> {att.name || `Document ${attIdx + 1}`}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ textAlign: "right" }}>
                <div className="db-label" style={{ color: "var(--rose)", fontSize: 11 }}>{fmtDate(v.date)}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Multi-File Report / Prescription Viewer Modal */}
      {activeReportVisit && (
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
          onClick={() => setActiveReportVisit(null)}
        >
          {(() => {
            const fileList = activeReportVisit.attachments && activeReportVisit.attachments.length > 0
              ? activeReportVisit.attachments
              : (activeReportVisit.attachmentName ? [{ id: "legacy_1", name: activeReportVisit.attachmentName, url: activeReportVisit.attachmentUrl }] : []);
            
            const currentFile = fileList[selectedFileIdx] || fileList[0];

            return (
              <div
                className="db-card"
                style={{ maxWidth: 580, width: "100%", background: "var(--card)", borderRadius: 16 }}
                onClick={e => e.stopPropagation()}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <div>
                    <div className="db-label" style={{ color: "var(--rose)" }}>
                      Medical Document Viewer ({selectedFileIdx + 1} of {fileList.length})
                    </div>
                    <h3 className="db-serif" style={{ fontSize: 17, margin: "2px 0 0 0" }}>
                      {activeReportVisit.doctor} — {fmtDate(activeReportVisit.date)}
                    </h3>
                  </div>
                  <button className="db-btn" onClick={() => setActiveReportVisit(null)} style={{ padding: 6 }}>
                    <X size={16} />
                  </button>
                </div>

                {/* Multiple File Selector Tabs */}
                {fileList.length > 1 && (
                  <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 8, marginBottom: 10 }}>
                    {fileList.map((f, idx) => (
                      <button
                        key={f.id || idx}
                        className={`db-chip ${selectedFileIdx === idx ? "active" : ""}`}
                        onClick={() => setSelectedFileIdx(idx)}
                        style={{ fontSize: 11, padding: "3px 10px", whiteSpace: "nowrap" }}
                      >
                        <FileText size={11} style={{ marginRight: 4 }} />
                        {f.name}
                      </button>
                    ))}
                  </div>
                )}

                {/* File Preview Area */}
                <div style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 12, padding: 14, marginBottom: 14, textAlign: "center" }}>
                  {currentFile?.url ? (
                    <img
                      src={currentFile.url}
                      alt="Medical Attachment Scan"
                      style={{ width: "100%", maxHeight: 320, objectFit: "contain", borderRadius: 8, border: "1px solid var(--line)" }}
                    />
                  ) : (
                    <div style={{ padding: 40, color: "var(--ink-soft)" }}>
                      <FileText size={48} color="var(--rose)" style={{ marginBottom: 8 }} />
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{currentFile?.name || "Medical Report Document"}</div>
                    </div>
                  )}
                </div>

                <div style={{ fontSize: 13, color: "var(--ink-soft)", marginBottom: 14, background: "var(--paper-alt)", padding: "10px 12px", borderRadius: 8 }}>
                  <strong>Doctor Notes:</strong> {activeReportVisit.note || "No additional notes recorded."}
                </div>

                <button className="db-btn primary" onClick={() => setActiveReportVisit(null)} style={{ width: "100%", justifyContent: "center" }}>
                  Close Viewer
                </button>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
