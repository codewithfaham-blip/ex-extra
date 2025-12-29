
import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { LifeBuoy, Send, MessageSquare, Clock, Plus, HelpCircle, ChevronRight, X } from 'lucide-react';

export const SupportPage = () => {
  const { tickets, createTicket, currentUser } = useApp();
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('MEDIUM');

  if (!currentUser) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !message) return;
    createTicket(subject, message, priority);
    setSubject('');
    setMessage('');
    setIsNewTicketOpen(false);
  };

  const userTickets = tickets.filter(t => t.userId === currentUser.id);

  const faqs = [
    { q: 'How fast are withdrawal approvals?', a: 'Standard nodes are processed in 24h. Institutional nodes are instant.' },
    { q: 'What is the minimum stake?', a: 'You can start your wealth journey with as little as $100.' },
    { q: 'Is the ROI guaranteed?', a: 'Our arbitrage engine maintains a 99.8% success rate historically.' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 md:pb-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Technical Helpdesk</h2>
          <p className="text-slate-500 dark:text-gray-400 font-medium mt-2">Expert support available 24/7 for all platform inquiries.</p>
        </div>
        <button 
          onClick={() => setIsNewTicketOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" /> Open New Ticket
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Active Tickets List */}
          <div className="bg-brand-lightSecondary dark:bg-brand-darkSecondary border border-slate-200 dark:border-gray-800 rounded-[40px] overflow-hidden shadow-sm">
             <div className="p-6 border-b border-slate-100 dark:border-gray-800 bg-slate-50/50 dark:bg-brand-darkSecondary/30">
               <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-tight">My Communication Logs</h3>
             </div>
             
             <div className="divide-y divide-slate-100 dark:divide-gray-800/50">
               {userTickets.length === 0 ? (
                 <div className="p-16 text-center text-slate-400 dark:text-gray-600">
                    <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-10" />
                    <p className="font-black uppercase tracking-widest text-[10px]">No active queries</p>
                 </div>
               ) : (
                 userTickets.map(ticket => (
                   <div key={ticket.id} className="p-6 hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors group cursor-pointer">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-3">
                           <div className={`w-2 h-2 rounded-full ${ticket.status === 'OPEN' ? 'bg-blue-500 animate-pulse' : 'bg-emerald-500'}`} />
                           <h4 className="font-black text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">{ticket.subject}</h4>
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md bg-slate-100 dark:bg-white/5 text-slate-400">#{ticket.id}</span>
                      </div>
                      <p className="text-sm text-slate-500 dark:text-gray-400 line-clamp-1 mb-4 font-medium">{ticket.message}</p>
                      <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                         <div className="flex items-center gap-4">
                           <span className="text-slate-400 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {new Date(ticket.createdAt).toLocaleDateString()}</span>
                           <span className={`${ticket.priority === 'HIGH' ? 'text-rose-500' : 'text-amber-500'}`}>{ticket.priority} Priority</span>
                         </div>
                         <ChevronRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 transition-transform" />
                      </div>
                   </div>
                 ))
               )}
             </div>
          </div>

          {/* FAQ Cluster */}
          <div className="space-y-4">
            <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight ml-2">Knowledge Base</h3>
            <div className="grid md:grid-cols-2 gap-4">
               {faqs.map((f, i) => (
                 <div key={i} className="p-6 bg-brand-lightSecondary dark:bg-brand-darkSecondary border border-slate-200 dark:border-gray-800 rounded-3xl shadow-sm hover:border-blue-500/30 transition-all">
                   <HelpCircle className="w-5 h-5 text-blue-600 mb-4" />
                   <h5 className="font-black text-sm text-slate-900 dark:text-white mb-2 uppercase tracking-tight">{f.q}</h5>
                   <p className="text-xs text-slate-500 dark:text-gray-500 font-bold leading-relaxed">{f.a}</p>
                 </div>
               ))}
            </div>
          </div>
        </div>

        {/* Support Sidebar Info */}
        <div className="space-y-8">
           <div className="bg-brand-lightSecondary dark:bg-brand-darkSecondary border border-slate-200 dark:border-gray-800 p-8 rounded-[40px] shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-5">
                 <LifeBuoy className="w-20 h-20 text-blue-600" />
              </div>
              <h4 className="text-xl font-black text-slate-900 dark:text-white mb-6 uppercase tracking-tight">Live Terminal</h4>
              <p className="text-xs text-slate-500 dark:text-gray-500 font-bold leading-relaxed mb-8">Direct node-to-node encryption is active on all support communications.</p>
              <div className="flex items-center gap-3 p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
                 <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">8 Agents Online</span>
              </div>
           </div>
        </div>
      </div>

      {/* New Ticket Modal */}
      {isNewTicketOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 backdrop-blur-3xl bg-black/60 animate-in fade-in duration-300">
           <div className="bg-brand-lightSecondary dark:bg-brand-darkSecondary border border-slate-200 dark:border-white/10 w-full max-w-xl rounded-[40px] shadow-2xl overflow-hidden">
              <div className="p-8 border-b border-slate-100 dark:border-white/5 flex justify-between items-center bg-slate-50 dark:bg-brand-darkSecondary/60">
                <h3 className="text-2xl font-black tracking-tighter uppercase text-slate-900 dark:text-white">Log Support Ticket</h3>
                <button onClick={() => setIsNewTicketOpen(false)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-white/5 p-3 rounded-xl"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                 <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 dark:text-gray-600 uppercase tracking-widest ml-1">Subject</label>
                   <input 
                    required 
                    placeholder="e.g. Withdrawal Inquiry"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#141922] border border-slate-200 dark:border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-blue-600 text-slate-900 dark:text-white font-bold" 
                   />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 dark:text-gray-600 uppercase tracking-widest ml-1">Priority Level</label>
                    <select 
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as any)}
                      className="w-full bg-slate-50 dark:bg-[#141922] border border-slate-200 dark:border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-blue-600 text-slate-900 dark:text-white font-bold"
                    >
                      <option value="LOW">Low - General Inquiry</option>
                      <option value="MEDIUM">Medium - Technical Issue</option>
                      <option value="HIGH">High - Transaction Issue</option>
                    </select>
                 </div>
                 <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 dark:text-gray-600 uppercase tracking-widest ml-1">Message Detail</label>
                   <textarea 
                    required 
                    rows={4}
                    placeholder="Describe your issue in detail..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#141922] border border-slate-200 dark:border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-blue-600 text-slate-900 dark:text-white font-bold resize-none" 
                   />
                 </div>
                 <button type="submit" className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all">
                   <Send className="w-5 h-5" /> Transmission Ticket
                 </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};
