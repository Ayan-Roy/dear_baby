// Storage calculation, export, and cleanup utilities

export function calculateUserStorage(dataObj) {
  if (!dataObj) return { totalBytes: 0, totalKb: "0 KB", totalMb: "0.00 MB", pct: 0, breakdown: {} };

  try {
    const jsonString = JSON.stringify(dataObj);
    const totalBytes = new Blob([jsonString]).size;
    const totalKbNum = (totalBytes / 1024);
    const totalMbNum = (totalBytes / (1024 * 1024));

    // Standard localStorage limit is ~5MB (5,242,880 bytes)
    const MAX_BYTES = 5 * 1024 * 1024;
    const pct = Math.min(100, Math.round((totalBytes / MAX_BYTES) * 100));

    // Category breakdown sizes
    const photosBytes = new Blob([JSON.stringify(dataObj.photos || [])]).size;
    const journalBytes = new Blob([JSON.stringify(dataObj.journal || [])]).size;
    const timelineBytes = new Blob([JSON.stringify(dataObj.events || [])]).size;
    const medicalBytes = new Blob([JSON.stringify({ visits: dataObj.visits || [], weight: dataObj.weightData || [], vitals: dataObj.vitals || {} })]).size;
    const profileBytes = new Blob([JSON.stringify(dataObj.user || {})]).size;

    return {
      totalBytes,
      totalKb: totalKbNum < 1024 ? `${totalKbNum.toFixed(1)} KB` : `${totalMbNum.toFixed(2)} MB`,
      totalMb: `${totalMbNum.toFixed(2)} MB`,
      pct,
      breakdown: {
        photos: (photosBytes / 1024).toFixed(1),
        journal: (journalBytes / 1024).toFixed(1),
        timeline: (timelineBytes / 1024).toFixed(1),
        medical: (medicalBytes / 1024).toFixed(1),
        profile: (profileBytes / 1024).toFixed(1)
      }
    };
  } catch (err) {
    console.error("Error calculating storage", err);
    return { totalBytes: 0, totalKb: "0 KB", totalMb: "0.00 MB", pct: 0, breakdown: {} };
  }
}

export function exportUserData(userEmail, dataObj) {
  try {
    const jsonStr = JSON.stringify(dataObj, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const safeEmail = (userEmail || "user").replace(/[^a-zA-Z0-9]/g, "_");
    a.href = url;
    a.download = `DearBaby_Backup_${safeEmail}_${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error("Export failed", err);
  }
}
