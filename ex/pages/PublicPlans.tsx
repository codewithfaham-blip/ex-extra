
import React from 'react';
import { useApp } from '../store/AppContext';
import { PublicNavbar } from '../components/Navbar';
import { Check } from 'lucide-react';

export const PublicPlansPage: React.FC = () => {
  const { plans } = useApp();

  return (
    <div className="min-h-screen bg-brand-light dark:bg-brand-dark pt-32 pb-20 px-6">
      <PublicNavbar />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-black text-center mb-10 tracking-tighter uppercase text-slate-900 dark:text-white">
          Investment Plans
        </h1>
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="bg-white dark:bg-brand-darkSecondary border border-slate-200 dark:border-gray-800 p-8 rounded-3xl shadow-lg"
            >
              <h2 className="text-xl font-black mb-4 text-slate-900 dark:text-white">{plan.name}</h2>
              <p className="text-4xl font-black text-blue-600 dark:text-blue-500 mb-6">{plan.roi}%</p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-emerald-500" />
                  <span className="text-sm text-slate-600 dark:text-gray-400">
                    Min. investment: ${plan.minAmount}
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-emerald-500" />
                  <span className="text-sm text-slate-600 dark:text-gray-400">
                    Max. investment: ${plan.maxAmount}
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-emerald-500" />
                  <span className="text-sm text-slate-600 dark:text-gray-400">
                    Duration: {plan.durationDays} days
                  </span>
                </li>
              </ul>
              <button className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold">
                Get Started
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
