import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Chat, GenerateContentResponse } from '@google/genai';
import { useApp } from '../store/AppContext';
import { MessageSquare, Send, X, Bot, User, Loader2, Minus, Maximize2, Cpu } from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export const AIAgent: React.FC = () => {
  const { currentUser, investments, plans } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentUser && messages.length === 0) {
      setMessages([
        { 
          role: 'model', 
          text: `Neural link established. CryptoYield AI Node online for Investor ${currentUser.name}. State your data verification request.` 
        }
      ]);
    }
  }, [currentUser, messages.length]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages]);

  const handleSendMessage = async (customInput?: string) => {
    const textToSend = customInput || input;
    if (!textToSend.trim() || isLoading) return;

    const userMessage = textToSend.trim();
    if (!customInput) setInput('');
    
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      
      const userContext = `
        MEMBER CORE:
        - Identity: ${currentUser?.name}
        - Liquid Balance: $${currentUser?.balance.toLocaleString()}
        - Capital Allocated: $${currentUser?.totalInvested.toLocaleString()}
        - Settlement Volume: $${currentUser?.totalWithdrawn.toLocaleString()}
        
        ACTIVE CONTRACTS:
        ${investments.filter(i => i.userId === currentUser?.id && i.status === 'ACTIVE').map(i => {
          const plan = plans.find(p => p.id === i.planId);
          return `- ${plan?.name}: $${i.amount} stake, earned $${i.earnedSoFar.toFixed(2)}`;
        }).join('\n') || 'None'}
      `;

      const systemInstruction = `
        You are the "CryptoYield AI Node". Be extremely concise (under 20 words).
        Tone: Cybernetic, efficient.
        User Data: ${userContext}
      `;

      const chat: Chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
          systemInstruction,
          temperature: 0.1,
        },
      });

      const response: GenerateContentResponse = await chat.sendMessage({ message: userMessage });
      const text = response.text || "PROTOCOL FAILURE: NO RESPONSE.";
      
      setMessages(prev => [...prev, { role: 'model', text }]);
    } catch (error) {
      console.error('AI Error:', error);
      setMessages(prev => [...prev, { role: 'model', text: 'PROTOCOL FAILURE: Uplink disrupted.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!currentUser) return null;

  return (
    <div className="fixed bottom-24 right-6 md:right-8 z-[60] flex flex-col items-end gap-4 pointer-events-none">
      {isOpen && (
        <div className={`pointer-events-auto bg-white/95 dark:bg-brand-darkSecondary/95 backdrop-blur-3xl border border-slate-200 dark:border-white/10 rounded-[32px] shadow-2xl flex flex-col transition-all duration-500 overflow-hidden ${
          isMinimized ? 'h-16 w-72' : 'h-[580px] w-[350px] md:w-[420px]'
        }`}>
          <div className="p-5 bg-blue-600/5 border-b border-slate-200 dark:border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Cpu className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white">AI Support Node</h4>
                <div className="flex items-center gap-1.5">
                  <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[9px] font-black text-slate-400 uppercase">Live</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button onClick={() => setIsMinimized(!isMinimized)} className="p-2 text-slate-400 hover:text-blue-500 transition-colors">
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
              </button>
              <button onClick={() => setIsOpen(false)} className="p-2 text-slate-400 hover:text-rose-500 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                      msg.role === 'user' ? 'bg-slate-200 dark:bg-white/5 text-slate-500' : 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                    }`}>
                      {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>
                    <div className={`p-4 rounded-2xl text-sm max-w-[80%] ${
                      msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-white/5 text-slate-800 dark:text-gray-200'
                    }`}>
                      {msg.text || (isLoading && <Loader2 className="w-4 h-4 animate-spin" />)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 border-t border-slate-200 dark:border-white/5">
                <form 
                  onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                  className="relative"
                >
                  <input 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Inquire balance or strategy..."
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-4 text-sm font-bold text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-blue-600"
                  />
                  <button 
                    disabled={!input.trim() || isLoading}
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-blue-600 text-white rounded-xl shadow-lg active:scale-95 disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      )}

      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="pointer-events-auto w-16 h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-2xl flex items-center justify-center transition-all hover:-translate-y-1 active:scale-90"
        >
          <MessageSquare className="w-8 h-8" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-brand-dark rounded-full" />
        </button>
      )}
    </div>
  );
};