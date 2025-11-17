import Image from "next/image";
import FloorplanInfo from "@/components/FloorplanInfo";

interface FloorplanLayoutProps {
  location: string;
  floorplanData: Array<{ name: string; hight: string }>;
}

export default function FloorplanLayout({
  location,
  floorplanData,
}: FloorplanLayoutProps) {
  const headline = "font-akzidenz-condensed font-bold text-2xl";

  if (!floorplanData || floorplanData.length === 0) {
    return <div>Floorplan für {location} nicht gefunden.</div>;
  }

  return (
    <div>
      <h1 className={`${headline}`}>{`Floorplan: ${
        location.charAt(0).toUpperCase() + location.slice(1)
      }`}</h1>
      <div className="flex flex-row gap-4 items-center">
        <div>
          <Image
            src={`/Floorplan_${location}_web.svg`}
            alt={`Floorplan ${location}`}
            width={800}
            height={800}
            priority
            className="flex-1"
          />
        </div>
        <div className="flex-2 flex flex-col gap-4">
          {floorplanData.map((e) => (
            <FloorplanInfo key={e.name} name={e.name} hight={e.hight} />
          ))}
        </div>
      </div>
    </div>
  );
}
