import React, { useState } from "react";
import { User, Heart, Baby, Calendar, Mail, Stethoscope, Phone, Building2, Check, Loader2, LogOut, HardDrive, Image as ImageIcon, BookOpen, Clock, HeartPulse } from "lucide-react";
import { daysBetween, fmtDate } from "../utils.js";
import { calculateUserStorage } from "../utils/storageUtils.js";

const AVATAR_OPTIONS = ["🌸", "🧸", "🍼", "👑", "🎀", "🐣", "💛", "🌿", "🌷", "✨"];

export default function Profile({ user, userDataBundle, onUpdateProfile, onLogout, onMarkDelivered, onToggleKeepsakeMode }) {
  const isDelivered = Boolean(user?.isDelivered);

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

      {/* Main Profile Summary Card - ALWAYS AT VERY TOP OF PROFILE */}
      <div className="db-card" style={{ background: "linear-gradient(135deg, var(--card), var(--paper-alt))", display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap", border: "1.5px solid var(--rose)" }}>
        <div style={{ width: 80, height: 80, borderRadius: "50%", background: "var(--rose-light)", border: "2px solid var(--rose)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40 }}>
          {formData.avatar}
        </div>
        <div style={{ flex: 1 }}>
          <div className="db-serif" style={{ fontSize: 26, fontWeight: 600, color: "var(--ink)" }}>
            {formData.name || "Monisha Roy"}
          </div>
          <div style={{ color: "var(--ink-soft)", fontSize: 14, marginTop: 4, display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
            <span><Baby size={15} color="var(--rose)" style={{ verticalAlign: -2 }} /> Baby: <strong>{formData.babyNickname}</strong> ({formData.babyGender})</span>
            <span><Calendar size={15} color="var(--rose)" style={{ verticalAlign: -2 }} /> <strong>Week {formData.currentWeek}</strong></span>
            <span><Heart size={15} color="var(--rose)" style={{ verticalAlign: -2 }} /> <strong>{isDelivered ? "Baby Born 🎉" : `${daysRemaining} days remaining`}</strong></span>
          </div>
        </div>
      </div>

      {/* Keepsake Memory Mode Controls */}
      <div className="db-card" style={{ background: isDelivered ? "linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)" : "linear-gradient(135deg, var(--card), var(--paper-alt))", border: isDelivered ? "1.5px solid #166534" : "1px solid var(--line)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: isDelivered ? "#166534" : "var(--rose)", marginBottom: 2 }}>
              {isDelivered ? "🔒 Memory Keepsake Mode Active" : "🌸 Active Pregnancy Tracking"}
            </div>
            <h3 className="db-serif" style={{ fontSize: 18, margin: 0 }}>
              {isDelivered ? "Pregnancy Journey Safely Preserved as Read-Only Archive" : "Active Pregnancy Journey Logging"}
            </h3>
            <p style={{ fontSize: 13, color: "var(--ink-soft)", margin: "4px 0 0 0" }}>
              {isDelivered
                ? "Your pregnancy memories are locked in read-only mode for lifelong sharing with family and friends."
                : "Log your daily letters, photos, and vitals. Mark baby born when delivered to preserve as a read-only memory book."}
            </p>
          </div>

          <div>
            {!isDelivered ? (
              <button
                className="db-btn primary"
                onClick={() => onMarkDelivered()}
                style={{ background: "var(--rose)", border: "none", fontSize: 13 }}
              >
                👶 Mark Baby Born / Preserve Keepsake
              </button>
            ) : (
              <button
                className="db-btn"
                onClick={() => onToggleKeepsakeMode(false)}
                style={{ fontSize: 12, borderColor: "#166534", color: "#166534", background: "#FFF" }}
              >
                🔓 Switch to Active Editing Mode
              </button>
            )}
          </div>
        </div>
      </div>

      {savedSuccess && (
        <div style={{ padding: "12px 16px", background: "var(--sage-light)", border: "1px solid var(--sage)", borderRadius: "var(--radius-sm)", color: "var(--ink)", display: "flex", alignItems: "center", gap: 10, fontSize: 14 }}>
          <Check size={18} color="var(--sage)" />
          <strong>Profile updated successfully!</strong> Your personalized settings are saved to your account.
        </div>
      )}

      {/* Edit Profile Form */}
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {/* Section 1: Avatar Selection */}
        <div className="db-card">
          <div className="db-label" style={{ marginBottom: 8, color: "var(--rose)" }}>Profile Icon</div>
          <h3 className="db-serif" style={{ fontSize: 18, margin: "0 0 12px 0" }}>Choose Your Avatar</h3>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {AVATAR_OPTIONS.map(av => (
              <button
                key={av}
                type="button"
                onClick={() => handleAvatarSelect(av)}
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  fontSize: 22,
                  border: formData.avatar === av ? "2px solid var(--rose)" : "1px solid var(--line)",
                  background: formData.avatar === av ? "var(--rose-light)" : "var(--card)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "transform 0.15s ease"
                }}
              >
                {av}
              </button>
            ))}
          </div>
        </div>

        {/* Section 2: Mother & Partner Info */}
        <div className="db-card">
          <div className="db-label" style={{ marginBottom: 8, color: "var(--rose)" }}>Mother & Family Info</div>
          <h3 className="db-serif" style={{ fontSize: 18, margin: "0 0 16px 0" }}>Personal Details</h3>

          <div className="db-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
            <div className="db-form-group">
              <label className="db-label">Mother's Full Name *</label>
              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  name="name"
                  className="db-input"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="db-form-group">
              <label className="db-label">Email Address (Account ID)</label>
              <div style={{ position: "relative" }}>
                <input
                  type="email"
                  name="email"
                  className="db-input"
                  value={formData.email}
                  readOnly
                  disabled
                  style={{ background: "var(--paper-alt)", color: "var(--ink-soft)" }}
                />
              </div>
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
        </div>

        {/* Section 3: Baby & Pregnancy Settings */}
        <div className="db-card">
          <div className="db-label" style={{ marginBottom: 8, color: "var(--rose)" }}>Pregnancy Tracker Settings</div>
          <h3 className="db-serif" style={{ fontSize: 18, margin: "0 0 16px 0" }}>Baby & Due Date</h3>

          <div className="db-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
            <div className="db-form-group">
              <label className="db-label">Baby's Nickname</label>
              <input
                type="text"
                name="babyNickname"
                className="db-input"
                value={formData.babyNickname}
                onChange={handleChange}
              />
            </div>

            <div className="db-form-group">
              <label className="db-label">Baby Gender / Reveal</label>
              <select
                name="babyGender"
                className="db-input"
                value={formData.babyGender}
                onChange={handleChange}
              >
                <option value="Girl 👧">Girl 👧</option>
                <option value="Boy 👦">Boy 👦</option>
                <option value="Surprise 🎁">Surprise 🎁</option>
                <option value="Twins 👶👶">Twins 👶👶</option>
              </select>
            </div>

            <div className="db-form-group">
              <label className="db-label">Expected Due Date</label>
              <input
                type="date"
                name="dueDate"
                className="db-input"
                value={formData.dueDate}
                onChange={handleChange}
              />
            </div>

            <div className="db-form-group">
              <label className="db-label">Current Gestational Week (1 - 40)</label>
              <input
                type="number"
                name="currentWeek"
                min="1"
                max="40"
                className="db-input"
                value={formData.currentWeek}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Section 4: Healthcare & Emergency Contact */}
        <div className="db-card">
          <div className="db-label" style={{ marginBottom: 8, color: "var(--rose)" }}>Healthcare & Medical Details</div>
          <h3 className="db-serif" style={{ fontSize: 18, margin: "0 0 16px 0" }}>Doctor & Hospital Contacts</h3>

          <div className="db-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
            <div className="db-form-group">
              <label className="db-label">Primary Obstetrician / Doctor</label>
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
              <label className="db-label">Hospital / Birth Center</label>
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

      {/* Account Storage Breakdown Dashboard — ALWAYS AT THE VERY BOTTOM */}
      <div className="db-card" style={{ border: "1.5px solid var(--rose)", background: "linear-gradient(135deg, var(--card) 0%, #FFFDF9 100%)", marginTop: 8 }}>
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
    </div>
  );
}
