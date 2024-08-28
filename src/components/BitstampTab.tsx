import { SelectedTradingPair } from "@/types/SelectedTradingPair";
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
    isSuccess,
  } = useQuery({
    queryKey: ["tradingPairDetails", url_symbol],
    queryFn: () => fetchTradingPairDetails(url_symbol),
    enabled: !!url_symbol, // Only run query if urlSymbol is provided
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

  return (
    <div className="flex-1 p-4">
      <h2 className="text-lg font-semibold">
        Selected Bitstamp Trading Values for {description}
      </h2>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <ul>
          <li>
            Timestamp:{" "}
            {unixTimestampToTimeStringConverter(
              Number(details.timestamp) * 1000
            )}
          </li>
          <li>Open: {details.open}</li>
          <li>High: {details.high}</li>
          <li>Low: {details.low}</li>
          <li>Last: {details.last}</li>
          <li>Volume: {details.volume}</li>
        </ul>
        <ul>
          <li>VWAP: {details.vwap}</li>
          <li>Bid: {details.bid}</li>
          <li>Ask: {details.ask}</li>
          <li>Side: {details.side}</li>
          <li>Open 24h: {details.open_24}</li>
          <li>Percent Change 24h: {details.percent_change_24}%</li>
        </ul>
      </div>
    </div>
  );
}
