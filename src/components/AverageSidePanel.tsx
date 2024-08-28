"use client";
import { TickerData } from "@/types/TickerData";
import GJNumberLabel from "./GJNumberLabel";
import { unixTimestampToTimeStringConverter } from "@/utils/timeConverter";
import { useQuery } from "@tanstack/react-query";

async function fetchTickerData() {
  const response = await fetch("/api/ticker");
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  return response.json();
}

export default function AverageSidePanel() {
  const { data: tickerData, error, isLoading } = useQuery<TickerData>({
    queryKey: ["tickerData"],
    queryFn: fetchTickerData,
  });

  return (
    <div className="flex-1 bg-white p-4 m-2 shadow-md">
      <h2 className="text-lg font-semibold">Average ticker values</h2>
      {isLoading ? (
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
      ) : (
        <>
          {error && <p className="text-red-500">{error.message}</p>}
          {tickerData?.averagePrice && (
             <div className="mt-4 text-xl font-bold">
              {tickerData?.error && (
                <p className="text-yellow-500">
                  Network Error, the data displayed is actual for{" "}
                  {unixTimestampToTimeStringConverter(tickerData.timestamp)}{" "}
                </p>
              )}
             
                <GJNumberLabel
                  description="$"
                  number={tickerData.averagePrice}
                  details={tickerData.details}
                />
            
            </div>
          )}
        </>
      )}
    </div>
  );
}
