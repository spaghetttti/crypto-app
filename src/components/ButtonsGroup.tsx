"use client";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import GJNumberLabel from "./GJNumberLabel";
import { SelectedTradingPair } from "@/types/SelectedTradingPair";

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

export async function fetchTradingPairs(
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
    // keepPreviousData: true,
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
      <div className="grid grid-cols-3 gap-2 p-2">
        {items.map((pair: TradingPair) => (
          <button
            key={pair.url_symbol}
            className="bg-blue-400 hover:bg-blue-500 text-white py-2 px-4 rounded"
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
      {(isLoading || isFetching) && <p>Loading...</p>}
      {error && <p className="text-red-500">{(error as Error).message}</p>}
    </div>
  );
}
