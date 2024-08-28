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

  test('returns error for page=0', async () => {
    const request = new Request('http://localhost/api/trading-pairs?page=0&limit=10');

    await GET(request);

    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: 'Invalid page parameter, must be a positive integer' },
      { status: 400 }
    );
  });

  test('returns error for page=-1', async () => {
    const request = new Request('http://localhost/api/trading-pairs?page=-1&limit=10');

    await GET(request);

    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: 'Invalid page parameter, must be a positive integer' },
      { status: 400 }
    );
  });

  test('returns error for non-numeric page', async () => {
    const request = new Request('http://localhost/api/trading-pairs?page=abc&limit=10');

    await GET(request);

    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: 'Invalid page parameter, must be a positive integer' },
      { status: 400 }
    );
  });

  test('returns error for limit=0', async () => {
    const request = new Request('http://localhost/api/trading-pairs?page=1&limit=0');

    await GET(request);

    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: 'Invalid limit parameter, must be a positive integer' },
      { status: 400 }
    );
  });

  test('returns error for limit=-1', async () => {
    const request = new Request('http://localhost/api/trading-pairs?page=1&limit=-1');

    await GET(request);

    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: 'Invalid limit parameter, must be a positive integer' },
      { status: 400 }
    );
  });

  test('returns error for non-numeric limit', async () => {
    const request = new Request('http://localhost/api/trading-pairs?page=1&limit=abc');

    await GET(request);

    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: 'Invalid limit parameter, must be a positive integer' },
      { status: 400 }
    );
  });

  test('handles missing page and limit parameters', async () => {
    const mockData = Array.from({ length: 100 }, (_, i) => ({
      name: `Pair ${i + 1}`,
      url_symbol: `pair${i + 1}`,
      description: `Description for Pair ${i + 1}`,
    }));

    mock.onGet('https://www.bitstamp.net/api/v2/trading-pairs-info/').reply(200, mockData);

    const request = new Request('http://localhost/api/trading-pairs');

    await GET(request);

    const expectedResponse = {
      page: 1,
      totalPages: 10,
      totalItems: 100,
      items: mockData.slice(0, 10), // first 10 items
    };

    expect(NextResponse.json).toHaveBeenCalledWith(expectedResponse);
  });
});
