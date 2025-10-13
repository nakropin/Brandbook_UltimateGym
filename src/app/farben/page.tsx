"use client";
import { useState } from "react";
import brandbook from "@/brandbook.json";
import ColorGrid from "@/components/ColorGrid";
import ColorInfo from "@/components/ColorInfo";

type Color = (typeof brandbook.colors)[0];

export default function Farben() {
  const [hoveredColor, setHoveredColor] = useState<Color | null>(null);

  return (
    <>
      <h1 className="font-jersey text-3xl mb-4">Farben</h1>
      <div className="flex flex-row gap-4">
        <ColorGrid
          colors={brandbook.colors}
          onColorHover={setHoveredColor}
          onColorLeave={() => setHoveredColor(null)}
        />
        <ColorInfo hoveredColor={hoveredColor} />
      </div>
    </>
  );
}
