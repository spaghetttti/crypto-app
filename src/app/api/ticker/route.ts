import { NextResponse } from "next/server";
import TickerService from "../services/TickerService";
import { CacheService } from "../services/CacheServices"; 
import { TickerData } from "@/types/TickerData";

const cacheService = new CacheService<TickerData>(10000); // Cache duration: 10 seconds
const tickerService = new TickerService(cacheService, "tickerData");
const headers = new Headers({
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0',
  'Surrogate-Control': 'no-store',
});

export async function GET() {
  try {
    const data = await tickerService.getTickerData();
    return NextResponse.json(data, { headers });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch ticker data' }, { status: 500 });
  }
}
