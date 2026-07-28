import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Timeline from "./pages/Timeline.jsx";
import Journal from "./pages/Journal.jsx";
import Gallery from "./pages/Gallery.jsx";
import Medical from "./pages/Medical.jsx";
import CalendarPage from "./pages/CalendarPage.jsx";
import Checklists from "./pages/Checklists.jsx";
import BabyNames from "./pages/BabyNames.jsx";
import { EVENTS, JOURNAL_SEED, WEIGHT_DATA, VISITS, INITIAL_PHOTOS } from "./data/dummyData.js";

export default function App() {
  const [events, setEvents] = useState(EVENTS);
  const [journal, setJournal] = useState(JOURNAL_SEED);
  const [weightData, setWeightData] = useState(WEIGHT_DATA);
  const [visits, setVisits] = useState(VISITS);
  const [photos, setPhotos] = useState(INITIAL_PHOTOS);
  const [vitals, setVitals] = useState({
    currentWeight: "65 kg",
    lastBp: "116/75",
    medicines: "Folic Acid, Iron"
  });

  function addEvent(e) { setEvents(prev => [...prev, e]); }
  function addEntry(e) { setJournal(prev => [e, ...prev]); }
  
  function addVisit(v) { setVisits(prev => [v, ...prev]); }
  function addWeight(w) {
    setWeightData(prev => {
      const updated = [...prev.filter(item => item.week !== w.week), w];
      return updated.sort((a, b) => a.week - b.week);
    });
  }
  function updateVitals(newVitals) {
    setVitals(prev => ({ ...prev, ...newVitals }));
  }

  function addPhoto(p) { setPhotos(prev => [p, ...prev]); }
  function togglePhotoFav(id) {
    setPhotos(prev => prev.map(p => p.id === id ? { ...p, fav: !p.fav } : p));
  }

  const [kickData, setKickData] = useState({
    count: 14,
    lastKickTime: "10 mins ago",
    sessionStarted: "8:00 AM"
  });

  function logKick() {
    setKickData(prev => ({
      ...prev,
      count: prev.count + 1,
      lastKickTime: "Just now"
    }));
  }

  function resetKicks() {
    setKickData(prev => ({
      ...prev,
      count: 0,
      lastKickTime: "Session started",
      sessionStarted: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }));
  }

  return (
    <div className="db-root">
      <Sidebar />
      <main className="db-main">
        <Routes>
          <Route
            path="/"
            element={
              <Dashboard
                events={events}
                journal={journal}
                photos={photos}
                visits={visits}
                kickData={kickData}
                logKick={logKick}
                resetKicks={resetKicks}
              />
            }
          />
          <Route path="/timeline" element={<Timeline events={events} addEvent={addEvent} />} />
          <Route path="/journal" element={<Journal entries={journal} addEntry={addEntry} />} />
          <Route
            path="/gallery"
            element={
              <Gallery
                photos={photos}
                addPhoto={addPhoto}
                togglePhotoFav={togglePhotoFav}
              />
            }
          />
          <Route
            path="/medical"
            element={
              <Medical
                weightData={weightData}
                visits={visits}
                vitals={vitals}
                addVisit={addVisit}
                addWeight={addWeight}
                updateVitals={updateVitals}
              />
            }
          />
          <Route path="/calendar" element={<CalendarPage events={events} visits={visits} journal={journal} addEvent={addEvent} />} />
          <Route path="/checklists" element={<Checklists />} />
          <Route path="/names" element={<BabyNames />} />
        </Routes>
      </main>
    </div>
  );
}


