/**
 * @jest-environment node
 */
import axios from 'axios';
import axiosMockAdapter from 'axios-mock-adapter';
import { NextResponse } from 'next/server';
import { GET } from '@/app/api/ticker/route';
import { API_ENDPOINTS } from '@/app/constants/urls';

jest.mock('next/server', () => ({
  __esModule: true,
  NextResponse: {
    json: jest.fn(),
  },
}));

describe('GET /api/ticker', () => {
  const mock = new axiosMockAdapter(axios);

  afterEach(() => {
    mock.reset();
    jest.clearAllMocks();
  });

  test('returns ticker data successfully', async () => {
    mock.onGet(API_ENDPOINTS.bitstamp).reply(200, { last: '25000' });
    mock.onGet(API_ENDPOINTS.coinbase).reply(200, { data: { rates: { USD: '26000' } } });
    mock.onGet(API_ENDPOINTS.bitfinex).reply(200, [['tBTCUSD', 24000]]);

    await GET();

    const expectedResponse = {
      averagePrice: '25000.00',
      details: {
        bitstamp: 25000,
        coinbase: 26000,
        bitfinex: 24000,
      },
      timestamp: expect.any(Number),
    };

    expect(NextResponse.json).toHaveBeenCalledWith(expectedResponse);
  });

  test('returns 500 error when fetching ticker data fails', async () => {
    mock.onGet(API_ENDPOINTS.bitstamp).networkError();
    mock.onGet(API_ENDPOINTS.coinbase).networkError();
    mock.onGet(API_ENDPOINTS.bitfinex).networkError();

    await GET();

    const expectedResponse = {
      error: 'Failed to fetch ticker data',
    };

    expect(NextResponse.json).toHaveBeenCalledWith(expectedResponse, { status: 500 });
  });
});
