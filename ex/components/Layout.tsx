
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import { 
  LayoutDashboard, Wallet, Users, ShieldCheck, TrendingUp, 
  LogOut as LogOutIcon, Menu, X, LayoutGrid, CreditCard, Layers, Settings as SettingsIcon,
  ShieldAlert, Sun, Moon, Home, HelpCircle, LifeBuoy, User, Activity, Zap
} from 'lucide-react';
import { UserRole } from '../types';
import { ToastContainer } from './ToastContainer';
import { AIAgent } from './AIAgent';

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, logout, theme, toggleTheme, systemIntegration } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  if (!currentUser) return null;

  const isAdmin = currentUser.role === UserRole.ADMIN;
  const currentTab = new URLSearchParams(location.search).get('tab') || 'overview';

  const userNavigation: { name: string; icon: any; path: string; id?: string }[] = [
    { name: 'Home', icon: Home, path: '/dashboard' },
    { name: 'Invest', icon: TrendingUp, path: '/invest' },
    { name: 'Wallets', icon: Wallet, path: '/transactions' },
    { name: 'Network', icon: Users, path: '/referrals' },
    { name: 'Support', icon: LifeBuoy, path: '/support' },
    { name: 'Security', icon: SettingsIcon, path: '/settings' },
  ];

  const adminNavigation: { name: string; icon: any; path: string; id?: string }[] = [
    { name: 'Kernel', icon: LayoutGrid, path: '/admin?tab=overview', id: 'overview' },
    { name: 'Payouts', icon: CreditCard, path: '/admin?tab=withdrawals', id: 'withdrawals' },
    { name: 'Nodes', icon: Users, path: '/admin?tab=users', id: 'users' },
    { name: 'Engine', icon: Layers, path: '/admin?tab=plans', id: 'plans' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path.split('?')[0];
  const isAdminTabActive = (tabId: string) => location.pathname === '/admin' && currentTab === tabId;

  const BottomNav = () => {
    const navItems = isAdmin 
      ? adminNavigation 
      : [
          userNavigation[0], // Home
          userNavigation[1], // Invest
          userNavigation[2], // Wallets
          userNavigation[3], // Network
          { name: 'Profile', icon: User, path: '/settings' } // Profile
        ];
    
    return (
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-[40]">
        <div className="bg-white/95 dark:bg-brand-dark/95 backdrop-blur-3xl border-t border-slate-200/60 dark:border-white/5 px-2 pb-safe shadow-premium-light dark:shadow-premium-dark transition-all duration-300">
          <div className="flex items-center justify-around h-20">
            {navItems.map((item) => {
              const active = isAdmin ? isAdminTabActive(item.id!) : isActive(item.path);
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex-1 flex flex-col items-center justify-center gap-1.5 h-full transition-all duration-300 relative ${
                    active 
                      ? 'text-blue-600 dark:text-blue-500' 
                      : 'text-slate-400 dark:text-gray-500 hover:text-slate-600 dark:hover:text-gray-300'
                  }`}
                >
                  {active && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-1 bg-blue-600 dark:bg-blue-500 rounded-b-full shadow-[0_2px_12px_rgba(37,99,235,0.3)] animate-in fade-in slide-in-from-top-1" />
                  )}
                  
                  <div className={`p-2.5 rounded-2xl transition-all duration-500 flex items-center justify-center ${
                    active ? 'bg-blue-600/10 dark:bg-blue-500/10' : 'bg-transparent'
                  }`}>
                    <item.icon className={`w-5 h-5 ${active ? 'stroke-[2.5px]' : 'stroke-[2px]'}`} />
                  </div>
                  
                  <span className={`text-[9px] font-black uppercase tracking-widest transition-opacity duration-300 ${
                    active ? 'opacity-100' : 'opacity-60'
                  }`}>
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const ControlCluster = () => (
    <div className={`flex items-center gap-1 p-1 rounded-2xl border transition-all duration-300 ${
      isAdmin 
        ? 'bg-blue-600/10 border-blue-500/30 shadow-[0_0_15px_rgba(37,99,235,0.1)]' 
        : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 shadow-sm'
    }`}>
      <div className="flex items-center">
        <button 
          className="text-slate-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-white transition-all p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 md:hidden active:scale-95" 
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="w-6 h-6" />
        </button>

        <button 
          onClick={() => setIsCollapsed(!isCollapsed)} 
          className="hidden md:flex p-2.5 text-slate-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-white transition-all rounded-xl hover:bg-slate-50 dark:hover:bg-white/5"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      <div className={`w-px h-4 mx-1 ${isAdmin ? 'bg-blue-500/20' : 'bg-slate-200 dark:bg-white/10'}`} />
      
      <button 
        onClick={toggleTheme} 
        className="p-2.5 text-slate-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-white transition-all rounded-xl hover:bg-slate-50 dark:hover:bg-white/5"
      >
        {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-brand-light dark:bg-brand-dark flex flex-col md:flex-row transition-all duration-500">
      <ToastContainer />
      {!isAdmin && <AIAgent />}
      <BottomNav />
      
      {sidebarOpen && <div className="fixed inset-0 bg-black/40 dark:bg-black/60 z-40 md:hidden backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />}
      
      <div className={`fixed inset-y-0 left-0 bg-white dark:bg-brand-darkSecondary border-r border-slate-200/60 dark:border-gray-800 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-all duration-300 z-50 flex flex-col ${isCollapsed ? 'md:w-20' : 'md:w-64'} w-72 shadow-premium-light md:shadow-none`}>
        <div className={`p-6 ${isCollapsed ? 'md:px-4' : ''} flex-1 overflow-y-auto no-scrollbar`}>
          <div className="flex items-center justify-between mb-10">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-xl shadow-lg shadow-blue-500/20 text-white flex-shrink-0">C</div>
              {!isCollapsed && <span className="font-black text-lg tracking-tighter text-slate-900 dark:text-white uppercase">Crypto<span className="text-blue-500">Yield</span></span>}
            </Link>
            <button className="md:hidden text-slate-400 hover:text-slate-900 dark:hover:text-white" onClick={() => setSidebarOpen(false)}><X className="w-6 h-6" /></button>
          </div>
          
          <nav className="space-y-6">
            {!isAdmin ? (
              <div className="space-y-1">
                <p className={`text-[10px] font-black text-slate-400 dark:text-gray-600 uppercase tracking-[0.2em] mb-4 ml-4 ${isCollapsed ? 'md:hidden' : ''}`}>Navigation</p>
                {userNavigation.map((item) => (
                  <Link key={item.name} to={item.path} onClick={() => setSidebarOpen(false)} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group relative ${isActive(item.path) ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5 border border-transparent'} ${isCollapsed ? 'md:justify-center md:px-0' : ''}`}>
                    <item.icon className={`w-5 h-5 flex-shrink-0`} />
                    {!isCollapsed && <span className="font-bold text-sm">{item.name}</span>}
                  </Link>
                ))}
              </div>
            ) : (
              <div className="space-y-1">
                <p className={`text-[10px] font-black text-blue-500/60 uppercase tracking-[0.2em] mb-4 ml-4 flex items-center gap-2 ${isCollapsed ? 'md:hidden' : ''}`}><ShieldAlert className="w-3 h-3" /> Admin Ops</p>
                {adminNavigation.map((item) => (
                  <Link key={item.name} to={item.path} onClick={() => setSidebarOpen(false)} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group relative ${isAdminTabActive(item.id!) ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/30' : 'text-slate-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5 border border-transparent'} ${isCollapsed ? 'md:justify-center md:px-0' : ''}`}>
                    <item.icon className={`w-5 h-5 flex-shrink-0`} />
                    {!isCollapsed && <span className="font-bold text-sm">{item.name}</span>}
                  </Link>
                ))}
              </div>
            )}
          </nav>
        </div>

        <div className={`mt-auto p-6 border-t border-slate-200 dark:border-gray-800 ${isCollapsed ? 'md:px-4' : ''}`}>
           <button onClick={handleLogout} className={`w-full flex items-center gap-3 px-4 py-3 text-slate-400 dark:text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all ${isCollapsed ? 'justify-center px-0' : ''}`}>
              <LogOutIcon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span className="font-bold text-sm">Sign Out</span>}
           </button>
        </div>
      </div>

      <div className={`flex-1 transition-all duration-300 ${isCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
        <header className="h-20 bg-white/80 dark:bg-brand-dark/80 backdrop-blur-xl sticky top-0 border-b border-slate-200 dark:border-gray-800 px-6 flex items-center justify-between z-30 transition-all duration-500">
          <div className="flex items-center gap-4">
            <ControlCluster />
            <div className="hidden sm:block ml-2">
              <h2 className="text-sm font-black text-slate-900 dark:text-white truncate">{isAdmin ? 'ROOT KERNEL: ' : 'NODE: '} {currentUser.name}</h2>
              <div className="flex items-center gap-2">
                <p className="text-[9px] text-slate-500 dark:text-gray-500 uppercase font-black tracking-[0.2em]">{isAdmin ? 'Full Protocol Authority' : 'Level 7 Clearance Verified'}</p>
                {systemIntegration.isLive && (
                  <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[8px] font-black uppercase tracking-widest animate-pulse shadow-lg shadow-emerald-500/30">
                    <Activity className="w-2.5 h-2.5" /> LIVE
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <div className="hidden md:flex flex-col items-end mr-1 text-right">
              <span className="text-[10px] font-black text-slate-400 dark:text-gray-600 uppercase tracking-widest leading-none mb-1">{isAdmin ? 'SYSTEM TVL' : 'TOTAL LIQUIDITY'}</span>
              <span className={`text-sm font-black font-mono leading-none ${isAdmin ? 'text-blue-600 dark:text-blue-400' : 'text-emerald-600 dark:text-emerald-500'}`}>${(currentUser.balance).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex items-center gap-2 md:gap-3 pl-2 md:pl-4 border-l border-slate-200 dark:border-white/10">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 shadow-lg flex-shrink-0 overflow-hidden ${isAdmin ? 'bg-amber-600 border-amber-500/30' : 'bg-blue-600 border-white/10'}`}>
                {currentUser.avatar ? <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" /> : currentUser.name[0]}
              </div>
              <button onClick={handleLogout} className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all active:scale-90"><LogOutIcon className="w-5 h-5" /></button>
            </div>
          </div>
        </header>
        <main className="p-4 md:p-10 pb-32 md:pb-10 max-w-7xl mx-auto min-h-[calc(100vh-80px)] transition-all">
          {children}
        </main>
      </div>
    </div>
  );
};
