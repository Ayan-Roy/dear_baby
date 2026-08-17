import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart, Lock, Mail, User, Calendar, Baby, ArrowRight, Sparkles,
  Eye, EyeOff, ShieldCheck, Star, BookOpen, Camera, Footprints, Clock, Droplet, Loader2
} from "lucide-react";

export default function AuthPage({ onLogin, onSignup, initialMode = "login" }) {
  const [mode, setMode] = useState(initialMode); // "login" | "signup"
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Signup form state
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    dueDate: "2026-11-02",
    babyNickname: "Little Bean",
    bloodGroup: "O Positive (O+)",
    partnerName: "",
    avatar: "🌸"
  });

  function handleLoginSubmit(e) {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setError("Please enter both email and password.");
      return;
    }
    setError("");
    setLoading(true);
    setTimeout(() => {
      const user = onLogin(loginEmail, loginPassword);
      setLoading(false);
      if (user) {
        navigate("/");
      }
    }, 400);
  }

  function handleSignupSubmit(e) {
    e.preventDefault();
    if (!signupData.name || !signupData.email || !signupData.password) {
      setError("Please fill in your name, email, and password.");
      return;
    }
    setError("");
    setLoading(true);
    setTimeout(() => {
      onSignup(signupData);
      setLoading(false);
      navigate("/");
    }, 400);
  }

  function handleDemoLogin() {
    setLoading(true);
    setTimeout(() => {
      onLogin("monisha@example.com", "password123");
      setLoading(false);
      navigate("/");
    }, 300);
  }

  return (
    <div className="db-auth-wrapper">
      {loading && <div className="db-top-loader" />}
      {/* Left Column: Brand Hero Panel */}
      <div className="db-auth-hero-panel">
        <div className="db-auth-hero-content">
          <div className="db-auth-brand db-serif">
            Dear Baby<span className="dot">.</span>
          </div>

          <div className="db-auth-hero-badge">
            <Sparkles size={14} color="var(--gold)" /> Digital Pregnancy Journal & Memory Book
          </div>

          <h1 className="db-serif db-auth-hero-heading">
            Preserve every tiny kick, scan, and story.
          </h1>

          <p className="db-auth-hero-text">
            A private, beautiful space designed for mothers-to-be to record weekly progress, doctor visits, ultrasound memories, and letters to your baby.
          </p>

          {/* Testimonial Quote Card */}
          <div className="db-auth-quote-card">
            <div style={{ display: "flex", gap: 3, marginBottom: 10 }}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill="var(--gold)" color="var(--gold)" />
              ))}
            </div>
            <p className="db-serif" style={{ fontStyle: "italic", fontSize: 15, margin: 0, lineHeight: 1.55, color: "rgba(255, 255, 255, 0.95)" }}>
              "Looking back at my week-by-week timeline and first kick entries brings back so many happy tears. It's the sweetest keepsake."
            </p>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: "var(--gold-light)", marginTop: 10 }}>
              — Monisha R., Mother of Little Bean
            </div>
          </div>

          {/* Floating Feature Badges */}
          <div className="db-auth-features">
            <div className="db-auth-feature-pill">
              <ShieldCheck size={14} color="var(--sage-light)" /> 100% Private & Secure
            </div>
            <div className="db-auth-feature-pill">
              <BookOpen size={14} color="var(--rose-light)" /> Letters to Baby
            </div>
            <div className="db-auth-feature-pill">
              <Camera size={14} color="var(--gold-light)" /> Ultrasound Album
            </div>
            <div className="db-auth-feature-pill">
              <Footprints size={14} color="var(--rose-light)" /> Kick Counter
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Professional Auth Form Box */}
      <div className="db-auth-form-panel">
        <div className="db-auth-form-box">
          {/* Mode Tab Switcher */}
          <div className="db-auth-tabs">
            <button
              type="button"
              className={`db-auth-tab ${mode === "login" ? "active" : ""}`}
              onClick={() => { setMode("login"); setError(""); }}
            >
              Sign In
            </button>
            <button
              type="button"
              className={`db-auth-tab ${mode === "signup" ? "active" : ""}`}
              onClick={() => { setMode("signup"); setError(""); }}
            >
              Create Account
            </button>
          </div>

          <div style={{ marginBottom: 20 }}>
            <h2 className="db-serif" style={{ fontSize: 24, margin: "0 0 6px 0", color: "var(--ink)" }}>
              {mode === "login" ? "Welcome back, Mama" : "Begin Your Memory Book"}
            </h2>
            <p style={{ fontSize: 13.5, color: "var(--ink-soft)", margin: 0, lineHeight: 1.45 }}>
              {mode === "login"
                ? "Sign in to access your journal, kick counts & milestones."
                : "Fill in a few details to start tracking your pregnancy journey."}
            </p>
          </div>

          {error && <div className="db-auth-error">{error}</div>}

          {/* Quick Demo Access Button */}
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={loading}
            className="db-btn"
            style={{
              width: "100%",
              justify: "center",
              background: "var(--sage-light)",
              color: "var(--ink)",
              borderColor: "var(--sage)",
              fontSize: 13.5,
              padding: "11px",
              marginBottom: 20,
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? (
              <><Loader2 size={16} className="db-spin" /> Signing in as Monisha...</>
            ) : (
              <><Sparkles size={15} color="var(--sage)" /> Continue as Demo Mama (Monisha)</>
            )}
          </button>

          <div style={{ display: "flex", alignItems: "center", margin: "0 0 20px 0" }}>
            <div style={{ flex: 1, height: 1, background: "var(--line)" }} />
            <span style={{ padding: "0 12px", fontSize: 11, color: "var(--ink-soft)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600 }}>
              or enter details
            </span>
            <div style={{ flex: 1, height: 1, background: "var(--line)" }} />
          </div>

          {/* LOGIN FORM */}
          {mode === "login" && (
            <form onSubmit={handleLoginSubmit} className="db-auth-form">
              <div className="db-form-group">
                <label className="db-label">Email address</label>
                <div className="db-input-icon-wrapper">
                  <Mail size={16} className="db-input-icon" />
                  <input
                    type="email"
                    className="db-input db-input-has-icon"
                    placeholder="monisha@example.com"
                    value={loginEmail}
                    onChange={e => setLoginEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="db-form-group">
                <label className="db-label">Password</label>
                <div className="db-input-icon-wrapper">
                  <Lock size={16} className="db-input-icon" />
                  <input
                    type={showPassword ? "text" : "password"}
                    className="db-input db-input-has-icon"
                    style={{ paddingRight: 40 }}
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="db-password-toggle-btn"
                    onClick={() => setShowPassword(s => !s)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="db-btn primary"
                style={{ width: "100%", padding: "12px", fontSize: 14.5, justifyContent: "center", marginTop: 8, opacity: loading ? 0.7 : 1 }}
              >
                {loading ? (
                  <><Loader2 size={16} className="db-spin" /> Signing in to my journal...</>
                ) : (
                  <>Sign in to my journal <ArrowRight size={16} /></>
                )}
              </button>
            </form>
          )}

          {/* SIGNUP FORM */}
          {mode === "signup" && (
            <form onSubmit={handleSignupSubmit} className="db-auth-form">
              <div className="db-form-group">
                <label className="db-label">Mother's Full Name *</label>
                <div className="db-input-icon-wrapper">
                  <User size={16} className="db-input-icon" />
                  <input
                    type="text"
                    className="db-input db-input-has-icon"
                    placeholder="e.g. Monisha Roy"
                    value={signupData.name}
                    onChange={e => setSignupData({ ...signupData, name: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="db-form-group">
                <label className="db-label">Email address *</label>
                <div className="db-input-icon-wrapper">
                  <Mail size={16} className="db-input-icon" />
                  <input
                    type="email"
                    className="db-input db-input-has-icon"
                    placeholder="monisha@example.com"
                    value={signupData.email}
                    onChange={e => setSignupData({ ...signupData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="db-form-group">
                <label className="db-label">Password *</label>
                <div className="db-input-icon-wrapper">
                  <Lock size={16} className="db-input-icon" />
                  <input
                    type={showPassword ? "text" : "password"}
                    className="db-input db-input-has-icon"
                    style={{ paddingRight: 40 }}
                    placeholder="At least 6 characters"
                    value={signupData.password}
                    onChange={e => setSignupData({ ...signupData, password: e.target.value })}
                    required
                  />
                  <button
                    type="button"
                    className="db-password-toggle-btn"
                    onClick={() => setShowPassword(s => !s)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="db-form-group">
                <label className="db-label">Estimated Due Date</label>
                <div className="db-input-icon-wrapper">
                  <Calendar size={16} className="db-input-icon" />
                  <input
                    type="date"
                    className="db-input db-input-has-icon"
                    value={signupData.dueDate}
                    onChange={e => setSignupData({ ...signupData, dueDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="db-form-group">
                <label className="db-label">Baby Nickname</label>
                <div className="db-input-icon-wrapper">
                  <Baby size={16} className="db-input-icon" />
                  <input
                    type="text"
                    className="db-input db-input-has-icon"
                    placeholder="e.g. Little Peanut"
                    value={signupData.babyNickname}
                    onChange={e => setSignupData({ ...signupData, babyNickname: e.target.value })}
                  />
                </div>
              </div>

              <div className="db-form-group">
                <label className="db-label">Blood Group</label>
                <div className="db-input-icon-wrapper">
                  <Droplet size={16} className="db-input-icon" color="var(--rose)" />
                  <select
                    className="db-input db-input-has-icon"
                    value={signupData.bloodGroup}
                    onChange={e => setSignupData({ ...signupData, bloodGroup: e.target.value })}
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
              </div>

              <button
                type="submit"
                disabled={loading}
                className="db-btn primary"
                style={{ width: "100%", padding: "12px", fontSize: 14.5, justifyContent: "center", marginTop: 8, opacity: loading ? 0.7 : 1 }}
              >
                {loading ? (
                  <><Loader2 size={16} className="db-spin" /> Creating My Account...</>
                ) : (
                  <>Create My Account <ArrowRight size={16} /></>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
