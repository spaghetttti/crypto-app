import { NextResponse } from 'next/server';
import { TradingPairsService } from '../../services/TradingPairsServices';

export async function GET(request: Request) {
  const service = new TradingPairsService();
  const { pathname } = new URL(request.url);
  const url_symbol = pathname.split('/').pop();

  if (!url_symbol) {
    return NextResponse.json({ error: 'No trading pair specified' }, { status: 400 });
  }

  try {
    const tickerData = await service.fetchTickerData(url_symbol);
    return NextResponse.json(tickerData);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch trading pair data' }, { status: 500 });
  }
}
