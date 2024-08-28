import { NextResponse } from "next/server";
import TickerService from "../services/TickerService";
import { CacheService } from "../services/CacheServices";
import { TickerData } from "@/types/TickerData";

const cacheService = new CacheService<TickerData>(30000);
const tickerService = new TickerService(cacheService, "tickerData");

export async function GET() {
  try {
    const data = await tickerService.getTickerData();
    return NextResponse.json(data);
  } catch (error) {
    const cachedData = tickerService.getTickerData();
    if (cachedData) {
      return NextResponse.json({
        ...cachedData,
        error: 'Failed to fetch new data, returning cached data',
      });
    }
    return NextResponse.json({ error: 'Failed to fetch ticker data' }, { status: 500 });
  }
}