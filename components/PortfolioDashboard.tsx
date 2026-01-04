import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PieChart as PieChartIcon, 
  Activity,
  Plus,
  RefreshCw,
  Wallet
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { ASSET_TYPE_COLORS, ASSET_TYPE_LABELS } from '../constants';
import { AssetType } from '../types';
import { DemoDataButton } from './DemoDataButton';

export const PortfolioDashboard: React.FC = () => {
  const { 
    portfolioMetrics, 
    assetAllocation, 
    holdings, 
    snapshots,
    cashBalance,
    refreshPrices,
    transactions 
  } = useApp();
  
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshPrices();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const chartData = snapshots.slice(-30).map(snapshot => ({
    date: new Date(snapshot.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    value: snapshot.totalValue,
    cost: snapshot.totalCost
  }));

  const pieData = assetAllocation.map(allocation => ({
    name: ASSET_TYPE_LABELS[allocation.type],
    value: allocation.value,
    count: allocation.count
  }));

  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-white">Portfolio Dashboard</h1>
          <p className="text-gray-400 mt-1">Track your investments in real-time</p>
        </div>
        <div className="flex gap-3">
          {holdings.length === 0 && <DemoDataButton />}
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh Prices
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Portfolio Value"
          value={`$${portfolioMetrics.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={<DollarSign className="w-6 h-6" />}
          color="blue"
        />
        
        <MetricCard
          title="Total Gain/Loss"
          value={`$${Math.abs(portfolioMetrics.unrealizedGain).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          subtitle={`${portfolioMetrics.unrealizedGainPercent >= 0 ? '+' : ''}${portfolioMetrics.unrealizedGainPercent.toFixed(2)}%`}
          icon={portfolioMetrics.unrealizedGain >= 0 ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
          color={portfolioMetrics.unrealizedGain >= 0 ? 'green' : 'red'}
        />
        
        <MetricCard
          title="Cash Balance"
          value={`$${cashBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={<Wallet className="w-6 h-6" />}
          color="purple"
        />
        
        <MetricCard
          title="Total Assets"
          value={holdings.length.toString()}
          subtitle={`Invested: $${portfolioMetrics.investedAmount.toLocaleString()}`}
          icon={<Activity className="w-6 h-6" />}
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Portfolio Performance
          </h2>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="Portfolio Value"
                  dot={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="cost" 
                  stroke="#6b7280" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Cost Basis"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-400">
              <p>No historical data yet. Portfolio performance will be tracked over time.</p>
            </div>
          )}
        </div>

        <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <PieChartIcon className="w-5 h-5" />
            Asset Allocation
          </h2>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => {
                    const assetType = Object.keys(ASSET_TYPE_LABELS).find(
                      key => ASSET_TYPE_LABELS[key as AssetType] === entry.name
                    ) as AssetType;
                    return <Cell key={`cell-${index}`} fill={ASSET_TYPE_COLORS[assetType]} />;
                  })}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                  formatter={(value: number) => `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-400">
              <p>No assets in portfolio yet. Add your first holding to see allocation.</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
        <h2 className="text-xl font-bold text-white mb-4">Recent Transactions</h2>
        {recentTransactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-400 font-semibold">Date</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-semibold">Type</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-semibold">Symbol</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-semibold">Quantity</th>
                  <th className="text-right py-3 px-4 text-gray-400 font-semibold">Amount</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((tx) => (
                  <tr key={tx.id} className="border-b border-gray-700 hover:bg-gray-750">
                    <td className="py-3 px-4 text-white">
                      {new Date(tx.date).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        tx.type === 'BUY' ? 'bg-green-900 text-green-300' :
                        tx.type === 'SELL' ? 'bg-red-900 text-red-300' :
                        'bg-blue-900 text-blue-300'
                      }`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-white font-mono">
                      {tx.symbol || '-'}
                    </td>
                    <td className="py-3 px-4 text-white">
                      {tx.quantity ? tx.quantity.toFixed(4) : '-'}
                    </td>
                    <td className="py-3 px-4 text-right text-white font-semibold">
                      ${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <p>No transactions yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'red' | 'purple' | 'orange';
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, subtitle, icon, color }) => {
  const colorClasses = {
    blue: 'from-blue-600 to-blue-700',
    green: 'from-green-600 to-green-700',
    red: 'from-red-600 to-red-700',
    purple: 'from-purple-600 to-purple-700',
    orange: 'from-orange-600 to-orange-700'
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-gray-400 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-white mt-2">{value}</p>
          {subtitle && (
            <p className={`text-sm font-semibold mt-1 ${
              color === 'green' ? 'text-green-400' : 
              color === 'red' ? 'text-red-400' : 
              'text-gray-400'
            }`}>
              {subtitle}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg bg-gradient-to-br ${colorClasses[color]} text-white`}>
          {icon}
        </div>
      </div>
    </div>
  );
};
