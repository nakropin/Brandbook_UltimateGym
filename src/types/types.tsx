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

export interface Event {
  start: string;
  end: string;
  title: string;
  weekday: string;
  category: string;
  marketing_potential: string;
  color?: string;
}

export interface FullCalendarEvent {
  id: string;
  title: string;
  start?: string;
  end?: string;
}

export interface Logo {
  name: string;
  alt: string;
  path: string;
  description: string;
  usage: string[];
  safe_zones_x: number;
  safe_zones_y: number;
}
