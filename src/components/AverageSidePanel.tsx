"use client";
import { useState, useEffect } from "react";
import GJNumberLabel from "./GJNumberLabel";
import { unixTimestampToTimeStringConverter } from "@/utils/timeConverter";

interface AverageSidePanelProps {
  title: string;
}

interface TickerData {
  averagePrice: string;
  details: {
    bitstamp: number;
    coinbase: number;
    bitfinex: number;
  };
  error?: string;
  timestamp: number
}

export default function AverageSidePanel({ title }: AverageSidePanelProps) {
  const [tickerData, setTickerData] = useState<TickerData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTickerData = async () => {
      try {
        const response = await fetch("/api/ticker");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data: TickerData = await response.json();
        setTickerData(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchTickerData();
  }, []);

  return (
    <div className="flex-1 bg-white p-4 m-2 shadow-md">
      <h2 className="text-lg font-semibold">{title}</h2>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {tickerData?.averagePrice && (
        <>
        {tickerData?.error && (<p className="text-yellow-500">Network Error, the data displayed is actual for {unixTimestampToTimeStringConverter(tickerData.timestamp)}  </p>)}
        <div className="mt-4 text-2xl font-bold">
          <GJNumberLabel
            description="$"
            number={tickerData.averagePrice}
            details={tickerData.details}
            />
        </div>
        </>
      )}
    </div>
  );
}
