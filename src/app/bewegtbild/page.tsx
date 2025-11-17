import FloorplanLayout from "@/components/FloorplanLayout";
import brandbook from "@/brandbook.json";

export default function Bewegtbild() {
  return (
    <div className="flex flex-col gap-8">
      {Object.keys(brandbook.floorplan).map((location) => (
        <FloorplanLayout
          location={location}
          key={location}
          floorplanData={
            brandbook.floorplan[location as keyof typeof brandbook.floorplan]
          }
        />
      ))}
    </div>
  );
}
