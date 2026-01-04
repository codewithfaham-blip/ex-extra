import { User, UserRole, AssetType } from './types';

export const DEMO_USER: User = {
  id: 'demo_user',
  email: 'demo@portfoliotracker.com',
  name: 'Demo User',
  avatar: 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
  role: UserRole.USER,
  createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
};

export const ADMIN_USER: User = {
  id: 'admin_user',
  email: 'admin@portfoliotracker.com',
  name: 'Admin User',
  role: UserRole.ADMIN,
  createdAt: Date.now() - 90 * 24 * 60 * 60 * 1000,
};

export const POPULAR_CRYPTO_SYMBOLS = [
  'BTC', 'ETH', 'USDT', 'BNB', 'SOL', 'XRP', 'USDC', 'ADA', 
  'AVAX', 'DOGE', 'DOT', 'MATIC', 'LINK', 'UNI', 'ATOM', 'LTC'
];

export const POPULAR_STOCK_SYMBOLS = [
  'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'META', 'TSLA', 'BRK.B',
  'JPM', 'V', 'WMT', 'MA', 'PG', 'DIS', 'HD', 'BAC'
];

export const POPULAR_ETF_SYMBOLS = [
  'SPY', 'QQQ', 'VOO', 'VTI', 'IWM', 'DIA', 'EEM', 'GLD',
  'TLT', 'AGG', 'VEA', 'VWO', 'IVV', 'IEFA', 'EFA', 'BND'
];

export const ASSET_TYPE_LABELS: Record<AssetType, string> = {
  [AssetType.STOCK]: 'Stocks',
  [AssetType.CRYPTO]: 'Cryptocurrency',
  [AssetType.ETF]: 'ETFs',
  [AssetType.BOND]: 'Bonds',
  [AssetType.MUTUAL_FUND]: 'Mutual Funds',
  [AssetType.CASH]: 'Cash'
};

export const ASSET_TYPE_COLORS: Record<AssetType, string> = {
  [AssetType.STOCK]: '#3b82f6',
  [AssetType.CRYPTO]: '#f59e0b',
  [AssetType.ETF]: '#10b981',
  [AssetType.BOND]: '#8b5cf6',
  [AssetType.MUTUAL_FUND]: '#ec4899',
  [AssetType.CASH]: '#6b7280'
};

export const PRICE_UPDATE_INTERVAL = 60000; // 1 minute
export const SNAPSHOT_INTERVAL = 3600000; // 1 hour
