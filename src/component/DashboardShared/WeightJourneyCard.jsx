import React from 'react';

const WeightJourneyCard = ({ currentWeight, targetWeight, weightPct, remaining }) => {
    return (
        <div className="relative overflow-hidden p-4 sm:p-6 border-[1.5px] border-emerald-100 rounded-[18px] bg-gradient-to-br from-white to-emerald-50 shadow-[0_2px_12px_rgba(22,163,74,0.07),0_1px_4px_rgba(0,0,0,0.04)] transition duration-200 hover:border-emerald-200 hover:shadow-[0_4px_16px_rgba(22,163,74,0.08),0_2px_8px_rgba(0,0,0,0.05)] hover:-translate-y-[1px] after:content-[''] after:absolute after:-top-[60px] after:-right-[60px] after:w-[200px] after:h-[200px] after:bg-[radial-gradient(circle,#dcfce7,transparent_70%)] after:pointer-events-none">
            <div className="text-[0.67rem] uppercase tracking-widest text-[#64748b] font-bold mb-4 sm:mb-5">Weight Journey</div>
            
            {/* Added flex-wrap and fluid typography to prevent overflow */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-6 mb-5 sm:mb-7">
                <div className="flex items-baseline gap-1">
                    <span className="font-['Plus_Jakarta_Sans',_sans-serif] text-4xl sm:text-[3rem] font-extrabold text-[#0f2d1a] tracking-tighter leading-none">{currentWeight}</span>
                    <span className="text-xs sm:text-[0.82rem] text-[#6aab7e] font-medium">kg</span>
                </div>
                
                <div className="text-xl sm:text-2xl text-[#bbf7d0]">→</div>
                
                <div className="flex items-baseline gap-1">
                    <span className="font-['Plus_Jakarta_Sans',_sans-serif] text-4xl sm:text-[3rem] font-extrabold text-[#16a34a] tracking-tighter leading-none">{targetWeight}</span>
                    <span className="text-xs sm:text-[0.82rem] text-[#16a34a] opacity-70 font-medium">kg goal</span>
                </div>
            </div>
            
            <div className="relative">
                <div className="h-2 bg-[#dcfce7] rounded-full relative mb-2 sm:mb-3">
                    <div className="h-full bg-gradient-to-r from-[#16a34a] to-[#4ade80] rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(22,163,74,0.3)]" style={{ width: `${weightPct}%` }}></div>
                    <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-[2.5px] border-[#16a34a] rounded-full shadow-[0_2px_8px_rgba(22,163,74,0.25)] transition-all duration-1000" style={{ left: `${weightPct}%` }}></div>
                </div>
                <div className="flex justify-between text-[0.7rem] sm:text-[0.78rem] text-[#6aab7e] font-medium">
                    <span>{weightPct.toFixed(0)}% to goal</span>
                    <span>{remaining.toFixed(1)} kg remaining</span>
                </div>
            </div>
        </div>
    );
};

export default WeightJourneyCard;