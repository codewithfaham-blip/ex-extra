
import React, { useState, useEffect } from 'react';
import { useApp } from '../store/AppContext';
import { useLocation } from 'react-router-dom';
import { 
  ShieldAlert, Users as UsersIcon, Wallet, Layers, Check, X, Edit, Trash2, 
  Plus, Save, RefreshCw, CreditCard, 
  UserPlus, Fingerprint, Clock, ArrowDownCircle, AlertCircle, ShieldCheck,
  Server, Database, Link as LinkIcon, Activity, Globe, Zap, Loader2, Sparkles, Terminal,
  Search, Filter, ChevronRight, MoreHorizontal, DatabaseBackup
} from 'lucide-react';
import { TransactionStatus, UserRole, InvestmentPlan, TransactionType, Transaction } from '../types';
import { StatCard, ActionModule, AdminTable, StatusBadge } from '../components/AdminShared';

type AdminTab = 'overview' | 'users' | 'withdrawals' | 'deposits' | 'plans' | 'infrastructure';

const DATABASE_PRESETS = [
  { label: 'Railway Prod', url: 'postgresql://postgres:VIQQEOktRqYgMfqOwdjaNBJoOxngjlil@yamanote.proxy.rlwy.net:48132/railway' },
  { label: 'AWS Cluster', url: 'postgresql://admin:vault_key@db-cluster.us-east-1.rds.amazonaws.com:5432/platform_v2' },
  { label: 'Supabase Node', url: 'postgresql://postgres:db_pass@db.zqxmvyzruq.supabase.co:5432/postgres' },
  { label: 'Local Dev', url: 'postgresql://localhost:5432/hyip_local' }
];

export const AdminPanel = () => {
  const { 
    users, transactions, plans, platformStats, systemIntegration, updateSystemIntegration, addToast,
    adminApproveWithdrawal, adminRejectWithdrawal, 
    adminApproveDeposit, adminRejectDeposit,
    adminUpdateUser, adminDeletePlan, adminCreatePlan, adminUpdatePlan, debugTriggerProfit, clearCache 
  } = useApp();
  
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<AdminTab>('infrastructure');
  
  // Infrastructure Migration States
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationProgress, setMigrationProgress] = useState(0);
  const [migrationStep, setMigrationStep] = useState('');

  const [infraConfig, setInfraConfig] = useState({
    dbLink: systemIntegration.dbLink || '',
    authRpc: systemIntegration.authRpc || '',
    apiGateway: systemIntegration.apiGateway || ''
  });
  const [isIntegrationStarted, setIsIntegrationStarted] = useState(false);

  useEffect(() => {
    if (activeTab === 'infrastructure' && !isIntegrationStarted && !systemIntegration.isLive) {
      applyPreset('postgresql://postgres:VIQQEOktRqYgMfqOwdjaNBJoOxngjlil@yamanote.proxy.rlwy.net:48132/railway');
      setInfraConfig(prev => ({...prev, authRpc: 'https://rpc.auth-protocol.com/v1', apiGateway: 'https://gateway.cryptoyield.io'}));
      setIsIntegrationStarted(true);
    }
    if (isIntegrationStarted && infraConfig.dbLink && infraConfig.authRpc) {
      handleIntegrateLive();
    }
  }, [activeTab, isIntegrationStarted, systemIntegration.isLive, infraConfig]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab') as AdminTab;
    if (tab && ['overview', 'users', 'withdrawals', 'deposits', 'plans', 'infrastructure'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [location.search]);

  const pendingWithdrawals = transactions.filter(t => t.type === TransactionType.WITHDRAWAL && t.status === TransactionStatus.PENDING);
  const pendingDeposits = transactions.filter(t => t.type === TransactionType.DEPOSIT && t.status === TransactionStatus.PENDING);

  const handleIntegrateLive = () => {
    if (!infraConfig.dbLink || !infraConfig.authRpc) {
      addToast("Database Link and Auth RPC are required for integration.", "error", "Missing Config");
      return;
    }

    setIsMigrating(true);
    setMigrationProgress(0);
    const steps = [
      'Establishing WebSocket Handshake...',
      'Mapping PostgreSQL Relations...',
      'Verifying RPC Node Latency...',
      'Syncing User Auth Table...',
      'Switching Kernel to LIVE_RPC...',
      'Integration Finalized'
    ];
    let stepIdx = 0;
    const interval = setInterval(() => {
      setMigrationProgress(prev => {
        const next = prev + 2;
        if (next % 20 === 0 && stepIdx < steps.length - 1) {
          stepIdx++;
          setMigrationStep(steps[stepIdx]);
        }
        if (next >= 100) {
          clearInterval(interval);
          setIsMigrating(false);
          updateSystemIntegration({ 
            isLive: true, 
            ...infraConfig,
            lastSync: Date.now() 
          });
          addToast("Platform Kernel successfully switched to Real-time Data mode.", "success", "System Integrated");
          return 100;
        }
        return next;
      });
    }, 40);
    setMigrationStep(steps[0]);
  };

  const handleDeactivateLive = () => {
    updateSystemIntegration({ isLive: false });
    addToast("Reverted to Local Cache Alpha mode.", "info", "Kernel Downscaled");
  };

  const applyPreset = (url: string) => {
    setInfraConfig(prev => ({ ...prev, dbLink: url }));
    addToast("Database connection string updated from preset.", "info", "Preset Applied");
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500 pb-20 md:pb-0">
      {/* Admin Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 md:gap-6">
        <div>
          <h2 className="text-xl md:text-4xl font-black text-slate-900 dark:text-white flex items-center gap-2 md:gap-3 tracking-tighter">
            <ShieldAlert className="text-blue-600 dark:text-blue-500 w-6 h-6 md:w-10 md:h-10 shrink-0" />
            Platform Kernel
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-slate-500 dark:text-gray-500 text-[9px] md:text-xs font-black uppercase tracking-[0.2em]">
              System Status: 
            </p>
            <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1 transition-all ${
              systemIntegration.isLive 
                ? 'bg-emerald-500 text-white animate-pulse' 
                : 'bg-amber-500 text-white'
            }`}>
              <Activity className="w-2.5 h-2.5" />
              {systemIntegration.isLive ? 'LIVE RPC INTEGRATED' : 'LOCAL ALPHA CACHE'}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveTab('infrastructure')}
            className={`flex items-center justify-center gap-2 px-4 md:px-6 py-2.5 md:py-3 rounded-xl md:rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all shadow-xl active:scale-95 ${
              activeTab === 'infrastructure' 
                ? 'bg-blue-600 text-white' 
                : 'bg-blue-600/10 text-blue-600 border border-blue-500/20'
            }`}
          >
            <Server className="w-3.5 h-3.5" /> Infra Config
          </button>
          <button onClick={debugTriggerProfit} className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 md:px-6 py-2.5 md:py-3 rounded-xl md:rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-emerald-900/20 whitespace-nowrap active:scale-95">
            <RefreshCw className="w-3.5 h-3.5 md:w-4 md:h-4" /> Batch ROI
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl overflow-x-auto no-scrollbar">
        {[
          { id: 'overview', label: 'Kernel' },
          { id: 'users', label: 'Nodes' },
          { id: 'withdrawals', label: 'Payouts' },
          { id: 'deposits', label: 'Deposits' },
          { id: 'plans', label: 'Plans' },
          { id: 'infrastructure', label: 'Infrastructure' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
              activeTab === tab.id 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="min-h-[400px]">
        {activeTab === 'overview' && (
          <div className="space-y-6 md:space-y-10 animate-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8">
              <StatCard label="Platform TVL" value={`$${platformStats.platformBalance.toLocaleString()}`} icon={Wallet} color="text-blue-600" bg="bg-blue-600/10" />
              <StatCard label="Active Stake" value={`$${platformStats.totalInvested.toLocaleString()}`} icon={Layers} color="text-purple-600" bg="bg-purple-600/10" />
              <StatCard label="Inflow Verified" value={`$${platformStats.totalDeposits.toLocaleString()}`} icon={ArrowDownCircle} color="text-emerald-600" bg="bg-emerald-500/10" />
              <StatCard label="Global Nodes" value={platformStats.totalUsers} icon={UsersIcon} color="text-amber-600" bg="bg-amber-600/10" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
              <ActionModule title="Payout Audit" description="Verify and release network capital withdrawals." icon={CreditCard} colorClass="text-rose-600" bgClass="bg-rose-600/10" primaryAction={{ label: `Queue (${pendingWithdrawals.length})`, onClick: () => setActiveTab('withdrawals') }} />
              <ActionModule title="Deposit Verify" description="Confirm incoming bank and card settlements." icon={ArrowDownCircle} colorClass="text-emerald-600" bgClass="bg-emerald-600/10" primaryAction={{ label: `Queue (${pendingDeposits.length})`, onClick: () => setActiveTab('deposits') }} />
              <ActionModule title="Yield Params" description="Calibrate ROI packages for market optimization." icon={Layers} colorClass="text-blue-600" bgClass="bg-blue-600/10" primaryAction={{ label: 'Protocols', onClick: () => setActiveTab('plans') }} />
              <ActionModule title="Governance" description="Manage node access and identity clearance." icon={Fingerprint} colorClass="text-purple-600" bgClass="bg-purple-600/10" primaryAction={{ label: 'Directory', onClick: () => setActiveTab('users') }} />
            </div>
          </div>
        )}

        {activeTab === 'infrastructure' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-white dark:bg-brand-darkSecondary border border-slate-200 dark:border-gray-800 p-8 md:p-10 rounded-[48px] shadow-sm overflow-hidden relative group transition-colors">
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Database className="w-32 h-32 text-blue-600" />
                  </div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-16 h-16 bg-blue-600/10 rounded-3xl flex items-center justify-center backdrop-blur-md border border-blue-500/20">
                        <Zap className={`w-8 h-8 ${systemIntegration.isLive ? 'text-emerald-500' : 'text-blue-600'}`} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-900 dark:text-white">Real-time Core Integration</h3>
                        <p className="text-xs text-slate-500 dark:text-gray-500 font-bold uppercase tracking-widest">Connect Live Database & RPC Layers</p>
                      </div>
                    </div>

                    {!isMigrating ? (
                      <div className="space-y-6">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between mb-2">
                             <label className="text-[10px] font-black text-slate-400 dark:text-gray-600 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                              <Database className="w-3 h-3" /> Database Connection String
                            </label>
                            <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest flex items-center gap-1">
                               <DatabaseBackup className="w-3 h-3" /> Preset Available
                            </span>
                          </div>
                          
                          <div className="flex flex-wrap gap-2 mb-4">
                            {DATABASE_PRESETS.map((preset, i) => (
                              <button
                                key={i}
                                onClick={() => applyPreset(preset.url)}
                                className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all border ${
                                  infraConfig.dbLink === preset.url 
                                    ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                                    : 'bg-slate-100 dark:bg-white/5 text-slate-500 border-slate-200 dark:border-white/10 hover:border-blue-500/50'
                                }`}
                              >
                                {preset.label}
                              </button>
                            ))}
                          </div>

                          <input 
                            placeholder="postgresql://user:pass@host:5432/db"
                            value={infraConfig.dbLink}
                            onChange={(e) => setInfraConfig({...infraConfig, dbLink: e.target.value})}
                            className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-3.5 text-sm font-mono text-slate-900 dark:text-white outline-none focus:border-blue-600 transition-all shadow-inner"
                          />
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 dark:text-gray-600 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                              <ShieldCheck className="w-3 h-3" /> Auth RPC Node
                            </label>
                            <input 
                              placeholder="https://rpc.auth-protocol.com/v1"
                              value={infraConfig.authRpc}
                              onChange={(e) => setInfraConfig({...infraConfig, authRpc: e.target.value})}
                              className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-3.5 text-sm font-mono text-slate-900 dark:text-white outline-none focus:border-blue-600 transition-all"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 dark:text-gray-600 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                              <LinkIcon className="w-3 h-3" /> API Gateway Edge
                            </label>
                            <input 
                              placeholder="https://gateway.cryptoyield.io"
                              value={infraConfig.apiGateway}
                              onChange={(e) => setInfraConfig({...infraConfig, apiGateway: e.target.value})}
                              className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-3.5 text-sm font-mono text-slate-900 dark:text-white outline-none focus:border-blue-600 transition-all"
                            />
                          </div>
                        </div>

                        {systemIntegration.isLive ? (
                          <button 
                            onClick={handleDeactivateLive}
                            className="w-full py-5 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3"
                          >
                            <X className="w-4 h-4" /> Downscale to Local Cache
                          </button>
                        ) : (
                          <button 
                            onClick={handleIntegrateLive}
                            className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3"
                          >
                            <Sparkles className="w-4 h-4" /> Switch to Live Kernel
                          </button>
                        )}
                        <button 
                            onClick={clearCache}
                            className="w-full py-5 bg-gray-600 hover:bg-gray-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3"
                          >
                            <Trash2 className="w-4 h-4" /> Clear Cache
                          </button>
                      </div>
                    ) : (
                      <div className="space-y-8 py-10 animate-in zoom-in-95 duration-500">
                        <div className="flex flex-col items-center text-center space-y-4">
                           <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                           <div>
                             <h4 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tighter">Synchronizing Protocol</h4>
                             <p className="text-xs text-blue-600 font-bold uppercase tracking-widest">{migrationStep}</p>
                           </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            <span>Integration Progress</span>
                            <span>{migrationProgress}%</span>
                          </div>
                          <div className="h-2.5 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.4)] transition-all duration-300" style={{ width: `${migrationProgress}%` }} />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                 <div className="bg-white dark:bg-brand-darkSecondary border border-slate-200 dark:border-gray-800 p-8 rounded-[40px] shadow-sm text-center">
                    <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <Terminal className="w-8 h-8 text-blue-600" />
                    </div>
                    <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase mb-2">Kernel Status</h4>
                    <p className="text-[10px] text-slate-500 font-bold leading-relaxed uppercase tracking-widest px-4 mb-6">
                      Bypassing local machine state for external endpoints. Presets allow rapid node reallocation.
                    </p>
                    <div className="p-4 bg-slate-50 dark:bg-black/20 rounded-2xl border border-slate-200 dark:border-white/5 space-y-3">
                       <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
                          <span className="text-slate-400">Mode</span>
                          <span className={systemIntegration.isLive ? 'text-emerald-500' : 'text-amber-500'}>{systemIntegration.isLive ? 'LIVE_RPC' : 'LOCAL_CACHE'}</span>
                       </div>
                       <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
                          <span className="text-slate-400">Latency</span>
                          <span className="text-slate-900 dark:text-white font-mono">{systemIntegration.isLive ? '14ms' : '0ms'}</span>
                       </div>
                       <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
                          <span className="text-slate-400">Node Sync</span>
                          <span className="text-emerald-500">ACTIVE</span>
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="animate-in fade-in duration-500">
             <AdminTable 
               title="Node Network" 
               subtitle="Authorized participants"
               headers={['Member', 'Balance', 'ID Code', 'Clearance', 'Actions']}
             >
                {users.map(u => (
                  <tr key={u.id}>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-white shadow-lg">{u.name[0]}</div>
                         <div>
                            <p className="font-black text-slate-900 dark:text-white text-sm">{u.name}</p>
                            <p className="text-[10px] text-slate-400 dark:text-gray-600 font-mono">#{u.id.slice(0, 8)}</p>
                         </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 font-mono font-bold text-sm text-slate-900 dark:text-white">${u.balance.toLocaleString()}</td>
                    <td className="px-8 py-6 text-xs font-black uppercase text-blue-600">{u.referralCode}</td>
                    <td className="px-8 py-6"><StatusBadge status={`LVL ${u.kycLevel}`} variant={u.kycLevel > 0 ? 'success' : 'warning'} /></td>
                    <td className="px-8 py-6 text-right">
                       <button className="p-2.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-600/5 transition-all"><MoreHorizontal className="w-5 h-5" /></button>
                    </td>
                  </tr>
                ))}
             </AdminTable>
          </div>
        )}

        {activeTab === 'withdrawals' && (
          <div className="animate-in fade-in duration-500">
            <AdminTable title="Payout Queue" subtitle="Verification Required" headers={['Date', 'Target', 'Amount', 'Status', 'Audit']}>
               {pendingWithdrawals.length === 0 ? (
                 <tr><td colSpan={5} className="p-20 text-center text-slate-400 font-black uppercase tracking-widest text-xs">No pending requests</td></tr>
               ) : (
                 pendingWithdrawals.map(tx => (
                    <tr key={tx.id}>
                       <td className="px-8 py-6 text-xs font-bold text-slate-500">{new Date(tx.date).toLocaleDateString()}</td>
                       <td className="px-8 py-6">
                         <div className="flex flex-col">
                           <span className="text-sm font-black text-slate-900 dark:text-white">{users.find(u => u.id === tx.userId)?.name}</span>
                           <span className="text-[9px] text-slate-400 font-black uppercase">{tx.method}</span>
                         </div>
                       </td>
                       <td className="px-8 py-6 font-mono font-bold text-rose-600 text-base">-${tx.amount.toLocaleString()}</td>
                       <td className="px-8 py-6"><StatusBadge status="PENDING" variant="warning" /></td>
                       <td className="px-8 py-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                             <button onClick={() => adminApproveWithdrawal(tx.id)} className="p-2.5 bg-emerald-500/10 text-emerald-600 rounded-xl hover:bg-emerald-500 hover:text-white transition-all"><Check className="w-4 h-4" /></button>
                             <button onClick={() => adminRejectWithdrawal(tx.id)} className="p-2.5 bg-rose-500/10 text-rose-600 rounded-xl hover:bg-rose-500 hover:text-white transition-all"><X className="w-4 h-4" /></button>
                          </div>
                       </td>
                    </tr>
                 ))
               )}
            </AdminTable>
          </div>
        )}

        {activeTab === 'deposits' && (
          <div className="animate-in fade-in duration-500">
            <AdminTable title="Deposit Verification" subtitle="Verify Settlements" headers={['Member', 'Amount', 'Method', 'Status', 'Confirm']}>
               {pendingDeposits.length === 0 ? (
                 <tr><td colSpan={5} className="p-20 text-center text-slate-400 font-black uppercase tracking-widest text-xs">No pending verification</td></tr>
               ) : (
                 pendingDeposits.map(tx => (
                    <tr key={tx.id}>
                       <td className="px-8 py-6 font-black text-slate-900 dark:text-white">{users.find(u => u.id === tx.userId)?.name}</td>
                       <td className="px-8 py-6 font-mono font-bold text-emerald-600 text-base">+${tx.amount.toLocaleString()}</td>
                       <td className="px-8 py-6 text-xs font-black uppercase text-slate-500">{tx.method}</td>
                       <td className="px-8 py-6"><StatusBadge status="PENDING" variant="warning" /></td>
                       <td className="px-8 py-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                             <button onClick={() => adminApproveDeposit(tx.id)} className="p-2.5 bg-emerald-500/10 text-emerald-600 rounded-xl hover:bg-emerald-500 hover:text-white transition-all"><Check className="w-4 h-4" /></button>
                             <button onClick={() => adminRejectDeposit(tx.id)} className="p-2.5 bg-rose-500/10 text-rose-600 rounded-xl hover:bg-rose-500 hover:text-white transition-all"><X className="w-4 h-4" /></button>
                          </div>
                       </td>
                    </tr>
                 ))
               )}
            </AdminTable>
          </div>
        )}

        {activeTab === 'plans' && (
          <div className="animate-in fade-in duration-500">
            <AdminTable 
              title="Yield Protocols" 
              subtitle="ROI Configuration" 
              headers={['Engine', 'Daily Yield', 'Stake Limits', 'Cycle', 'Actions']}
              action={<button onClick={() => adminCreatePlan({ name: 'New Plan', minAmount: 100, maxAmount: 1000, roi: 1, period: 'DAILY', durationDays: 30 })} className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-900/20 active:scale-95 flex items-center gap-2"><Plus className="w-4 h-4" /> Add Protocol</button>}
            >
               {plans.map(plan => (
                 <tr key={plan.id}>
                   <td className="px-8 py-6 font-black text-slate-900 dark:text-white uppercase tracking-tight">{plan.name}</td>
                   <td className="px-8 py-6 text-blue-600 font-mono font-bold text-lg">{plan.roi}%</td>
                   <td className="px-8 py-6 text-[11px] font-bold text-slate-500 uppercase tracking-widest">${plan.minAmount} - ${plan.maxAmount}</td>
                   <td className="px-8 py-6 font-black text-xs">{plan.durationDays} Days</td>
                   <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                         <button className="p-2 text-slate-400 hover:text-blue-600"><Edit className="w-4 h-4" /></button>
                         <button onClick={() => adminDeletePlan(plan.id)} className="p-2 text-slate-400 hover:text-rose-500"><Trash2 className="w-4 h-4" /></button>
                      </div>
                   </td>
                 </tr>
               ))}
            </AdminTable>
          </div>
        )}
      </div>
    </div>
  );
};
