"use client";
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import GJNumberLabel from "./GJNumberLabel";
import { SelectedTradingPair } from './DetailedSidePanel';


export interface TradingPair extends SelectedTradingPair  {
  name: string;
}
interface ButtonsGroupProps {
  handleTradingPairChange: (value: SelectedTradingPair) => void;
}

interface FetchTradingPairsResponse {
  items: TradingPair[];
  totalPages: number;
}

export async function fetchTradingPairs(page: number, limit: number): Promise<FetchTradingPairsResponse> {
  const response = await fetch(`/api/trading-pairs?page=${page}&limit=${limit}`);
  if (!response.ok) {
    throw new Error('Failed to fetch trading pairs');
  }
  return response.json();
}

export default function ButtonsGroup({ handleTradingPairChange }: ButtonsGroupProps) {
  const [page, setPage] = useState<number>(1);
  const limit = 9;

  const { data, error, isLoading, isFetching } = useQuery({
    queryKey: ['tradingPairs', page],
    queryFn: () => fetchTradingPairs(page, limit),
    // keepPreviousData: true,
    staleTime: 60000, // Keep data fresh for a minute
  }
  );

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < (data?.totalPages || 1)) {
      setPage(page + 1);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-3 gap-2 p-2">
        {(isLoading || isFetching) && <p>Loading...</p>}
        {error && <p className="text-red-500">{(error as Error).message}</p>}
        {!isLoading && !error && data?.items.map((pair: TradingPair) => (
          <button
            key={pair.url_symbol}
            className="bg-blue-400 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded"
            onClick={() => handleTradingPairChange({url_symbol: pair.url_symbol, description: pair.description})}
          >
            <GJNumberLabel description={pair.name} number={pair.description} />
          </button>
        ))}
      </div>

      <div className="flex justify-between m-4">
        <button
          onClick={handlePreviousPage}
          disabled={page === 1 || isLoading || isFetching}
          className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>Page {page} of {data?.totalPages || 1}</span>
        <button
          onClick={handleNextPage}
          disabled={page === data?.totalPages || isLoading || isFetching}
          className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
