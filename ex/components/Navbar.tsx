import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, Menu, X, LayoutDashboard, Sun, Moon } from 'lucide-react';
import { useApp } from '../store/AppContext';

export const PublicNavbar: React.FC = () => {
  const { currentUser, theme, toggleTheme } = useApp();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect for premium glass look
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Investment Plans', path: '/public-plans' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        scrolled 
          ? 'bg-brand-light/90 dark:bg-brand-dark/90 backdrop-blur-2xl py-3 border-slate-200 dark:border-white/10 shadow-lg' 
          : 'bg-transparent py-5 border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        
        {/* Left: Hamburger (Shifted here) + Branding */}
        <div className="flex items-center gap-4">
          <button 
            className="text-slate-500 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white p-2 transition-all md:hidden border border-slate-200 dark:border-white/5 bg-slate-100 dark:bg-white/5 rounded-xl active:scale-90"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <Link to="/" className="group transition-transform active:scale-95 flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-xl text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] group-hover:shadow-[0_0_25px_rgba(37,99,235,0.6)] transition-all">
              C
            </div>
            <span className="hidden sm:block font-black text-lg tracking-tighter text-slate-900 dark:text-white uppercase">Crypto<span className="text-blue-500">Yield</span></span>
          </Link>
        </div>

        {/* Center: Desktop Navigation */}
        <div className="hidden md:flex flex-1 justify-center">
          <div className="flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-xs font-bold uppercase tracking-[0.15em] transition-all ${
                  isActive(link.path) 
                  ? 'text-blue-500' 
                  : 'text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Right: Actions & Theme Toggle */}
        <div className="flex items-center gap-3">
          
          <button 
            onClick={toggleTheme}
            className="p-2.5 text-slate-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-white bg-slate-100 dark:bg-white/5 rounded-xl transition-all border border-transparent hover:border-blue-200 dark:hover:border-white/10"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {currentUser ? (
            <Link 
              to="/dashboard" 
              className="bg-blue-600 hover:bg-blue-700 md:px-8 px-4 md:py-3 py-2.5 rounded-xl md:rounded-2xl font-bold text-xs md:text-sm text-white transition-all shadow-xl shadow-blue-900/30 flex items-center gap-2"
            >
              <LayoutDashboard className="w-4 h-4 md:w-5 md:h-5" />
              <span className="hidden sm:inline">Portal Access</span>
              <span className="sm:hidden">Portal</span>
            </Link>
          ) : (
            <Link 
              to="/login" 
              className="bg-blue-600 border border-blue-400/30 md:px-8 px-5 md:py-3 py-2.5 rounded-xl md:rounded-2xl font-bold text-xs md:text-sm text-white flex items-center gap-2 shadow-lg shadow-blue-600/20 active:scale-95 transition-all"
            >
              <User className="w-4 h-4" />
              Login
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-brand-lightSecondary dark:bg-brand-darkSecondary border-b border-slate-200 dark:border-white/5 p-8 flex flex-col gap-6 animate-in slide-in-from-top-4 duration-300 shadow-2xl">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`text-xl font-bold tracking-tight flex items-center justify-between ${
                isActive(link.path) ? 'text-blue-500' : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {link.name}
              <div className={`w-1.5 h-1.5 rounded-full bg-blue-500 transition-opacity ${isActive(link.path) ? 'opacity-100' : 'opacity-0'}`} />
            </Link>
          ))}
          {!currentUser && (
            <Link 
              to="/register" 
              onClick={() => setIsOpen(false)}
              className="mt-4 w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-center font-bold transition-all shadow-xl shadow-blue-900/20"
            >
              Register Now
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};