import React, { useState } from "react";
import {
  User, Calendar, Baby, Stethoscope, Heart, Check, LogOut, ShieldCheck, Phone, MapPin, Sparkles, Loader2,
  HardDrive, Download, Trash2, Database, ShieldAlert, Image as ImageIcon, BookOpen, Clock, HeartPulse
} from "lucide-react";
import { daysBetween, fmtDate } from "../utils.js";
import { calculateUserStorage, exportUserData } from "../utils/storageUtils.js";

const AVATAR_OPTIONS = ["🌸", "🧸", "🍼", "👑", "🎀", "🐣", "💛", "🌿", "🌷", "✨"];

export default function Profile({ user, userDataBundle, onUpdateProfile, onLogout }) {
  const [formData, setFormData] = useState({
    name: user?.name || "Monisha Roy",
    email: user?.email || "monisha@example.com",
    partnerName: user?.partnerName || "Shuvo",
    babyNickname: user?.babyNickname || "Little Bean",
    babyGender: user?.babyGender || "Girl 👧",
    dueDate: user?.dueDate || "2026-11-02",
    currentWeek: user?.currentWeek || 24,
    avatar: user?.avatar || "🌸",
    doctorName: user?.doctorName || "Dr. Rahman",
    hospital: user?.hospital || "City Maternity Hospital",
    bloodGroup: user?.bloodGroup || "O Positive (O+)",
    emergencyContact: user?.emergencyContact || "+1 (555) 234-5678"
  });

  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Storage calculations
  const storageInfo = calculateUserStorage(userDataBundle);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  function handleAvatarSelect(av) {
    setFormData(prev => ({ ...prev, avatar: av }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      onUpdateProfile(formData);
      setIsSaving(false);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }, 350);
  }

  function handleClearCache() {
    if (window.confirm("Are you sure you want to clear your local memory cache? Make sure to export a backup first!")) {
      const key = `dear_baby_userdata_${(user?.email || "user").toLowerCase()}`;
      localStorage.removeItem(key);
      window.location.reload();
    }
  }

  const daysRemaining = Math.max(0, daysBetween(new Date(), formData.dueDate));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 900 }}>
      {/* Header Banner */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <span className="db-chip active" style={{ fontSize: 11, padding: "2px 8px" }}>
              Profile & Account
            </span>
            <span style={{ fontSize: 13, color: "var(--ink-soft)" }}>Manage your information & storage</span>
          </div>
          <h1 className="db-serif db-page-title" style={{ fontSize: 32 }}>
            Mother & Baby Profile
          </h1>
        </div>

        {onLogout && (
          <button
            onClick={onLogout}
            className="db-btn"
            style={{ color: "#D93838", borderColor: "#F8C4C4", background: "#FFF5F5" }}
          >
            <LogOut size={15} /> Sign out
          </button>
        )}
      </div>

      {savedSuccess && (
        <div style={{ padding: "12px 16px", background: "var(--sage-light)", border: "1px solid var(--sage)", borderRadius: "var(--radius-sm)", color: "var(--ink)", display: "flex", alignItems: "center", gap: 10, fontSize: 14 }}>
          <Check size={18} color="var(--sage)" />
          <strong>Profile updated successfully!</strong> Your personalized settings are saved to your account.
        </div>
      )}

      {/* Main Profile Header Card */}
      <div className="db-card" style={{ background: "linear-gradient(135deg, var(--card), var(--paper-alt))", display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
        <div style={{ width: 80, height: 80, borderRadius: "50%", background: "var(--rose-light)", border: "2px solid var(--rose)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40 }}>
          {formData.avatar}
        </div>
        <div style={{ flex: 1 }}>
          <div className="db-serif" style={{ fontSize: 24, fontWeight: 600 }}>
            {formData.name || "Mother-to-be"}
          </div>
          <div style={{ color: "var(--ink-soft)", fontSize: 13.5, marginTop: 2, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <span><Baby size={14} style={{ verticalAlign: -2 }} /> Baby: <strong>{formData.babyNickname}</strong> ({formData.babyGender})</span>
            <span><Calendar size={14} style={{ verticalAlign: -2 }} /> Week {formData.currentWeek}</span>
            <span><Heart size={14} style={{ verticalAlign: -2, color: "var(--rose)" }} /> {daysRemaining} days remaining</span>
          </div>
        </div>
      </div>

      {/* Total Data Storage Dashboard */}
      <div className="db-card" style={{ border: "1.5px solid var(--rose)", background: "linear-gradient(135deg, var(--card) 0%, #FFFDF9 100%)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
          <div>
            <div className="db-label" style={{ color: "var(--rose)", display: "flex", alignItems: "center", gap: 6 }}>
              <HardDrive size={14} color="var(--rose)" /> Isolated Data Storage Usage
            </div>
            <h3 className="db-serif" style={{ fontSize: 18, margin: "2px 0 0 0" }}>
              Account Storage Breakdown
            </h3>
          </div>
        </div>

        {/* Visual Storage Meter Bar */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 600, color: "var(--ink)", marginBottom: 6 }}>
            <span>Used Account Memory: <strong style={{ color: "var(--rose)" }}>{storageInfo.totalKb}</strong></span>
            <span style={{ color: "var(--ink-soft)", fontSize: 12 }}>{storageInfo.pct}% of 5.0 MB Quota</span>
          </div>
          <div style={{ width: "100%", height: 12, background: "var(--paper-alt)", borderRadius: 999, overflow: "hidden", border: "1px solid var(--line)" }}>
            <div
              style={{
                width: `${Math.max(4, storageInfo.pct)}%`,
                height: "100%",
                background: "linear-gradient(90deg, var(--rose) 0%, var(--gold) 100%)",
                borderRadius: 999,
                transition: "width 0.4s ease"
              }}
            />
          </div>
        </div>

        {/* Storage Category Breakdown Grid */}
        <div className="db-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 10 }}>
          <div style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 10, padding: "10px 12px" }}>
            <div style={{ fontSize: 11, color: "var(--ink-soft)", display: "flex", alignItems: "center", gap: 4, marginBottom: 2 }}>
              <ImageIcon size={12} color="var(--rose)" /> Photos & Scans
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "var(--ink)" }}>{storageInfo.breakdown.photos} KB</div>
          </div>

          <div style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 10, padding: "10px 12px" }}>
            <div style={{ fontSize: 11, color: "var(--ink-soft)", display: "flex", alignItems: "center", gap: 4, marginBottom: 2 }}>
              <BookOpen size={12} color="var(--rose)" /> Journal Letters
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "var(--ink)" }}>{storageInfo.breakdown.journal} KB</div>
          </div>

          <div style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 10, padding: "10px 12px" }}>
            <div style={{ fontSize: 11, color: "var(--ink-soft)", display: "flex", alignItems: "center", gap: 4, marginBottom: 2 }}>
              <Clock size={12} color="var(--rose)" /> Milestones
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "var(--ink)" }}>{storageInfo.breakdown.timeline} KB</div>
          </div>

          <div style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 10, padding: "10px 12px" }}>
            <div style={{ fontSize: 11, color: "var(--ink-soft)", display: "flex", alignItems: "center", gap: 4, marginBottom: 2 }}>
              <HeartPulse size={12} color="var(--rose)" /> Medical & Vitals
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "var(--ink)" }}>{storageInfo.breakdown.medical} KB</div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {/* Section 1: Basic Mother Info */}
        <div className="db-card">
          <div className="db-label" style={{ marginBottom: 14, display: "flex", alignItems: "center", gap: 6 }}>
            <User size={15} color="var(--rose)" /> Personal Details
          </div>

          <div className="db-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
            <div className="db-form-group">
              <label className="db-label">Full Name</label>
              <input
                type="text"
                name="name"
                className="db-input"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="db-form-group">
              <label className="db-label">Email Address (Isolated Account Key)</label>
              <input
                type="email"
                name="email"
                className="db-input"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="db-form-group">
              <label className="db-label">Partner's Name</label>
              <input
                type="text"
                name="partnerName"
                className="db-input"
                value={formData.partnerName}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="db-form-group" style={{ marginTop: 16 }}>
            <label className="db-label" style={{ marginBottom: 8 }}>Choose Avatar Emoji</label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {AVATAR_OPTIONS.map(av => (
                <button
                  key={av}
                  type="button"
                  onClick={() => handleAvatarSelect(av)}
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: "50%",
                    fontSize: 20,
                    border: formData.avatar === av ? "2px solid var(--rose)" : "1px solid var(--line)",
                    background: formData.avatar === av ? "var(--rose-light)" : "var(--card)",
                    cursor: "pointer",
                    transition: "all 0.15s ease"
                  }}
                >
                  {av}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Section 2: Baby & Pregnancy Details */}
        <div className="db-card">
          <div className="db-label" style={{ marginBottom: 14, display: "flex", alignItems: "center", gap: 6 }}>
            <Baby size={15} color="var(--rose)" /> Baby & Pregnancy Details
          </div>

          <div className="db-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
            <div className="db-form-group">
              <label className="db-label">Baby Nickname</label>
              <input
                type="text"
                name="babyNickname"
                className="db-input"
                value={formData.babyNickname}
                onChange={handleChange}
              />
            </div>

            <div className="db-form-group">
              <label className="db-label">Gender (or Surprise)</label>
              <input
                type="text"
                name="babyGender"
                className="db-input"
                value={formData.babyGender}
                onChange={handleChange}
              />
            </div>

            <div className="db-form-group">
              <label className="db-label">Estimated Due Date</label>
              <input
                type="date"
                name="dueDate"
                className="db-input"
                value={formData.dueDate}
                onChange={handleChange}
              />
            </div>

            <div className="db-form-group">
              <label className="db-label">Current Pregnancy Week</label>
              <input
                type="number"
                name="currentWeek"
                min="1"
                max="42"
                className="db-input"
                value={formData.currentWeek}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Section 3: Healthcare & Emergency */}
        <div className="db-card">
          <div className="db-label" style={{ marginBottom: 14, display: "flex", alignItems: "center", gap: 6 }}>
            <Stethoscope size={15} color="var(--rose)" /> Healthcare & Doctor Details
          </div>

          <div className="db-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
            <div className="db-form-group">
              <label className="db-label">Doctor / Obstetrician</label>
              <input
                type="text"
                name="doctorName"
                className="db-input"
                placeholder="e.g. Dr. Rahman"
                value={formData.doctorName}
                onChange={handleChange}
              />
            </div>

            <div className="db-form-group">
              <label className="db-label">Hospital / Clinic</label>
              <input
                type="text"
                name="hospital"
                className="db-input"
                placeholder="e.g. City Maternity Hospital"
                value={formData.hospital}
                onChange={handleChange}
              />
            </div>

            <div className="db-form-group">
              <label className="db-label">Blood Group</label>
              <select
                name="bloodGroup"
                className="db-input"
                value={formData.bloodGroup}
                onChange={handleChange}
              >
                <option value="O Positive (O+)">O Positive (O+)</option>
                <option value="O Negative (O-)">O Negative (O-)</option>
                <option value="A Positive (A+)">A Positive (A+)</option>
                <option value="A Negative (A-)">A Negative (A-)</option>
                <option value="B Positive (B+)">B Positive (B+)</option>
                <option value="B Negative (B-)">B Negative (B-)</option>
                <option value="AB Positive (AB+)">AB Positive (AB+)</option>
                <option value="AB Negative (AB-)">AB Negative (AB-)</option>
              </select>
            </div>

            <div className="db-form-group">
              <label className="db-label">Emergency Phone</label>
              <input
                type="tel"
                name="emergencyContact"
                className="db-input"
                placeholder="e.g. +1 (555) 234-5678"
                value={formData.emergencyContact}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {isSaving && <div className="db-top-loader" />}

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
          <button type="submit" disabled={isSaving} className="db-btn primary" style={{ padding: "12px 24px", fontSize: 15, opacity: isSaving ? 0.7 : 1 }}>
            {isSaving ? (
              <><Loader2 size={16} className="db-spin" /> Saving Changes...</>
            ) : (
              <><Check size={16} /> Save Profile Changes</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
