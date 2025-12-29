
import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { Wallet, ArrowDownCircle, ArrowUpCircle, Clock, CheckCircle2, XCircle, CreditCard, Landmark, Coins, ChevronRight, ArrowLeft, Plus, Copy, Trash2, ShieldCheck, ExternalLink, QrCode, Info } from 'lucide-react';
import { TransactionType, LinkedWallet } from '../types';

export const TransactionsPage = () => {
  const { transactions, currentUser, makeDeposit, requestWithdrawal, updateProfile, addToast } = useApp();
  const [amount, setAmount] = useState<number>(0);
  const [step, setStep] = useState<'TYPE' | 'DETAILS'>('TYPE');
  const [method, setMethod] = useState<string>('');
  const [isWithdraw, setIsWithdraw] = useState(false);
  
  // Wallet Linking States
  const [isAddingWallet, setIsAddingWallet] = useState(false);
  const [newWallet, setNewWallet] = useState({ type: 'BTC', address: '', label: '' });

  const userTransactions = transactions.filter(t => t.userId === currentUser?.id);
  const linkedWallets = currentUser?.linkedWallets || [];

  const depositMethods = [
    { id: 'BTC', name: 'Bitcoin', icon: Coins, desc: 'Instant after 1 confirmation' },
    { id: 'ETH', name: 'Ethereum', icon: Coins, desc: 'ERC20 Network' },
    { id: 'USDT', name: 'Tether', icon: Coins, desc: 'TRC20 Network' },
    { id: 'Bank Transfer', name: 'Bank Wire', icon: Landmark, desc: 'Verified in 1-3 business days' },
    { id: 'Credit Card', name: 'Card Payment', icon: CreditCard, desc: 'Verified in 24 hours' },
  ];

  const handleAction = () => {
    if (amount <= 0) return;
    if (isWithdraw) {
      if (!currentUser || currentUser.balance < amount) return;
      requestWithdrawal(amount, method);
    } else {
      makeDeposit(amount, method);
    }
    resetForm();
  };

  const resetForm = () => {
    setAmount(0);
    setStep('TYPE');
    setMethod('');
    setIsWithdraw(false);
  };

  const startDeposit = (m: string) => {
    setMethod(m);
    setIsWithdraw(false);
    setStep('DETAILS');
  };

  const startWithdrawal = () => {
    setIsWithdraw(true);
    setStep('DETAILS');
    setMethod(linkedWallets.length > 0 ? linkedWallets[0].type : 'BTC');
  };

  const handleAddWallet = () => {
    if (!newWallet.address || !newWallet.label) {
      addToast("Please provide address and label", "error", "Missing Data");
      return;
    }
    const wallet: LinkedWallet = {
      id: Math.random().toString(36).substr(2, 9),
      ...newWallet,
      addedAt: Date.now()
    };
    updateProfile({ linkedWallets: [...linkedWallets, wallet] });
    setIsAddingWallet(false);
    setNewWallet({ type: 'BTC', address: '', label: '' });
    addToast("New destination address linked successfully.", "success", "Vault Updated");
  };

  const removeWallet = (id: string) => {
    updateProfile({ linkedWallets: linkedWallets.filter(w => w.id !== id) });
    addToast("Address removed from secure vault.", "info", "Vault Update");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    addToast("Address copied to clipboard.", "success");
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 md:pb-0">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Interface */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white dark:bg-brand-darkSecondary border border-slate-200/60 dark:border-gray-800 p-8 md:p-10 rounded-[48px] shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Wallet className="w-32 h-32 text-blue-600" />
            </div>

            {step === 'TYPE' ? (
              <div className="relative z-10 space-y-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-900 dark:text-white leading-none">Capital Gateway</h3>
                    <p className="text-xs text-slate-500 dark:text-gray-500 font-bold uppercase tracking-widest mt-2">Manage inflows and outflows</p>
                  </div>
                  <button 
                    onClick={startWithdrawal}
                    className="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl text-rose-500 hover:bg-rose-500/10 transition-all border border-transparent hover:border-rose-500/20 active:scale-95 shadow-sm"
                  >
                    <ArrowUpCircle className="w-6 h-6" />
                  </button>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {depositMethods.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => startDeposit(m.id)}
                      className="group p-6 bg-slate-50/50 dark:bg-black/20 border border-slate-200/60 dark:border-white/5 rounded-[32px] text-left hover:border-blue-600 transition-all active:scale-95 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-white dark:bg-white/5 rounded-2xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                          <m.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-black text-slate-900 dark:text-white uppercase text-sm tracking-tight">{m.name}</h4>
                          <p className="text-[10px] text-slate-400 dark:text-gray-600 font-bold uppercase tracking-widest">{m.desc}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 transition-transform" />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="relative z-10 space-y-8 animate-in slide-in-from-right-4 duration-300">
                <div className="flex items-center gap-4">
                  <button onClick={() => setStep('TYPE')} className="p-3 bg-slate-100 dark:bg-white/5 rounded-xl hover:text-blue-600 transition-all">
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div>
                    <h3 className="text-xl font-black uppercase tracking-tighter text-slate-900 dark:text-white">
                      {isWithdraw ? 'Withdraw Funds' : `Inflow via ${method}`}
                    </h3>
                    <p className="text-[10px] text-slate-500 dark:text-gray-500 font-bold uppercase tracking-widest">Verify amount and confirm settlement</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 dark:text-gray-600 uppercase tracking-widest ml-1">Volume (USD)</label>
                    <div className="relative">
                      <input 
                        type="number" 
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200/60 dark:border-white/5 rounded-3xl px-8 py-6 text-4xl font-black text-slate-900 dark:text-white outline-none focus:border-blue-600 transition-all font-mono"
                        placeholder="0.00"
                        autoFocus
                      />
                      <span className="absolute right-8 top-1/2 -translate-y-1/2 font-black text-slate-300 dark:text-gray-600 text-lg uppercase tracking-widest">USD</span>
                    </div>
                  </div>

                  {isWithdraw && (
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 dark:text-gray-600 uppercase tracking-widest ml-1">Destination Target</label>
                      <select 
                        value={method}
                        onChange={(e) => setMethod(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200/60 dark:border-white/5 rounded-2xl px-6 py-4 text-slate-900 dark:text-white font-bold outline-none focus:border-blue-600 cursor-pointer"
                      >
                        {linkedWallets.length > 0 ? (
                          linkedWallets.map(w => (
                            <option key={w.id} value={w.type}>{w.label} ({w.type}) - {w.address.slice(0, 6)}...{w.address.slice(-4)}</option>
                          ))
                        ) : (
                          <>
                            <option value="BTC">Direct Bitcoin Wallet</option>
                            <option value="ETH">Direct Ethereum Address</option>
                            <option value="Bank">Manual Wire Transfer</option>
                          </>
                        )}
                      </select>
                      {linkedWallets.length === 0 && (
                        <p className="text-[10px] text-amber-600 font-bold uppercase tracking-widest ml-2 flex items-center gap-1">
                          <Info className="w-3 h-3" /> No linked wallets found. Using manual routing.
                        </p>
                      )}
                    </div>
                  )}

                  <div className="p-6 bg-blue-500/5 rounded-3xl border border-blue-500/10 flex items-start gap-3">
                    <Clock className="w-4 h-4 text-blue-500 mt-0.5" />
                    <p className="text-[10px] text-slate-500 dark:text-gray-500 font-bold leading-relaxed uppercase tracking-wide">
                      {method === 'Bank Transfer' || method === 'Credit Card' 
                        ? 'Administrative verification is required for fiat settlements. Your balance will update upon successful node confirmation.' 
                        : 'Crypto settlements are processed instantly after on-chain verification.'}
                    </p>
                  </div>

                  <button 
                    onClick={handleAction}
                    className={`w-full py-6 rounded-[32px] font-black text-lg transition-all shadow-xl active:scale-95 uppercase tracking-widest ${
                      isWithdraw ? 'bg-slate-900 dark:bg-white text-white dark:text-black hover:opacity-90' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-900/40'
                    }`}
                  >
                    Confirm {isWithdraw ? 'Outflow' : 'Deposit'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Security Vault: Linked Addresses */}
          <div className="bg-white dark:bg-brand-darkSecondary border border-slate-200/60 dark:border-gray-800 p-8 md:p-10 rounded-[48px] shadow-sm space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-600/10 rounded-2xl">
                    <ShieldCheck className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black uppercase tracking-tighter text-slate-900 dark:text-white leading-none">Security Vault</h3>
                    <p className="text-[10px] text-slate-500 dark:text-gray-500 font-bold uppercase tracking-widest mt-1">Managed destination addresses</p>
                  </div>
                </div>
              <button 
                onClick={() => setIsAddingWallet(true)}
                className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg active:scale-90"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {isAddingWallet && (
              <div className="p-6 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/5 rounded-[32px] space-y-4 animate-in slide-in-from-top-4 duration-300">
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1.5">
                     <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Asset Class</label>
                     <select 
                      value={newWallet.type}
                      onChange={(e) => setNewWallet({...newWallet, type: e.target.value})}
                      className="w-full bg-white dark:bg-black/20 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 dark:text-white outline-none focus:border-blue-600"
                     >
                       <option value="BTC">Bitcoin (BTC)</option>
                       <option value="ETH">Ethereum (ETH)</option>
                       <option value="USDT">Tether (USDT)</option>
                       <option value="BNB">Binance (BNB)</option>
                     </select>
                   </div>
                   <div className="space-y-1.5">
                     <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Custom Label</label>
                     <input 
                      placeholder="e.g. Cold Storage"
                      value={newWallet.label}
                      onChange={(e) => setNewWallet({...newWallet, label: e.target.value})}
                      className="w-full bg-white dark:bg-black/20 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 dark:text-white outline-none focus:border-blue-600"
                     />
                   </div>
                </div>
                <div className="space-y-1.5">
                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Destination Address</label>
                   <input 
                    placeholder="Enter full wallet address..."
                    value={newWallet.address}
                    onChange={(e) => setNewWallet({...newWallet, address: e.target.value})}
                    className="w-full bg-white dark:bg-black/20 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-3 text-sm font-mono font-bold text-slate-700 dark:text-white outline-none focus:border-blue-600"
                   />
                </div>
                <div className="flex gap-3">
                   <button 
                    onClick={() => setIsAddingWallet(false)}
                    className="flex-1 py-3 bg-slate-200 dark:bg-white/5 text-slate-500 rounded-xl font-black text-[10px] uppercase tracking-widest"
                   >
                     Cancel
                   </button>
                   <button 
                    onClick={handleAddWallet}
                    className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-900/20"
                   >
                     Secure Link
                   </button>
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              {linkedWallets.length === 0 ? (
                <div className="col-span-2 p-12 border-2 border-dashed border-slate-200 dark:border-gray-800 rounded-[32px] text-center">
                  <QrCode className="w-12 h-12 text-slate-200 dark:text-gray-800 mx-auto mb-4" />
                  <p className="text-xs text-slate-400 font-black uppercase tracking-widest">No verified destinations linked.</p>
                </div>
              ) : (
                linkedWallets.map(wallet => (
                  <div key={wallet.id} className="p-6 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/5 rounded-[32px] group hover:border-blue-500/50 transition-all relative">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-white dark:bg-white/5 rounded-xl text-blue-600 shadow-sm">
                          <Coins className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{wallet.label}</h4>
                          <span className="text-[9px] font-black text-blue-600 dark:text-blue-500 uppercase tracking-widest">{wallet.type} NETWORK</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => removeWallet(wallet.id)}
                        className="p-2 text-slate-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="bg-white dark:bg-black/20 rounded-xl px-4 py-3 flex items-center justify-between gap-2 border border-slate-100 dark:border-white/5">
                      <code className="text-[10px] font-mono font-bold text-slate-500 dark:text-gray-400 truncate flex-1">
                        {wallet.address}
                      </code>
                      <button 
                        onClick={() => copyToClipboard(wallet.address)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Cards */}
        <div className="space-y-8">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-900 p-10 rounded-[48px] text-white flex flex-col justify-between shadow-2xl relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 blur-[60px] rounded-full group-hover:scale-125 transition-transform duration-1000" />
            <div className="relative">
              <p className="text-blue-100/60 text-[9px] font-black uppercase tracking-[0.3em] mb-4">Total Liquidity</p>
              <h2 className="text-3xl md:text-4xl font-black font-mono tracking-tighter leading-none">${currentUser?.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h2>
            </div>
            <div className="space-y-4 relative mt-12">
              <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/10 flex justify-between items-center">
                 <span className="text-[9px] text-blue-100/60 font-black uppercase tracking-widest">Inflow History</span>
                 <span className="text-lg font-black font-mono">${currentUser?.totalInvested.toLocaleString()}</span>
              </div>
              <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/10 flex justify-between items-center">
                 <span className="text-[9px] text-blue-100/60 font-black uppercase tracking-widest">Settled Outflow</span>
                 <span className="text-lg font-black font-mono">${currentUser?.totalWithdrawn.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-brand-darkSecondary border border-slate-200/60 dark:border-gray-800 p-8 rounded-[40px] shadow-sm flex flex-col items-center text-center">
             <div className="w-16 h-16 bg-blue-600/10 rounded-[20px] flex items-center justify-center text-blue-600 mb-6">
                <ExternalLink className="w-8 h-8" />
             </div>
             <h4 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">Network Security</h4>
             <p className="text-xs text-slate-500 dark:text-gray-500 font-bold leading-relaxed mb-6">All linked addresses undergo a micro-auth check before first use to prevent hijacking.</p>
             <div className="flex gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <div className="w-2 h-2 rounded-full bg-slate-200 dark:bg-gray-800" />
             </div>
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white dark:bg-brand-darkSecondary border border-slate-200/60 dark:border-gray-800 rounded-[48px] overflow-hidden shadow-sm">
        <div className="p-8 md:p-10 border-b border-slate-100 dark:border-gray-800 flex justify-between items-center bg-slate-50/50 dark:bg-brand-darkSecondary/50">
          <h3 className="text-xl font-black uppercase tracking-tighter text-slate-900 dark:text-white">Protocol Ledger</h3>
          <span className="px-3 py-1.5 bg-white dark:bg-white/10 rounded-full text-[9px] font-black text-slate-500 dark:text-gray-500 uppercase tracking-widest border border-slate-200 dark:border-transparent shadow-sm">Live Feed</span>
        </div>
        <div className="overflow-x-auto no-scrollbar">
           {userTransactions.length === 0 ? (
             <div className="p-24 text-center text-slate-400 dark:text-gray-600 font-black uppercase tracking-widest text-xs">No active node data found.</div>
           ) : (
             <table className="w-full text-left">
               <thead className="bg-slate-50 dark:bg-brand-darkSecondary/80 text-[10px] font-black text-slate-400 dark:text-gray-500 uppercase tracking-[0.2em]">
                 <tr>
                    <th className="px-8 py-5">Node Date</th>
                    <th className="px-8 py-5">Protocol</th>
                    <th className="px-8 py-5">Volume</th>
                    <th className="px-8 py-5">Settlement</th>
                    <th className="px-8 py-5">Clearance</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100 dark:divide-gray-800/50">
                 {userTransactions.map(tx => (
                    <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors group">
                      <td className="px-8 py-6 whitespace-nowrap">
                         <div className="flex flex-col">
                            <span className="text-slate-900 dark:text-white font-black text-sm">{new Date(tx.date).toLocaleDateString()}</span>
                            <span className="text-[10px] text-slate-400 dark:text-gray-600 font-mono">#{tx.id.toUpperCase()}</span>
                         </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`text-[9px] font-black px-3 py-1.5 rounded-lg border ${
                          tx.type === TransactionType.PROFIT ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' :
                          tx.type === TransactionType.WITHDRAWAL ? 'bg-rose-500/10 text-rose-600 border-rose-500/20' : 'bg-blue-500/10 text-blue-600 border-blue-500/20'
                        }`}>
                          {tx.type}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                         <span className={`text-lg font-black font-mono ${tx.type === TransactionType.WITHDRAWAL ? 'text-rose-600 dark:text-rose-500' : 'text-emerald-600 dark:text-emerald-500'}`}>
                           {tx.type === TransactionType.WITHDRAWAL ? '-' : '+'}${tx.amount.toLocaleString()}
                         </span>
                      </td>
                      <td className="px-8 py-6 text-xs text-slate-500 dark:text-gray-500 font-black uppercase tracking-widest whitespace-nowrap">{tx.method || 'System'}</td>
                      <td className="px-8 py-6">
                        <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border flex items-center gap-2 w-fit ${
                          tx.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' :
                          tx.status === 'PENDING' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' : 'bg-rose-500/10 text-rose-600 border-rose-500/20'
                        }`}>
                          {tx.status === 'COMPLETED' ? <CheckCircle2 className="w-3 h-3" /> : 
                           tx.status === 'PENDING' ? <Clock className="w-3 h-3 animate-pulse" /> : <XCircle className="w-3 h-3" />}
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
  );
};
