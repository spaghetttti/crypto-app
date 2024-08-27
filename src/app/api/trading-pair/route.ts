// src/app/api/trading-pairs/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';

interface TradingPair {
  url_symbol: string;
  name: string;
  // Add other relevant fields if needed
}

export async function GET() {
  try {
    const response = await axios.get<any[]>('https://jsonplaceholder.typicode.com/users');
    
    const tradingPairs = response.data;

    return NextResponse.json(tradingPairs);
  } catch (error) {
    console.error('Error fetching trading pairs:', error);
    return NextResponse.json({ error: 'Failed to fetch trading pairs data' }, { status: 500 });
  }
}
