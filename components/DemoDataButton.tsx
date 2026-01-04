import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { AssetType } from '../types';
import { Sparkles } from 'lucide-react';

export const DemoDataButton: React.FC = () => {
  const { addHolding, addCash, addToast } = useApp();
  const [isLoading, setIsLoading] = useState(false);

  const loadDemoData = async () => {
    setIsLoading(true);
    try {
      addCash(10000);

      const demoHoldings = [
        {
          symbol: 'AAPL',
          name: 'Apple Inc.',
          type: AssetType.STOCK,
          quantity: 10,
          costBasis: 150,
          purchaseDate: Date.now() - 30 * 24 * 60 * 60 * 1000,
          assetId: 'stock-aapl',
          totalCost: 1500
        },
        {
          symbol: 'BTC',
          name: 'Bitcoin',
          type: AssetType.CRYPTO,
          quantity: 0.5,
          costBasis: 40000,
          purchaseDate: Date.now() - 60 * 24 * 60 * 60 * 1000,
          assetId: 'crypto-btc',
          totalCost: 20000
        },
        {
          symbol: 'SPY',
          name: 'SPDR S&P 500 ETF',
          type: AssetType.ETF,
          quantity: 20,
          costBasis: 400,
          purchaseDate: Date.now() - 90 * 24 * 60 * 60 * 1000,
          assetId: 'etf-spy',
          totalCost: 8000
        },
        {
          symbol: 'ETH',
          name: 'Ethereum',
          type: AssetType.CRYPTO,
          quantity: 5,
          costBasis: 2000,
          purchaseDate: Date.now() - 45 * 24 * 60 * 60 * 1000,
          assetId: 'crypto-eth',
          totalCost: 10000
        }
      ];

      for (const holding of demoHoldings) {
        await addHolding(holding);
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      addToast('Demo portfolio loaded successfully!', 'success', 'Welcome');
    } catch (error) {
      console.error('Error loading demo data:', error);
      addToast('Failed to load demo data', 'error', 'Error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={loadDemoData}
      disabled={isLoading}
      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
    >
      <Sparkles className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
      {isLoading ? 'Loading Demo Data...' : 'Load Demo Portfolio'}
    </button>
  );
};
