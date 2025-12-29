
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  bg: string;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, icon: Icon, color, bg }) => (
  <div className="bg-brand-lightSecondary dark:bg-brand-darkSecondary border border-slate-200 dark:border-gray-800 p-4 md:p-5 rounded-[24px] md:rounded-[32px] hover:shadow-lg transition-all group overflow-hidden">
    <div className="flex justify-between items-center mb-3 md:mb-4">
      <div className={`p-2.5 md:p-3 rounded-xl md:rounded-2xl ${bg}`}>
        <Icon className={`w-4 h-4 md:w-5 md:h-5 ${color}`} />
      </div>
      <span className="text-[9px] md:text-[10px] font-black text-slate-400 dark:text-gray-500 uppercase tracking-widest">{label}</span>
    </div>
    <h3 className="text-lg md:text-3xl font-black font-mono text-slate-900 dark:text-white truncate leading-tight">{value}</h3>
  </div>
);

interface ActionModuleProps {
  title: string;
  description: string;
  icon: LucideIcon;
  colorClass: string;
  bgClass: string;
  primaryAction: { label: string; onClick: () => void };
}

export const ActionModule: React.FC<ActionModuleProps> = ({ 
  title, description, icon: Icon, colorClass, bgClass, primaryAction 
}) => (
  <div className="bg-brand-lightSecondary dark:bg-brand-darkSecondary border border-slate-200 dark:border-gray-800 p-6 md:p-8 rounded-[32px] md:rounded-[40px] flex flex-col justify-between hover:border-blue-500/30 transition-all group shadow-sm">
    <div>
      <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
        <div className={`p-3 md:p-4 ${bgClass} rounded-xl md:rounded-2xl ${colorClass}`}><Icon className="w-5 h-5 md:w-6 md:h-6" /></div>
        <h4 className="text-lg md:text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white leading-none">{title}</h4>
      </div>
      <p className="text-xs md:text-sm text-slate-500 dark:text-gray-500 mb-6 md:mb-8 leading-relaxed font-bold">{description}</p>
    </div>
    <button 
      onClick={primaryAction.onClick} 
      className={`w-full py-3.5 md:py-4 ${bgClass} hover:bg-blue-600 ${colorClass} hover:text-white rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs transition-all uppercase tracking-widest active:scale-95`}
    >
      {primaryAction.label}
    </button>
  </div>
);

interface AdminTableProps {
  headers: string[];
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  hideHeadersOnMobile?: boolean;
}

export const AdminTable: React.FC<AdminTableProps> = ({ headers, children, title, subtitle, action, hideHeadersOnMobile = true }) => (
  <div className="bg-brand-lightSecondary dark:bg-brand-darkSecondary border border-slate-200 dark:border-gray-800 rounded-[24px] md:rounded-[32px] overflow-hidden shadow-sm">
    {(title || action) && (
      <div className="p-6 md:p-8 border-b border-slate-100 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50 dark:bg-brand-darkSecondary/30">
        <div>
          {title && <h3 className="text-lg md:text-xl font-black leading-none uppercase tracking-tighter text-slate-900 dark:text-white">{title}</h3>}
          {subtitle && <p className="text-[9px] text-slate-400 dark:text-gray-600 mt-1.5 md:mt-2 uppercase tracking-[0.2em] font-black">{subtitle}</p>}
        </div>
        <div className="w-full sm:w-auto">
          {action}
        </div>
      </div>
    )}
    <div className="overflow-x-auto w-full no-scrollbar">
      <table className="w-full text-left min-w-full md:min-w-[700px]">
        <thead className={`${hideHeadersOnMobile ? 'hidden md:table-header-group' : 'table-header-group'} bg-slate-50 dark:bg-brand-darkSecondary/50 text-[9px] md:text-[10px] font-black text-slate-500 dark:text-gray-500 uppercase tracking-widest`}>
          <tr>
            {headers.map((header, i) => (
              <th key={header} className={`px-4 md:px-8 py-4 md:py-5 ${i === headers.length - 1 ? 'text-right' : ''}`}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-gray-800/50">
          {children}
        </tbody>
      </table>
    </div>
  </div>
);

interface StatusBadgeProps {
  status: string;
  variant: 'success' | 'warning' | 'danger' | 'info';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, variant }) => {
  const styles = {
    success: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-600 dark:text-amber-500 border-amber-500/20',
    danger: 'bg-rose-500/10 text-rose-600 dark:text-rose-500 border-rose-500/20',
    info: 'bg-blue-500/10 text-blue-600 dark:text-blue-500 border-blue-500/20',
  };
  return (
    <span className={`px-2 md:px-2.5 py-1 md:py-1.5 rounded-lg md:rounded-xl text-[8px] md:text-[9px] font-black uppercase tracking-widest border ${styles[variant]} whitespace-nowrap inline-block`}>
      {status}
    </span>
  );
};
