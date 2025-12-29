
import React, { useState, useEffect } from 'react';
import { useApp } from '../store/AppContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, PieChart as PieChartIcon, Zap, TrendingUp, ArrowUpRight, ArrowDownRight, Wallet, ArrowDownCircle, ChevronRight, ShieldCheck, Newspaper, Info, ChevronDown, ChevronUp, Cpu, Server, Target } from 'lucide-react';
import { TransactionType } from '../types';

const CountdownTimer: React.FC<{ targetDate: number }> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState<number>(Math.max(0, targetDate - Date.now()));

  useEffect(() => {
    const interval = setInterval(() => {
      const diff = Math.max(0, targetDate - Date.now());
      setTimeLeft(diff);
      if (diff <= 0) clearInterval(interval);
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((timeLeft / 1000 / 60) % 60);
  const seconds = Math.floor((timeLeft / 1000) % 60);

  return (
    <div className="flex items-center gap-1.5 text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/5 px-2.5 py-1.5 rounded-lg border border-blue-100 dark:border-blue-500/10 whitespace-nowrap">
      <Zap className="w-3 h-3 animate-pulse fill-current" />
      Next ROI in {hours.toString().padStart(2, '0')}:{minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
    </div>
  );
};

export const UserDashboard = () => {
  const { currentUser, investments, transactions, plans, theme, makeDeposit, investInPlan, addToast } = useApp();
  const [depositAmount, setDepositAmount] = useState<string>('');
  const [depositMethod, setDepositMethod] = useState<string>('BTC');
  const [expandedBriefId, setExpandedBriefId] = useState<string | null>(null);

  if (!currentUser) return null;

  const userInvestments = investments.filter(i => i.userId === currentUser.id);
  const activeInvestments = userInvestments.filter(i => i.status === 'ACTIVE');
  const userTransactions = transactions.filter(t => t.userId === currentUser.id).slice(0, 5);
  const totalProfitEarned = userInvestments.reduce((acc, inv) => acc + inv.earnedSoFar, 0);

  const handleQuickDeposit = () => {
    const amt = parseFloat(depositAmount);
    if (isNaN(amt) || amt <= 0) return;
    makeDeposit(amt, depositMethod);
    setDepositAmount('');
  };

  const handleQuickInvest = (planId: string, minAmount: number) => {
    if (currentUser.balance < minAmount) {
      addToast("Insufficient liquidity for this strategy.", "error", "Allocation Failed");
      return;
    }
    const error = investInPlan(planId, minAmount);
    if (!error) {
       addToast(`$${minAmount.toLocaleString()} allocated to protocol successfully.`, "success", "Contract Active");
    }
  };

  const toggleBrief = (id: string) => {
    setExpandedBriefId(expandedBriefId === id ? null : id);
  };

  const chartData = [
    { name: '01', profit: 40 }, { name: '02', profit: 30 }, { name: '03', profit: 60 },
    { name: '04', profit: 80 }, { name: '05', profit: 50 }, { name: '06', profit: 90 }, { name: '07', profit: 110 }
  ];

  const stats = [
    { label: 'Active Capital', value: `$${currentUser.totalInvested.toLocaleString()}`, icon: TrendingUp, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Total Yield', value: `$${totalProfitEarned.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Total Paid', value: `$${currentUser.totalWithdrawn.toLocaleString()}`, icon: ArrowDownRight, color: 'text-rose-500', bg: 'bg-rose-500/10' },
    { label: 'Network XP', value: '1,240 XP', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  ];

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-20 md:pb-0">
      
      {/* Platform News Ticker */}
      <div className="bg-white dark:bg-brand-darkSecondary border border-slate-200 dark:border-white/5 rounded-2xl p-3 px-6 flex items-center gap-4 overflow-hidden shadow-sm">
        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-black text-[10px] uppercase tracking-widest flex-shrink-0">
          <Newspaper className="w-4 h-4" />
          Protocol News:
        </div>
        <div className="flex-1 overflow-hidden relative h-5">
           <div className="absolute whitespace-nowrap animate-[marquee_20s_linear_infinite] text-[11px] font-bold text-slate-500 dark:text-gray-400">
             • Bitcoin Hashrate reaches new ATH, Arbitrage Engine efficiency +12% • System Kernel Upgrade 4.2.0 successfully deployed • New "Ethereum Plus" staking pool now open for verified nodes •
           </div>
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((s, i) => (
          <div key={i} className="bg-white dark:bg-brand-darkSecondary border border-slate-200/60 dark:border-gray-800 p-5 rounded-3xl hover:shadow-premium-light dark:hover:shadow-premium-dark transition-all group overflow-hidden relative">
            <div className="relative z-10 flex justify-between items-start mb-4">
              <div className={`p-2.5 rounded-2xl ${s.bg} group-hover:scale-110 transition-transform`}>
                <s.icon className={`w-4.5 h-4.5 ${s.color}`} />
              </div>
              <span className="text-[9px] font-black text-slate-400 dark:text-gray-500 uppercase tracking-widest">{s.label}</span>
            </div>
            <h3 className="text-lg md:text-xl font-black text-slate-900 dark:text-white font-mono relative z-10">{s.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Chart */}
          <div className="bg-white dark:bg-brand-darkSecondary border border-slate-200/60 dark:border-gray-800 p-6 rounded-3xl shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">Yield Performance</h3>
                <p className="text-[11px] text-slate-500 dark:text-gray-500 mt-1 uppercase tracking-widest font-bold">Real-time Arbitrage Index</p>
              </div>
              <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-lg text-[9px] font-black border border-emerald-500/10 animate-pulse">LIVE FEED</span>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#1f2937' : '#f1f5f9'} vertical={false} />
                  <XAxis dataKey="name" stroke={theme === 'dark' ? '#6b7280' : '#94a3b8'} fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke={theme === 'dark' ? '#6b7280' : '#94a3b8'} fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: theme === 'dark' ? '#141922' : '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px' }}
                    itemStyle={{ color: '#3b82f6' }}
                  />
                  <Area type="monotone" dataKey="profit" stroke="#3b82f6" fillOpacity={1} fill="url(#colorProfit)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Strategy Hub - NEW SECTION */}
          <div className="space-y-4">
             <div className="flex items-center justify-between px-2">
                <h3 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight">Strategy Hub</h3>
                <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">Available Protocols</span>
             </div>
             <div className="grid sm:grid-cols-3 gap-4">
                {plans.map(plan => (
                   <div key={plan.id} className="bg-white dark:bg-brand-darkSecondary border border-slate-200/60 dark:border-gray-800 p-6 rounded-[32px] shadow-sm hover:border-blue-500/50 transition-all flex flex-col justify-between group">
                      <div>
                         <h4 className="text-[9px] font-black text-slate-400 dark:text-gray-600 uppercase tracking-widest mb-1">{plan.name}</h4>
                         <p className="text-xl font-black text-blue-600 dark:text-blue-500 font-mono mb-6">{plan.roi}%</p>
                         <div className="space-y-2 mb-6">
                            <div className="flex justify-between text-[8px] font-bold uppercase tracking-widest text-slate-400">
                               <span>Floor</span>
                               <span className="text-slate-900 dark:text-white">${plan.minAmount}</span>
                            </div>
                            <div className="flex justify-between text-[8px] font-bold uppercase tracking-widest text-slate-400">
                               <span>Risk</span>
                               <span className="text-emerald-500">LOW</span>
                            </div>
                         </div>
                      </div>
                      <button 
                        onClick={() => handleQuickInvest(plan.id, plan.minAmount)}
                        className="w-full py-2.5 bg-slate-100 dark:bg-white/5 group-hover:bg-blue-600 group-hover:text-white text-slate-600 dark:text-gray-400 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95"
                      >
                         Invest
                      </button>
                   </div>
                ))}
             </div>
          </div>
        </div>

        {/* Quick Actions Stack */}
        <div className="space-y-6 md:space-y-8 flex flex-col">
          {/* Quick Deposit Module */}
          <div className="bg-white dark:bg-brand-darkSecondary border border-slate-200/60 dark:border-gray-800 p-6 rounded-3xl shadow-sm relative overflow-hidden group flex-1 transition-all">
             <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Wallet className="w-16 h-16 text-blue-600" />
             </div>
             <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4 uppercase tracking-tight flex items-center gap-2">
                <ArrowDownCircle className="w-5 h-5 text-blue-500" /> Quick Deposit
             </h3>
             <div className="space-y-4">
                <div className="relative">
                  <input 
                    type="number" 
                    placeholder="0.00"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200/60 dark:border-white/5 rounded-2xl px-5 py-3.5 text-lg font-black text-slate-900 dark:text-white focus:border-blue-600 outline-none transition-all font-mono"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 dark:text-gray-600 uppercase tracking-widest">USD</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                   <select 
                    value={depositMethod}
                    onChange={(e) => setDepositMethod(e.target.value)}
                    className="bg-slate-50 dark:bg-black/20 border border-slate-200/60 dark:border-white/5 rounded-2xl px-4 py-3 text-xs font-bold text-slate-700 dark:text-gray-300 outline-none focus:border-blue-600 transition-all appearance-none cursor-pointer text-center"
                   >
                     <option value="BTC">BTC</option>
                     <option value="ETH">ETH</option>
                     <option value="USDT">USDT</option>
                     <option value="Bank Transfer">Bank</option>
                     <option value="Credit Card">Card</option>
                   </select>
                   <button 
                    onClick={handleQuickDeposit}
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-blue-900/20 active:scale-95 py-3 flex items-center justify-center gap-2"
                   >
                     Deposit <ChevronRight className="w-3 h-3" />
                   </button>
                </div>
             </div>
             <p className="text-[9px] text-slate-400 dark:text-gray-600 mt-4 font-bold uppercase tracking-widest text-center">Multiple settlement layers supported.</p>
          </div>

          {/* Status Hub */}
          <div className="bg-white dark:bg-brand-darkSecondary border border-slate-200/60 dark:border-gray-800 p-6 rounded-3xl flex flex-col justify-between shadow-sm relative group overflow-hidden flex-1">
            <div className="relative z-10">
              <h3 className="text-lg font-black text-slate-900 dark:text-white mb-6 uppercase tracking-tight">Ecosystem Pulse</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-black/20 rounded-2xl border border-slate-100 dark:border-white/5">
                  <span className="text-xs font-bold text-slate-600 dark:text-gray-400">Active Nodes</span>
                  <span className="font-black text-blue-600 dark:text-blue-500">{activeInvestments.length}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-black/20 rounded-2xl border border-slate-100 dark:border-white/5">
                  <span className="text-xs font-bold text-slate-600 dark:text-gray-400">Success Rate</span>
                  <span className="font-black text-emerald-600 dark:text-emerald-500">99.8%</span>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-gray-800 relative z-10">
              <div className="flex justify-between text-[9px] font-black uppercase tracking-widest mb-2">
                <span className="text-slate-500 dark:text-gray-500">Node Maturity</span>
                <span className="text-blue-600 dark:text-blue-500">65%</span>
              </div>
              <div className="h-2 bg-slate-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.4)] transition-all duration-1000" style={{ width: '65%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
        {/* Active Strategies */}
        <div className="bg-white dark:bg-brand-darkSecondary border border-slate-200/60 dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-100 dark:border-gray-800 bg-slate-50/50 dark:bg-brand-darkSecondary/30 flex justify-between items-center">
            <h3 className="font-black text-slate-900 dark:text-white flex items-center gap-2 uppercase tracking-tight">
              <Zap className="w-5 h-5 text-blue-500 fill-current" /> Live ROI Contracts
            </h3>
          </div>
          <div className="p-6">
            {activeInvestments.length === 0 ? (
              <div className="text-center py-12 text-slate-400 dark:text-gray-600">
                <PieChartIcon className="w-12 h-12 mx-auto mb-4 opacity-10" />
                <p className="font-bold text-sm uppercase tracking-widest">No active protocols</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activeInvestments.map(inv => {
                  const plan = plans.find(p => p.id === inv.planId);
                  const progress = (inv.totalPayouts / (plan?.durationDays || 30)) * 100;
                  const isExpanded = expandedBriefId === inv.id;
                  
                  return (
                    <div key={inv.id} className="p-5 bg-slate-50 dark:bg-brand-darkSecondary border border-slate-100/60 dark:border-gray-800 rounded-2xl group hover:border-blue-400 transition-all">
                      <div className="flex justify-between items-start mb-4 gap-2">
                        <div>
                          <h4 className="font-black text-slate-900 dark:text-white text-base">{plan?.name}</h4>
                          <span className="text-[10px] text-slate-400 dark:text-gray-600 font-mono tracking-tighter uppercase tracking-widest font-black">NODE: #{inv.id.slice(0, 8)}</span>
                        </div>
                        <CountdownTimer targetDate={inv.nextPayout} />
                      </div>
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-white dark:bg-black/20 p-3 rounded-xl border border-slate-200/60 dark:border-white/5">
                           <p className="text-[9px] text-slate-400 dark:text-gray-600 uppercase font-black mb-1 tracking-widest">Stake</p>
                           <p className="text-sm font-black text-slate-900 dark:text-white font-mono">${inv.amount.toLocaleString()}</p>
                        </div>
                        <div className="bg-white dark:bg-black/20 p-3 rounded-xl border border-slate-200/60 dark:border-white/5">
                           <p className="text-[9px] text-slate-400 dark:text-gray-600 uppercase font-black mb-1 tracking-widest">Earned</p>
                           <p className="text-sm font-black text-emerald-600 dark:text-emerald-500 font-mono">+${inv.earnedSoFar.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                        </div>
                      </div>
                      <div className="h-1.5 bg-slate-200 dark:bg-gray-800 rounded-full overflow-hidden mb-4">
                         <div className="h-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.3)] transition-all duration-1000" style={{ width: `${progress}%` }} />
                      </div>

                      {/* Expandable Brief Section */}
                      <div className="border-t border-slate-100 dark:border-white/5 pt-3">
                        <button 
                          onClick={() => toggleBrief(inv.id)}
                          className="flex items-center justify-between w-full text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-gray-500 hover:text-blue-600 transition-colors"
                        >
                          Protocol Brief
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                        
                        {isExpanded && (
                          <div className="mt-4 grid grid-cols-2 gap-4 animate-in slide-in-from-top-2 duration-300">
                             <div className="flex items-center gap-2">
                                <Cpu className="w-3.5 h-3.5 text-blue-500" />
                                <div className="flex flex-col">
                                   <span className="text-[8px] text-slate-400 uppercase font-black">Engine</span>
                                   <span className="text-[9px] font-bold dark:text-gray-300 uppercase">Alpha-v4.2</span>
                                </div>
                             </div>
                             <div className="flex items-center gap-2">
                                <Server className="w-3.5 h-3.5 text-blue-500" />
                                <div className="flex flex-col">
                                   <span className="text-[8px] text-slate-400 uppercase font-black">Region</span>
                                   <span className="text-[9px] font-bold dark:text-gray-300 uppercase">US-EAST</span>
                                </div>
                             </div>
                             <div className="flex items-center gap-2">
                                <Target className="w-3.5 h-3.5 text-emerald-500" />
                                <div className="flex flex-col">
                                   <span className="text-[8px] text-slate-400 uppercase font-black">Accuracy</span>
                                   <span className="text-[9px] font-bold dark:text-gray-300">99.98%</span>
                                </div>
                             </div>
                             <div className="flex items-center gap-2">
                                <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                                <div className="flex flex-col">
                                   <span className="text-[8px] text-slate-400 uppercase font-black">Risk Level</span>
                                   <span className="text-[9px] font-bold text-emerald-500 uppercase">LOW</span>
                                </div>
                             </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* History */}
        <div className="bg-white dark:bg-brand-darkSecondary border border-slate-200/60 dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-100 dark:border-gray-800 bg-slate-50/50 dark:bg-brand-darkSecondary/30">
            <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-tight">Recent Ledger</h3>
          </div>
          <div className="p-0 overflow-x-auto no-scrollbar">
            {userTransactions.length === 0 ? (
               <div className="p-16 text-center text-slate-400 dark:text-gray-600 font-black uppercase tracking-[0.2em] text-xs">Ledger Empty</div>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-brand-darkSecondary/50 text-[10px] font-black text-slate-500 dark:text-gray-500 uppercase tracking-widest">
                  <tr>
                    <th className="px-6 py-4">Action</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-gray-800/50">
                  {userTransactions.map(tx => (
                    <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors group">
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="font-black text-slate-900 dark:text-white text-xs">{tx.type}</span>
                          <span className="text-[9px] text-slate-400 dark:text-gray-600 font-bold uppercase">{new Date(tx.date).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`font-black font-mono text-sm ${tx.type === TransactionType.WITHDRAWAL ? 'text-rose-600' : 'text-emerald-600'}`}>
                          {tx.type === TransactionType.WITHDRAWAL ? '-' : '+'}${tx.amount.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`px-2 py-1 rounded-lg text-[9px] font-black border ${
                          tx.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 border-emerald-500/20' :
                          tx.status === 'PENDING' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-500 border-amber-500/20' : 'bg-rose-500/10 text-rose-600 dark:text-rose-500 border-rose-500/20'
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
