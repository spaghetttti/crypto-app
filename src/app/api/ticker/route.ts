import { NextResponse } from "next/server";
import TickerService from "../services/TickerService";
import { CacheService } from "../services/CacheServices";
import { TickerData } from "@/types/TickerData";

const cacheService = new CacheService<TickerData>(10000); // caching mechanism removed from TickerService because of deployment issues
const tickerService = new TickerService();

export async function GET() {
  try {
    const data = await tickerService.getTickerData();
    return NextResponse.json(data);
  } catch (error) {
    // const cachedData = await tickerService.getLastCachedData();
    // if (cachedData) {
    //   return NextResponse.json({
    //     ...cachedData,
    //     error: 'Failed to fetch new data, returning cached data',
    //   });
    // }
    return NextResponse.json({ error: 'Failed to fetch ticker data' }, { status: 500 });
  }
}
