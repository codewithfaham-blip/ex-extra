import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  deleteDoc,
  updateDoc,
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import { 
  PortfolioHolding, 
  Transaction, 
  PortfolioSnapshot, 
  PortfolioMetrics,
  AssetAllocation,
  AssetType,
  User 
} from '../types';

const COLLECTIONS = {
  USERS: 'users',
  HOLDINGS: 'holdings',
  TRANSACTIONS: 'transactions',
  SNAPSHOTS: 'snapshots'
};

export const saveHolding = async (holding: PortfolioHolding): Promise<void> => {
  try {
    await setDoc(doc(db, COLLECTIONS.HOLDINGS, holding.id), holding);
  } catch (error) {
    console.error('Error saving holding:', error);
    throw error;
  }
};

export const getHoldings = async (userId: string): Promise<PortfolioHolding[]> => {
  try {
    const q = query(
      collection(db, COLLECTIONS.HOLDINGS),
      where('userId', '==', userId)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as PortfolioHolding);
  } catch (error) {
    console.error('Error getting holdings:', error);
    return [];
  }
};

export const deleteHolding = async (holdingId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, COLLECTIONS.HOLDINGS, holdingId));
  } catch (error) {
    console.error('Error deleting holding:', error);
    throw error;
  }
};

export const updateHolding = async (holdingId: string, updates: Partial<PortfolioHolding>): Promise<void> => {
  try {
    await updateDoc(doc(db, COLLECTIONS.HOLDINGS, holdingId), updates as any);
  } catch (error) {
    console.error('Error updating holding:', error);
    throw error;
  }
};

export const saveTransaction = async (transaction: Transaction): Promise<void> => {
  try {
    await setDoc(doc(db, COLLECTIONS.TRANSACTIONS, transaction.id), transaction);
  } catch (error) {
    console.error('Error saving transaction:', error);
    throw error;
  }
};

export const getTransactions = async (userId: string, limitCount: number = 100): Promise<Transaction[]> => {
  try {
    const q = query(
      collection(db, COLLECTIONS.TRANSACTIONS),
      where('userId', '==', userId),
      orderBy('date', 'desc'),
      limit(limitCount)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as Transaction);
  } catch (error) {
    console.error('Error getting transactions:', error);
    return [];
  }
};

export const saveSnapshot = async (snapshot: PortfolioSnapshot): Promise<void> => {
  try {
    await setDoc(doc(db, COLLECTIONS.SNAPSHOTS, snapshot.id), snapshot);
  } catch (error) {
    console.error('Error saving snapshot:', error);
    throw error;
  }
};

export const getSnapshots = async (userId: string, days: number = 30): Promise<PortfolioSnapshot[]> => {
  try {
    const startDate = Date.now() - (days * 24 * 60 * 60 * 1000);
    const q = query(
      collection(db, COLLECTIONS.SNAPSHOTS),
      where('userId', '==', userId),
      where('timestamp', '>=', startDate),
      orderBy('timestamp', 'asc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as PortfolioSnapshot);
  } catch (error) {
    console.error('Error getting snapshots:', error);
    return [];
  }
};

export const calculatePortfolioMetrics = (
  holdings: PortfolioHolding[],
  cashBalance: number,
  snapshots: PortfolioSnapshot[]
): PortfolioMetrics => {
  const totalCost = holdings.reduce((sum, h) => sum + h.totalCost, 0);
  const currentValue = holdings.reduce((sum, h) => sum + h.currentValue, 0);
  const totalValue = currentValue + cashBalance;
  const unrealizedGain = currentValue - totalCost;
  const unrealizedGainPercent = totalCost > 0 ? (unrealizedGain / totalCost) * 100 : 0;
  
  let dayChange = 0;
  let dayChangePercent = 0;
  
  if (snapshots.length > 0) {
    const yesterday = Date.now() - (24 * 60 * 60 * 1000);
    const recentSnapshot = snapshots
      .filter(s => s.timestamp >= yesterday)
      .sort((a, b) => a.timestamp - b.timestamp)[0];
    
    if (recentSnapshot) {
      dayChange = totalValue - recentSnapshot.totalValue;
      dayChangePercent = recentSnapshot.totalValue > 0 
        ? (dayChange / recentSnapshot.totalValue) * 100 
        : 0;
    }
  }
  
  const allValues = snapshots.map(s => s.totalValue);
  const allTimeHigh = Math.max(...allValues, totalValue);
  const allTimeLow = allValues.length > 0 ? Math.min(...allValues, totalValue) : totalValue;
  
  return {
    totalValue,
    totalCost,
    cashBalance,
    investedAmount: totalCost,
    unrealizedGain,
    unrealizedGainPercent,
    dayChange,
    dayChangePercent,
    allTimeHigh,
    allTimeLow
  };
};

export const calculateAssetAllocation = (holdings: PortfolioHolding[], cashBalance: number): AssetAllocation[] => {
  const allocationMap = new Map<AssetType, { value: number; count: number }>();
  
  holdings.forEach(holding => {
    const current = allocationMap.get(holding.type) || { value: 0, count: 0 };
    allocationMap.set(holding.type, {
      value: current.value + holding.currentValue,
      count: current.count + 1
    });
  });
  
  if (cashBalance > 0) {
    const current = allocationMap.get(AssetType.CASH) || { value: 0, count: 0 };
    allocationMap.set(AssetType.CASH, {
      value: current.value + cashBalance,
      count: current.count + 1
    });
  }
  
  const totalValue = Array.from(allocationMap.values()).reduce((sum, a) => sum + a.value, 0);
  
  const allocations: AssetAllocation[] = [];
  allocationMap.forEach((data, type) => {
    allocations.push({
      type,
      value: data.value,
      percentage: totalValue > 0 ? (data.value / totalValue) * 100 : 0,
      count: data.count
    });
  });
  
  return allocations.sort((a, b) => b.value - a.value);
};

export const saveUser = async (user: User): Promise<void> => {
  try {
    await setDoc(doc(db, COLLECTIONS.USERS, user.id), user);
  } catch (error) {
    console.error('Error saving user:', error);
    throw error;
  }
};

export const getUser = async (userId: string): Promise<User | null> => {
  try {
    const docSnap = await getDoc(doc(db, COLLECTIONS.USERS, userId));
    return docSnap.exists() ? docSnap.data() as User : null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};
