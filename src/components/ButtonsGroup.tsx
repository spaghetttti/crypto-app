"use client"
import { useState, useEffect } from 'react';
import GJNumberLabel from "./GJNumberLabel";

interface TradingPair {
  name: string;
  url_symbol: string;
  description: string;
}

interface ButtonsGroupProps {
  handleUrlSymbolChange: (value: string) => void
}

export default function ButtonsGroup({handleUrlSymbolChange}: ButtonsGroupProps) {
  const [tradingPairs, setTradingPairs] = useState<{ [key: number]: TradingPair[] }>({});
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const limit = 9;

  useEffect(() => {
    const fetchTradingPairs = async () => {
      setLoading(true);
      setError(null);

      if (tradingPairs[page]) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/trading-pairs?page=${page}&limit=${limit}`);
        if (!response.ok) {
          throw new Error('Failed to fetch trading pairs');
        }

        const data = await response.json();
        setTradingPairs((prevState) => ({
          ...prevState,
          [page]: data.items
        }));
        setTotalPages(data.totalPages);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchTradingPairs();
  }, [page, tradingPairs]);

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-3 gap-2 p-2">
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && tradingPairs[page]?.map((pair) => (
          <button
            key={pair.url_symbol}
            className="bg-blue-400 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded"
            onClick={() => handleUrlSymbolChange(pair.url_symbol)}
          >
            <GJNumberLabel description={pair.name} number={pair.description} />
          </button>
        ))}
      </div>

      <div className="flex justify-between mt-4">
        <button
          onClick={handlePreviousPage}
          disabled={page === 1}
          className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>Page {page} of {totalPages}</span>
        <button
          onClick={handleNextPage}
          disabled={page === totalPages}
          className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
