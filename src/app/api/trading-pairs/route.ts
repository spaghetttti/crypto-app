import { NextResponse } from 'next/server';
import axios from 'axios';

interface TradingPair {
  name: string;
  url_symbol: string;
  description: string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pageParam = searchParams.get('page');
  const limitParam = searchParams.get('limit');

  // Parse and validate the 'page' parameter
  const page = parseInt(pageParam || '1', 10);
  if (isNaN(page) || page <= 0) {
    return NextResponse.json({ error: 'Invalid page parameter, must be a positive integer' }, { status: 400 });
  }

  // Parse and validate the 'limit' parameter
  const limit = parseInt(limitParam || '10', 10);
  if (isNaN(limit) || limit <= 0) {
    return NextResponse.json({ error: 'Invalid limit parameter, must be a positive integer' }, { status: 400 });
  }

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
