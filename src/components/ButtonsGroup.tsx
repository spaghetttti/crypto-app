"use client";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import GJNumberLabel from "./GJNumberLabel";
import { SelectedTradingPair } from "@/types/SelectedTradingPair";
import LoadingSnipper from "./LoadingSpinner";

interface ButtonsGroupProps {
  handleTradingPairChange: (value: SelectedTradingPair) => void;
}

interface TradingPair extends SelectedTradingPair {
  name: string;
}

interface FetchTradingPairsResponse {
  items: TradingPair[];
  totalPages: number;
  totalItems: number;
}

async function fetchTradingPairs(
  page: number,
  limit: number
): Promise<FetchTradingPairsResponse> {
  const response = await fetch(
    `/api/trading-pairs?page=${page}&limit=${limit}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch trading pairs");
  }
  return response.json();
}

export default function ButtonsGroup({
  handleTradingPairChange,
}: ButtonsGroupProps) {
  const [page, setPage] = useState<number>(1);
  const [items, setItems] = useState<TradingPair[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const limit = 27;

  const { data, error, isLoading, isFetching } = useQuery({
    queryKey: ["tradingPairs", page],
    queryFn: () => fetchTradingPairs(page, limit),
    staleTime: 60000,
  });

  useEffect(() => {
    if (data) {
      setItems((prevItems) => [...prevItems, ...data.items]);
      setHasMore(data.items.length > 0);
    }
  }, [data]);

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    if (
      scrollHeight - scrollTop <= clientHeight * 1.5 &&
      hasMore &&
      !isLoading &&
      !isFetching
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <div onScroll={handleScroll} style={{ height: "400px", overflowY: "auto" }}>
      <h2 className="text-lg font-semibold">Trading pairs</h2>
      <div className="grid grid-cols-3 gap-2 p-2">
        {items.map((pair: TradingPair) => (
          <button
            key={pair.url_symbol}
            className="bg-sky-600 hover:bg-sky-700 text-white py-2 px-4 rounded"
            onClick={() =>
              handleTradingPairChange({
                url_symbol: pair.url_symbol,
                description: pair.name,
              })
            }
          >
            <GJNumberLabel description={pair.name} number={pair.description} />
          </button>
        ))}
      </div>
      {(isLoading || isFetching) && (
        <button
          disabled
          className="flex justify-center m-2 bg-sky-800 text-white py-2 px-4 rounded w-full"
        >
          <LoadingSnipper color="text-white" />
          Loading...
        </button>
      )}
      {error && <p className="text-red-500">{(error as Error).message}</p>}
    </div>
  );
}
