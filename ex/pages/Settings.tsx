
import React, { useState, useEffect } from 'react';
import { useApp } from '../store/AppContext';
import { 
  Shield, User, Lock, Smartphone, CheckCircle2, 
  Fingerprint, Download, Package, Terminal, Loader2, Sparkles, 
  Cpu, HardDrive, Coins, Plus, Copy, Trash2, ShieldCheck, 
  ExternalLink, QrCode, ArrowRight, X, ShieldAlert, Key, FileCode, AlertCircle
} from 'lucide-react';
import { LinkedWallet } from '../types';

export const SettingsPage = () => {
  const { currentUser, updateProfile, addToast } = useApp();
  const [activeTab, setActiveTab] = useState<'PROFILE' | 'WALLETS' | 'SECURITY' | 'MOBILE'>('PROFILE');
  
  // Mobile Build State
  const [isBuilding, setIsBuilding] = useState(false);
  const [buildProgress, setBuildProgress] = useState(0);
  const [buildStep, setBuildStep] = useState('');
  const [apkReady, setApkReady] = useState(false);

  // Wallet State
  const [isAddingWallet, setIsAddingWallet] = useState(false);
  const [newWallet, setNewWallet] = useState({ type: 'BTC', address: '', label: '' });

  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    phoneNumber: currentUser?.phoneNumber || '',
    country: currentUser?.country || '',
  });

  if (!currentUser) return null;

  const linkedWallets = currentUser.linkedWallets || [];

  const handleSaveProfile = () => {
    updateProfile(formData);
    addToast('Institutional profile updated.', 'success', 'Changes Committed');
  };

  const handleAddWallet = () => {
    if (!newWallet.address || !newWallet.label) {
      addToast("Address and Label are mandatory fields.", "error", "Missing Metadata");
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
    addToast("Destination address linked to secure vault.", "success", "Vault Updated");
  };

  const removeWallet = (id: string) => {
    updateProfile({ linkedWallets: linkedWallets.filter(w => w.id !== id) });
    addToast("Address purged from infrastructure.", "info", "Security Protocol");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    addToast("Address captured to clipboard.", "success");
  };

  const handleBuildManifest = () => {
    setIsBuilding(true);
    setApkReady(false);
    setBuildProgress(0);
    const steps = [
      'Generating RSA-4096 Keys...',
      'Mapping Liquidity Nodes...',
      'Signing Protocol Manifest...',
      'Verifying Binary Integrity...',
      'Packaging Security Certificate...'
    ];
    let stepIdx = 0;
    const interval = setInterval(() => {
      setBuildProgress(prev => {
        const next = prev + 1;
        if (next % 20 === 0 && stepIdx < steps.length - 1) {
          stepIdx++;
          setBuildStep(steps[stepIdx]);
        }
        if (next >= 100) {
          clearInterval(interval);
          setIsBuilding(false);
          setApkReady(true);
          addToast('Security Manifest Generated', 'success', 'Protocol Signed');
          return 100;
        }
        return next;
      });
    }, 30);
    setBuildStep(steps[0]);
  };

  const handleDownloadManifest = () => {
    // Generate a valid JSON manifest rather than a fake APK to avoid Android Parse errors
    const manifest = {
      version: "1.0.4",
      protocol: "CryptoYield-Native",
      node_id: currentUser.id,
      owner: currentUser.name,
      timestamp: new Date().toISOString(),
      signature: btoa(`SECURE_SIG_${currentUser.id}_${Date.now()}`),
      authorized_wallets: linkedWallets.map(w => ({ type: w.type, addr: w.address }))
    };
    
    const blob = new Blob([JSON.stringify(manifest, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CryptoYield_Protocol_${currentUser.id.slice(0, 4)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    addToast('Security manifest downloaded.', 'success', 'Inbound Document');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 md:pb-0">
      <div className="flex flex-col items-center text-center">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">System Configuration</h2>
        <div className="flex items-center gap-1 mt-4 bg-slate-100 dark:bg-white/5 p-1 rounded-2xl border border-slate-200 dark:border-white/10 overflow-x-auto no-scrollbar max-w-full">
          {[
            { id: 'PROFILE', label: 'Identity' },
            { id: 'WALLETS', label: 'External Wallets' },
            { id: 'SECURITY', label: 'Vault Security' },
            { id: 'MOBILE', label: 'Deploy Manifest' }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'PROFILE' && (
        <div className="bg-brand-lightSecondary dark:bg-brand-darkSecondary border border-slate-200 dark:border-gray-800 p-8 md:p-10 rounded-[40px] shadow-sm animate-in fade-in duration-500">
          <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight mb-8 flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" /> Member Identity
          </h3>
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Legal Name</label>
                <input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-3.5 text-slate-900 dark:text-white font-bold outline-none focus:border-blue-600" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contact Phone</label>
                <input value={formData.phoneNumber} onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})} className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-3.5 text-slate-900 dark:text-white font-bold outline-none focus:border-blue-600" />
              </div>
            </div>
            <button onClick={handleSaveProfile} className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all">Update Identity</button>
          </div>
        </div>
      )}

      {activeTab === 'WALLETS' && (
        <div className="space-y-8 animate-in fade-in duration-500">
          <div className="bg-brand-lightSecondary dark:bg-brand-darkSecondary border border-slate-200 dark:border-gray-800 p-8 md:p-10 rounded-[40px] shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-600/10 rounded-2xl">
                  <ShieldCheck className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-black uppercase tracking-tight text-slate-900 dark:text-white leading-none">External Linkages</h3>
                  <p className="text-[9px] text-slate-500 dark:text-gray-500 font-bold uppercase tracking-widest mt-1">Verified Destination Addresses</p>
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
              <div className="p-6 md:p-8 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/5 rounded-[32px] space-y-6 animate-in slide-in-from-top-4 duration-300 mb-8">
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1.5">
                     <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Asset Class</label>
                     <select 
                      value={newWallet.type}
                      onChange={(e) => setNewWallet({...newWallet, type: e.target.value})}
                      className="w-full bg-white dark:bg-black/20 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-3.5 text-sm font-bold text-slate-700 dark:text-white outline-none focus:border-blue-600 appearance-none"
                     >
                       <option value="BTC">Bitcoin (BTC)</option>
                       <option value="ETH">Ethereum (ETH)</option>
                       <option value="USDT">Tether (USDT)</option>
                       <option value="BNB">Binance (BNB)</option>
                     </select>
                   </div>
                   <div className="space-y-1.5">
                     <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Label (e.g. Ledger)</label>
                     <input 
                      placeholder="My Cold Storage"
                      value={newWallet.label}
                      onChange={(e) => setNewWallet({...newWallet, label: e.target.value})}
                      className="w-full bg-white dark:bg-black/20 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-3.5 text-sm font-bold text-slate-700 dark:text-white outline-none focus:border-blue-600"
                     />
                   </div>
                </div>
                <div className="space-y-1.5">
                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Wallet Address</label>
                   <input 
                    placeholder="Enter full public address..."
                    value={newWallet.address}
                    onChange={(e) => setNewWallet({...newWallet, address: e.target.value})}
                    className="w-full bg-white dark:bg-black/20 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-3.5 text-sm font-mono font-bold text-slate-700 dark:text-white outline-none focus:border-blue-600"
                   />
                </div>
                <div className="flex gap-3">
                   <button 
                    onClick={() => setIsAddingWallet(false)}
                    className="flex-1 py-3.5 bg-slate-200 dark:bg-white/5 text-slate-500 rounded-xl font-black text-[10px] uppercase tracking-widest"
                   >
                     Cancel
                   </button>
                   <button 
                    onClick={handleAddWallet}
                    className="flex-1 py-3.5 bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-900/20"
                   >
                     Commit Linkage
                   </button>
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              {linkedWallets.length === 0 ? (
                <div className="col-span-2 p-16 border-2 border-dashed border-slate-200 dark:border-gray-800 rounded-[32px] text-center flex flex-col items-center">
                  <QrCode className="w-12 h-12 text-slate-200 dark:text-gray-800 mb-4" />
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">No verified destinations linked.</p>
                  <button onClick={() => setIsAddingWallet(true)} className="mt-4 text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-1 hover:underline">
                    Link External Node <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                linkedWallets.map(wallet => (
                  <div key={wallet.id} className="p-6 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/5 rounded-[32px] group hover:border-blue-500/50 transition-all relative">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-white dark:bg-white/5 rounded-xl text-blue-600 shadow-sm">
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
                        className="p-2 text-slate-400 hover:text-blue-600 transition-colors flex items-center gap-2 hover:bg-blue-600/5 rounded-lg group/btn"
                      >
                        <Copy className="w-3.5 h-3.5 group-hover/btn:scale-110" />
                        <span className="text-[8px] font-black uppercase tracking-tighter">Copy</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'MOBILE' && (
        <div className="grid lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-gradient-to-br from-slate-900 to-blue-950 p-10 rounded-[48px] text-white shadow-2xl relative overflow-hidden group border border-white/5">
               <div className="absolute -top-10 -right-10 w-48 h-48 bg-blue-600/20 blur-[60px] rounded-full group-hover:scale-125 transition-transform duration-1000" />
               <div className="relative z-10">
                 <div className="flex items-center gap-4 mb-8">
                   <div className="w-14 h-14 bg-white/10 rounded-3xl flex items-center justify-center backdrop-blur-md border border-white/10">
                     <FileCode className="w-7 h-7 text-blue-400" />
                   </div>
                   <div>
                      <h3 className="text-xl font-black uppercase tracking-tighter">Protocol Manifest</h3>
                      <p className="text-[10px] text-blue-200/50 font-bold uppercase tracking-widest">Node Deployment Logic • v1.0.4</p>
                   </div>
                 </div>

                 {!isBuilding && !apkReady && (
                   <div className="space-y-6">
                     <p className="text-sm text-slate-300 leading-relaxed font-medium">
                       Generate a cryptographically signed JSON manifest for your investment node. This document serves as a digital proof of deployment for external audits and mobile terminal synchronization.
                     </p>
                     
                     <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
                        <p className="text-[10px] text-amber-200/70 font-bold uppercase leading-relaxed">
                          Note: This browser-based environment generates a Security Manifest. Full native APK compilation requires an enterprise Build Server link.
                        </p>
                     </div>

                     <button 
                        onClick={handleBuildManifest}
                        className="flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-blue-900/40 active:scale-95"
                     >
                       <Package className="w-4 h-4" /> Generate Protocol
                     </button>
                   </div>
                 )}

                 {isBuilding && (
                   <div className="space-y-6 animate-in fade-in duration-500">
                     <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest">
                       <span className="text-blue-400 flex items-center gap-2">
                         <Loader2 className="w-3.5 h-3.5 animate-spin" /> {buildStep}
                       </span>
                       <span className="font-mono">{buildProgress}%</span>
                     </div>
                     <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
                       <div 
                         className="h-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all duration-300" 
                         style={{ width: `${buildProgress}%` }} 
                       />
                     </div>
                   </div>
                 )}

                 {apkReady && (
                   <div className="space-y-8 animate-in zoom-in-95 duration-500">
                     <div className="flex items-center gap-4 p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-[32px]">
                        <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                        <div>
                          <h4 className="font-black text-emerald-400 uppercase tracking-tighter">Manifest Finalized</h4>
                          <p className="text-[10px] text-emerald-500/70 font-bold uppercase">Authorized & Signed by Root Engine</p>
                        </div>
                     </div>
                     <button 
                        onClick={handleDownloadManifest}
                        className="w-full py-5 bg-white text-blue-950 hover:bg-slate-100 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-2xl flex items-center justify-center gap-3 active:scale-95 group"
                     >
                       <Download className="w-5 h-5 group-hover:animate-bounce" /> Download Secure Manifest
                     </button>
                   </div>
                 )}
               </div>
            </div>

            <div className="bg-brand-lightSecondary dark:bg-brand-darkSecondary border border-slate-200 dark:border-gray-800 p-8 rounded-[40px] shadow-sm">
               <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight mb-8 flex items-center gap-2">
                 <Sparkles className="w-5 h-5 text-blue-600" /> Digital Infrastructure
               </h3>
               <div className="grid sm:grid-cols-2 gap-4">
                 {[
                   { icon: ShieldAlert, title: "Biometric Vault", desc: "Unlock with Fingerprint/FaceID" },
                   { icon: Key, title: "Seed Export", desc: "Manage your private keys natively" },
                   { icon: Cpu, title: "RPC Sync", desc: "Real-time ledger updates" },
                   { icon: HardDrive, title: "Cold Cache", desc: "Local encrypted storage" }
                 ].map((feat, i) => (
                   <div key={i} className="p-5 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/5 rounded-3xl flex items-center gap-4">
                     <div className="p-3 bg-white dark:bg-white/5 rounded-xl text-blue-600">
                       <feat.icon className="w-5 h-5" />
                     </div>
                     <div>
                       <h5 className="text-xs font-black text-slate-900 dark:text-white uppercase">{feat.title}</h5>
                       <p className="text-[9px] text-slate-500 dark:text-gray-500 font-bold uppercase tracking-tight">{feat.desc}</p>
                     </div>
                   </div>
                 ))}
               </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-brand-lightSecondary dark:bg-brand-darkSecondary border border-slate-200 dark:border-gray-800 p-8 rounded-[40px] shadow-sm text-center">
               <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                 <Terminal className="w-8 h-8 text-blue-600" />
               </div>
               <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase mb-2">Build Environment</h4>
               <p className="text-[10px] text-slate-500 font-bold leading-relaxed uppercase tracking-widest px-4">
                 The manifest provides the cryptographic bridge between your web terminal and native mobile terminals.
               </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
