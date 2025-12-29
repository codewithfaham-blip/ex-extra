
import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Shield, Zap, CircleDollarSign, BarChart3, Clock, Globe, Lock, Cpu, Server, Activity, ArrowRight, ShieldCheck, Database } from 'lucide-react';
import { INITIAL_PLANS } from '../constants';
import { PublicNavbar } from '../components/Navbar';

export const LandingPage = () => {
  return (
    <div className="bg-brand-light dark:bg-brand-dark text-slate-900 dark:text-white overflow-hidden min-h-screen transition-colors duration-300">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-44 pb-32 flex flex-col items-center relative">
        <div className="absolute top-40 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-blue-600/10 dark:bg-blue-600/10 blur-[120px] -z-10 rounded-full" />
        
        <div className="relative border-2 border-blue-400/20 dark:border-blue-400/20 bg-white/50 dark:bg-blue-500/[0.01] p-10 md:p-24 rounded-[32px] max-w-5xl w-full flex flex-col items-center shadow-xl dark:shadow-[inset_0_0_80px_rgba(59,130,246,0.02)] backdrop-blur-sm">
          <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] mb-12 animate-pulse">
            <Zap className="w-4 h-4 fill-current" />
            Institutional Grade Yield Engine
          </span>

          <h1 className="text-5xl md:text-8xl font-black mb-4 tracking-tight leading-[0.9] text-center flex flex-col items-center">
            <span className="uppercase text-slate-900 dark:text-white">Scale Your</span>
            <div className="h-16 md:h-24 w-[280px] md:w-[600px] bg-gradient-to-r from-blue-600 via-emerald-400 to-blue-500 my-8 rounded-2xl shadow-2xl dark:shadow-[0_0_60px_rgba(37,99,235,0.3)] border border-white/20" />
            <span className="uppercase text-slate-900 dark:text-white">Digital Capital</span>
          </h1>
        </div>

        <p className="text-base md:text-lg text-slate-500 dark:text-gray-500 max-w-2xl mx-auto mt-16 mb-12 text-center leading-relaxed font-medium">
          Deploy capital into a proprietary high-frequency arbitrage ecosystem. Start with $100 and reach 4.0% daily yields.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link to="/register" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-10 py-4.5 rounded-[22px] font-bold text-lg transition-all shadow-2xl shadow-blue-900/40 hover:-translate-y-1 text-center">
            Create Account
          </Link>
          <Link to="/login" className="w-full sm:w-auto bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-900 dark:text-white px-10 py-4.5 rounded-[22px] font-bold text-lg border border-slate-200 dark:border-white/10 transition-all text-center">
            View Protocol
          </Link>
        </div>
      </section>

      {/* Live Stats Ticker */}
      <section className="bg-white dark:bg-brand-darkSecondary border-y border-slate-200 dark:border-white/5 py-8 overflow-hidden">
        <div className="flex items-center gap-12 animate-[marquee_40s_linear_infinite] whitespace-nowrap px-10">
          {[1,2,3,4,5].map(i => (
            <React.Fragment key={i}>
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Total Value Locked:</span>
                <span className="text-sm font-black text-blue-600 font-mono">$1.24B+</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Active Nodes:</span>
                <span className="text-sm font-black text-emerald-600 font-mono">142,801</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Avg Daily ROI:</span>
                <span className="text-sm font-black text-blue-500 font-mono">2.68%</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">System Uptime:</span>
                <span className="text-sm font-black text-slate-900 dark:text-white font-mono">99.99%</span>
              </div>
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* Infrastructure Section */}
      <section className="py-32 max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-20 items-center">
        <div>
          <span className="text-blue-600 font-black text-[10px] uppercase tracking-[0.3em] mb-4 block">Engine Core</span>
          <h2 className="text-3xl md:text-4xl font-black mb-8 leading-tight uppercase tracking-tight">AI-Driven Arbitrage <span className="text-blue-600">Infrastructure</span></h2>
          <p className="text-slate-500 dark:text-gray-400 text-base mb-10 font-medium">Our system scans thousands of global exchanges per second, identifying micro-discrepancies in pricing and executing trades with institutional precision.</p>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-600 shrink-0">
                <Cpu className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-black text-slate-900 dark:text-white uppercase text-sm mb-1">Neural Execution</h4>
                <p className="text-slate-500 dark:text-gray-500 text-xs font-bold leading-relaxed">Deep learning models predict market volatility before it happens.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-emerald-600/10 rounded-2xl flex items-center justify-center text-emerald-600 shrink-0">
                <Server className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-black text-slate-900 dark:text-white uppercase text-sm mb-1">Global Node Network</h4>
                <p className="text-slate-500 dark:text-gray-500 text-xs font-bold leading-relaxed">Low-latency servers deployed across 24 financial regions.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="relative">
          <div className="absolute inset-0 bg-blue-600/20 blur-[100px] rounded-full" />
          <div className="relative bg-white dark:bg-brand-darkSecondary border border-slate-200 dark:border-white/10 p-4 rounded-[40px] shadow-2xl">
             <div className="grid grid-cols-2 gap-4">
                {[1,2,3,4].map(i => (
                  <div key={i} className="aspect-square bg-slate-50 dark:bg-black/20 rounded-3xl border border-slate-100 dark:border-white/5 flex flex-col items-center justify-center p-6 text-center group hover:bg-blue-600 hover:text-white transition-all">
                     <Globe className="w-8 h-8 mb-4 opacity-40 group-hover:opacity-100 transition-opacity" />
                     <span className="text-[10px] font-black uppercase tracking-widest">Region {i}</span>
                     <span className="text-xs font-bold mt-1">Operational</span>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </section>

      {/* Security Vault Section */}
      <section className="bg-slate-900 text-white py-32 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/20 blur-[150px] -z-0" />
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <Shield className="w-16 h-16 text-blue-500 mx-auto mb-10" />
          <h2 className="text-4xl md:text-6xl font-black mb-8 uppercase tracking-tighter">Hardened Security <span className="text-blue-500">Protocol</span></h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg mb-16 font-medium">Your assets are protected by multiple layers of military-grade encryption and audited cold-storage solutions.</p>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: Lock, title: "Cold Storage", desc: "98% of assets offline" },
              { icon: ShieldCheck, title: "Verified KYC", desc: "Anti-fraud clearance" },
              { icon: Database, title: "Snapshotting", desc: "Real-time ledger backup" },
              { icon: Activity, title: "IDS Monitoring", desc: "Intrusion protection" }
            ].map((item, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[32px] hover:-translate-y-2 transition-all">
                 <item.icon className="w-10 h-10 text-blue-500 mb-6 mx-auto" />
                 <h4 className="font-black uppercase tracking-tight mb-2 text-sm">{item.title}</h4>
                 <p className="text-slate-500 text-[11px] font-bold uppercase tracking-widest">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section className="bg-brand-lightSecondary dark:bg-brand-darkSecondary py-32 border-y border-slate-200 dark:border-white/5 transition-colors">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-black mb-6 tracking-tight text-slate-900 dark:text-white uppercase">ROI Packages</h2>
            <p className="text-slate-500 dark:text-gray-500 max-w-xl mx-auto text-sm font-medium">Guaranteed daily returns backed by automated liquidity provisioning.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {INITIAL_PLANS.map((plan) => (
              <div key={plan.id} className="bg-white dark:bg-[#141922] border border-slate-200 dark:border-white/5 rounded-[48px] p-10 hover:border-blue-500/50 transition-all group relative overflow-hidden shadow-xl dark:shadow-2xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-3xl rounded-full" />
                <div className="flex justify-between items-start mb-10 relative">
                  <div>
                    <h3 className="text-slate-400 dark:text-gray-500 text-[9px] font-black uppercase tracking-[0.2em] mb-4">{plan.name}</h3>
                    <p className="text-blue-600 dark:text-blue-500 font-black text-5xl font-mono tracking-tighter">{plan.roi}% <span className="text-[10px] font-bold text-slate-400 dark:text-gray-700 block mt-1 tracking-widest uppercase">Per 24h</span></p>
                  </div>
                  <div className="p-4 bg-blue-500/10 rounded-[20px]">
                    <TrendingUp className="w-8 h-8 text-blue-600 dark:text-blue-500" />
                  </div>
                </div>
                <div className="space-y-5 mb-12 relative text-sm">
                  <div className="flex justify-between items-center"><span className="text-slate-400 dark:text-gray-600 uppercase font-black tracking-widest text-[9px]">Entry Floor</span><span className="font-black text-slate-900 dark:text-white font-mono">${plan.minAmount}</span></div>
                  <div className="flex justify-between items-center"><span className="text-slate-400 dark:text-gray-600 uppercase font-black tracking-widest text-[9px]">Cap Limit</span><span className="font-black text-slate-900 dark:text-white font-mono">${plan.maxAmount}</span></div>
                  <div className="flex justify-between items-center"><span className="text-slate-400 dark:text-gray-600 uppercase font-black tracking-widest text-[9px]">Maturity</span><span className="font-black text-slate-900 dark:text-white">{plan.durationDays} Days</span></div>
                </div>
                <Link to="/register" className="block w-full text-center py-6 bg-blue-50 dark:bg-blue-600/10 hover:bg-blue-600 text-blue-600 dark:text-blue-500 rounded-[28px] font-bold text-lg transition-all border border-blue-200 dark:border-blue-500/20 group-hover:bg-blue-600 group-hover:text-white shadow-xl uppercase tracking-widest">Configure</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 bg-brand-light dark:bg-brand-dark border-t border-slate-200 dark:border-white/5 text-center transition-colors">
        <Link to="/" className="inline-block mb-12">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center font-black text-2xl text-white shadow-2xl shadow-blue-900/40 mx-auto">C</div>
        </Link>
        <p className="text-slate-500 dark:text-gray-600 text-sm mb-16 max-w-md mx-auto font-medium">The world's most sophisticated high-yield engine for the digital asset era.</p>
        <p className="text-[10px] text-slate-400 dark:text-gray-800 uppercase tracking-[0.5em] font-black">© MMXXIV CryptoYield Engine</p>
      </footer>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};
