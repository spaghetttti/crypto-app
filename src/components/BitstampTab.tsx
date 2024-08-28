"use client";
import { SelectedTradingPair } from "@/types/SelectedTradingPair";
import GJNumbersView from "./GJNumbersView";
import { unixTimestampToTimeStringConverter } from "@/utils/timeConverter";
import { useQuery } from "@tanstack/react-query";

interface BitstampTabProps extends SelectedTradingPair {}

interface TradingPairDetails {
  timestamp: string;
  open: string;
  high: string;
  low: string;
  last: string;
  volume: string;
  vwap: string;
  bid: string;
  ask: string;
  side: string;
  open_24: string;
  percent_change_24: string;
}

async function fetchTradingPairDetails(
  url_symbol: string
): Promise<TradingPairDetails> {
  const response = await fetch(`/api/trading-pairs/${url_symbol}`);
  if (!response.ok) {
    throw new Error("Failed to fetch trading pair details");
  }
  return response.json();
}

export default function BitstampTab({
  url_symbol,
  description,
}: BitstampTabProps) {
  const {
    data: details,
    error,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["tradingPairDetails", url_symbol],
    queryFn: () => fetchTradingPairDetails(url_symbol),
    enabled: !!url_symbol, // Only run query if url_symbol is provided
  });

  if (isLoading) {
    return (
      <div className="flex-1 p-4">
        <div className="mt-4 flex flex-col space-y-4">
          <div className="flex items-center space-x-4 animate-pulse">
            <div className="flex-1 space-y-4">
              <div className="h-5 bg-slate-200 rounded w-3/4"></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-2 bg-slate-200 rounded col-span-1"></div>
                <div className="h-2 bg-slate-200 rounded col-span-1"></div>
                <div className="h-2 bg-slate-200 rounded col-span-1"></div>
                <div className="h-2 bg-slate-200 rounded col-span-1"></div>
                <div className="h-2 bg-slate-200 rounded col-span-1"></div>
                <div className="h-2 bg-slate-200 rounded col-span-1"></div>
                <div className="h-2 bg-slate-200 rounded col-span-1"></div>
                <div className="h-2 bg-slate-200 rounded col-span-1"></div>
                <div className="h-2 bg-slate-200 rounded col-span-1"></div>
                <div className="h-2 bg-slate-200 rounded col-span-1"></div>
                <div className="h-2 bg-slate-200 rounded col-span-1"></div>
                <div className="h-2 bg-slate-200 rounded col-span-1"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex-1 p-4">
        <p className="text-red-500">{(error as Error).message}</p>
      </div>
    );
  }

  if (!details) {
    return (
      <div className="flex-1 p-4">
        <p>No details available</p>
      </div>
    );
  }

  const detailsArray = [
    { description: "Timestamp", number: unixTimestampToTimeStringConverter(Number(details.timestamp) * 1000) },
    { description: "Open", number: details.open },
    { description: "High", number: details.high },
    { description: "Low", number: details.low },
    { description: "Last", number: details.last },
    { description: "Volume", number: details.volume },
    { description: "VWAP", number: details.vwap },
    { description: "Bid", number: details.bid },
    { description: "Ask", number: details.ask },
    { description: "Side", number: details.side },
    { description: "Open 24h", number: details.open_24 },
    { description: "Percent Change 24h", number: `${details.percent_change_24}%` },
  ];

  return (
    <div className="flex-1 p-4">
      <h2 className="text-lg font-semibold">
        Selected Bitstamp Trading Values for {description}
      </h2>
      <GJNumbersView title="Trading Pair Details" data={detailsArray} />
    </div>
  );
}
