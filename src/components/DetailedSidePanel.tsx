"use client"
import ButtonsGroup from "./ButtonsGroup"

export default function DetailedSidePanel() {
  return (
    <div className="flex flex-col md:w-1/3 bg-white m-2 shadow-md">
      <ButtonsGroup />
      <div className="flex-1 p-4">
        <h2 className="text-lg font-semibold">
          Selected Bitstamp trading values
        </h2>
      </div>
    </div>
  );
}
