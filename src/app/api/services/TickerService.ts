import axios from "axios";
import { API_ENDPOINTS } from "@/app/constants/urls";
import { TickerData } from "@/types/TickerData";
import { CacheService } from "./CacheServices";

class TickerService {
  private cacheService: CacheService<TickerData>;
  private cacheKey: string;
  private headers = {
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    Pragma: "no-cache",
    Expires: "0",
  };

  constructor(cacheService: CacheService<TickerData>, cacheKey: string) {
    this.cacheService = cacheService;
    this.cacheKey = cacheKey;
  }

  async getLastCachedData(): Promise<TickerData | null> {
    return await this.cacheService.getCachedData(this.cacheKey);
  }

  async getTickerData(): Promise<TickerData> {
    const cachedData = await this.cacheService.getCachedData(this.cacheKey);
    if (cachedData) return cachedData;

    const now = Date.now();

    const [bitfinex, coinbase, bitstamp] = await Promise.all([
      axios.get(API_ENDPOINTS.bitfinex, {
        headers: this.headers,
      }),
      axios.get(API_ENDPOINTS.coinbase, {
        headers: this.headers,
      }),
      axios.get(API_ENDPOINTS.bitstamp, {
        headers: this.headers,
      }),
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
