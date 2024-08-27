/**
 * @jest-environment node
 */
import axios from 'axios';
import axiosMockAdapter from 'axios-mock-adapter';
import { GET } from '@/app/api/trading-pairs/route';
import { NextResponse } from 'next/server';

jest.mock('next/server', () => ({
  __esModule: true,
  NextResponse: {
    json: jest.fn(),
  },
}));

describe('GET /api/trading-pairs', () => {
  const mock = new axiosMockAdapter(axios);

  afterEach(() => {
    mock.reset();
    jest.clearAllMocks();
  });

  test('returns paginated trading pairs', async () => {
    const mockData = Array.from({ length: 100 }, (_, i) => ({
      name: `Pair ${i + 1}`,
      url_symbol: `pair${i + 1}`,
      description: `Description for Pair ${i + 1}`,
    }));

    mock.onGet('https://www.bitstamp.net/api/v2/trading-pairs-info/').reply(200, mockData);

    const request = new Request('http://localhost/api/trading-pairs?page=2&limit=10');

    await GET(request);

    const expectedResponse = {
      page: 2,
      totalPages: 10,
      totalItems: 100,
      items: mockData.slice(10, 20), // items 11-20
    };

    expect(NextResponse.json).toHaveBeenCalledWith(expectedResponse);
  });

  test('handles API failure gracefully', async () => {
    mock.onGet('https://www.bitstamp.net/api/v2/trading-pairs-info/').networkError();

    const request = new Request('http://localhost/api/trading-pairs?page=1&limit=10');

    await GET(request);

    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: 'Failed to fetch trading pairs data' },
      { status: 500 }
    );
  });
});
