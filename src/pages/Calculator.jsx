import { useState } from "react";
import "./Calculator.css";

const ACTIVITY_OPTIONS = [
  { label: "Sedentary", sub: "Little or no exercise", value: 1.2 },
  { label: "Light", sub: "1-3 days/week", value: 1.375 },
  { label: "Moderate", sub: "3-5 days/week", value: 1.55 },
  { label: "Active", sub: "6-7 days/week", value: 1.725 },
  { label: "Very Active", sub: "Hard training", value: 1.9 },
  { label: "Athlete", sub: "Twice daily", value: 2.0 },
];

const GOAL_OPTIONS = [
  { label: "Lose Weight", icon: "Cut", delta: -500, sub: "-500 kcal" },
  { label: "Maintain", icon: "Keep", delta: 0, sub: "Maintenance" },
  { label: "Gain Muscle", icon: "Bulk", delta: 500, sub: "+500 kcal" },
];

function getBmiInfo(bmi) {
  if (bmi < 18.5) {
    return { label: "Underweight", color: "#0f766e", pct: Math.max(5, (bmi / 18.5) * 25) };
  }
  if (bmi < 25) {
    return { label: "Normal", color: "#16a34a", pct: 25 + ((bmi - 18.5) / 6.5) * 25 };
  }
  if (bmi < 30) {
    return { label: "Overweight", color: "#d97706", pct: 50 + ((bmi - 25) / 5) * 25 };
  }
  return { label: "Obese", color: "#dc2626", pct: Math.min(100, 75 + ((bmi - 30) / 10) * 25) };
}

export function Calculator() {
  const [gender, setGender] = useState("male");
  const [age, setAge] = useState(25);
  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(175);
  const [activity, setActivity] = useState(1.375);
  const [goal, setGoal] = useState(0);
  const [results, setResults] = useState(null);
  const [key, setKey] = useState(0);

  function calculate() {
    if (!age || !weight || !height) return;

    const bmr =
      gender === "male"
        ? 10 * weight + 6.25 * height - 5 * age + 5
        : 10 * weight + 6.25 * height - 5 * age - 161;

    const maintenance = bmr * activity;
    const target = maintenance + goal;
    const bmi = weight / Math.pow(height / 100, 2);

    setResults({ bmr, maintenance, target, bmi });
    setKey((k) => k + 1);
  }

  const bmiInfo = results ? getBmiInfo(results.bmi) : null;
  const ringPct = results ? Math.max(0, Math.min(results.target / 3500, 1)) : 0;
  const ringOffset = 163.4 - ringPct * 163.4;
  const goalBadge = goal < 0 ? "Cut" : goal > 0 ? "Bulk" : "Keep";
  const goalText = goal < 0 ? "for weight loss" : goal > 0 ? "for muscle gain" : "to maintain weight";

  return (
    <div className="cc-wrapper">
      <div className="cc-card">
        <div className="cc-header">
          <div className="cc-tag">Nutrition Tool</div>
          <h1>Calorie Calculator</h1>
          <p>Estimate daily calories based on your body and target.</p>
        </div>

        <div className="cc-form">
          <div>
            <label className="cc-label">Gender</label>
            <div className="cc-gender-group">
              {["male", "female"].map((g) => (
                <button
                  key={g}
                  className={`cc-gender-btn${gender === g ? " active" : ""}`}
                  type="button"
                  onClick={() => setGender(g)}
                >
                  {g.charAt(0).toUpperCase() + g.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="cc-label">Age</label>
            <div className="cc-input-wrap">
              <input type="number" min="10" max="100" value={age} onChange={(e) => setAge(+e.target.value)} />
              <span className="cc-input-unit">yrs</span>
            </div>
          </div>

          <div>
            <label className="cc-label">Weight</label>
            <div className="cc-input-wrap">
              <input type="number" min="30" max="300" value={weight} onChange={(e) => setWeight(+e.target.value)} />
              <span className="cc-input-unit">kg</span>
            </div>
          </div>

          <div>
            <label className="cc-label">Height</label>
            <div className="cc-input-wrap">
              <input type="number" min="100" max="250" value={height} onChange={(e) => setHeight(+e.target.value)} />
              <span className="cc-input-unit">cm</span>
            </div>
          </div>

          <div>
            <label className="cc-label">Activity Level</label>
            <div className="cc-activity-grid">
              {ACTIVITY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  className={`cc-act-btn${activity === opt.value ? " active" : ""}`}
                  type="button"
                  onClick={() => setActivity(opt.value)}
                >
                  {opt.label}
                  <span>{opt.sub}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="cc-label">Your Goal</label>
            <div className="cc-goal-grid">
              {GOAL_OPTIONS.map((opt) => (
                <button
                  key={opt.delta}
                  className={`cc-goal-btn${goal === opt.delta ? " active" : ""}`}
                  type="button"
                  onClick={() => setGoal(opt.delta)}
                >
                  <span className="cc-goal-icon">{opt.icon}</span>
                  {opt.label}
                  <span className="cc-goal-sub">{opt.sub}</span>
                </button>
              ))}
            </div>
          </div>

          <button className="cc-submit" type="button" onClick={calculate}>
            Calculate Calories
          </button>
        </div>

        {results && (
          <div className="cc-results" key={key}>
            <div className="cc-divider" />
            <div className="cc-results-title">Your Results</div>

            <div className="cc-bmi-card">
              <div className="cc-bmi-top">
                <div>
                  <div className="cc-bmi-label">Body Mass Index</div>
                  <div className="cc-bmi-value">{results.bmi.toFixed(1)}</div>
                </div>
                <span
                  className="cc-bmi-badge"
                  style={{
                    background: `${bmiInfo.color}18`,
                    color: bmiInfo.color,
                    border: `1px solid ${bmiInfo.color}40`,
                  }}
                >
                  {bmiInfo.label}
                </span>
              </div>
              <div className="cc-bar-bg">
                <div className="cc-bar-fill" style={{ width: `${bmiInfo.pct}%`, background: bmiInfo.color }} />
              </div>
              <div className="cc-bmi-scale">
                <span>Underweight</span>
                <span>Normal</span>
                <span>Over</span>
                <span>Obese</span>
              </div>
            </div>

            <div className="cc-stats-grid">
              <div className="cc-stat-card">
                <span className="cc-stat-icon">BMR</span>
                <div className="cc-stat-label">Basal Rate</div>
                <div className="cc-stat-value">{Math.round(results.bmr).toLocaleString()}</div>
                <div className="cc-stat-unit">kcal / day at rest</div>
              </div>
              <div className="cc-stat-card">
                <span className="cc-stat-icon">TDEE</span>
                <div className="cc-stat-label">Maintenance</div>
                <div className="cc-stat-value">{Math.round(results.maintenance).toLocaleString()}</div>
                <div className="cc-stat-unit">kcal / day to maintain</div>
              </div>
            </div>

            <div className="cc-target-card">
              <div>
                <div className="cc-target-title">Daily Target</div>
                <div className="cc-target-value">{Math.round(results.target).toLocaleString()}</div>
                <div className="cc-target-sub">kcal/day {goalText}</div>
              </div>
              <div className="cc-ring">
                <svg width="60" height="60" viewBox="0 0 60 60">
                  <circle cx="30" cy="30" r="26" fill="none" stroke="rgba(17, 24, 39, 0.12)" strokeWidth="4" />
                  <circle
                    cx="30"
                    cy="30"
                    r="26"
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="4"
                    strokeDasharray="163.4"
                    strokeDashoffset={ringOffset}
                    strokeLinecap="round"
                    style={{ transition: "stroke-dashoffset 1s ease" }}
                  />
                </svg>
                <span className="cc-ring-emoji">{goalBadge}</span>
              </div>
            </div>

            <div className="cc-note">
              <span className="cc-note-icon">Note</span>
              <span>These are estimates. Adjust based on your progress over 2-3 weeks.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
