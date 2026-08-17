import React, { useState, useEffect, Component } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Sidebar from "./components/Sidebar.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Timeline from "./pages/Timeline.jsx";
import Journal from "./pages/Journal.jsx";
import Gallery from "./pages/Gallery.jsx";
import Medical from "./pages/Medical.jsx";
import CalendarPage from "./pages/CalendarPage.jsx";
import Checklists from "./pages/Checklists.jsx";
import BabyNames from "./pages/BabyNames.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import Profile from "./pages/Profile.jsx";
import { EVENTS, JOURNAL_SEED, WEIGHT_DATA, VISITS, INITIAL_PHOTOS, CHECKLISTS } from "./data/dummyData.js";
import { RotateCcw } from "lucide-react";

// Error Boundary component to prevent any white blank screen crashes
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("React ErrorBoundary caught an error", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="db-card" style={{ margin: 30, padding: 30, textAlign: "center" }}>
          <h2 className="db-serif" style={{ color: "var(--rose)", fontSize: 22 }}>Something went wrong loading your memory data.</h2>
          <p style={{ color: "var(--ink-soft)", margin: "10px 0 20px 0", fontSize: 14 }}>
            Don't worry! Your profile is safe. Click below to clear corrupt cache & restore clean memory state.
          </p>
          <button
            className="db-btn primary"
            onClick={() => {
              localStorage.clear();
              window.location.href = "/";
            }}
          >
            <RotateCcw size={16} /> Reset Storage & Restore App
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const DEFAULT_USER = {
  name: "Monisha Roy",
  email: "monisha@example.com",
  partnerName: "Shuvo",
  babyNickname: "Little Bean",
  babyGender: "Girl 👧",
  dueDate: "2026-11-02",
  currentWeek: 24,
  avatar: "🌸",
  doctorName: "Dr. Rahman",
  hospital: "City Maternity Hospital",
  bloodGroup: "O Positive (O+)",
  emergencyContact: "+1 (555) 234-5678",
  isDelivered: false,
  birthDetails: null
};

function safeArray(val, fallback) {
  return Array.isArray(val) ? val : fallback;
}

function safeObject(val, fallback) {
  return (val && typeof val === "object" && !Array.isArray(val)) ? val : fallback;
}

function getStorageKey(email) {
  if (!email) return null;
  return `dear_baby_userdata_${email.toLowerCase().trim()}`;
}

function loadUserStore(email) {
  const key = getStorageKey(email);
  if (!key) return null;
  const saved = localStorage.getItem(key);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to parse user store", e);
      return null;
    }
  }
  return null;
}

export default function App() {
  const navigate = useNavigate();

  // User state defaults to stored session or DEFAULT_USER
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("dear_baby_user");
    if (!saved) return DEFAULT_USER;
    try {
      const parsed = JSON.parse(saved);
      if (!parsed || typeof parsed !== "object" || !parsed.email) return DEFAULT_USER;
      if (!parsed.name || parsed.name.includes("Rahman") || parsed.name === "Sophia" || parsed.email === "sophia@example.com") {
        parsed.name = "Monisha Roy";
        parsed.email = "monisha@example.com";
        parsed.partnerName = "Shuvo";
        localStorage.setItem("dear_baby_user", JSON.stringify(parsed));
      }
      return parsed;
    } catch {
      return DEFAULT_USER;
    }
  });

  const activeEmail = user?.email || "monisha@example.com";
  const initialStore = loadUserStore(activeEmail);

  // Isolated per-user data states with defensive safeArray & safeObject wrappers
  const [events, setEvents] = useState(() => safeArray(initialStore?.events, EVENTS));
  const [journal, setJournal] = useState(() => safeArray(initialStore?.journal, JOURNAL_SEED));
  const [weightData, setWeightData] = useState(() => safeArray(initialStore?.weightData, WEIGHT_DATA));
  const [visits, setVisits] = useState(() => safeArray(initialStore?.visits, VISITS));
  const [photos, setPhotos] = useState(() => safeArray(initialStore?.photos, INITIAL_PHOTOS));
  const [checklistsData, setChecklistsData] = useState(() => safeObject(initialStore?.checklistsData, CHECKLISTS));
  const [vitals, setVitals] = useState(() => safeObject(initialStore?.vitals, {
    currentWeight: "65 kg",
    lastBp: "116/75",
    medicines: "Folic Acid, Iron"
  }));
  const [kickData, setKickData] = useState(() => safeObject(initialStore?.kickData, {
    count: 14,
    lastKickTime: "10 mins ago",
    sessionStarted: "8:00 AM"
  }));

  // Function to reload data for active user
  function reloadUserData(targetUser) {
    if (!targetUser || !targetUser.email) return;
    const store = loadUserStore(targetUser.email);
    setEvents(safeArray(store?.events, EVENTS));
    setJournal(safeArray(store?.journal, JOURNAL_SEED));
    setWeightData(safeArray(store?.weightData, WEIGHT_DATA));
    setVisits(safeArray(store?.visits, VISITS));
    setPhotos(safeArray(store?.photos, INITIAL_PHOTOS));
    setChecklistsData(safeObject(store?.checklistsData, CHECKLISTS));
    setVitals(safeObject(store?.vitals, { currentWeight: "65 kg", lastBp: "116/75", medicines: "Folic Acid, Iron" }));
    setKickData(safeObject(store?.kickData, { count: 14, lastKickTime: "10 mins ago", sessionStarted: "8:00 AM" }));
  }

  // Sync session & isolated data to localStorage safely
  useEffect(() => {
    if (user && user.email) {
      try {
        localStorage.setItem("dear_baby_user", JSON.stringify(user));
        const key = getStorageKey(user.email);
        const storeObj = {
          user,
          events,
          journal,
          weightData,
          visits,
          photos,
          checklistsData,
          vitals,
          kickData
        };
        localStorage.setItem(key, JSON.stringify(storeObj));
      } catch (err) {
        console.warn("Storage quota limit reached or save prevented", err);
      }
    }
  }, [user, events, journal, weightData, visits, photos, checklistsData, vitals, kickData]);

  function handleLogin(email, password) {
    const key = getStorageKey(email);
    const existingUserData = localStorage.getItem(key);
    let loggedInUser = {
      ...DEFAULT_USER,
      email: email
    };

    if (existingUserData) {
      try {
        const parsed = JSON.parse(existingUserData);
        if (parsed.user) loggedInUser = parsed.user;
      } catch (err) {
        console.error("Failed parsing existing user info", err);
      }
    }

    setUser(loggedInUser);
    reloadUserData(loggedInUser);
    return loggedInUser;
  }

  function handleSignup(userData) {
    const newUser = {
      ...DEFAULT_USER,
      ...userData
    };
    const key = getStorageKey(newUser.email);
    const freshStore = {
      user: newUser,
      events: EVENTS,
      journal: JOURNAL_SEED,
      weightData: WEIGHT_DATA,
      visits: VISITS,
      photos: INITIAL_PHOTOS,
      checklistsData: CHECKLISTS,
      vitals: { currentWeight: "65 kg", lastBp: "116/75", medicines: "Folic Acid, Iron" },
      kickData: { count: 0, lastKickTime: "Not started", sessionStarted: "8:00 AM" }
    };
    localStorage.setItem(key, JSON.stringify(freshStore));
    setUser(newUser);
    reloadUserData(newUser);
    return newUser;
  }

  function handleLogout() {
    setUser(null);
    localStorage.removeItem("dear_baby_user");
    navigate("/login");
  }

  function handleUpdateProfile(updatedData) {
    setUser(prev => ({
      ...prev,
      ...updatedData
    }));
  }

  function handleMarkDelivered(birthDetails) {
    setUser(prev => ({
      ...prev,
      isDelivered: true,
      birthDetails: birthDetails || prev?.birthDetails || {
        birthDate: new Date().toISOString().split("T")[0],
        birthTime: "08:30 AM",
        birthWeight: "3.4 kg",
        birthLength: "51 cm",
        birthPhoto: "/images/bump.jpg",
        note: "Welcome to the world, little angel!"
      }
    }));
  }

  function handleToggleKeepsakeMode(status) {
    setUser(prev => ({
      ...prev,
      isDelivered: status
    }));
  }

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

  const currentUserDataBundle = {
    user,
    events,
    journal,
    weightData,
    visits,
    photos,
    checklistsData,
    vitals,
    kickData
  };

  const isDelivered = Boolean(user?.isDelivered);

  return (
    <ErrorBoundary>
      <div className="db-layout">
        {user && <Sidebar user={user} />}
        
        <main className="db-content">
          <Routes>
            <Route
              path="/"
              element={
                user ? (
                  <Dashboard
                    user={user}
                    events={events}
                    journal={journal}
                    photos={photos}
                    visits={visits}
                    kickData={kickData}
                    logKick={logKick}
                    resetKicks={resetKicks}
                    onMarkDelivered={handleMarkDelivered}
                    onToggleKeepsakeMode={handleToggleKeepsakeMode}
                  />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/timeline"
              element={
                user ? (
                  <Timeline events={events} addEvent={addEvent} isDelivered={isDelivered} />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/journal"
              element={
                user ? (
                  <Journal entries={journal} addEntry={addEntry} isDelivered={isDelivered} />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/gallery"
              element={
                user ? (
                  <Gallery photos={photos} addPhoto={addPhoto} togglePhotoFav={togglePhotoFav} isDelivered={isDelivered} />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/medical"
              element={
                user ? (
                  <Medical
                    weightData={weightData}
                    visits={visits}
                    vitals={vitals}
                    addVisit={addVisit}
                    addWeight={addWeight}
                    updateVitals={updateVitals}
                    isDelivered={isDelivered}
                  />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/calendar"
              element={
                user ? (
                  <CalendarPage events={events} visits={visits} isDelivered={isDelivered} />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/checklists"
              element={
                user ? (
                  <Checklists checklists={checklistsData} setChecklists={setChecklistsData} isDelivered={isDelivered} />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/names"
              element={
                user ? (
                  <BabyNames isDelivered={isDelivered} />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/profile"
              element={
                user ? (
                  <Profile
                    user={user}
                    userDataBundle={currentUserDataBundle}
                    onUpdateProfile={handleUpdateProfile}
                    onLogout={handleLogout}
                    onMarkDelivered={handleMarkDelivered}
                    onToggleKeepsakeMode={handleToggleKeepsakeMode}
                  />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/login"
              element={
                user ? (
                  <Navigate to="/" replace />
                ) : (
                  <AuthPage onLogin={handleLogin} onSignup={handleSignup} />
                )
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </ErrorBoundary>
  );
}
