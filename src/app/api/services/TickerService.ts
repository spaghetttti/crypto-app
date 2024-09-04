// import axios from "axios";
import { API_ENDPOINTS } from "@/app/constants/urls";
import { TickerData } from "@/types/TickerData";
import { CacheService } from "./CacheServices";

class TickerService {
  private cacheService: CacheService<TickerData>;
  private cacheKey: string;
  // private headers = {
  //   "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  //   Pragma: "no-cache",
  //   Expires: "0",
  // };

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

    const [bitstampData, coinbaseData, bitfinexData] = await Promise.all([
      this.fetchJson(API_ENDPOINTS.bitstamp),
      this.fetchJson(API_ENDPOINTS.coinbase),
      this.fetchJson(API_ENDPOINTS.bitfinex),
    ]);

    const bitstampPrice = parseFloat(bitstampData.last);
    const coinbasePrice = parseFloat(coinbaseData.data.rates.USD);
    const bitfinexPrice = parseFloat(bitfinexData[0][1]);

    const averagePrice = (
      (bitstampPrice + coinbasePrice + bitfinexPrice) /
      3
    ).toFixed(2);

    const responseData: TickerData = {
      averagePrice,
      details: {
        bitstamp: bitstampPrice,
        coinbase: coinbasePrice,
        bitfinex: bitfinexPrice,
      },
      timestamp: now,
    };

    await this.cacheService.setCache(this.cacheKey, responseData);

    return responseData;
  }

  async fetchJson(url: string) {
    const response = await fetch(url, {
      cache: "no-store",
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch data from ${url}`);
    }
    return response.json();
  }
}

export default TickerService;
