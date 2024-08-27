"use client";
import GJNumberLabel from "./GJNumberLabel";
import { unixTimestampToTimeStringConverter } from "@/utils/timeConverter";
import { useQuery } from "@tanstack/react-query";

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

export async function fetchTickerData() {
  const response = await fetch("/api/ticker");
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  return response.json();
}

export default function AverageSidePanel() {
  const { data: tickerData, error, isLoading } = useQuery<TickerData>({ queryKey: ['tickerData'], queryFn: fetchTickerData });

  return (
    <div className="flex-1 bg-white p-4 m-2 shadow-md">
      <h2 className="text-lg font-semibold">Average ticker values</h2>
      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error.message}</p>}
      {tickerData?.averagePrice && (
        <>
        {tickerData?.error && (<p className="text-yellow-500">Network Error, the data displayed is actual for {unixTimestampToTimeStringConverter(tickerData.timestamp)}  </p>)}
        <div className="mt-4 text-xl font-bold">
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
