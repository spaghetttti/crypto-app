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

export async function fetchTradingPairDetails(
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
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p className="text-red-500">{(error as Error).message}</p>;
  }

  if (!details) {
    return <p>No details available</p>;
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
