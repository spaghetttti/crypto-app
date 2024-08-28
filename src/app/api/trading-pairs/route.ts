import { NextResponse } from 'next/server';
import axios from 'axios';

interface TradingPair {
  name: string;
  url_symbol: string;
  description: string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);

  try {
    const response = await axios.get<TradingPair[]>('https://www.bitstamp.net/api/v2/trading-pairs-info/');
    
    const tradingPairs = response.data.map(pair => ({
      name: pair.name,
      url_symbol: pair.url_symbol,
      description: pair.description,
    }));

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedPairs = tradingPairs.slice(startIndex, endIndex);

    const totalPages = Math.ceil(tradingPairs.length / limit);

    return NextResponse.json({
      page,
      totalPages,
      totalItems: tradingPairs.length,
      items: paginatedPairs,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch trading pairs data' }, { status: 500 });
  }
}
