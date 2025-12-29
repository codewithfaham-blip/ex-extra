
'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { User, InvestmentPlan, Investment, Transaction, UserRole, TransactionType, TransactionStatus } from '@/types';
import { INITIAL_PLANS, MOCK_USERS } from '@/constants';

interface PlatformStats {
  totalUsers: number;
  totalDeposits: number;
  totalWithdrawals: number;
  totalInvested: number;
  pendingWithdrawals: number;
  platformBalance: number;
}

interface AppContextType {
  currentUser: User | null;
  users: User[];
  plans: InvestmentPlan[];
  investments: Investment[];
  transactions: Transaction[];
  platformStats: PlatformStats;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, userId: string, referrerCode?: string) => Promise<{success: boolean, message?: string}>;
  makeDeposit: (amount: number, method: string) => void;
  requestWithdrawal: (amount: number, method: string) => void;
  investInPlan: (planId: string, amount: number) => string | null;
  adminApproveWithdrawal: (txId: string) => void;
  adminRejectWithdrawal: (txId: string) => void;
  adminUpdateUser: (userId: string, data: Partial<User>) => void;
  adminUpdatePlan: (plan: InvestmentPlan) => void;
  adminDeletePlan: (id: string) => void;
  adminCreatePlan: (plan: Omit<InvestmentPlan, 'id'>) => void;
  debugTriggerProfit: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);
const SIMULATED_DAY_MS = 60000;

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [plans, setPlans] = useState<InvestmentPlan[]>(INITIAL_PLANS);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const savedUser = localStorage.getItem('hyip_current_user');
    const savedUsers = localStorage.getItem('hyip_users');
    const savedPlans = localStorage.getItem('hyip_plans');
    const savedInvestments = localStorage.getItem('hyip_investments');
    const savedTransactions = localStorage.getItem('hyip_transactions');

    if (savedUser) setCurrentUser(JSON.parse(savedUser));
    if (savedUsers) setUsers(JSON.parse(savedUsers));
    if (savedPlans) setPlans(JSON.parse(savedPlans));
    if (savedInvestments) setInvestments(JSON.parse(savedInvestments));
    if (savedTransactions) setTransactions(JSON.parse(savedTransactions));
    
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    localStorage.setItem('hyip_current_user', JSON.stringify(currentUser));
    localStorage.setItem('hyip_users', JSON.stringify(users));
    localStorage.setItem('hyip_plans', JSON.stringify(plans));
    localStorage.setItem('hyip_investments', JSON.stringify(investments));
    localStorage.setItem('hyip_transactions', JSON.stringify(transactions));
  }, [currentUser, users, plans, investments, transactions, isHydrated]);

  const platformStats = useMemo(() => {
    return {
      totalUsers: users.length,
      totalDeposits: transactions.filter(t => t.type === TransactionType.DEPOSIT && t.status === TransactionStatus.COMPLETED).reduce((a, b) => a + b.amount, 0),
      totalWithdrawals: transactions.filter(t => t.type === TransactionType.WITHDRAWAL && t.status === TransactionStatus.COMPLETED).reduce((a, b) => a + b.amount, 0),
      totalInvested: investments.reduce((a, b) => a + b.amount, 0),
      pendingWithdrawals: transactions.filter(t => t.type === TransactionType.WITHDRAWAL && t.status === TransactionStatus.PENDING).length,
      platformBalance: users.reduce((a, b) => a + b.balance, 0),
    };
  }, [users, transactions, investments]);

  const processProfits = () => {
    setInvestments(prevInvestments => {
      let hasChanges = false;
      const newTransactions: Transaction[] = [];
      const userUpdates: Record<string, number> = {};

      const nextInvestments = prevInvestments.map(inv => {
        if (inv.status !== 'ACTIVE') return inv;
        const plan = plans.find(p => p.id === inv.planId);
        if (!plan) return inv;

        let tempInv = { ...inv };
        let processedAny = false;

        while (Date.now() > tempInv.nextPayout && tempInv.totalPayouts < plan.durationDays) {
          hasChanges = true;
          processedAny = true;
          const profit = tempInv.amount * (plan.roi / 100);
          userUpdates[tempInv.userId] = (userUpdates[tempInv.userId] || 0) + profit;
          
          newTransactions.push({
            id: Math.random().toString(36).substr(2, 9),
            userId: tempInv.userId,
            amount: profit,
            type: TransactionType.PROFIT,
            status: TransactionStatus.COMPLETED,
            date: Date.now(),
            details: `Yield payout from ${plan.name} (${tempInv.totalPayouts + 1}/${plan.durationDays})`
          });

          tempInv.totalPayouts += 1;
          tempInv.earnedSoFar += profit;
          tempInv.nextPayout += SIMULATED_DAY_MS;

          if (tempInv.totalPayouts >= plan.durationDays) {
            tempInv.status = 'COMPLETED';
            break;
          }
        }
        return processedAny ? tempInv : inv;
      });

      if (hasChanges) {
        setUsers(prev => prev.map(u => userUpdates[u.id] ? { ...u, balance: u.balance + userUpdates[u.id] } : u));
        setTransactions(prev => [...newTransactions, ...prev]);
        return nextInvestments;
      }
      return prevInvestments;
    });
  };

  useEffect(() => {
    const interval = setInterval(processProfits, 5000);
    return () => clearInterval(interval);
  }, [plans]);

  const login = async (email: string, pass: string) => {
    const user = users.find(u => u.email === email && !u.isBlocked);
    if (user && (email === 'admin@hyip.com' ? pass === 'admin123' : true)) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const logout = () => setCurrentUser(null);

  const register = async (name: string, email: string, userId: string, referrerCode?: string) => {
    const norm = userId.trim().toUpperCase();
    if (users.find(u => u.email === email || u.referralCode === norm)) return { success: false, message: 'Identity conflict detected.' };

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email, name, role: UserRole.USER, balance: 5, 
      totalInvested: 0, totalWithdrawn: 0, referralCode: norm,
      createdAt: Date.now(), isBlocked: false,
      // Fix: Adding missing required User properties based on the interface in types/index.ts
      kycLevel: 0,
      twoFactorEnabled: false,
      referredBy: referrerCode ? users.find(u => u.referralCode === referrerCode.trim().toUpperCase())?.id : undefined
    };
    setUsers([...users, newUser]);
    setCurrentUser(newUser);
    return { success: true };
  };

  const makeDeposit = (amount: number, method: string) => {
    if (!currentUser) return;
    const tx: Transaction = { id: Math.random().toString(36).substr(2, 9), userId: currentUser.id, amount, type: TransactionType.DEPOSIT, status: TransactionStatus.COMPLETED, date: Date.now(), method };
    setTransactions(prev => [tx, ...prev]);
    setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, balance: u.balance + amount } : u));
  };

  const requestWithdrawal = (amount: number, method: string) => {
    if (!currentUser || currentUser.balance < amount) return;
    const tx: Transaction = { id: Math.random().toString(36).substr(2, 9), userId: currentUser.id, amount, type: TransactionType.WITHDRAWAL, status: TransactionStatus.PENDING, date: Date.now(), method };
    setTransactions(prev => [tx, ...prev]);
    setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, balance: u.balance - amount } : u));
  };

  const investInPlan = (planId: string, amount: number) => {
    const u = users.find(u => u.id === currentUser?.id);
    const p = plans.find(p => p.id === planId);
    if (!u || u.balance < amount || !p || amount < p.minAmount || amount > p.maxAmount) return 'Parameters invalid.';

    const newInv: Investment = { id: Math.random().toString(36).substr(2, 9), userId: u.id, planId, amount, earnedSoFar: 0, startDate: Date.now(), nextPayout: Date.now() + SIMULATED_DAY_MS, totalPayouts: 0, status: 'ACTIVE' };
    
    if (u.referredBy) {
      const comm = amount * 0.05;
      setUsers(prev => prev.map(usr => usr.id === u.referredBy ? { ...usr, balance: usr.balance + comm } : usr));
      setTransactions(prev => [{ id: Math.random().toString(36).substr(2, 9), userId: u.referredBy!, amount: comm, type: TransactionType.REFERRAL, status: TransactionStatus.COMPLETED, date: Date.now(), details: `Referral commission` }, ...prev]);
    }

    setInvestments(prev => [newInv, ...prev]);
    setUsers(prev => prev.map(usr => usr.id === u.id ? { ...usr, balance: usr.balance - amount, totalInvested: usr.totalInvested + amount } : usr));
    setTransactions(prev => [{ id: Math.random().toString(36).substr(2, 9), userId: u.id, amount, type: TransactionType.DEPOSIT, status: TransactionStatus.COMPLETED, date: Date.now(), details: `Allocated to ${p.name}` }, ...prev]);
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
    if (tx) setUsers(prev => prev.map(u => u.id === tx.userId ? { ...u, balance: u.balance + tx.amount } : u));
  };

  const adminUpdateUser = (userId: string, data: Partial<User>) => setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...data } : u));
  const adminUpdatePlan = (plan: InvestmentPlan) => setPlans(prev => prev.map(p => p.id === plan.id ? plan : p));
  const adminDeletePlan = (id: string) => setPlans(prev => prev.filter(p => p.id !== id));
  const adminCreatePlan = (planData: Omit<InvestmentPlan, 'id'>) => setPlans([...plans, { ...planData, id: 'plan_' + Date.now() }]);
  const debugTriggerProfit = () => {
    setInvestments(prev => prev.map(inv => inv.status === 'ACTIVE' ? { ...inv, nextPayout: Date.now() - 1000 } : inv));
    setTimeout(processProfits, 100);
  };

  return (
    <AppContext.Provider value={{
      currentUser, users, plans, investments, transactions, platformStats,
      login, logout, register, makeDeposit, requestWithdrawal, investInPlan,
      adminApproveWithdrawal, adminRejectWithdrawal, adminUpdateUser, adminUpdatePlan, adminDeletePlan, adminCreatePlan, debugTriggerProfit
    }}>
      {isHydrated ? children : <div className="min-h-screen bg-[#0b0e14] flex items-center justify-center font-black text-blue-500 tracking-[0.5em] animate-pulse">INIT KERNEL...</div>}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
