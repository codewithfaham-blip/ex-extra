
import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { Users, Link as LinkIcon, Copy, Check, TrendingUp, Gift, Share2, Rocket, Coins, ArrowRight } from 'lucide-react';

export const ReferralsPage = () => {
  const { currentUser } = useApp();
  const [copied, setCopied] = useState(false);

  const referralLink = `https://cryptoyield.io/?ref=${currentUser?.referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const steps = [
    { 
      title: 'Share Link', 
      desc: 'Send your unique invitation link to friends, family, or your social network.',
      icon: Share2,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10'
    },
    { 
      title: 'They Invest', 
      desc: 'Once your associate makes their first capital allocation, it is tracked to you.',
      icon: Rocket,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10'
    },
    { 
      title: 'Earn Dividends', 
      desc: 'Receive an instant 5% commission credited directly to your balance.',
      icon: Coins,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Hero Header Section */}
      <div className="bg-brand-lightSecondary dark:bg-brand-darkSecondary p-8 md:p-20 rounded-[48px] border border-slate-200 dark:border-white/5 text-center relative overflow-hidden shadow-2xl">
        {/* Animated Background Gradients */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-600/10 blur-[120px] rounded-full animate-pulse duration-1000" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-10">
            <Gift className="w-4 h-4" />
            Elite Affiliate Protocol
          </div>

          <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tighter text-slate-900 dark:text-white leading-none uppercase">
            Build Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500">Wealth Network</span>
          </h2>
          
          <p className="text-base text-slate-500 dark:text-gray-400 mb-14 max-w-2xl mx-auto md:text-lg leading-relaxed font-medium">
            Invite your inner circle to the future of automated yields. Earn institutional-grade commissions for every verified member you onboard.
          </p>

          {/* Referral Link Input Area */}
          <div className="max-w-2xl mx-auto">
            <div className="p-4 bg-slate-100 dark:bg-[#141922] border border-slate-200 dark:border-white/5 rounded-[40px] flex flex-col sm:flex-row items-center gap-3 shadow-inner">
              <div className="flex-1 px-6 py-5 bg-white dark:bg-black/20 rounded-[28px] border border-slate-200 dark:border-white/5 w-full flex items-center gap-4 group/input transition-all focus-within:border-blue-500">
                <LinkIcon className="w-5 h-5 text-blue-600 dark:text-blue-500 flex-shrink-0 group-hover/input:rotate-12 transition-transform" />
                <span className="font-mono text-blue-600 dark:text-blue-400 font-bold truncate text-sm select-all">
                  {referralLink}
                </span>
              </div>
              <button 
                onClick={handleCopy}
                className={`w-full sm:w-auto px-10 py-5 rounded-[28px] text-xs font-black shadow-2xl transition-all flex items-center justify-center gap-3 group uppercase tracking-widest ${
                  copied ? 'bg-emerald-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-900/40 hover:-translate-y-1'
                }`}
              >
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5 group-hover:rotate-12 transition-transform" />}
                {copied ? 'Captured' : 'Copy Protocol Link'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="group p-10 bg-brand-lightSecondary dark:bg-brand-darkSecondary rounded-[48px] border border-slate-200 dark:border-white/5 hover:border-blue-500/40 transition-all relative overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <Users className="w-24 h-24 text-blue-600" />
          </div>
          <div className="relative">
            <p className="text-slate-400 dark:text-gray-500 text-[10px] font-black uppercase tracking-[0.3em] mb-6">Network Nodes</p>
            <div className="flex items-end gap-3">
              <span className="text-4xl md:text-5xl font-black font-mono text-slate-900 dark:text-white tracking-tighter">0</span>
              <span className="text-blue-600 dark:text-blue-500 font-black text-[10px] mb-2 uppercase tracking-widest">+0 Cycle</span>
            </div>
            <p className="text-[10px] text-slate-400 dark:text-gray-600 mt-6 uppercase font-black tracking-widest">Verified Global Associates</p>
          </div>
        </div>

        <div className="group p-10 bg-brand-lightSecondary dark:bg-brand-darkSecondary rounded-[48px] border border-slate-200 dark:border-white/5 hover:border-emerald-500/40 transition-all relative overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <Coins className="w-24 h-24 text-emerald-600" />
          </div>
          <div className="relative">
            <p className="text-slate-400 dark:text-gray-500 text-[10px] font-black uppercase tracking-[0.3em] mb-6">Network Dividends</p>
            <div className="flex items-end gap-3">
              <span className="text-4xl md:text-5xl font-black font-mono text-emerald-600 dark:text-emerald-500 tracking-tighter">$0.00</span>
              <span className="text-slate-400 dark:text-gray-600 font-black text-[10px] mb-2 uppercase tracking-widest">Settled</span>
            </div>
            <p className="text-[10px] text-slate-400 dark:text-gray-600 mt-6 uppercase font-black tracking-widest">Instant Liquidity Payouts</p>
          </div>
        </div>
      </div>

      {/* How it Works Section */}
      <div className="space-y-10">
        <div className="text-center">
          <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-900 dark:text-white">Simplified Growth Vector</h3>
          <p className="text-sm text-slate-500 dark:text-gray-500 font-medium mt-2">Scale your reach in three strategic phases.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, idx) => (
            <div key={idx} className="bg-brand-lightSecondary dark:bg-brand-darkSecondary border border-slate-200 dark:border-white/5 p-10 rounded-[40px] hover:bg-blue-50 dark:hover:bg-white/[0.02] transition-all relative group shadow-sm">
              <div className={`w-16 h-16 ${step.bg} ${step.color} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
                <step.icon className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-black mb-4 text-slate-900 dark:text-white flex items-center gap-2 uppercase tracking-tight">
                {idx + 1}. {step.title}
                {idx < 2 && <ArrowRight className="hidden md:block w-4 h-4 text-slate-300 dark:text-gray-700 ml-auto group-hover:translate-x-2 transition-transform" />}
              </h4>
              <p className="text-slate-500 dark:text-gray-500 text-sm leading-relaxed font-bold">{step.desc}</p>
              
              {/* Vertical connector for mobile */}
              {idx < 2 && (
                <div className="md:hidden flex justify-center py-6">
                  <div className="w-px h-10 bg-gradient-to-b from-slate-200 dark:from-gray-800 to-transparent" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bonus Tier Info */}
      <div className="bg-gradient-to-br from-blue-600/5 to-purple-600/5 border border-blue-500/20 p-10 md:p-14 rounded-[48px] flex flex-col md:flex-row items-center justify-between gap-10 shadow-xl">
        <div className="flex items-center gap-8 text-center md:text-left flex-col md:flex-row">
          <div className="w-24 h-24 bg-blue-600 rounded-[32px] flex items-center justify-center shadow-2xl shadow-blue-900/40 rotate-3 group hover:rotate-0 transition-transform flex-shrink-0">
             <TrendingUp className="w-12 h-12 text-white" />
          </div>
          <div>
            <h4 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tighter">Current Multiplier: <span className="text-blue-600 dark:text-blue-500 tracking-widest">ALPHA</span></h4>
            <p className="text-sm text-slate-500 dark:text-gray-400 font-bold max-w-sm">You are on the Standard Tier. Maintain 10 active nodes to unlock the <b>7% PLATINUM</b> protocol.</p>
          </div>
        </div>
        <div className="flex flex-col items-center md:items-end bg-white dark:bg-black/20 p-8 rounded-[32px] border border-slate-100 dark:border-white/5 shadow-inner min-w-[180px]">
          <div className="text-4xl font-black font-mono text-blue-600 dark:text-blue-500 mb-1">5.0%</div>
          <div className="text-[9px] font-black text-slate-400 dark:text-gray-600 uppercase tracking-[0.3em]">Instant Payout</div>
        </div>
      </div>
    </div>
  );
};
