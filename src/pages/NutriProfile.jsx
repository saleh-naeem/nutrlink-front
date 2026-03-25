import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../component/Navbar";
import { getProfile } from "../api/nutritionist";
import { AuthContext } from "../AuthContext";
import "./NutriProfile.css";

export const NutriProfile = () => {
  const { user: authUSer } = useContext(AuthContext)

  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [noProfile, setNoProfile] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const p = await getProfile();
        if (!p) setNoProfile(true);
        else setData(p);
      } catch (err) {
        console.error(err);
        setNoProfile(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="np-layout">
        <Navbar />
        <div className="np-loader">
          <div className="np-spinner-lg" />
          <p>Loading professional profile…</p>
        </div>
      </div>
    );
  }

  /* ── No Profile ── */
  if (noProfile) {
    return (
      <div className="np-layout">
        <Navbar />
        <div className="np-master-wrapper flex-center">
          <div className="np-empty-card">
            <div className="np-empty-icon">🥗</div>
            <h2 className="np-empty-title">No Profile Yet</h2>
            <p className="np-empty-desc">
              Set up your nutritionist profile so clients can find and book you.
            </p>
            <div className="np-empty-features">
              <div className="np-empty-feature"><span>🎯</span> Showcase your specializations</div>
              <div className="np-empty-feature"><span>💬</span> Share your languages</div>
              <div className="np-empty-feature"><span>⭐</span> Build your reputation</div>
            </div>
            <button className="np-btn-primary" onClick={() => navigate("/creatNprofile")}>
              Create Professional Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- SAFE DATA EXTRACTION ---
  const {
    user = {},
    specialization = [],
    bio = "",
    cardBio = "",
    yearsOfExperience = 0,
    clientServed = 0,
    rating = 0,
    reviewCount = 0,
    languages = [],
    price = 0,
  } = data;

  return (
    <div className="np-layout">
      <Navbar />

      {/* ── MASTER WRAPPER ── */}
      <div className="np-master-wrapper">

        {/* ── COVER PHOTO ── */}
        <div className="np-cover">
          <img
            src="https://marketplace.canva.com/EAEB97jvqIY/5/0/1600w/canva-blue-and-pink-classy-photo-cherry-blossom-inspirational-quotes-facebook-cover-vpnA8PdWGCs.jpg"
            alt="Nutritionist Office Cover"
          />
        </div>

        {/* ── HEADER OVERLAP ── */}
        <div className="np-header-overlap">
          <div className="np-avatar-container">
            {authUSer?.profilePic ? (
              <img src={authUSer.profilePic} alt="Nutritionist Profile" />
            ) : (
              <div className="np-avatar-fallback">
                {user?.username?.charAt(0)?.toUpperCase() || "N"}
              </div>
            )}
          </div>



          <div className="np-header-info">
            <h1>{user?.username || "Nutritionist"}</h1>
            {user?.isadmin ? (
              <p className="header-subtitle">Admin</p>
            ) : (
              <p className="np-header-subtitle">{cardBio || "Certified Nutrition Professional"}</p>
            )}

            <div className="np-header-badges">
              <span className="np-badge np-badge--rating">
                ⭐ {rating?.toFixed(1) || "0.0"} ({reviewCount} Reviews)
              </span>
              <span className="np-badge np-badge--neutral">
                ✉️ {user?.email}
              </span>
            </div>
          </div>

          <div className="np-header-actions">
            <button className="np-btn-primary" onClick={() => navigate("/updateNprofile")}>
              ✏️ Edit Profile
            </button>
          </div>
        </div>

        {/* ── TWO COLUMN BODY GRID ── */}
        <div className="np-body-grid">

          {/* LEFT SIDEBAR */}
          <aside className="np-sidebar">
            <div className="np-modern-card">
              <h3 className="np-card-title">At a Glance</h3>
              <ul className="np-spec-list">
                <li><span className="np-spec-icon">💰</span> <strong>Rate:</strong> ${price}/hr</li>
                <li><span className="np-spec-icon">🏆</span> <strong>Experience:</strong> {yearsOfExperience} yrs</li>
                <li><span className="np-spec-icon">👥</span> <strong>Clients:</strong> {clientServed}+</li>
              </ul>
            </div>

            {languages.length > 0 && (
              <div className="np-modern-card">
                <h3 className="np-card-title">💬 Languages</h3>
                <div className="np-tag-cloud">
                  {languages.map((l, i) => <span key={i} className="np-tag np-tag--blue">{l}</span>)}
                </div>
              </div>
            )}
          </aside>

          {/* RIGHT MAIN CONTENT */}
          <main className="np-main">

            {/* Highlight Metrics */}
            <div className="np-metrics-row">
              <div className="np-modern-card np-metric-card">
                <p className="np-metric-label">Years of Experience</p>
                <h2 className="np-metric-value">{yearsOfExperience}</h2>
              </div>
              <div className="np-modern-card np-metric-card np-highlight">
                <p className="np-metric-label">Total Clients Served</p>
                <h2 className="np-metric-value">{clientServed}</h2>
              </div>
            </div>

            {/* Specializations */}
            {specialization.length > 0 && (
              <div className="np-modern-card">
                <h3 className="np-card-title">🎯 Core Specializations</h3>
                <div className="np-tag-cloud">
                  {specialization.map((s, i) => <span key={i} className="np-tag np-tag--green">{s}</span>)}
                </div>
              </div>
            )}

            {/* Full Bio */}
            {bio && (
              <div className="np-modern-card">
                <h3 className="np-card-title">📝 About Me</h3>
                <p className="np-bio-text">{bio}</p>
              </div>
            )}

          </main>

        </div>
      </div>
    </div>
  );
};