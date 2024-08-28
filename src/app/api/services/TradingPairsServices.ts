import axios from 'axios';

interface TradingPair {
  name: string;
  url_symbol: string;
  description: string;
}

export class TradingPairsService {
  private readonly apiUrl: string;

  constructor(apiUrl: string = 'https://www.bitstamp.net/api/v2/trading-pairs-info/') {
    this.apiUrl = apiUrl;
  }

  public async fetchTradingPairs(): Promise<TradingPair[]> {
    const response = await axios.get<TradingPair[]>(this.apiUrl);
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
