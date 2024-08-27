/**
 * @jest-environment node
 */
import axios from 'axios';
import axiosMockAdapter from 'axios-mock-adapter';
import { GET } from '@/app/api/trading-pairs/[url_symbol]/route';
import { NextResponse } from 'next/server';

jest.mock('next/server', () => ({
  __esModule: true,
  NextResponse: {
    json: jest.fn(),
  },
}));

describe('GET /api/trading-pairs/:url_symbol', () => {
  const mock = new axiosMockAdapter(axios);

  afterEach(() => {
    mock.reset();
    jest.clearAllMocks();
  });

  test('returns ticker data for a valid trading pair', async () => {
    const mockTickerData = {
      timestamp: '1724747913',
      open: '0.880',
      high: '0.908',
      low: '0.877',
      last: '0.877',
      volume: '3124.0178',
      vwap: '0.893',
      bid: '0.856',
      ask: '0.857',
      side: '0',
      open_24: '0.896',
      percent_change_24: '-2.12',
    };

    mock.onGet('https://www.bitstamp.net/api/v2/ticker/btcusd/').reply(200, mockTickerData);

    const request = new Request('http://localhost/api/trading-pairs/btcusd');

    await GET(request);

    expect(NextResponse.json).toHaveBeenCalledWith(mockTickerData);
  });

  test('returns 400 if no trading pair is specified', async () => {
    const request = new Request('http://localhost/api/trading-pairs/');

    await GET(request);

    expect(NextResponse.json).toHaveBeenCalledWith({ error: 'No trading pair specified' }, { status: 400 });
  });

  test('handles API failure gracefully', async () => {
    mock.onGet('https://www.bitstamp.net/api/v2/ticker/btcusd/').networkError();

    const request = new Request('http://localhost/api/trading-pairs/btcusd');

    await GET(request);

    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: 'Failed to fetch trading pair data' },
      { status: 500 }
    );
  });
});
