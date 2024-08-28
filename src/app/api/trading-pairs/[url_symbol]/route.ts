import { NextResponse } from 'next/server';
import axios from 'axios';

interface TickerData {
  timestamp: string;
  open: string;
  high: string;
  low: string;
  last: string;
  volume: string;
  vwap: string;
  bid: string;
  ask: string;
  side: string;
  open_24: string;
  percent_change_24: string;
}

export async function GET(request: Request) {
  const { pathname } = new URL(request.url);
  const url_symbol = pathname.split('/').pop();

  if (!url_symbol) {
    return NextResponse.json({ error: 'No trading pair specified' }, { status: 400 });
  }

  try {
    const response = await axios.get<TickerData>(`https://www.bitstamp.net/api/v2/ticker/${url_symbol}/`);

    return NextResponse.json(response.data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch trading pair data' }, { status: 500 });
  }
}
