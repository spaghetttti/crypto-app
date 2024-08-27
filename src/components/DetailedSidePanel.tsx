export default function DetailedSidePanel() {
  return (
    <div className="flex flex-col md:w-1/3 bg-white m-2 shadow-md">
      <div className="grid grid-cols-3 gap-2 p-2">
        <button className="bg-blue-400 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded">
          Button 1
        </button>
        <button className="bg-blue-300 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded">
          Button 2
        </button>
        <button className="bg-blue-300 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded">
          Button 3
        </button>
        <button className="bg-blue-300 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded">
          Button 4
        </button>
        <button className="bg-blue-300 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded">
          Button 5
        </button>
        <button className="bg-blue-300 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded">
          Button 6
        </button>
      </div>

      <div className="flex-1 p-4">
        <h2 className="text-lg font-semibold">
          Selected Bitstamp trading values
        </h2>
      </div>
    </div>
  );
}
