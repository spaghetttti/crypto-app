import { API_ENDPOINTS } from "@/utils/urls";
import axios from "axios";
import { NextResponse } from "next/server";

export async function GET() { 
  try { //! future proof for number for dynamic numebr of urs and implement caching logic
    const [bitfinex, coinbase, bitstamp] = await Promise.all([
      axios.get(API_ENDPOINTS.bitfinex),
      axios.get(API_ENDPOINTS.coinbase),
      axios.get(API_ENDPOINTS.bitstamp),
    ]);

    const bitstampPrice = parseFloat(bitstamp.data.last);
    const coinbaseRate = parseFloat(coinbase.data.data.rates.USD);
    const bitfinexPrice = parseFloat(bitfinex.data[0][1]);

    const averagePrice = (
      (bitstampPrice + coinbaseRate + bitfinexPrice) / 3
    ).toFixed(2);


    return NextResponse.json({
      averagePrice,
      details: {
        bitstamp: bitstampPrice,
        coinbase: coinbaseRate,
        bitfinex: bitfinexPrice,
      },
    });
  } catch (error) {
    console.error('Error fetching ticker data:', error);
    return NextResponse.json({ error: 'Failed to fetch ticker data' }, { status: 500 });
  }
}