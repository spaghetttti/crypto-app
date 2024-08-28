"use client"
import { useState } from "react";
import BitstampTab from "./BitstampTab";
import ButtonsGroup from "./ButtonsGroup"

export interface SelectedTradingPair {
  url_symbol: string, 
  description: string
}

export default function DetailedSidePanel() {
  const [selectedTradingPair, setSelectedTradingPair] = useState<SelectedTradingPair>({url_symbol: 'btcusd', description: 'loh'});

  const handleSelectedTradingPairChange = (newTradingPair: SelectedTradingPair) => {
    setSelectedTradingPair(newTradingPair);
  }

  return (
    <div className="flex flex-col md:w-1/3 bg-white m-2 shadow-md">
      <ButtonsGroup handleTradingPairChange={handleSelectedTradingPairChange}/>
      <BitstampTab url_symbol={selectedTradingPair.url_symbol} description={selectedTradingPair.description}/>
    </div>
  );
}
