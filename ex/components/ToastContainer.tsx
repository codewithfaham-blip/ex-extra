
import React from 'react';
import { useApp, Toast } from '../store/AppContext';
import { CheckCircle2, Info, XCircle, X, TrendingUp } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  return (
    <div className="fixed top-24 right-6 z-[100] flex flex-col gap-4 pointer-events-none max-w-sm w-full">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: Toast; onClose: () => void }> = ({ toast, onClose }) => {
  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
    error: <XCircle className="w-5 h-5 text-rose-500" />,
  };

  return (
    <div className="pointer-events-auto bg-white/80 dark:bg-brand-darkSecondary/90 backdrop-blur-xl border border-slate-200 dark:border-white/5 rounded-3xl p-5 shadow-2xl flex items-start gap-4 animate-in slide-in-from-right-8 fade-in duration-300 group">
      <div className={`flex-shrink-0 p-2.5 rounded-2xl ${
        toast.type === 'success' ? 'bg-emerald-500/10' : 
        toast.type === 'error' ? 'bg-rose-500/10' : 'bg-blue-500/10'
      }`}>
        {toast.title === 'Yield Payout Received' ? <TrendingUp className="w-5 h-5 text-emerald-500" /> : icons[toast.type]}
      </div>
      
      <div className="flex-1 pt-1">
        {toast.title && <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-900 dark:text-white mb-1 leading-none">{toast.title}</h4>}
        <p className="text-sm font-medium text-slate-500 dark:text-gray-400 leading-snug">{toast.message}</p>
      </div>

      <button 
        onClick={onClose}
        className="text-slate-300 dark:text-gray-600 hover:text-slate-900 dark:hover:text-white transition-colors"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Auto-dismiss progress bar */}
      <div className="absolute bottom-0 left-0 h-1 bg-blue-600/20 w-full rounded-b-3xl overflow-hidden">
        <div className="h-full bg-blue-600 animate-[shrink_5000ms_linear_forwards]" />
      </div>
    </div>
  );
};

// Add keyframes to tailwind config? No, we can use a standard style tag or inline
const styles = `
  @keyframes shrink {
    from { width: 100%; }
    to { width: 0%; }
  }
`;
