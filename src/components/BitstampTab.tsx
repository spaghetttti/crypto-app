import { useState, useEffect } from "react";

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

interface BitstampTabProps {
  urlSymbol: string;
}

export default function BitstampTab({ urlSymbol }: BitstampTabProps) {
  const [details, setDetails] = useState<TradingPairDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/trading-pairs/${urlSymbol}`);
        if (!response.ok) {
          throw new Error("Failed to fetch trading pair details");
        }

        const data = await response.json();
        setDetails(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [urlSymbol]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!details) {
    return <p>No details available</p>;
  }

  return (
    <div className="flex-1 p-4">
      <h2 className="text-lg font-semibold">Selected Bitstamp Trading Values</h2>
      <ul>
        <li>Timestamp: {details.timestamp}</li>
        <li>Open: {details.open}</li>
        <li>High: {details.high}</li>
        <li>Low: {details.low}</li>
        <li>Last: {details.last}</li>
        <li>Volume: {details.volume}</li>
        <li>VWAP: {details.vwap}</li>
        <li>Bid: {details.bid}</li>
        <li>Ask: {details.ask}</li>
        <li>Side: {details.side}</li>
        <li>Open 24h: {details.open_24}</li>
        <li>Percent Change 24h: {details.percent_change_24}%</li>
      </ul>
    </div>
  );
}
