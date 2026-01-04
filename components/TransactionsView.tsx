import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { Filter, Download, Search } from 'lucide-react';
import { TransactionType } from '../types';

export const TransactionsView: React.FC = () => {
  const { transactions } = useApp();
  const [filterType, setFilterType] = useState<TransactionType | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTransactions = transactions.filter(tx => {
    const matchesType = filterType === 'ALL' || tx.type === filterType;
    const matchesSearch = !tx.symbol || 
      tx.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.details?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const exportToCSV = () => {
    const headers = ['Date', 'Type', 'Symbol', 'Quantity', 'Price', 'Amount', 'Status', 'Details'];
    const rows = filteredTransactions.map(tx => [
      new Date(tx.date).toISOString(),
      tx.type,
      tx.symbol || '',
      tx.quantity || '',
      tx.pricePerUnit || '',
      tx.amount,
      tx.status,
      tx.details || ''
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions_${Date.now()}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Transactions</h1>
          <p className="text-gray-400 mt-1">View your transaction history</p>
        </div>
        <button
          onClick={exportToCSV}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      <div className="bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-700">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as TransactionType | 'ALL')}
            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Types</option>
            <option value={TransactionType.BUY}>Buy</option>
            <option value={TransactionType.SELL}>Sell</option>
            <option value={TransactionType.DEPOSIT}>Deposit</option>
            <option value={TransactionType.WITHDRAWAL}>Withdrawal</option>
            <option value={TransactionType.DIVIDEND}>Dividend</option>
          </select>
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden">
        {filteredTransactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-750">
                <tr className="border-b border-gray-700">
                  <th className="text-left py-4 px-6 text-gray-400 font-semibold">Date & Time</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-semibold">Type</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-semibold">Symbol</th>
                  <th className="text-right py-4 px-6 text-gray-400 font-semibold">Quantity</th>
                  <th className="text-right py-4 px-6 text-gray-400 font-semibold">Price</th>
                  <th className="text-right py-4 px-6 text-gray-400 font-semibold">Amount</th>
                  <th className="text-center py-4 px-6 text-gray-400 font-semibold">Status</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-semibold">Details</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((tx, index) => (
                  <tr 
                    key={tx.id} 
                    className={`border-b border-gray-700 hover:bg-gray-750 transition-colors ${
                      index === 0 ? 'bg-gray-750/50' : ''
                    }`}
                  >
                    <td className="py-4 px-6 text-white">
                      <div className="font-medium">
                        {new Date(tx.date).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(tx.date).toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        tx.type === TransactionType.BUY ? 'bg-green-900 text-green-300' :
                        tx.type === TransactionType.SELL ? 'bg-red-900 text-red-300' :
                        tx.type === TransactionType.DEPOSIT ? 'bg-blue-900 text-blue-300' :
                        tx.type === TransactionType.WITHDRAWAL ? 'bg-orange-900 text-orange-300' :
                        'bg-purple-900 text-purple-300'
                      }`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-white font-mono font-semibold">
                      {tx.symbol || '-'}
                    </td>
                    <td className="py-4 px-6 text-right text-white">
                      {tx.quantity ? tx.quantity.toFixed(4) : '-'}
                    </td>
                    <td className="py-4 px-6 text-right text-white">
                      {tx.pricePerUnit ? `$${tx.pricePerUnit.toLocaleString()}` : '-'}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span className={`font-semibold ${
                        tx.type === TransactionType.BUY || tx.type === TransactionType.WITHDRAWAL 
                          ? 'text-red-400' 
                          : 'text-green-400'
                      }`}>
                        {tx.type === TransactionType.BUY || tx.type === TransactionType.WITHDRAWAL ? '-' : '+'}
                        ${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        tx.status === 'COMPLETED' ? 'bg-green-900 text-green-300' :
                        tx.status === 'PENDING' ? 'bg-yellow-900 text-yellow-300' :
                        'bg-red-900 text-red-300'
                      }`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-400 text-sm max-w-xs truncate">
                      {tx.details || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">No transactions found</p>
            <p className="text-gray-500 text-sm mt-2">
              {searchQuery || filterType !== 'ALL' 
                ? 'Try adjusting your filters' 
                : 'Your transaction history will appear here'}
            </p>
          </div>
        )}
      </div>

      {filteredTransactions.length > 0 && (
        <div className="flex justify-between items-center text-sm text-gray-400">
          <p>Showing {filteredTransactions.length} of {transactions.length} transactions</p>
          <p>Total Volume: ${filteredTransactions.reduce((sum, tx) => sum + tx.amount, 0).toLocaleString()}</p>
        </div>
      )}
    </div>
  );
};
