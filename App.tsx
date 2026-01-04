import React, { useState } from 'react';
import { AppProvider, useApp } from './store/AppContext';
import { AuthForm } from './components/AuthForm';
import { Layout } from './components/Layout';
import { PortfolioDashboard } from './components/PortfolioDashboard';
import { HoldingsManager } from './components/HoldingsManager';
import { TransactionsView } from './components/TransactionsView';
import { ProfileView } from './components/ProfileView';

type Page = 'dashboard' | 'holdings' | 'transactions' | 'profile';

const MainApp: React.FC = () => {
  const { currentUser } = useApp();
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');

  if (!currentUser) {
    return <AuthForm />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <PortfolioDashboard />;
      case 'holdings':
        return <HoldingsManager />;
      case 'transactions':
        return <TransactionsView />;
      case 'profile':
        return <ProfileView />;
      default:
        return <PortfolioDashboard />;
    }
  };

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <div className="antialiased selection:bg-blue-500/30">
        <MainApp />
      </div>
    </AppProvider>
  );
};

export default App;
