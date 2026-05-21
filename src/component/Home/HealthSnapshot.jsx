import React from 'react';

const HealthSnapshot = ({
  currentWeight = 59,
  targetWeight = 75,
  weightPct = 63,
  remaining = 16.0,
  waterIntake = 1200,
  waterTarget = 2000,
  exerciseMinutes = 30,
  exerciseTarget = 45,
  goalsDone = 1,
  goalsTotal = 4,
  height = 170
}) => {

  const calculateBMI = (w, h) => {
    if (!w || !h) return null;
    return (w / ((h / 100) ** 2)).toFixed(1);
  };

  const getBMICategory = (bmi) => {
    if (!bmi) return 'Unknown';
    const b = parseFloat(bmi);
    if (b < 18.5) return 'UNDERWEIGHT';
    if (b < 25) return 'NORMAL';
    if (b < 30) return 'OVERWEIGHT';
    return 'OBESE';
  };

  const bmi = calculateBMI(currentWeight, height);
  const bmiCategory = getBMICategory(bmi);

  // Calculate percentages for the tracker bars
  const waterPct = Math.min((waterIntake / waterTarget) * 100, 100);
  const exercisePct = Math.min((exerciseMinutes / exerciseTarget) * 100, 100);

  return (
    <div className="flex flex-col gap-6 w-full max-w-[500px] font-sans">
      
      {/* Header */}
      <div>
        <h2 className="text-[1.4rem] font-extrabold text-gray-900 tracking-tight">Your Health Snapshot</h2>
      </div>

      {/* Weight Progress Bar */}
      <div>
        <h3 className="text-[0.9rem] text-gray-700 font-medium mb-2">Weight Progress Bar</h3>
        <div className="bg-gradient-to-r from-emerald-50 to-green-100/50 rounded-[1.25rem] p-5 border border-emerald-100/60 shadow-sm relative overflow-hidden">
          {/* Subtle background glow mimicking the image */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-green-200/40 rounded-full blur-2xl"></div>

          <div className="flex items-baseline gap-4 mb-4 relative z-10">
            <div className="flex items-baseline">
              <span className="text-[2.5rem] font-extrabold text-[#0f2d1a] leading-none tracking-tighter">{currentWeight}</span>
              <span className="text-sm font-semibold text-gray-600 ml-1">kg</span>
            </div>
            
            <span className="text-emerald-300 text-2xl font-light">→</span>
            
            <div className="flex items-baseline">
              <span className="text-[2.5rem] font-extrabold text-emerald-500 leading-none tracking-tighter">{targetWeight}</span>
              <span className="text-sm font-semibold text-gray-600 ml-1">kg (target)</span>
            </div>
          </div>

          <div className="relative h-2 bg-emerald-100/80 rounded-full mb-3 z-10">
            <div className="absolute top-0 left-0 h-full bg-emerald-500 rounded-full" style={{ width: `${weightPct}%` }}></div>
            <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-[2.5px] border-emerald-500 rounded-full shadow-sm" style={{ left: `${weightPct}%` }}></div>
          </div>

          <div className="flex justify-between text-[0.8rem] text-gray-600 font-medium z-10 relative">
            <span>{Number(weightPct).toFixed(0)}% to goal</span>
            <span>{remaining.toFixed(1)} kg remaining</span>
          </div>
        </div>
      </div>

      {/* Daily Trackers */}
      <div>
        <h3 className="text-[0.9rem] text-gray-700 font-medium mb-2">Daily Trackers</h3>
        <div className="flex gap-4">
          
          {/* Water Card */}
          <div className="flex-1 bg-white rounded-[1.25rem] p-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-100/50 rounded-full blur-xl -mr-8 -mt-8"></div>
            <div className="flex items-center gap-3 mb-5 relative z-10">
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 text-lg">💧</div>
              <span className="text-[0.7rem] font-bold text-gray-500 tracking-wider">TODAY'S WATER</span>
            </div>
            <div className="relative h-1.5 bg-blue-100 rounded-full mb-3 z-10">
              <div className="absolute top-0 left-0 h-full bg-blue-500 rounded-full" style={{ width: `${waterPct}%` }}></div>
            </div>
            <div className="text-[0.8rem] font-bold text-gray-800 z-10 relative">
              {waterIntake} ml <span className="text-gray-400 font-semibold">/ {waterTarget} ml</span>
            </div>
          </div>

          {/* Exercise Card */}
          <div className="flex-1 bg-white rounded-[1.25rem] p-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-100/50 rounded-full blur-xl -mr-8 -mt-8"></div>
            <div className="flex items-center gap-3 mb-5 relative z-10">
              <div className="w-8 h-8 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-500 text-lg">🏃</div>
              <span className="text-[0.7rem] font-bold text-gray-500 tracking-wider">DAILY EXERCISE</span>
            </div>
            <div className="relative h-1.5 bg-yellow-100 rounded-full mb-3 z-10">
              <div className="absolute top-0 left-0 h-full bg-yellow-400 rounded-full" style={{ width: `${exercisePct}%` }}></div>
              <div className="absolute top-1/2 -translate-y-1/2 w-[14px] h-[14px] bg-white border-[2.5px] border-yellow-400 rounded-full shadow-sm" style={{ left: `${exercisePct}%` }}></div>
            </div>
            <div className="text-[0.8rem] font-bold text-gray-800 z-10 relative">
              {exerciseMinutes} min <span className="text-gray-400 font-semibold">/ {exerciseTarget} min</span>
            </div>
          </div>

        </div>
      </div>

      {/* Goal Summary */}
      <div>
        <h3 className="text-[0.9rem] text-gray-700 font-medium mb-2">Goal Summary</h3>
        <div className="flex gap-4 items-stretch">
          
          {/* Status Pill */}
          <div className="flex items-center justify-center px-8 bg-[#fee2e2] text-[#e11d48] text-sm font-bold tracking-wide rounded-[1.25rem]">
            STATUS: {bmiCategory}
          </div>

          {/* Goals Card */}
          <div className="flex-1 bg-white border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] rounded-[1.25rem] p-4 flex items-center gap-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-rose-100/40 rounded-full blur-xl -mr-4 -mt-4"></div>
            <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 text-xl z-10">🎯</div>
            <div className="flex flex-col z-10">
              <div className="leading-none mb-1">
                <span className="text-rose-500 text-[1.4rem] font-bold">{goalsDone}</span>
                <span className="text-gray-500 text-sm font-medium ml-1">/ {goalsTotal}</span>
              </div>
              <div className="text-[0.65rem] font-bold text-gray-500 tracking-wider">
                GOALS COMPLETED
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default HealthSnapshot;