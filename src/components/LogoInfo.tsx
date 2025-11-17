import { Logo } from "@/types/types";

interface LogoInfoProps {
  logo: Logo;
  isLandscape: boolean;
}
const headline = "font-akzidenz-condensed font-bold text-2xl";

export default function LogoInfo({ logo, isLandscape }: LogoInfoProps) {
  return (
    <div
      className={`flex-1 flex gap-y-2 ${isLandscape ? "flex-row" : "flex-col"}`}
    >
      <div className="flex-1 min-w-1/2">
        <p>{logo.description}</p>
        <h3>Sicherheitsabstand-X: {logo.safe_zones_x * 2}% Zugabe</h3>
        <h3>Sicherheitsabstand-Y: {logo.safe_zones_y * 2}% Zugabe</h3>
      </div>

      <div className="flex-1 min-w-1/2">
        <h3 className={headline}>Nutzung:</h3>
        <ul className="list-disc pl-4">
          {logo.usage.map((usage) => (
            <li key={usage}>{usage}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
