
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

  async getLastCachedData(): Promise<TickerData | null> {
    const cachedData = await this.cacheService.getCachedData(this.cacheKey);
    return cachedData;
  }

  async getTickerData(): Promise<TickerData> {
    const cachedData = await this.cacheService.getCachedData(this.cacheKey);
    if (cachedData) return cachedData;

    const now = Date.now();

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

    await this.cacheService.setCache(this.cacheKey, responseData);
    return responseData;
  }
}

export default TickerService;
``