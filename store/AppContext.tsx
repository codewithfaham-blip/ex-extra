import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { User, InvestmentPlan, Investment, Transaction, UserRole, TransactionType, TransactionStatus, SupportTicket } from '../types.ts';
import { INITIAL_PLANS, MOCK_USERS } from '../constants.ts';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
  title?: string;
}

interface PlatformStats {
  totalUsers: number;
  totalDeposits: number;
  totalWithdrawals: number;
  totalInvested: number;
  pendingWithdrawals: number;
  pendingDeposits: number;
  platformBalance: number;
}

interface SystemIntegration {
  isLive: boolean;
  dbLink: string;
  authRpc: string;
  apiGateway: string;
  lastSync: number | null;
}

interface AppContextType {
  currentUser: User | null;
  users: User[];
  plans: InvestmentPlan[];
  investments: Investment[];
  transactions: Transaction[];
  tickets: SupportTicket[];
  platformStats: PlatformStats;
  theme: 'dark' | 'light';
  toasts: Toast[];
  systemIntegration: SystemIntegration;
  isHydrated: boolean;
  toggleTheme: () => void;
  removeToast: (id: string) => void;
  addToast: (message: string, type?: 'success' | 'info' | 'error', title?: string) => void;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  createTicket: (subject: string, message: string, priority: 'LOW' | 'MEDIUM' | 'HIGH') => void;
  register: (name: string, email: string, userId: string, referrerCode?: string) => Promise<{success: boolean, message?: string}>;
  makeDeposit: (amount: number, method: string) => void;
  requestWithdrawal: (amount: number, method: string) => void;
  investInPlan: (planId: string, amount: number) => string | null;
  adminApproveWithdrawal: (txId: string) => void;
  adminRejectWithdrawal: (txId: string) => void;
  adminApproveDeposit: (txId: string) => void;
  adminRejectDeposit: (txId: string) => void;
  adminUpdateUser: (userId: string, data: Partial<User>) => void;
  adminUpdatePlan: (plan: InvestmentPlan) => void;
  adminDeletePlan: (id: string) => void;
  adminCreatePlan: (plan: Omit<InvestmentPlan, 'id'>) => void;
  debugTriggerProfit: () => void;
  updateSystemIntegration: (config: Partial<SystemIntegration>) => void;
  clearCache: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);
const SIMULATED_DAY_MS = 60000;

const safeParse = <T,>(key: string, fallback: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    return fallback;
  }
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [systemIntegration, setSystemIntegration] = useState<SystemIntegration>({
    isLive: false, dbLink: '', authRpc: '', apiGateway: '', lastSync: null
  });
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [plans, setPlans] = useState<InvestmentPlan[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Faster hydration by avoiding state-per-item updates
  useEffect(() => {
    const savedTheme = localStorage.getItem('hyip_theme') as 'dark' | 'light';
    if (savedTheme) setTheme(savedTheme);

    const config = safeParse('hyip_system_integration', { isLive: false, dbLink: '', authRpc: '', apiGateway: '', lastSync: null });
    const user = safeParse('hyip_current_user', null);
    const usersList = safeParse('hyip_users', MOCK_USERS);
    const ticketsList = safeParse('hyip_tickets', []);
    const plansList = safeParse('hyip_plans', INITIAL_PLANS);
    const investmentsList = safeParse('hyip_investments', []);
    const transactionsList = safeParse('hyip_transactions', []);

    setSystemIntegration(config);
    setCurrentUser(user);
    setUsers(usersList);
    setTickets(ticketsList);
    setPlans(plansList);
    setInvestments(investmentsList);
    setTransactions(transactionsList);

    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    const root = window.document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    localStorage.setItem('hyip_theme', theme);
  }, [theme, isHydrated]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const addToast = useCallback((message: string, type: 'success' | 'info' | 'error' = 'info', title?: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type, title }]);
    setTimeout(() => removeToast(id), 5000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const platformStats = useMemo(() => {
    return {
      totalUsers: users.length,
      totalDeposits: transactions.filter(t => t.type === TransactionType.DEPOSIT && t.status === TransactionStatus.COMPLETED).reduce((a, b) => a + b.amount, 0),
      totalWithdrawals: transactions.filter(t => t.type === TransactionType.WITHDRAWAL && t.status === TransactionStatus.COMPLETED).reduce((a, b) => a + b.amount, 0),
      totalInvested: investments.reduce((a, b) => a + b.amount, 0),
      pendingWithdrawals: transactions.filter(t => t.type === TransactionType.WITHDRAWAL && t.status === TransactionStatus.PENDING).length,
      pendingDeposits: transactions.filter(t => t.type === TransactionType.DEPOSIT && t.status === TransactionStatus.PENDING).length,
      platformBalance: users.reduce((a, b) => a + b.balance, 0),
    };
  }, [users, transactions, investments]);

  useEffect(() => {
    if (!isHydrated) return;
    localStorage.setItem('hyip_current_user', JSON.stringify(currentUser));
    localStorage.setItem('hyip_users', JSON.stringify(users));
    localStorage.setItem('hyip_plans', JSON.stringify(plans));
    localStorage.setItem('hyip_investments', JSON.stringify(investments));
    localStorage.setItem('hyip_transactions', JSON.stringify(transactions));
    localStorage.setItem('hyip_tickets', JSON.stringify(tickets));
    localStorage.setItem('hyip_system_integration', JSON.stringify(systemIntegration));
  }, [currentUser, users, plans, investments, transactions, tickets, systemIntegration, isHydrated]);

  const processProfits = useCallback(() => {
    const now = Date.now();
    let hasChanges = false;
    const newTransactions: Transaction[] = [];
    const userUpdates: Record<string, number> = {};
    let totalCurrentUserProfit = 0;

    const nextInvestments = investments.map(inv => {
      if (inv.status !== 'ACTIVE') return inv;
      const plan = plans.find(p => p.id === inv.planId);
      if (!plan) return inv;

      let tempInv = { ...inv };
      let updated = false;

      while (now > tempInv.nextPayout && tempInv.totalPayouts < plan.durationDays) {
        hasChanges = true;
        updated = true;
        const profit = tempInv.amount * (plan.roi / 100);
        
        userUpdates[tempInv.userId] = (userUpdates[tempInv.userId] || 0) + profit;
        
        if (tempInv.userId === currentUser?.id) {
          totalCurrentUserProfit += profit;
        }

        newTransactions.push({
          id: Math.random().toString(36).substr(2, 9),
          userId: tempInv.userId,
          amount: profit,
          type: TransactionType.PROFIT,
          status: TransactionStatus.COMPLETED,
          date: now,
          details: `Yield payout from ${plan.name}`
        });

        tempInv.totalPayouts += 1;
        tempInv.earnedSoFar += profit;
        tempInv.nextPayout += SIMULATED_DAY_MS;

        if (tempInv.totalPayouts >= plan.durationDays) {
          tempInv.status = 'COMPLETED';
          break;
        }
      }
      return updated ? tempInv : inv;
    });

    if (hasChanges) {
      setInvestments(nextInvestments);
      setTransactions(prev => [...newTransactions, ...prev]);
      setUsers(prev => prev.map(u => userUpdates[u.id] ? { ...u, balance: u.balance + userUpdates[u.id] } : u));
      
      if (currentUser && userUpdates[currentUser.id]) {
        setCurrentUser(prev => prev ? { ...prev, balance: prev.balance + userUpdates[prev.id!] } : null);
        addToast(`ROI payout of $${totalCurrentUserProfit.toFixed(2)} received.`, 'success', 'Yield Credit');
      }
    }
  }, [investments, plans, currentUser, addToast]);

  useEffect(() => {
    if (!isHydrated) return;
    const interval = setInterval(processProfits, 5000);
    return () => clearInterval(interval);
  }, [isHydrated, processProfits]);

  const login = async (email: string, pass: string) => {
    const user = users.find(u => u.email === email && !u.isBlocked);
    if (user && (email === 'admin@hyip.com' ? pass === 'admin123' : true)) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const logout = () => setCurrentUser(null);

  const updateProfile = (data: Partial<User>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...data };
    setCurrentUser(updated);
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updated : u));
    addToast('Security profile updated.', 'success', 'System Confirmed');
  };

  const createTicket = (subject: string, message: string, priority: 'LOW' | 'MEDIUM' | 'HIGH') => {
    if (!currentUser) return;
    const newTicket: SupportTicket = {
      id: Math.random().toString(36).substr(2, 9),
      userId: currentUser.id,
      subject,
      message,
      status: 'OPEN',
      priority,
      createdAt: Date.now()
    };
    setTickets(prev => [newTicket, ...prev]);
    addToast('Support ticket logged.', 'info', 'Inquiry Active');
  };

  const register = async (name: string, email: string, userId: string, referrerCode?: string) => {
    const norm = userId.trim().toUpperCase();
    if (users.find(u => u.email === email || u.referralCode === norm)) return { success: false, message: 'Identity Conflict' };

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email, name, role: UserRole.USER, balance: 5, 
      totalInvested: 0, totalWithdrawn: 0, referralCode: norm,
      createdAt: Date.now(), isBlocked: false,
      kycLevel: 0, twoFactorEnabled: false,
      referredBy: referrerCode ? users.find(u => u.referralCode === referrerCode.trim().toUpperCase())?.id : undefined
    };
    setUsers([...users, newUser]);
    setCurrentUser(newUser);
    return { success: true };
  };

  const makeDeposit = (amount: number, method: string) => {
    if (!currentUser) return;
    const isInstant = !['Bank Transfer', 'Credit Card'].includes(method);
    const status = isInstant ? TransactionStatus.COMPLETED : TransactionStatus.PENDING;
    const tx: Transaction = { id: Math.random().toString(36).substr(2, 9), userId: currentUser.id, amount, type: TransactionType.DEPOSIT, status, date: Date.now(), method };
    setTransactions(prev => [tx, ...prev]);
    if (status === TransactionStatus.COMPLETED) {
      setCurrentUser(prev => prev ? { ...prev, balance: prev.balance + amount } : null);
      setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, balance: u.balance + amount } : u));
      addToast(`Deposited $${amount.toLocaleString()} via ${method}.`, 'success', 'Confirmed');
    } else {
      addToast(`Processing $${amount.toLocaleString()} via ${method}.`, 'info', 'Pending Verification');
    }
  };

  const requestWithdrawal = (amount: number, method: string) => {
    if (!currentUser || currentUser.balance < amount) return;
    const tx: Transaction = { id: Math.random().toString(36).substr(2, 9), userId: currentUser.id, amount, type: TransactionType.WITHDRAWAL, status: TransactionStatus.PENDING, date: Date.now(), method };
    setTransactions(prev => [tx, ...prev]);
    setCurrentUser(prev => prev ? { ...prev, balance: prev.balance - amount } : null);
    setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, balance: u.balance - amount } : u));
    addToast(`Withdrawal of $${amount.toLocaleString()} pending.`, 'info', 'Verification Step');
  };

  const investInPlan = (planId: string, amount: number) => {
    const u = currentUser;
    const p = plans.find(p => p.id === planId);
    if (!u || u.balance < amount || !p || amount < p.minAmount || amount > p.maxAmount) return 'Invalid Parameters';
    
    const newInv: Investment = { 
      id: Math.random().toString(36).substr(2, 9), 
      userId: u.id, 
      planId, 
      amount, 
      earnedSoFar: 0, 
      startDate: Date.now(), 
      nextPayout: Date.now() + SIMULATED_DAY_MS, 
      totalPayouts: 0, 
      status: 'ACTIVE' 
    };

    setInvestments(prev => [newInv, ...prev]);
    setCurrentUser(prev => prev ? { ...prev, balance: prev.balance - amount, totalInvested: prev.totalInvested + amount } : null);
    setUsers(prev => prev.map(usr => usr.id === u.id ? { ...usr, balance: usr.balance - amount, totalInvested: usr.totalInvested + amount } : usr));
    
    const tx: Transaction = { id: Math.random().toString(36).substr(2, 9), userId: u.id, amount, type: TransactionType.DEPOSIT, status: TransactionStatus.COMPLETED, date: Date.now(), details: `Stake: ${p.name}` };
    setTransactions(prev => [tx, ...prev]);
    
    addToast(`$${amount.toLocaleString()} allocated to ${p.name}.`, 'success', 'Protocol Active');
    return null;
  };

  const adminApproveWithdrawal = (txId: string) => {
    setTransactions(prev => prev.map(t => {
      if (t.id === txId) {
        setUsers(uList => uList.map(u => u.id === t.userId ? { ...u, totalWithdrawn: u.totalWithdrawn + t.amount } : u));
        return { ...t, status: TransactionStatus.COMPLETED };
      }
      return t;
    }));
  };

  const adminRejectWithdrawal = (txId: string) => {
    setTransactions(prev => prev.map(t => t.id === txId ? { ...t, status: TransactionStatus.REJECTED } : t));
    const tx = transactions.find(t => t.id === txId);
    if (tx) {
      setUsers(prev => prev.map(u => u.id === tx.userId ? { ...u, balance: u.balance + tx.amount } : u));
    }
  };

  const adminApproveDeposit = (txId: string) => {
    setTransactions(prev => prev.map(t => {
      if (t.id === txId && t.status === TransactionStatus.PENDING) {
        setUsers(uList => uList.map(u => u.id === t.userId ? { ...u, balance: u.balance + t.amount } : u));
        return { ...t, status: TransactionStatus.COMPLETED };
      }
      return t;
    }));
  };

  const adminRejectDeposit = (txId: string) => {
    setTransactions(prev => prev.map(t => t.id === txId ? { ...t, status: TransactionStatus.REJECTED } : t));
  };

  const adminUpdateUser = (userId: string, data: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...data } : u));
  };

  const adminUpdatePlan = (plan: InvestmentPlan) => setPlans(prev => prev.map(p => p.id === plan.id ? plan : p));
  const adminDeletePlan = (id: string) => setPlans(prev => prev.filter(p => p.id !== id));
  const adminCreatePlan = (planData: Omit<InvestmentPlan, 'id'>) => setPlans([...plans, { ...planData, id: 'plan_' + Date.now() }]);
  
  const debugTriggerProfit = () => {
    setInvestments(prev => prev.map(inv => inv.status === 'ACTIVE' ? { ...inv, nextPayout: Date.now() - 1000 } : inv));
  };

  const clearCache = () => {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('hyip_')) {
        localStorage.removeItem(key);
      }
    });
    window.location.reload();
  };

  const updateSystemIntegration = (config: Partial<SystemIntegration>) => {
    setSystemIntegration(prev => ({ ...prev, ...config }));
  };

  if (!isHydrated) {
    return (
      <div style={{ backgroundColor: '#0b0e14' }} className="min-h-screen flex flex-col items-center justify-center p-10 text-center space-y-4">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="font-black text-blue-500 uppercase tracking-widest animate-pulse">Establishing Node Link</p>
      </div>
    );
  }

  return (
    <AppContext.Provider value={{
      currentUser, users, plans, investments, transactions, tickets, platformStats, theme, toggleTheme,
      toasts, removeToast, addToast, systemIntegration, isHydrated,
      login, logout, updateProfile, createTicket, register, makeDeposit, requestWithdrawal, investInPlan,
      adminApproveWithdrawal, adminRejectWithdrawal, adminApproveDeposit, adminRejectDeposit,
      adminUpdateUser, adminUpdatePlan, adminDeletePlan, adminCreatePlan, debugTriggerProfit,
      updateSystemIntegration, clearCache
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};