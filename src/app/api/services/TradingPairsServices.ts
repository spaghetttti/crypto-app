import axios from 'axios';

interface TradingPair {
  name: string;
  url_symbol: string;
  description: string;
}

interface TickerData {
  timestamp: string;
  open: string;
  high: string;
  low: string;
  last: string;
  volume: string;
  vwap: string;
  bid: string;
  ask: string;
  side: string;
  open_24: string;
  percent_change_24: string;
}

export class TradingPairsService {
  private readonly tradingPairsApiUrl: string;
  private readonly tickerApiBaseUrl: string;

  constructor(
    tradingPairsApiUrl: string = 'https://www.bitstamp.net/api/v2/trading-pairs-info/',
    tickerApiBaseUrl: string = 'https://www.bitstamp.net/api/v2/ticker/'
  ) {
    this.tradingPairsApiUrl = tradingPairsApiUrl;
    this.tickerApiBaseUrl = tickerApiBaseUrl;
  }

  public async fetchTradingPairs(): Promise<TradingPair[]> {
    const response = await axios.get<TradingPair[]>(this.tradingPairsApiUrl);
    return response.data.map(pair => ({
      name: pair.name,
      url_symbol: pair.url_symbol,
      description: pair.description,
    }));
  }

  public paginate(tradingPairs: TradingPair[], page: number, limit: number) {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedPairs = tradingPairs.slice(startIndex, endIndex);

    const totalPages = Math.ceil(tradingPairs.length / limit);

    return {
      page,
      totalPages,
      totalItems: tradingPairs.length,
      items: paginatedPairs,
    };
  }

  public async fetchTickerData(urlSymbol: string): Promise<TickerData> {
    const response = await axios.get<TickerData>(`${this.tickerApiBaseUrl}${urlSymbol}/`);
    return response.data;
  }

  public validatePageParam(pageParam: string | null): number {
    const page = parseInt(pageParam || '1', 10);
    if (isNaN(page) || page <= 0) {
      throw new Error('Invalid page parameter, must be a positive integer');
    }
    return page;
  }

  public validateLimitParam(limitParam: string | null): number {
    const limit = parseInt(limitParam || '10', 10);
    if (isNaN(limit) || limit <= 0) {
      throw new Error('Invalid limit parameter, must be a positive integer');
    }
    return limit;
  }
}
