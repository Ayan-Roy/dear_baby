import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Home, Clock, BookOpen, Image as ImageIcon, HeartPulse, Calendar as CalendarIcon,
  CheckSquare, Baby, MapPin, Menu, X, User, LogIn
} from "lucide-react";
import { CURRENT_WEEK, DUE_DATE } from "../data/dummyData.js";
import { daysBetween } from "../utils.js";

const NAV = [
  { to: "/", label: "Home", icon: Home, end: true },
  { to: "/timeline", label: "Milestones", icon: Clock },
  { to: "/journal", label: "Journal", icon: BookOpen },
  { to: "/gallery", label: "Memories", icon: ImageIcon },
  { to: "/medical", label: "Health & Care", icon: HeartPulse },
  { to: "/calendar", label: "Calendar", icon: CalendarIcon },
  { to: "/checklists", label: "Checklists", icon: CheckSquare },
  { to: "/names", label: "Baby Names", icon: Baby },
  { to: "/profile", label: "Profile", icon: User },
];

const BOTTOM_NAV = [
  { to: "/", label: "Home", icon: Home, end: true },
  { to: "/timeline", label: "Milestones", icon: Clock },
  { to: "/journal", label: "Journal", icon: BookOpen },
  { to: "/gallery", label: "Memories", icon: ImageIcon },
  { to: "/profile", label: "Profile", icon: User },
];

export default function Sidebar({ user }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const week = user?.currentWeek || CURRENT_WEEK;
  const dueDate = user?.dueDate || DUE_DATE;
  const daysLeft = Math.max(0, daysBetween(new Date(), dueDate));

  function closeMobile() {
    setMobileOpen(false);
  }

  return (
    <>
      {/* Mobile Sticky Header */}
      <header className="db-mobile-header">
        <NavLink to="/" className="db-brand db-serif" onClick={closeMobile}>
          Dear Baby<span className="dot">.</span>
        </NavLink>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <NavLink to="/profile" className="db-sidebar-avatar" style={{ width: 32, height: 32, fontSize: 16 }}>
            {user ? (user.avatar || "🌸") : <User size={16} />}
          </NavLink>
          <button
            className="db-mobile-menu-btn"
            onClick={() => setMobileOpen(s => !s)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Drawer Overlay */}
      {mobileOpen && (
        <div className="db-mobile-drawer-overlay" onClick={closeMobile}>
          <div className="db-mobile-drawer" onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <span className="db-brand db-serif" style={{ padding: 0 }}>Dear Baby<span className="dot">.</span></span>
              <button className="db-mobile-menu-btn" onClick={closeMobile}>
                <X size={20} />
              </button>
            </div>
            {NAV.map(n => {
              const Icon = n.icon;
              return (
                <NavLink
                  key={n.to}
                  to={n.to}
                  end={n.end}
                  onClick={closeMobile}
                  className={({ isActive }) => `db-navitem ${isActive ? "active" : ""}`}
                >
                  <Icon size={16} /> {n.label}
                </NavLink>
              );
            })}
            
            {user ? (
              <NavLink to="/profile" onClick={closeMobile} className="db-sidebar-user-card" style={{ marginTop: 20 }}>
                <div className="db-sidebar-avatar">{user.avatar || "🌸"}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                    {user.name || "Mother-to-be"}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--ink-soft)" }}>
                    Baby: {user.babyNickname || "Little Bean"}
                  </div>
                </div>
              </NavLink>
            ) : (
              <NavLink to="/login" onClick={closeMobile} className="db-btn primary" style={{ marginTop: 20, justifyContent: "center" }}>
                <LogIn size={15} /> Sign In
              </NavLink>
            )}

            <div className="db-sidebar-foot" style={{ marginTop: 12 }}>
              <MapPin size={12} style={{ verticalAlign: -2, marginRight: 4 }} />
              Week {week} · {daysLeft} days to go
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sticky Left Sidebar */}
      <aside className="db-sidebar">
        <NavLink to="/" className="db-brand db-serif">
          Dear Baby<span className="dot">.</span>
        </NavLink>
        {NAV.map(n => {
          const Icon = n.icon;
          return (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) => `db-navitem ${isActive ? "active" : ""}`}
            >
              <Icon size={16} /> {n.label}
            </NavLink>
          );
        })}

        {user ? (
          <NavLink to="/profile" className="db-sidebar-user-card" style={{ marginTop: "auto" }}>
            <div className="db-sidebar-avatar">{user.avatar || "🌸"}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 13, textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                {user.name || "Mother-to-be"}
              </div>
              <div style={{ fontSize: 11, color: "var(--ink-soft)" }}>
                Baby: {user.babyNickname || "Little Bean"}
              </div>
            </div>
          </NavLink>
        ) : (
          <NavLink to="/login" className="db-btn primary" style={{ marginTop: "auto", justifyContent: "center" }}>
            <LogIn size={15} /> Sign In / Sign Up
          </NavLink>
        )}

        <div className="db-sidebar-foot" style={{ marginTop: 10 }}>
          <MapPin size={12} style={{ verticalAlign: -2, marginRight: 4 }} />
          Week {week} · {daysLeft} days to go
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="db-bottom-nav">
        {BOTTOM_NAV.map(n => {
          const Icon = n.icon;
          return (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) => `db-bottom-navitem ${isActive ? "active" : ""}`}
            >
              <Icon size={18} />
              <span>{n.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </>
  );
}
