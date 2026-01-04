# Portfolio Tracker

A comprehensive, real-time investment portfolio tracking application built with Next.js 16, React 18, TypeScript, and Firebase.

## Features

### Portfolio Dashboard
- Real-time portfolio valuation
- Asset allocation visualization with Recharts
- Performance metrics (daily/monthly/yearly gains/losses)
- Interactive charts showing portfolio growth over time
- Recent transactions overview

### Asset Management
- Add, edit, and delete portfolio holdings
- Support for multiple asset types:
  - Stocks
  - Cryptocurrency
  - ETFs
  - Bonds
  - Mutual Funds
  - Cash
- Track cost basis, purchase dates, and quantities
- Real-time price updates
- Calculate unrealized gains/losses automatically

### Real-Time Market Data
- Integration with CoinGecko API for cryptocurrency prices
- Integration with Finnhub API for stock and ETF prices
- Automatic price updates every minute
- Display current vs. purchase prices
- Track 24-hour price changes

### Authentication & User Management
- Secure Firebase Authentication
- Email/password registration and login
- Password reset functionality
- User profile management
- Session persistence

### Data Persistence
- Firebase Firestore for storing portfolios
- Historical portfolio snapshots for charting
- Complete transaction history
- Secure, cloud-based data storage

### Visualization & Analytics
- Line charts for portfolio performance over time
- Pie charts for asset allocation
- Performance comparison with cost basis
- Asset type breakdown
- Transaction history with filtering

## Technology Stack

- **Frontend**: React 18.2.0 with TypeScript
- **Build Tool**: Vite 6.2.0
- **UI Framework**: Tailwind CSS
- **Charts**: Recharts 2.12.2
- **Icons**: Lucide React
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore
- **Market Data APIs**:
  - CoinGecko (cryptocurrency)
  - Finnhub (stocks & ETFs)

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Firebase:
   - Update `services/firebase.ts` with your Firebase config
   - Enable Authentication and Firestore in your Firebase project

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open http://localhost:5173 in your browser

## Project Structure

```
├── components/          # React components
│   ├── AuthForm.tsx    # Login/Register form
│   ├── Layout.tsx      # Main layout with navigation
│   ├── PortfolioDashboard.tsx  # Main dashboard
│   ├── HoldingsManager.tsx     # Manage holdings
│   ├── TransactionsView.tsx    # Transaction history
│   ├── ProfileView.tsx         # User profile
│   └── CashManager.tsx        # Cash deposit/withdraw
├── services/           # API services
│   ├── firebase.ts     # Firebase configuration
│   ├── marketData.ts   # Market data APIs
│   └── portfolio.ts    # Portfolio operations
├── store/              # State management
│   └── AppContext.tsx  # Global app state
├── types.ts            # TypeScript types
├── constants.ts        # App constants
└── App.tsx            # Main app component
```

## Key Features Explained

### Real-Time Price Updates
The app automatically fetches current market prices every minute for all holdings in your portfolio. Prices are retrieved from:
- **CoinGecko**: Free API for cryptocurrency prices
- **Finnhub**: Free tier for stock and ETF prices

### Portfolio Metrics
The dashboard calculates and displays:
- Total portfolio value (holdings + cash)
- Total cost basis
- Unrealized gain/loss (both dollar amount and percentage)
- Day change (compared to previous snapshot)
- All-time high and low portfolio values

### Asset Allocation
Visual representation of your portfolio composition:
- Pie chart showing percentage allocation by asset type
- Color-coded segments for easy identification
- Hover tooltips with exact values

### Transaction History
Complete audit trail of all portfolio activities:
- Buy/sell transactions
- Cash deposits and withdrawals
- Dividend payments (manual entry)
- Exportable to CSV format

## Security & Privacy

- All user data is stored securely in Firebase Firestore
- Authentication is handled by Firebase Auth
- No sensitive financial credentials are stored
- Market data is fetched from legitimate, verified sources
- No fraudulent or deceptive practices

## API Rate Limits

- **CoinGecko**: Free tier allows 10-30 calls/minute
- **Finnhub**: Free tier allows 60 calls/minute

The app is optimized to batch API calls and cache results to stay within these limits.

## Contributing

This is a legitimate portfolio tracking application. All contributions should maintain ethical standards and use only verified market data sources.

## License

MIT License
