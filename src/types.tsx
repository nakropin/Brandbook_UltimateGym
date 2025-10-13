export interface Color {
  name: string;
  hexcolor: string;
  description: string;
}

export interface ColorTileProps {
  name: string;
  hexcolor: string;
}

export interface ColorInfoProps {
  hoveredColor: Color | null;
}

export interface ColorGridProps {
  colors: Color[];
  onColorHover: (color: Color) => void;
  onColorLeave: () => void;
}