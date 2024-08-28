"use client";
import { TickerData } from "@/types/TickerData";
import GJNumberLabel from "./GJNumberLabel";
import { unixTimestampToTimeStringConverter } from "@/utils/timeConverter";
import { useQuery } from "@tanstack/react-query";
import GJNumbersView from "./GJNumbersView";

async function fetchTickerData() {
  const response = await fetch("/api/ticker");
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  return response.json();
}

export default function AverageSidePanel() {
  const {
    data: tickerData,
    error,
    isLoading,
  } = useQuery<TickerData>({
    queryKey: ["tickerData"],
    queryFn: fetchTickerData,
  });

  if (isLoading) {
    return (
      <div className="flex-1 bg-white p-4 m-2 shadow-md">
        <div className="mt-4 flex flex-col space-y-4">
          <div className="flex items-center space-x-4 animate-pulse">
            <div className="flex-1 space-y-4">
              <div className="h-5 bg-slate-200 rounded w-3/4"></div>
              <div className="h-3 bg-slate-200 rounded w-1/2"></div>
              <div className="h-3 bg-slate-200 rounded w-1/2"></div>
              <div className="h-3 bg-slate-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500">{error.message}</p>;
  }

  if (tickerData) {
    const { averagePrice, error: tickerError, timestamp, details } = tickerData;

    const detailsArray = Object.keys(details).map((key) => ({
      description: key,
      number: details[key as keyof typeof details].toString(),
    }));

    return (
      <div className="flex-1 bg-white p-4 m-2 shadow-md">
        <h2 className="text-lg font-semibold">Average ticker values</h2>

        {tickerError && (
          <p className="text-yellow-500">
            Network Error, the data displayed is actual for{" "}
            {unixTimestampToTimeStringConverter(timestamp)}
          </p>
        )}

        {averagePrice && (
          <div className="mt-4 text-xl font-bold">
            <GJNumberLabel description="BTC/USD" number={averagePrice} />
            <div className="text-base">
              <GJNumbersView title="Details:" data={detailsArray} />
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
}
