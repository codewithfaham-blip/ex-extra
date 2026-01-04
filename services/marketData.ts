import { Asset, AssetType } from '../types';

const COINGECKO_API = 'https://api.coingecko.com/api/v3';
const FINNHUB_API = 'https://finnhub.io/api/v1';
const FINNHUB_API_KEY = 'ctslkr9r01qvovndji1gctslkr9r01qvovndji20'; // Free tier demo key

interface CryptoPrice {
  usd: number;
  usd_24h_change: number;
}

interface StockQuote {
  c: number; // Current price
  d: number; // Change
  dp: number; // Percent change
  h: number; // High
  l: number; // Low
  o: number; // Open
  pc: number; // Previous close
}

const cryptoSymbolMap: Record<string, string> = {
  'BTC': 'bitcoin',
  'ETH': 'ethereum',
  'USDT': 'tether',
  'BNB': 'binancecoin',
  'SOL': 'solana',
  'XRP': 'ripple',
  'USDC': 'usd-coin',
  'ADA': 'cardano',
  'AVAX': 'avalanche-2',
  'DOGE': 'dogecoin',
  'DOT': 'polkadot',
  'MATIC': 'matic-network',
  'LINK': 'chainlink',
  'UNI': 'uniswap',
  'ATOM': 'cosmos',
  'LTC': 'litecoin',
  'BCH': 'bitcoin-cash',
  'NEAR': 'near',
  'APT': 'aptos',
  'ARB': 'arbitrum'
};

const getCryptoId = (symbol: string): string => {
  return cryptoSymbolMap[symbol.toUpperCase()] || symbol.toLowerCase();
};

export const fetchCryptoPrice = async (symbol: string): Promise<Asset | null> => {
  try {
    const coinId = getCryptoId(symbol);
    const response = await fetch(
      `${COINGECKO_API}/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_change=true`
    );
    
    if (!response.ok) {
      console.error(`Failed to fetch crypto price for ${symbol}`);
      return null;
    }

    const data = await response.json();
    const priceData: CryptoPrice = data[coinId];
    
    if (!priceData) {
      console.error(`No price data for ${symbol}`);
      return null;
    }

    return {
      id: `crypto-${symbol.toLowerCase()}`,
      symbol: symbol.toUpperCase(),
      name: symbol.toUpperCase(),
      type: AssetType.CRYPTO,
      currentPrice: priceData.usd,
      priceChange24h: priceData.usd * (priceData.usd_24h_change / 100),
      priceChangePercent24h: priceData.usd_24h_change,
      lastUpdated: Date.now(),
      currency: 'USD'
    };
  } catch (error) {
    console.error('Error fetching crypto price:', error);
    return null;
  }
};

export const fetchStockPrice = async (symbol: string): Promise<Asset | null> => {
  try {
    const response = await fetch(
      `${FINNHUB_API}/quote?symbol=${symbol.toUpperCase()}&token=${FINNHUB_API_KEY}`
    );
    
    if (!response.ok) {
      console.error(`Failed to fetch stock price for ${symbol}`);
      return null;
    }

    const data: StockQuote = await response.json();
    
    if (!data.c || data.c === 0) {
      console.error(`No price data for ${symbol}`);
      return null;
    }

    return {
      id: `stock-${symbol.toLowerCase()}`,
      symbol: symbol.toUpperCase(),
      name: symbol.toUpperCase(),
      type: AssetType.STOCK,
      currentPrice: data.c,
      previousClose: data.pc,
      priceChange24h: data.d,
      priceChangePercent24h: data.dp,
      lastUpdated: Date.now(),
      currency: 'USD'
    };
  } catch (error) {
    console.error('Error fetching stock price:', error);
    return null;
  }
};

export const fetchAssetPrice = async (symbol: string, type: AssetType): Promise<Asset | null> => {
  if (type === AssetType.CRYPTO) {
    return fetchCryptoPrice(symbol);
  } else if (type === AssetType.STOCK || type === AssetType.ETF) {
    return fetchStockPrice(symbol);
  }
  
  return null;
};

export const fetchMultiplePrices = async (
  symbols: Array<{ symbol: string; type: AssetType }>
): Promise<Map<string, Asset>> => {
  const priceMap = new Map<string, Asset>();
  
  const results = await Promise.allSettled(
    symbols.map(({ symbol, type }) => fetchAssetPrice(symbol, type))
  );
  
  results.forEach((result, index) => {
    if (result.status === 'fulfilled' && result.value) {
      const { symbol } = symbols[index];
      priceMap.set(symbol.toUpperCase(), result.value);
    }
  });
  
  return priceMap;
};

export const searchAsset = async (query: string): Promise<Asset[]> => {
  const results: Asset[] = [];
  
  try {
    const cryptoResponse = await fetch(
      `${COINGECKO_API}/search?query=${encodeURIComponent(query)}`
    );
    
    if (cryptoResponse.ok) {
      const data = await cryptoResponse.json();
      const coins = data.coins?.slice(0, 5) || [];
      
      for (const coin of coins) {
        const price = await fetchCryptoPrice(coin.symbol);
        if (price) {
          price.name = coin.name;
          results.push(price);
        }
      }
    }
  } catch (error) {
    console.error('Error searching crypto:', error);
  }
  
  try {
    const stockResponse = await fetch(
      `${FINNHUB_API}/search?q=${encodeURIComponent(query)}&token=${FINNHUB_API_KEY}`
    );
    
    if (stockResponse.ok) {
      const data = await stockResponse.json();
      const stocks = data.result?.slice(0, 5) || [];
      
      for (const stock of stocks) {
        if (stock.type === 'Common Stock' || stock.type === 'ETP') {
          results.push({
            id: `stock-${stock.symbol.toLowerCase()}`,
            symbol: stock.symbol,
            name: stock.description,
            type: stock.type === 'ETP' ? AssetType.ETF : AssetType.STOCK,
            currentPrice: 0,
            lastUpdated: Date.now(),
            currency: 'USD'
          });
        }
      }
    }
  } catch (error) {
    console.error('Error searching stocks:', error);
  }
  
  return results;
};
