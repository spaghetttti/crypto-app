import AverageSidePanel from "@/components/AverageSidePanel";
import DetailedSidePanel from "@/components/DetailedSidePanel";

export default function Home() {
  return (
    <div className="md:min-h-screen bg-gray-100 p-4 flex flex-col md:flex-row">
      <AverageSidePanel />
      <DetailedSidePanel />
    </div>
  );
}
