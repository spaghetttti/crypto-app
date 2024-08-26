import { API_ENDPOINTS } from "@/utils/urls";
import axios from "axios";
import axiosMock from "axios-mock-adapter";
import test, { afterEach, describe } from "node:test";
import { jest } from "@jest/globals";
import handler from "@/app/api/ticker";

const mock = new axiosMock(axios);

describe("ticker data api call", async () => {
  afterEach(() => {
    mock.reset();
  });

  test("calling and aggregating data from 3 endpoints", async () => {
    mock.onGet(API_ENDPOINTS.bitstamp).reply(200, { last: "25000" });
    mock
      .onGet(API_ENDPOINTS.coinbase)
      .reply(200, { data: { rates: { USD: "26000" } } });
    mock.onGet(API_ENDPOINTS.bitfinex).reply(200, [["tBTCUSD", 24000]]);

    const req = {};
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    await handler(req as Request, res as unknown as Response); // refactor later

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      averagePrice: "25000.00",
      details: {
        bitstamp: 25000,
        coinbase: 26000,
        bitfinex: 24000,
      },
    });
  });

  test("handling third-party api server errors", async () => {
    mock.onGet(API_ENDPOINTS.bitstamp).networkError;
    mock
      .onGet(API_ENDPOINTS.coinbase)
      .reply(200, { data: { rates: { USD: "26000" } } });
    mock.onGet(API_ENDPOINTS.bitfinex).reply(200, [["tBTCUSD", 24000]]);
  });

  const req = {};
  const res = {
    status: jest.fn(() => res),
    json: jest.fn(),
  };

  await handler(req as Request, res as unknown as Response); // refactor later

  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.json).toHaveBeenCalledWith({
    error: "Failed to fetch ticker data",
    // lastCachedResult: {
    //   averagePrice: "25000.00",
    //   details: {
    //     bitstamp: 25000,
    //     coinbase: 26000,
    //     bitfinex: 24000,
    //   },
    // },
  });
});
