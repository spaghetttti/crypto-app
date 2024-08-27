/**
 * @jest-environment node
 */
import { API_ENDPOINTS } from "@/utils/urls";
import axios from "axios";
import axiosMockAdapter from "axios-mock-adapter";
import test, { afterEach, describe } from "node:test";
import { GET } from "@/app/api/ticker/route";
import { NextResponse } from "next/server";

jest.mock("next/server", () => ({
  _esModule: true,
  NextResponse: {
    json: jest.fn(),
  },
}));

describe("GET /api/ticker", () => {
  const mock = new axiosMockAdapter(axios);

  afterEach(() => {
    mock.reset();
    jest.clearAllMocks();
  });

  test("calling and aggregating data from 3 endpoints", async () => {
    mock.onGet(API_ENDPOINTS.bitstamp).reply(200, { last: "25000" });
    mock
      .onGet(API_ENDPOINTS.coinbase)
      .reply(200, { data: { rates: { USD: "26000" } } });
    mock.onGet(API_ENDPOINTS.bitfinex).reply(200, [["tBTCUSD", 24000]]);

    const request = new Request("http://localhost/api/ticker");

    await GET();

    const expectedResponse = {
      averagePrice: "25000.00",
      details: {
        bitstamp: 25000,
        coinbase: 26000,
        bitfinex: 24000,
      },
    };

    expect(NextResponse.json).toHaveBeenCalledWith(expectedResponse);
  });

  test("handling third-party api server errors", async () => {
    mock.onGet(API_ENDPOINTS.bitstamp).networkError;
    mock
      .onGet(API_ENDPOINTS.coinbase)
      .reply(200, { data: { rates: { USD: "26000" } } });
    mock.onGet(API_ENDPOINTS.bitfinex).reply(200, [["tBTCUSD", 24000]]);

    await GET();

    const expectedResponse = {
      error: 'Failed to fetch ticker data', 
      //! lastCachedResult: {
      //   averagePrice: "25000.00",
      //   details: {
      //     bitstamp: 25000,
      //     coinbase: 26000,
      //     bitfinex: 24000,
      //   },
      // },
    };

    expect(NextResponse.json).toHaveBeenCalledWith(expectedResponse, { status: 500});
  });
});
