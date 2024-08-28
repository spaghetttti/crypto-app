/**
 * @jest-environment node
 */
import axios from "axios";
import axiosMockAdapter from "axios-mock-adapter";
import { GET } from "@/app/api/ticker/route";
import { NextResponse } from "next/server";
import { API_ENDPOINTS } from "@/app/constants/urls";
import { TickerData } from "@/types/TickerData";
  
jest.mock("next/server", () => ({
  _esModule: true,
  NextResponse: {
    json: jest.fn(),
  },
}));

describe("GET /api/ticker", () => {
  const mock = new axiosMockAdapter(axios);
  const CACHE_DURATION = 3000;
  let cache: TickerData;

  beforeEach(() => {
    // cache = { data: null, timestamp: 0 }; 
    jest.spyOn(global.Date, 'now').mockImplementation(() => 1000000); // Mock the timestamp
  });

  afterEach(() => {
    mock.reset(); 
  });

  test("returns cached data if within cache duration", async () => {
    const cachedData = {
      averagePrice: "25000.00",
      details: {
        bitstamp: 25000,
        coinbase: 26000,
        bitfinex: 24000,
      },
      timestamp: Date.now(),
    };

    cache = cachedData;

    await GET();

    expect(NextResponse.json).toHaveBeenCalledWith(cachedData);
    expect(axios.get).not.toHaveBeenCalled();
  });

  test("fetches new data and updates the cache if cache is expired", async () => {
    mock.onGet(API_ENDPOINTS.bitstamp).reply(200, { last: "25000" });
    mock
      .onGet(API_ENDPOINTS.coinbase)
      .reply(200, { data: { rates: { USD: "26000" } } });
    mock.onGet(API_ENDPOINTS.bitfinex).reply(200, [["tBTCUSD", 24000]]);

    cache = {
      averagePrice: "25000.00",
      details: {
        bitstamp: 25000,
        coinbase: 26000,
        bitfinex: 24000,
      },
      timestamp: Date.now() - CACHE_DURATION - 10,
    };

    await GET();

    const expectedResponse = {
      averagePrice: "25000.00",
      details: {
        bitstamp: 25000,
        coinbase: 26000,
        bitfinex: 24000,
      },
      timestamp: expect.any(Number),
    };

    expect(NextResponse.json).toHaveBeenCalledWith(expectedResponse);
  });

  test("returns cached data with error message if API call fails", async () => {
    const now = Date.now();
    const cachedData = {
      averagePrice: "25000.00",
      details: {
        bitstamp: 25000,
        coinbase: 26000,
        bitfinex: 24000,
      },
      timestamp: now,
    };

    cache = cachedData;

    mock.onGet(API_ENDPOINTS.bitstamp).networkError();
    mock.onGet(API_ENDPOINTS.coinbase).reply(200, { data: { rates: { USD: "26000" } } });
    mock.onGet(API_ENDPOINTS.bitfinex).reply(200, [["tBTCUSD", 24000]]);

    await GET();

    const expectedResponse = {
      ...cachedData,
      error: 'Failed to fetch new data, returning cached data',
    };

    expect(NextResponse.json).toHaveBeenCalledWith(expectedResponse);
  });

  test("returns error response if no cache and API call fails", async () => {
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
