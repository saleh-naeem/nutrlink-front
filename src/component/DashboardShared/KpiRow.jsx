import React from 'react';

const KpiRow = ({ waterIntake, exerciseMinutes, goalsDone, goalsTotal, nextApptDate }) => {
  const kpis = [
    { icon: '💧', label: "Today's Water", value: waterIntake || '—', unit: 'ml', color: '#60a5fa' },
    { icon: '🏃', label: 'Exercise', value: exerciseMinutes || '—', unit: 'min', color: '#fbbf24' },
    { icon: '🎯', label: 'Goals Done', value: goalsDone || 0, unit: `/ ${goalsTotal || 0}`, color: '#34d399' },
    { icon: '📅', label: 'Next Appt', value: nextApptDate || 'None', unit: '', color: '#c084fc' },
  ];

  return (
    <div className="db-kpi-row">
      {kpis.map((kpi, i) => (
        <div className="db-kpi" key={i} style={{ '--kpi-color': kpi.color }}>
          <div className="db-kpi__icon">{kpi.icon}</div>
          <div className="db-kpi__body">
            <span className="db-kpi__label">{kpi.label}</span>
            <div className="db-kpi__val-row">
              <span className="db-kpi__val">{kpi.value}</span>
              <span className="db-kpi__unit">{kpi.unit}</span>
            </div>
          </div>
          <div className="db-kpi__glow"></div>
        </div>
      ))}
    </div>
  );
};

export default KpiRow;