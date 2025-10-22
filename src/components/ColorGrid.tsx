import ColorTile from "./ColorTile";
import { ColorGridProps } from "@/types/types";

// Sub-Komponenten als named exports
export default function ColorGrid({
  colors,
  onColorHover,
  onColorLeave,
}: ColorGridProps) {
  return (
    <div className="w-1/2 flex-[1_1_0%]">
      <div className="grid grid-cols-4 gap-4">
        {colors.map((color) => (
          <div
            key={color.name}
            onMouseEnter={() => onColorHover(color)}
            onMouseLeave={onColorLeave}
          >
            <ColorTile name={color.name} hexcolor={color.hexcolor} />
          </div>
        ))}
      </div>
      <p className="mt-4 text-sm">
        Clicke die Farben um den Hexcode auf die Zwischenablage zu kopieren
      </p>
    </div>
  );
}
