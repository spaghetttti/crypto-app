import { API_ENDPOINTS } from "@/app/constants/urls";
import { TickerData } from "@/types/TickerData";
import axios from "axios";
import { NextResponse } from "next/server";

let cache: TickerData;

const CACHE_DURATION = 30000; // 30 seconds

export async function GET() { 
  const now = Date.now();
  if (cache && now - cache.timestamp < CACHE_DURATION) {
    return NextResponse.json(cache);
  }

  try {
    const [bitfinex, coinbase, bitstamp] = await Promise.all([
      axios.get(API_ENDPOINTS.bitfinex),
      axios.get(API_ENDPOINTS.coinbase),
      axios.get(API_ENDPOINTS.bitstamp),
    ]);

    const bitstampPrice = parseFloat(bitstamp.data.last);``
    const coinbaseRate = parseFloat(coinbase.data.data.rates.USD);
    const bitfinexPrice = parseFloat(bitfinex.data[0][1]);

    const averagePrice = (
      (bitstampPrice + coinbaseRate + bitfinexPrice) / 3
    ).toFixed(2);

    const responseData = {
      averagePrice,
      details: {
        bitstamp: bitstampPrice,
        coinbase: coinbaseRate,
        bitfinex: bitfinexPrice,
      },
      timestamp: now,
    };

    cache = responseData;

    return NextResponse.json(responseData);
  } catch (error) {
    // console.error('Error fetching ticker data:', error);

    if (cache) {
      return NextResponse.json({
        ...cache,
        error: 'Failed to fetch new data, returning cached data',
      });
    }

    return NextResponse.json({ error: 'Failed to fetch ticker data' }, { status: 500 });
  }
}