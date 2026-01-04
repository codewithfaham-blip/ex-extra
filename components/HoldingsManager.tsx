import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { Plus, Trash2, TrendingUp, TrendingDown, Edit2, X, Search } from 'lucide-react';
import { AssetType } from '../types';
import { ASSET_TYPE_LABELS } from '../constants';

export const HoldingsManager: React.FC = () => {
  const { holdings, removeHolding, addHolding, addToast } = useApp();
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterType, setFilterType] = useState<AssetType | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredHoldings = holdings.filter(holding => {
    const matchesType = filterType === 'ALL' || holding.type === filterType;
    const matchesSearch = holding.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          holding.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleDelete = async (holdingId: string) => {
    if (window.confirm('Are you sure you want to remove this holding from your portfolio?')) {
      await removeHolding(holdingId);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">My Holdings</h1>
          <p className="text-gray-400 mt-1">Manage your investment portfolio</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Holding
        </button>
      </div>

      <div className="bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-700">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by symbol or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as AssetType | 'ALL')}
            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Types</option>
            {Object.entries(ASSET_TYPE_LABELS).map(([type, label]) => (
              <option key={type} value={type}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      {filteredHoldings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredHoldings.map((holding) => (
            <div key={holding.id} className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700 hover:border-gray-600 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-white">{holding.symbol}</h3>
                    <span className="px-2 py-1 text-xs font-semibold rounded bg-gray-700 text-gray-300">
                      {ASSET_TYPE_LABELS[holding.type]}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">{holding.name}</p>
                </div>
                <button
                  onClick={() => handleDelete(holding.id)}
                  className="p-2 text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Quantity</span>
                  <span className="text-white font-semibold">{holding.quantity.toFixed(4)}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Cost Basis</span>
                  <span className="text-white font-semibold">${holding.costBasis.toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Current Price</span>
                  <span className="text-white font-semibold">${holding.currentPrice.toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-gray-700">
                  <span className="text-gray-400 text-sm">Total Cost</span>
                  <span className="text-white font-semibold">${holding.totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Current Value</span>
                  <span className="text-white font-semibold">${holding.currentValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-gray-700">
                  <span className="text-gray-400 text-sm">Unrealized Gain/Loss</span>
                  <div className="text-right">
                    <div className={`font-bold flex items-center gap-1 ${holding.unrealizedGain >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {holding.unrealizedGain >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      ${Math.abs(holding.unrealizedGain).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div className={`text-sm font-semibold ${holding.unrealizedGainPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {holding.unrealizedGainPercent >= 0 ? '+' : ''}{holding.unrealizedGainPercent.toFixed(2)}%
                    </div>
                  </div>
                </div>

                <div className="pt-2 text-xs text-gray-500">
                  Purchased: {new Date(holding.purchaseDate).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-800 rounded-xl p-12 text-center border border-gray-700">
          <p className="text-gray-400 text-lg">No holdings found</p>
          <p className="text-gray-500 text-sm mt-2">
            {searchQuery || filterType !== 'ALL' ? 'Try adjusting your filters' : 'Add your first holding to get started'}
          </p>
        </div>
      )}

      {showAddForm && <AddHoldingForm onClose={() => setShowAddForm(false)} />}
    </div>
  );
};

const AddHoldingForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { addHolding } = useApp();
  const [formData, setFormData] = useState({
    symbol: '',
    name: '',
    type: AssetType.STOCK,
    quantity: '',
    costBasis: '',
    purchaseDate: new Date().toISOString().split('T')[0],
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await addHolding({
        symbol: formData.symbol.toUpperCase(),
        name: formData.name || formData.symbol.toUpperCase(),
        type: formData.type,
        quantity: parseFloat(formData.quantity),
        costBasis: parseFloat(formData.costBasis),
        totalCost: parseFloat(formData.quantity) * parseFloat(formData.costBasis),
        purchaseDate: new Date(formData.purchaseDate).getTime(),
        notes: formData.notes,
        assetId: `${formData.type.toLowerCase()}-${formData.symbol.toLowerCase()}`
      });
      onClose();
    } catch (error) {
      console.error('Error adding holding:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full shadow-2xl border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Add Holding</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Symbol *</label>
            <input
              type="text"
              required
              value={formData.symbol}
              onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
              placeholder="e.g., AAPL, BTC, SPY"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Apple Inc."
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Asset Type *</label>
            <select
              required
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as AssetType })}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Object.entries(ASSET_TYPE_LABELS).map(([type, label]) => (
                <option key={type} value={type}>{label}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Quantity *</label>
              <input
                type="number"
                step="any"
                required
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                placeholder="0.00"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Cost Basis *</label>
              <input
                type="number"
                step="any"
                required
                value={formData.costBasis}
                onChange={(e) => setFormData({ ...formData, costBasis: e.target.value })}
                placeholder="0.00"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Purchase Date *</label>
            <input
              type="date"
              required
              value={formData.purchaseDate}
              onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
              max={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Optional notes..."
              rows={3}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Adding...' : 'Add Holding'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
