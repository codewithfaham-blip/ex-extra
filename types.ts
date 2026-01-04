export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  REJECTED = 'REJECTED'
}

export enum TransactionType {
  BUY = 'BUY',
  SELL = 'SELL',
  DIVIDEND = 'DIVIDEND',
  DEPOSIT = 'DEPOSIT',
  WITHDRAWAL = 'WITHDRAWAL'
}

export enum AssetType {
  STOCK = 'STOCK',
  CRYPTO = 'CRYPTO',
  ETF = 'ETF',
  BOND = 'BOND',
  MUTUAL_FUND = 'MUTUAL_FUND',
  CASH = 'CASH'
}

export interface SupportTicket {
  id: string;
  userId: string;
  subject: string;
  message: string;
  status: 'OPEN' | 'RESOLVED' | 'CLOSED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  createdAt: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  createdAt: number;
  phoneNumber?: string;
  country?: string;
}

export interface Asset {
  id: string;
  symbol: string;
  name: string;
  type: AssetType;
  currentPrice: number;
  previousClose?: number;
  priceChange24h?: number;
  priceChangePercent24h?: number;
  lastUpdated: number;
  currency: string;
}

export interface PortfolioHolding {
  id: string;
  userId: string;
  assetId: string;
  symbol: string;
  name: string;
  type: AssetType;
  quantity: number;
  costBasis: number; // Price per unit at purchase
  purchaseDate: number;
  currentPrice: number;
  currentValue: number; // quantity * currentPrice
  totalCost: number; // quantity * costBasis
  unrealizedGain: number; // currentValue - totalCost
  unrealizedGainPercent: number; // (unrealizedGain / totalCost) * 100
  notes?: string;
}

export interface Transaction {
  id: string;
  userId: string;
  holdingId?: string;
  symbol?: string;
  amount: number;
  quantity?: number;
  pricePerUnit?: number;
  type: TransactionType;
  status: TransactionStatus;
  date: number;
  method?: string;
  details?: string;
  fee?: number;
}

export interface PortfolioSnapshot {
  id: string;
  userId: string;
  timestamp: number;
  totalValue: number;
  totalCost: number;
  unrealizedGain: number;
  unrealizedGainPercent: number;
  cashBalance: number;
}

export interface PortfolioMetrics {
  totalValue: number;
  totalCost: number;
  cashBalance: number;
  investedAmount: number;
  unrealizedGain: number;
  unrealizedGainPercent: number;
  dayChange: number;
  dayChangePercent: number;
  allTimeHigh: number;
  allTimeLow: number;
}

export interface AssetAllocation {
  type: AssetType;
  value: number;
  percentage: number;
  count: number;
}
