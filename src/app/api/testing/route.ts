import { API_ENDPOINTS } from "@/app/constants/urls";
import { NextResponse } from "next/server";

async function fetchJson(url: string) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch data from ${url}`);
  }
  return response.json();
}

export async function GET() {
  try {
    // Fetch data from all three endpoints
    const [bitstampData, coinbaseData, bitfinexData] = await Promise.all([
      fetchJson(API_ENDPOINTS.bitstamp),
      fetchJson(API_ENDPOINTS.coinbase),
      fetchJson(API_ENDPOINTS.bitfinex),
    ]);

    // Extract the BTC/USD values from each API response
    const bitstampPrice = parseFloat(bitstampData.last);
    const coinbasePrice = parseFloat(coinbaseData.data.rates.USD);
    const bitfinexPrice = parseFloat(bitfinexData[0][1]);

    // Calculate the average price
    const averagePrice = (bitstampPrice + coinbasePrice + bitfinexPrice) / 3;

    // Return the average price in the response
    return NextResponse.json({ averagePrice });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
