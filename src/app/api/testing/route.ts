import { API_ENDPOINTS } from "@/app/constants/urls";
import axios from "axios";
import { NextResponse } from "next/server";

async function fetchJson(url: string) {
  const response = await axios.get(url, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  });

  if (response.status !== 200) {
    throw new Error(`Failed to fetch data from ${url}`);
  }

  return response.data;
}

export async function GET() {
  try {
    const [bitstampData, coinbaseData, bitfinexData] = await Promise.all([
      fetchJson(API_ENDPOINTS.bitstamp),
      fetchJson(API_ENDPOINTS.coinbase),
      fetchJson(API_ENDPOINTS.bitfinex),
    ]);

    const bitstampPrice = parseFloat(bitstampData.last);
    const coinbasePrice = parseFloat(coinbaseData.data.rates.USD);
    const bitfinexPrice = parseFloat(bitfinexData[0][1]);

    const averagePrice = (bitstampPrice + coinbasePrice + bitfinexPrice) / 3;

    // Set headers to prevent caching in the response
    const headers = new Headers({
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Surrogate-Control': 'no-store',
    });

    return NextResponse.json({ averagePrice }, { headers });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
