import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Home, Clock, BookOpen, Image as ImageIcon, HeartPulse, Calendar as CalendarIcon,
  CheckSquare, Baby, MapPin, Menu, X
} from "lucide-react";
import { CURRENT_WEEK, DUE_DATE } from "../data/dummyData.js";
import { daysBetween } from "../utils.js";

const NAV = [
  { to: "/", label: "Home", icon: Home, end: true },
  { to: "/timeline", label: "Timeline", icon: Clock },
  { to: "/journal", label: "Journal", icon: BookOpen },
  { to: "/gallery", label: "Gallery", icon: ImageIcon },
  { to: "/medical", label: "Medical", icon: HeartPulse },
  { to: "/calendar", label: "Calendar", icon: CalendarIcon },
  { to: "/checklists", label: "Checklists", icon: CheckSquare },
  { to: "/names", label: "Baby Names", icon: Baby },
];

const BOTTOM_NAV = [
  { to: "/", label: "Home", icon: Home, end: true },
  { to: "/timeline", label: "Timeline", icon: Clock },
  { to: "/journal", label: "Journal", icon: BookOpen },
  { to: "/gallery", label: "Gallery", icon: ImageIcon },
  { to: "/medical", label: "Medical", icon: HeartPulse },
];

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const daysLeft = Math.max(0, daysBetween(new Date(), DUE_DATE));

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
        <button
          className="db-mobile-menu-btn"
          onClick={() => setMobileOpen(s => !s)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
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
            <div className="db-sidebar-foot" style={{ marginTop: 20 }}>
              <MapPin size={12} style={{ verticalAlign: -2, marginRight: 4 }} />
              Week {CURRENT_WEEK} · {daysLeft} days to go
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
        <div className="db-sidebar-foot">
          <MapPin size={12} style={{ verticalAlign: -2, marginRight: 4 }} />
          Week {CURRENT_WEEK} · {daysLeft} days to go
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

