"use client"
import { useState } from "react";
import BitstampTab from "./BitstampTab";
import ButtonsGroup from "./ButtonsGroup"

export default function DetailedSidePanel() {
  const [urlSymbol, setUrlSymbol] = useState('');

  const handleUrlSymbolChange = (value: string) => {
    setUrlSymbol(value);
  }
  
  return (
    <div className="flex flex-col md:w-1/3 bg-white m-2 shadow-md">
      <ButtonsGroup handleUrlSymbolChange={handleUrlSymbolChange}/>
      <BitstampTab  urlSymbol={urlSymbol}/>
    </div>
  );
}
