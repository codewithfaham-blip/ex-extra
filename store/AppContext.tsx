import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth } from '../services/firebase';
import { 
  User, 
  PortfolioHolding, 
  Transaction, 
  PortfolioMetrics,
  PortfolioSnapshot,
  AssetAllocation,
  SupportTicket,
  AssetType,
  TransactionType,
  TransactionStatus,
  UserRole 
} from '../types';
import { 
  saveHolding, 
  getHoldings, 
  deleteHolding, 
  updateHolding,
  saveTransaction,
  getTransactions,
  saveSnapshot,
  getSnapshots,
  calculatePortfolioMetrics,
  calculateAssetAllocation,
  saveUser,
  getUser
} from '../services/portfolio';
import { fetchAssetPrice, fetchMultiplePrices } from '../services/marketData';
import { DEMO_USER, PRICE_UPDATE_INTERVAL, SNAPSHOT_INTERVAL } from '../constants';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
  title?: string;
}

interface AppContextType {
  currentUser: User | null;
  firebaseUser: FirebaseUser | null;
  holdings: PortfolioHolding[];
  transactions: Transaction[];
  tickets: SupportTicket[];
  portfolioMetrics: PortfolioMetrics;
  assetAllocation: AssetAllocation[];
  snapshots: PortfolioSnapshot[];
  cashBalance: number;
  theme: 'dark' | 'light';
  toasts: Toast[];
  isLoading: boolean;
  isHydrated: boolean;
  toggleTheme: () => void;
  removeToast: (id: string) => void;
  addToast: (message: string, type?: 'success' | 'info' | 'error', title?: string) => void;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<boolean>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  addHolding: (holding: Omit<PortfolioHolding, 'id' | 'userId' | 'currentPrice' | 'currentValue' | 'unrealizedGain' | 'unrealizedGainPercent'>) => Promise<void>;
  editHolding: (holdingId: string, updates: Partial<PortfolioHolding>) => Promise<void>;
  removeHolding: (holdingId: string) => Promise<void>;
  addCash: (amount: number) => void;
  withdrawCash: (amount: number) => void;
  refreshPrices: () => Promise<void>;
  createTicket: (subject: string, message: string, priority: 'LOW' | 'MEDIUM' | 'HIGH') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const safeParse = <T,>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    return fallback;
  }
};

const safeStringify = (value: any): string => {
  try {
    return JSON.stringify(value);
  } catch (e) {
    return '{}';
  }
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [holdings, setHoldings] = useState<PortfolioHolding[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [snapshots, setSnapshots] = useState<PortfolioSnapshot[]>([]);
  const [cashBalance, setCashBalance] = useState<number>(0);

  useEffect(() => {
    const savedTheme = localStorage.getItem('portfolio_theme') as 'dark' | 'light';
    if (savedTheme) setTheme(savedTheme);
    
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      
      if (fbUser) {
        const userData = await getUser(fbUser.uid);
        if (userData) {
          setCurrentUser(userData);
        } else {
          const newUser: User = {
            id: fbUser.uid,
            email: fbUser.email || '',
            name: fbUser.displayName || 'User',
            role: UserRole.USER,
            createdAt: Date.now(),
          };
          await saveUser(newUser);
          setCurrentUser(newUser);
        }
      } else {
        setCurrentUser(null);
        setHoldings([]);
        setTransactions([]);
        setSnapshots([]);
        setCashBalance(0);
      }
      
      setIsLoading(false);
      setIsHydrated(true);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!currentUser) return;
    
    const loadUserData = async () => {
      try {
        const [holdingsData, transactionsData, snapshotsData] = await Promise.all([
          getHoldings(currentUser.id),
          getTransactions(currentUser.id),
          getSnapshots(currentUser.id, 30)
        ]);
        
        setHoldings(holdingsData);
        setTransactions(transactionsData);
        setSnapshots(snapshotsData);
        
        const savedCash = safeParse<number>(`portfolio_cash_${currentUser.id}`, 10000);
        setCashBalance(savedCash);
        
        const savedTickets = safeParse<SupportTicket[]>(`portfolio_tickets_${currentUser.id}`, []);
        setTickets(savedTickets);
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };
    
    loadUserData();
  }, [currentUser]);

  useEffect(() => {
    if (!isHydrated || !currentUser) return;
    const root = window.document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    localStorage.setItem('portfolio_theme', theme);
  }, [theme, isHydrated, currentUser]);

  useEffect(() => {
    if (!currentUser) return;
    localStorage.setItem(`portfolio_cash_${currentUser.id}`, JSON.stringify(cashBalance));
  }, [cashBalance, currentUser]);

  useEffect(() => {
    if (!currentUser) return;
    localStorage.setItem(`portfolio_tickets_${currentUser.id}`, safeStringify(tickets));
  }, [tickets, currentUser]);

  const refreshPrices = useCallback(async () => {
    if (holdings.length === 0) return;
    
    try {
      const symbolsToFetch = holdings.map(h => ({
        symbol: h.symbol,
        type: h.type
      }));
      
      const priceMap = await fetchMultiplePrices(symbolsToFetch);
      
      const updatedHoldings = holdings.map(holding => {
        const asset = priceMap.get(holding.symbol);
        if (!asset) return holding;
        
        const currentPrice = asset.currentPrice;
        const currentValue = holding.quantity * currentPrice;
        const totalCost = holding.quantity * holding.costBasis;
        const unrealizedGain = currentValue - totalCost;
        const unrealizedGainPercent = totalCost > 0 ? (unrealizedGain / totalCost) * 100 : 0;
        
        const updated = {
          ...holding,
          currentPrice,
          currentValue,
          unrealizedGain,
          unrealizedGainPercent
        };
        
        updateHolding(holding.id, updated);
        return updated;
      });
      
      setHoldings(updatedHoldings);
    } catch (error) {
      console.error('Error refreshing prices:', error);
    }
  }, [holdings]);

  useEffect(() => {
    if (!currentUser || holdings.length === 0) return;
    
    refreshPrices();
    const interval = setInterval(refreshPrices, PRICE_UPDATE_INTERVAL);
    return () => clearInterval(interval);
  }, [currentUser, holdings.length, refreshPrices]);

  useEffect(() => {
    if (!currentUser || holdings.length === 0) return;
    
    const savePeriodicSnapshot = async () => {
      const metrics = calculatePortfolioMetrics(holdings, cashBalance, snapshots);
      const snapshot: PortfolioSnapshot = {
        id: `snapshot_${Date.now()}`,
        userId: currentUser.id,
        timestamp: Date.now(),
        totalValue: metrics.totalValue,
        totalCost: metrics.totalCost,
        unrealizedGain: metrics.unrealizedGain,
        unrealizedGainPercent: metrics.unrealizedGainPercent,
        cashBalance
      };
      
      await saveSnapshot(snapshot);
      setSnapshots(prev => [...prev, snapshot]);
    };
    
    const interval = setInterval(savePeriodicSnapshot, SNAPSHOT_INTERVAL);
    return () => clearInterval(interval);
  }, [currentUser, holdings, cashBalance, snapshots]);

  const portfolioMetrics = useMemo(() => {
    return calculatePortfolioMetrics(holdings, cashBalance, snapshots);
  }, [holdings, cashBalance, snapshots]);

  const assetAllocation = useMemo(() => {
    return calculateAssetAllocation(holdings, cashBalance);
  }, [holdings, cashBalance]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const addToast = useCallback((message: string, type: 'success' | 'info' | 'error' = 'info', title?: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type, title }]);
    setTimeout(() => removeToast(id), 5000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      addToast('Successfully logged in', 'success', 'Welcome Back');
      return true;
    } catch (error: any) {
      addToast(error.message || 'Login failed', 'error', 'Authentication Error');
      return false;
    }
  };

  const register = async (email: string, password: string, name: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser: User = {
        id: userCredential.user.uid,
        email,
        name,
        role: UserRole.USER,
        createdAt: Date.now(),
      };
      await saveUser(newUser);
      addToast('Account created successfully', 'success', 'Welcome');
      return { success: true };
    } catch (error: any) {
      return { success: false, message: error.message || 'Registration failed' };
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      setHoldings([]);
      setTransactions([]);
      setSnapshots([]);
      setCashBalance(0);
      addToast('Successfully logged out', 'info', 'Goodbye');
    } catch (error: any) {
      addToast(error.message || 'Logout failed', 'error', 'Error');
    }
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      await sendPasswordResetEmail(auth, email);
      addToast('Password reset email sent', 'success', 'Check Your Email');
      return true;
    } catch (error: any) {
      addToast(error.message || 'Failed to send reset email', 'error', 'Error');
      return false;
    }
  };

  const updateProfile = async (data: Partial<User>): Promise<void> => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...data };
    await saveUser(updated);
    setCurrentUser(updated);
    addToast('Profile updated successfully', 'success', 'Saved');
  };

  const addHolding = async (holdingData: Omit<PortfolioHolding, 'id' | 'userId' | 'currentPrice' | 'currentValue' | 'unrealizedGain' | 'unrealizedGainPercent'>): Promise<void> => {
    if (!currentUser) return;
    
    try {
      const asset = await fetchAssetPrice(holdingData.symbol, holdingData.type);
      const currentPrice = asset?.currentPrice || holdingData.costBasis;
      const currentValue = holdingData.quantity * currentPrice;
      const totalCost = holdingData.quantity * holdingData.costBasis;
      const unrealizedGain = currentValue - totalCost;
      const unrealizedGainPercent = totalCost > 0 ? (unrealizedGain / totalCost) * 100 : 0;
      
      const holding: PortfolioHolding = {
        ...holdingData,
        id: `holding_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: currentUser.id,
        currentPrice,
        currentValue,
        totalCost,
        unrealizedGain,
        unrealizedGainPercent
      };
      
      await saveHolding(holding);
      setHoldings(prev => [...prev, holding]);
      
      const transaction: Transaction = {
        id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: currentUser.id,
        holdingId: holding.id,
        symbol: holding.symbol,
        amount: totalCost,
        quantity: holding.quantity,
        pricePerUnit: holding.costBasis,
        type: TransactionType.BUY,
        status: TransactionStatus.COMPLETED,
        date: holdingData.purchaseDate,
        details: `Purchased ${holding.quantity} ${holding.symbol}`
      };
      
      await saveTransaction(transaction);
      setTransactions(prev => [transaction, ...prev]);
      
      addToast(`Added ${holding.quantity} ${holding.symbol} to portfolio`, 'success', 'Holding Added');
    } catch (error: any) {
      addToast(error.message || 'Failed to add holding', 'error', 'Error');
    }
  };

  const editHolding = async (holdingId: string, updates: Partial<PortfolioHolding>): Promise<void> => {
    try {
      await updateHolding(holdingId, updates);
      setHoldings(prev => prev.map(h => h.id === holdingId ? { ...h, ...updates } : h));
      addToast('Holding updated successfully', 'success', 'Updated');
    } catch (error: any) {
      addToast(error.message || 'Failed to update holding', 'error', 'Error');
    }
  };

  const removeHolding = async (holdingId: string): Promise<void> => {
    try {
      const holding = holdings.find(h => h.id === holdingId);
      if (!holding) return;
      
      await deleteHolding(holdingId);
      setHoldings(prev => prev.filter(h => h.id !== holdingId));
      
      if (currentUser) {
        const transaction: Transaction = {
          id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          userId: currentUser.id,
          holdingId: holding.id,
          symbol: holding.symbol,
          amount: holding.currentValue,
          quantity: holding.quantity,
          pricePerUnit: holding.currentPrice,
          type: TransactionType.SELL,
          status: TransactionStatus.COMPLETED,
          date: Date.now(),
          details: `Sold ${holding.quantity} ${holding.symbol}`
        };
        
        await saveTransaction(transaction);
        setTransactions(prev => [transaction, ...prev]);
        setCashBalance(prev => prev + holding.currentValue);
      }
      
      addToast(`Removed ${holding.symbol} from portfolio`, 'info', 'Holding Removed');
    } catch (error: any) {
      addToast(error.message || 'Failed to remove holding', 'error', 'Error');
    }
  };

  const addCash = (amount: number) => {
    if (!currentUser) return;
    setCashBalance(prev => prev + amount);
    
    const transaction: Transaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: currentUser.id,
      amount,
      type: TransactionType.DEPOSIT,
      status: TransactionStatus.COMPLETED,
      date: Date.now(),
      details: 'Cash deposit'
    };
    
    saveTransaction(transaction);
    setTransactions(prev => [transaction, ...prev]);
    addToast(`Deposited $${amount.toLocaleString()}`, 'success', 'Deposit');
  };

  const withdrawCash = (amount: number) => {
    if (!currentUser || cashBalance < amount) {
      addToast('Insufficient cash balance', 'error', 'Error');
      return;
    }
    
    setCashBalance(prev => prev - amount);
    
    const transaction: Transaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: currentUser.id,
      amount,
      type: TransactionType.WITHDRAWAL,
      status: TransactionStatus.COMPLETED,
      date: Date.now(),
      details: 'Cash withdrawal'
    };
    
    saveTransaction(transaction);
    setTransactions(prev => [transaction, ...prev]);
    addToast(`Withdrew $${amount.toLocaleString()}`, 'info', 'Withdrawal');
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
    addToast('Support ticket created', 'info', 'Ticket Submitted');
  };

  if (!isHydrated || isLoading) {
    return (
      <div style={{ backgroundColor: '#0b0e14' }} className="min-h-screen flex flex-col items-center justify-center p-10 text-center space-y-4">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="font-black text-blue-500 uppercase tracking-widest animate-pulse">Loading Portfolio</p>
      </div>
    );
  }

  return (
    <AppContext.Provider value={{
      currentUser,
      firebaseUser,
      holdings,
      transactions,
      tickets,
      portfolioMetrics,
      assetAllocation,
      snapshots,
      cashBalance,
      theme,
      toggleTheme,
      toasts,
      removeToast,
      addToast,
      isLoading,
      isHydrated,
      login,
      register,
      logout,
      resetPassword,
      updateProfile,
      addHolding,
      editHolding,
      removeHolding,
      addCash,
      withdrawCash,
      refreshPrices,
      createTicket
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
