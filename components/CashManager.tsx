import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { DollarSign, Plus, Minus, Wallet } from 'lucide-react';

export const CashManager: React.FC = () => {
  const { cashBalance, addCash, withdrawCash } = useApp();
  const [showModal, setShowModal] = useState<'deposit' | 'withdraw' | null>(null);
  const [amount, setAmount] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = parseFloat(amount);
    if (isNaN(value) || value <= 0) return;

    if (showModal === 'deposit') {
      addCash(value);
    } else if (showModal === 'withdraw') {
      withdrawCash(value);
    }

    setAmount('');
    setShowModal(null);
  };

  return (
    <>
      <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg">
            <Wallet className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-gray-400 text-sm">Cash Balance</p>
            <p className="text-2xl font-bold text-white">
              ${cashBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setShowModal('deposit')}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Deposit
          </button>
          <button
            onClick={() => setShowModal('withdraw')}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            <Minus className="w-4 h-4" />
            Withdraw
          </button>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full shadow-2xl border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-4">
              {showModal === 'deposit' ? 'Deposit Cash' : 'Withdraw Cash'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Amount</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    step="0.01"
                    required
                    min="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                {showModal === 'withdraw' && (
                  <p className="text-sm text-gray-400 mt-2">
                    Available: ${cashBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(null);
                    setAmount('');
                  }}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Confirm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
