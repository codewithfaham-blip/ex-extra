import React from 'react';
import './globals.css';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { AppProvider } from '@/context/AppContext';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata = {
  title: 'CryptoYield | Premium HYIP Platform',
  description: 'Institutional-grade high-yield investment program platform.',
};

// Fixed: Added missing React import to support React namespace usage for types
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable}`}>
      <body className="bg-[#0b0e14] text-[#f3f4f6] antialiased selection:bg-blue-500/30">
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}