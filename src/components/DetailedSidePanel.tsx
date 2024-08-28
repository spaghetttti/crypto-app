"use client"
import { useState } from "react";
import BitstampTab from "./BitstampTab";
import ButtonsGroup from "./ButtonsGroup"
import { SelectedTradingPair } from "@/types/SelectedTradingPair";

export default function DetailedSidePanel() {
  const [selectedTradingPair, setSelectedTradingPair] = useState<SelectedTradingPair>({url_symbol: '', description: ''});

  const handleSelectedTradingPairChange = (newTradingPair: SelectedTradingPair) => {
    setSelectedTradingPair(newTradingPair);
  }

  return (
    <div className="flex flex-col md:w-1/2 bg-white m-2 p-4 shadow-md">
      <ButtonsGroup handleTradingPairChange={handleSelectedTradingPairChange}/>
      <BitstampTab url_symbol={selectedTradingPair.url_symbol} description={selectedTradingPair.description}/>
    </div>
  );
}
