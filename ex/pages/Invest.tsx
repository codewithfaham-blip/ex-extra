
import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { ShieldCheck, Info, CheckCircle2, ShieldAlert } from 'lucide-react';
import { UserRole } from '../types';
import { Navigate } from 'react-router-dom';

export const InvestPage = () => {
  const { plans, currentUser, investInPlan } = useApp();
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [amount, setAmount] = useState<number>(100);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Hard redirect if an admin somehow accesses this page
  if (currentUser?.role === UserRole.ADMIN) {
    return <Navigate to="/admin" replace />;
  }

  const selectedPlan = plans.find(p => p.id === selectedPlanId);

  const handleInvest = () => {
    if (!selectedPlanId) return;
    setError(null);
    const result = investInPlan(selectedPlanId, amount);
    if (result) {
      setError(result);
    } else {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-500">
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Investment Strategies</h2>
        <p className="text-sm text-slate-500 dark:text-gray-400 font-medium mt-2">Select a package and start growing your digital portfolio today.</p>
      </div>

      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500/50 p-6 rounded-3xl flex items-center gap-4 animate-in zoom-in duration-300">
          <CheckCircle2 className="w-8 h-8 text-emerald-500 flex-shrink-0" />
          <div>
            <h4 className="font-bold text-emerald-600 dark:text-emerald-400">Investment Successful!</h4>
            <p className="text-sm text-slate-600 dark:text-gray-400">Your funds have been allocated. Daily ROIs will be added to your balance.</p>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <button
            key={plan.id}
            onClick={() => setSelectedPlanId(plan.id)}
            className={`p-8 rounded-[40px] border transition-all text-left group relative overflow-hidden ${
              selectedPlanId === plan.id 
              ? 'bg-blue-600/10 border-blue-500 shadow-xl shadow-blue-500/10' 
              : 'bg-brand-lightSecondary dark:bg-brand-darkSecondary border-slate-200 dark:border-gray-800 hover:border-blue-400 dark:hover:border-blue-500/50 shadow-sm'
            }`}
          >
            <h3 className="font-black text-base mb-2 uppercase tracking-tight text-slate-900 dark:text-white">{plan.name}</h3>
            <p className="text-3xl font-black text-blue-600 dark:text-blue-500 mb-6 font-mono tracking-tighter">
              {plan.roi}% <span className="text-[9px] font-black text-slate-400 dark:text-gray-500 block uppercase tracking-widest mt-1">/ Per Day</span>
            </p>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between font-bold">
                <span className="text-slate-400 dark:text-gray-500 uppercase tracking-widest text-[9px]">Min Stake</span> 
                <span className="text-slate-900 dark:text-white">${plan.minAmount}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span className="text-slate-400 dark:text-gray-500 uppercase tracking-widest text-[9px]">Max Cap</span> 
                <span className="text-slate-900 dark:text-white">${plan.maxAmount}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span className="text-slate-400 dark:text-gray-500 uppercase tracking-widest text-[9px]">Maturity</span> 
                <span className="text-slate-900 dark:text-white">{plan.durationDays} Days</span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {selectedPlan && (
        <div className="bg-brand-lightSecondary dark:bg-brand-darkSecondary border border-slate-200 dark:border-gray-800 p-8 md:p-10 rounded-[48px] space-y-8 animate-in slide-in-from-bottom-6 duration-500 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-500 shadow-inner">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-black text-xl uppercase tracking-tighter text-slate-900 dark:text-white">Protocol Configuration</h3>
              <p className="text-xs text-slate-500 dark:text-gray-500 font-medium">Calibrate your asset allocation parameters.</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 dark:text-gray-500 uppercase tracking-[0.2em] ml-2">Amount to Stake (USD)</label>
              <div className="relative">
                 <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/5 rounded-3xl px-8 py-6 text-3xl font-black text-slate-900 dark:text-white outline-none focus:border-blue-600 transition-all font-mono"
                 />
                 <span className="absolute right-8 top-1/2 -translate-y-1/2 font-black text-slate-300 dark:text-gray-600 text-lg uppercase">USD</span>
              </div>
              {error && <p className="text-rose-600 text-xs font-black uppercase tracking-widest bg-rose-500/10 p-3 rounded-xl border border-rose-500/10 text-center">{error}</p>}
            </div>

            <div className="bg-slate-50 dark:bg-black/20 p-8 rounded-[32px] space-y-5 border border-slate-100 dark:border-white/5 shadow-inner">
               <div className="flex justify-between items-center text-sm font-bold">
                  <span className="text-slate-500 dark:text-gray-500 uppercase tracking-widest text-[10px]">Daily Yield</span>
                  <span className="font-black text-emerald-600 dark:text-emerald-500 font-mono text-lg">${(amount * (selectedPlan.roi / 100)).toFixed(2)}</span>
               </div>
               <div className="flex justify-between items-center text-sm font-bold">
                  <span className="text-slate-500 dark:text-gray-500 uppercase tracking-widest text-[10px]">Net Surplus</span>
                  <span className="font-black text-blue-600 dark:text-blue-500 font-mono text-lg">${(amount * (selectedPlan.roi / 100) * selectedPlan.durationDays).toFixed(2)}</span>
               </div>
               <div className="pt-5 border-t border-slate-200 dark:border-white/10 flex justify-between items-center">
                  <span className="font-black text-slate-900 dark:text-white uppercase tracking-tighter">Total Maturity</span>
                  <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">${(amount + (amount * (selectedPlan.roi / 100) * selectedPlan.durationDays)).toFixed(2)}</span>
               </div>
            </div>
          </div>

          <div className="flex items-start gap-4 p-6 bg-blue-500/5 rounded-[24px] border border-blue-500/10">
            <Info className="w-6 h-6 text-blue-500 mt-1 flex-shrink-0" />
            <p className="text-[11px] text-slate-500 dark:text-gray-500 leading-relaxed font-bold uppercase tracking-wide">
              Principal of <b className="text-slate-900 dark:text-slate-300">${amount}</b> will be locked for <b className="text-slate-900 dark:text-slate-300">{selectedPlan.durationDays} cycles</b>. Dividends are computed every 24 hours (simulated as 1 minute in this demo) and credited to your global liquidity balance instantly.
            </p>
          </div>

          <button 
            onClick={handleInvest}
            className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-[24px] font-black text-lg shadow-2xl shadow-blue-900/40 transition-all hover:-translate-y-1 active:scale-95 uppercase tracking-widest"
          >
            Authorize ROI Contract
          </button>
        </div>
      )}
    </div>
  );
};
