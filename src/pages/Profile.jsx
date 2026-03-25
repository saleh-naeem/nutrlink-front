import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { getCustomerProfile } from "../api/customerapi";
import "./profile.css";
import Navbar from "../component/Navbar";
import { AuthContext } from "../AuthContext";

export const Profile = () => {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    async function fetchProfile() {
      try {
        const response = await getCustomerProfile();
        if (isMounted) setData(response);
      } catch (err) {
        if (isMounted) setError("Could not connect to the server. Please check your connection.");
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchProfile();
    return () => { isMounted = false };
  }, []);

  if (loading) return <div className="profile-loader"><div className="loader-spinner" /></div>;

  if (error) {
    return (
      <><Navbar /><div className="profile-error">{error}</div></>
    );
  }

  if (!data) {
    return (
      <><Navbar />
        <div className="profile-layout flex-center">
          <div className="modern-card text-center no-data-card">
            <h2>No Profile Found</h2>
            <p>Set up your health profile to see your metrics.</p>
            <button className="primary-btn" onClick={() => navigate("/createprofile")}>Create Profile</button>
          </div>
        </div>
      </>
    );
  }

  // --- SAFE DATA EXTRACTION (Defensive Coding) ---
  const { age = 0, gender = "N/A", height = 0, startingWeight = 0, currentWeight = 0, targetWeight = 0, allergies = [] } = data;

  const bmi = height > 0 ? (currentWeight / ((height / 100) ** 2)).toFixed(1) : "0.0";

  const getBmiInfo = (b) => {
    const val = parseFloat(b);
    if (!val || val <= 0) return { label: "No Data", color: "#9ca3af" };
    if (val < 18.5) return { label: "Underweight", color: "#3b82f6" };
    if (val < 25) return { label: "Normal", color: "#22c55e" };
    if (val < 30) return { label: "Overweight", color: "#f59e0b" };
    return { label: "Obese", color: "#ef4444" };
  };
  const bmiInfo = getBmiInfo(bmi);

  const totalJourney = Math.abs(startingWeight - targetWeight);
  const progressMade = Math.abs(startingWeight - currentWeight);
  const progressPct = totalJourney > 0 ? Math.max(5, Math.min(100, (progressMade / totalJourney) * 100)) : 100;
  const weightDiff = (currentWeight - targetWeight).toFixed(1);

  return (
    <>
      <Navbar />
      <div className="profile-layout">

        {/* White Master Wrapper centered on page */}
        <div className="profile-master-wrapper">

          {/* --- COVER PHOTO --- */}
          <div className="profile-cover">
            <img src="https://marketplace.canva.com/EAEB97jvqIY/5/0/1600w/canva-blue-and-pink-classy-photo-cherry-blossom-inspirational-quotes-facebook-cover-vpnA8PdWGCs.jpg" alt="Profile Cover" />
          </div>

          {/* --- HEADER OVERLAP --- */}
          <div className="profile-header-overlap">
            <div className="avatar-container">
              <img src={user?.profilePic || "https://via.placeholder.com/150"} alt="Avatar" />
            </div>

            <div className="header-info">
              <h1>{user?.username || "Health User"}</h1>
              {user?.isadmin ? (
                <p className="header-subtitle">Admin</p>
              ) : (
                <p className="header-subtitle">Nutrlink Member</p>
              )}
            </div>

            <div className="header-actions">
              <button className="primary-btn" onClick={() => navigate("/updateprofile")}>
                Update Profile
              </button>
            </div>
          </div>

          {/* --- TWO COLUMN BODY GRID --- */}
          <div className="profile-body-grid">

            {/* LEFT SIDEBAR (Static Specs & Allergies) */}
            <aside className="profile-sidebar">
              <div className="modern-card specs-card">
                <h3 className="card-title">Personal Specs</h3>
                <ul className="spec-list">
                  <li><span className="spec-icon">📩</span> <strong>Email:</strong> {user?.email}</li>
                  <li><span className="spec-icon">🎂</span> <strong>Age:</strong> {age} yrs</li>
                  <li><span className="spec-icon">📏</span> <strong>Height:</strong> {height} cm</li>
                </ul>
              </div>

              {allergies.length > 0 && (
                <div className="modern-card">
                  <h3 className="card-title">⚠️ Dietary Restrictions</h3>
                  <div className="tag-cloud">
                    {allergies.map((a, i) => <span key={i} className="allergy-tag">{a}</span>)}
                  </div>
                </div>
              )}
            </aside>

            {/* RIGHT MAIN CONTENT (Dynamic Health Metrics) */}
            <main className="profile-main">

              {/* Weight Overview */}
              <div className="metrics-row">
                <div className="modern-card metric-card">
                  <p className="metric-label">Current Weight</p>
                  <h2 className="metric-value">{currentWeight} <span className="metric-unit">kg</span></h2>
                </div>
                <div className="modern-card metric-card goal-card">
                  <p className="metric-label">Target Weight</p>
                  <h2 className="metric-value">{targetWeight} <span className="metric-unit">kg</span></h2>
                </div>
              </div>

              {/* Advanced Modules (BMI & Journey) */}
              <div className="modules-grid">

                {/* BMI Module */}
                <div className="modern-card">
                  <h3 className="card-title">Body Mass Index</h3>
                  <div className="bmi-display">
                    <h1 className="bmi-number" style={{ color: bmiInfo.color }}>{bmi}</h1>
                    <span className="bmi-text" style={{ color: bmiInfo.color }}>{bmiInfo.label}</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${Math.min(100, (bmi / 40) * 100)}%`, backgroundColor: bmiInfo.color }}></div>
                  </div>
                </div>

                {/* Journey Module */}
                <div className="modern-card">
                  <h3 className="card-title">Goal Progress</h3>
                  <div className="journey-display">
                    <div className="j-endpoints">
                      <span className="j-start">{startingWeight}kg</span>
                      <span className="j-end">{targetWeight}kg</span>
                    </div>
                    <div className="progress-track">
                      <div className="progress-fill green-fill" style={{ width: `${progressPct}%` }}></div>
                    </div>
                  </div>
                  <p className="journey-footer">
                    {weightDiff > 0 ? `${weightDiff} kg remaining` : "🎉 Goal Achieved!"}
                  </p>
                </div>

              </div>
            </main>

          </div>
        </div>
      </div>
    </>
  );
};