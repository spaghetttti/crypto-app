import { NextResponse } from 'next/server';
import { TradingPairsService } from '../services/TradingPairsServices';

export async function GET(request: Request) {
  const service = new TradingPairsService();
  const { searchParams } = new URL(request.url);

  try {
    const page = service.validatePageParam(searchParams.get('page'));
    const limit = service.validateLimitParam(searchParams.get('limit'));

    const tradingPairs = await service.fetchTradingPairs();
    const paginatedResult = service.paginate(tradingPairs, page, limit);

    return NextResponse.json(paginatedResult);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to fetch trading pairs data' }, { status: 500 });
  }
}
