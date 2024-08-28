import axios from "axios";
import { API_ENDPOINTS } from "@/app/constants/urls";
import { TickerData } from "@/types/TickerData";
import { CacheService } from "./CacheServices";

class TickerService {
  private cacheService: CacheService<TickerData>;
  private cacheKey: string;

  constructor(cacheService: CacheService<TickerData>, cacheKey: string) {
    this.cacheService = cacheService;
    this.cacheKey = cacheKey;
  }
  
  getLastCachedData(): TickerData | null {
    const cachedData = this.cacheService.getLastCachedDataWithoutValidation(this.cacheKey);
    if (cachedData) return cachedData;
    return null;
  }

  async getTickerData(): Promise<TickerData> {
    const cachedData = this.cacheService.getCachedData(this.cacheKey)
    if (cachedData) return cachedData;
    
    const now = Date.now();
    console.log('Fetching new data at', new Date(now).toISOString());

    const [bitfinex, coinbase, bitstamp] = await Promise.all([
      axios.get(API_ENDPOINTS.bitfinex),
      axios.get(API_ENDPOINTS.coinbase),
      axios.get(API_ENDPOINTS.bitstamp),
    ]);

    const bitstampPrice = parseFloat(bitstamp.data.last);
    const coinbaseRate = parseFloat(coinbase.data.data.rates.USD);
    const bitfinexPrice = parseFloat(bitfinex.data[0][1]);

    const averagePrice = (
      (bitstampPrice + coinbaseRate + bitfinexPrice) /
      3
    ).toFixed(2);

    const responseData: TickerData = {
      averagePrice,
      details: {
        bitstamp: bitstampPrice,
        coinbase: coinbaseRate,
        bitfinex: bitfinexPrice,
      },
      timestamp: now,
    };

    console.log('Setting cache with key:', this.cacheKey);
    this.cacheService.setCache(this.cacheKey, responseData);
    return responseData;
  }
}


export default TickerService;
