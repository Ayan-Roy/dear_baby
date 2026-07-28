import React, { useState } from "react";
import { Camera, Plus, Heart, X, ChevronLeft, ChevronRight, Grid, Clock, Sparkles } from "lucide-react";
import { fmtDate } from "../utils.js";

export default function Gallery({ photos = [], addPhoto, togglePhotoFav }) {
  const [filter, setFilter] = useState("All");
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "timeline"
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  // Upload draft state
  const [draft, setDraft] = useState({
    title: "",
    cat: "Bump Diary",
    week: "24",
    date: new Date().toISOString().split("T")[0],
    note: "",
    imageFile: null,
    previewUrl: ""
  });

  const categories = ["All", "Ultrasound", "Bump Diary", "Nursery", "Milestones", "Favorites"];

  // Filter photos
  const filteredPhotos = photos.filter(p => {
    if (filter === "All") return true;
    if (filter === "Favorites") return p.fav;
    return p.cat === filter;
  });

  // Sorted by week for Bump Progression Timeline
  const timelineSorted = [...photos].sort((a, b) => (a.week || 0) - (b.week || 0));

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setDraft(d => ({ ...d, imageFile: file, previewUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  }

  function handleUploadSubmit(e) {
    e.preventDefault();
    if (!draft.title || (!draft.previewUrl && !draft.url)) return;

    addPhoto({
      id: Date.now(),
      url: draft.previewUrl || "/images/bump.jpg",
      title: draft.title,
      cat: draft.cat,
      week: Number(draft.week) || 24,
      date: draft.date,
      note: draft.note,
      fav: false
    });

    setDraft({
      title: "",
      cat: "Bump Diary",
      week: "24",
      date: new Date().toISOString().split("T")[0],
      note: "",
      imageFile: null,
      previewUrl: ""
    });
    setShowUploadModal(false);
  }

  // Lightbox handlers
  const activePhoto = lightboxIndex !== null ? filteredPhotos[lightboxIndex] : null;

  function prevPhoto() {
    if (lightboxIndex > 0) setLightboxIndex(lightboxIndex - 1);
  }

  function nextPhoto() {
    if (lightboxIndex < filteredPhotos.length - 1) setLightboxIndex(lightboxIndex + 1);
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 12 }}>
        <div>
          <h1 className="db-serif db-page-title">Photo gallery & Memory book</h1>
          <p className="db-page-sub">Every ultrasound, bump update, and milestone photo — captured with love.</p>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <div style={{ display: "flex", border: "1px solid var(--line)", borderRadius: 10, background: "var(--card)", padding: 2 }}>
            <button
              className={`db-btn ${viewMode === "grid" ? "primary" : ""}`}
              onClick={() => setViewMode("grid")}
              style={{ border: "none", padding: "6px 12px", fontSize: 12 }}
            >
              <Grid size={13} /> Grid
            </button>
            <button
              className={`db-btn ${viewMode === "timeline" ? "primary" : ""}`}
              onClick={() => setViewMode("timeline")}
              style={{ border: "none", padding: "6px 12px", fontSize: 12 }}
            >
              <Clock size={13} /> Bump Timeline
            </button>
          </div>

          <button className="db-btn rose" onClick={() => setShowUploadModal(true)}>
            <Plus size={14} /> Upload memory
          </button>
        </div>
      </div>

      {/* Filter Category Chips */}
      <div style={{ display: "flex", gap: 8, marginBottom: 22, flexWrap: "wrap" }}>
        {categories.map(c => (
          <button
            key={c}
            className={`db-chip ${filter === c ? "active" : ""}`}
            onClick={() => setFilter(c)}
          >
            {c === "Favorites" ? "❤️ Favorites" : c}
          </button>
        ))}
      </div>

      {/* Grid View Mode */}
      {viewMode === "grid" && (
        <div className="db-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 20 }}>
          {filteredPhotos.map((p, idx) => (
            <div
              key={p.id}
              className="db-card"
              style={{
                padding: 0,
                overflow: "hidden",
                cursor: "pointer",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                display: "flex",
                flexDirection: "column"
              }}
              onClick={() => setLightboxIndex(idx)}
            >
              {/* Image Thumbnail Container */}
              <div style={{ position: "relative", width: "100%", height: 180, background: "var(--paper-alt)" }}>
                <img
                  src={p.url}
                  alt={p.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                
                {/* Week Badge */}
                <div
                  style={{
                    position: "absolute",
                    top: 10,
                    left: 10,
                    background: "rgba(43,36,56,0.8)",
                    color: "white",
                    padding: "3px 8px",
                    borderRadius: 6,
                    fontSize: 11,
                    fontWeight: 600,
                    backdropFilter: "blur(4px)"
                  }}
                >
                  Wk {p.week}
                </div>

                {/* Heart Favorite Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePhotoFav(p.id);
                  }}
                  style={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    background: "rgba(255,254,252,0.9)",
                    border: "none",
                    borderRadius: "50%",
                    width: 30,
                    height: 30,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.15)"
                  }}
                >
                  <Heart size={15} color="var(--rose)" fill={p.fav ? "var(--rose)" : "none"} />
                </button>
              </div>

              {/* Photo Details */}
              <div style={{ padding: "14px 16px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
                    <div style={{ fontWeight: 600, fontSize: 15 }}>{p.title}</div>
                  </div>
                  <div className="db-label" style={{ fontSize: 10.5 }}>{fmtDate(p.date)} · {p.cat}</div>
                  {p.note && (
                    <div style={{ fontSize: 12.5, color: "var(--ink-soft)", marginTop: 6, lineHeight: 1.4 }}>
                      "{p.note}"
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bump Timeline View Mode */}
      {viewMode === "timeline" && (
        <div className="db-ribbon">
          {timelineSorted.map((p, idx) => (
            <div className="db-ribbon-item" key={p.id}>
              <div className="db-ribbon-dot gold"><Sparkles size={11} color="var(--gold)" /></div>
              <div className="db-card" style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
                <img
                  src={p.url}
                  alt={p.title}
                  style={{ width: 120, height: 100, borderRadius: 10, objectFit: "cover", flexShrink: 0 }}
                  onClick={() => {
                    const foundIdx = filteredPhotos.findIndex(item => item.id === p.id);
                    if (foundIdx !== -1) setLightboxIndex(foundIdx);
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div className="db-label">Week {p.week} · {fmtDate(p.date)} · {p.cat}</div>
                  <div className="db-serif" style={{ fontSize: 17, fontWeight: 600, margin: "4px 0" }}>{p.title}</div>
                  {p.note && <div style={{ fontSize: 13, color: "var(--ink-soft)" }}>"{p.note}"</div>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Photo Modal */}
      {showUploadModal && (
        <form onSubmit={handleUploadSubmit} className="db-card" style={{ marginTop: 20, border: "2px solid var(--rose)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div className="db-label">Upload Memory Photo</div>
            <button type="button" className="db-btn" onClick={() => setShowUploadModal(false)} style={{ padding: 4 }}>
              <X size={14} />
            </button>
          </div>

          {/* Photo File Input / Preview */}
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 11, color: "var(--ink-soft)", display: "block", marginBottom: 4 }}>Memory Photo File</label>
            <input className="db-input" type="file" accept="image/*" onChange={handleFileChange} />
            {draft.previewUrl && (
              <div style={{ marginTop: 8 }}>
                <img src={draft.previewUrl} alt="Preview" style={{ height: 100, borderRadius: 8, objectFit: "cover" }} />
              </div>
            )}
          </div>

          <div className="db-grid" style={{ gridTemplateColumns: "2fr 1fr 1fr", marginBottom: 12 }}>
            <div>
              <label style={{ fontSize: 11, color: "var(--ink-soft)", display: "block", marginBottom: 4 }}>Photo Title</label>
              <input
                className="db-input"
                type="text"
                placeholder="e.g. Nursery crib set up"
                value={draft.title}
                onChange={e => setDraft({ ...draft, title: e.target.value })}
                required
              />
            </div>
            <div>
              <label style={{ fontSize: 11, color: "var(--ink-soft)", display: "block", marginBottom: 4 }}>Album Category</label>
              <select className="db-input" value={draft.cat} onChange={e => setDraft({ ...draft, cat: e.target.value })}>
                <option value="Ultrasound">Ultrasound</option>
                <option value="Bump Diary">Bump Diary</option>
                <option value="Nursery">Nursery</option>
                <option value="Milestones">Milestones</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: 11, color: "var(--ink-soft)", display: "block", marginBottom: 4 }}>Pregnancy Week</label>
              <input
                className="db-input"
                type="number"
                value={draft.week}
                onChange={e => setDraft({ ...draft, week: e.target.value })}
                placeholder="24"
              />
            </div>
          </div>

          <textarea
            className="db-input"
            rows={2}
            placeholder="Write the story behind this photo..."
            value={draft.note}
            onChange={e => setDraft({ ...draft, note: e.target.value })}
            style={{ marginBottom: 12 }}
          />

          <button type="submit" className="db-btn rose">Save Photo Memory</button>
        </form>
      )}

      {/* Lightbox Modal */}
      {activePhoto && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(20, 16, 28, 0.85)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: 20
          }}
          onClick={() => setLightboxIndex(null)}
        >
          <div
            className="db-card"
            style={{
              maxWidth: 700,
              width: "100%",
              padding: 0,
              overflow: "hidden",
              background: "var(--card)",
              position: "relative"
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setLightboxIndex(null)}
              style={{
                position: "absolute",
                top: 12,
                right: 12,
                background: "rgba(0,0,0,0.5)",
                color: "white",
                border: "none",
                borderRadius: "50%",
                width: 32,
                height: 32,
                cursor: "pointer",
                zIndex: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <X size={16} />
            </button>

            {/* Lightbox Image View */}
            <div style={{ position: "relative", width: "100%", maxHeight: 420, background: "#111", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <img
                src={activePhoto.url}
                alt={activePhoto.title}
                style={{ maxWidth: "100%", maxHeight: 420, objectFit: "contain" }}
              />

              {/* Prev / Next Nav */}
              {lightboxIndex > 0 && (
                <button
                  onClick={prevPhoto}
                  style={{
                    position: "absolute",
                    left: 12,
                    background: "rgba(255,255,255,0.8)",
                    border: "none",
                    borderRadius: "50%",
                    width: 36,
                    height: 36,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <ChevronLeft size={20} color="var(--ink)" />
                </button>
              )}

              {lightboxIndex < filteredPhotos.length - 1 && (
                <button
                  onClick={nextPhoto}
                  style={{
                    position: "absolute",
                    right: 12,
                    background: "rgba(255,255,255,0.8)",
                    border: "none",
                    borderRadius: "50%",
                    width: 36,
                    height: 36,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <ChevronRight size={20} color="var(--ink)" />
                </button>
              )}
            </div>

            {/* Photo Metadata Footer */}
            <div style={{ padding: "20px 24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <div className="db-serif" style={{ fontSize: 20, fontWeight: 600 }}>{activePhoto.title}</div>
                <button
                  onClick={() => togglePhotoFav(activePhoto.id)}
                  style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}
                >
                  <Heart size={20} color="var(--rose)" fill={activePhoto.fav ? "var(--rose)" : "none"} />
                </button>
              </div>

              <div className="db-label" style={{ marginBottom: 10 }}>
                Week {activePhoto.week} · {fmtDate(activePhoto.date)} · {activePhoto.cat}
              </div>

              {activePhoto.note && (
                <div style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.5 }}>
                  "{activePhoto.note}"
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

