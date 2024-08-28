export interface TickerData {
  averagePrice: string;
  details: {
    bitstamp: number;
    coinbase: number;
    bitfinex: number;
  };
  error?: string;
  timestamp: number
}