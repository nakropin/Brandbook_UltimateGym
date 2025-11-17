import LogoText from "./LogoText";
import LogoGrid from "./LogoGrid";

export default function Logos() {
  return (
    <div className="flex flex-col gap-8">
      <LogoText />
      <LogoGrid />
    </div>
  );
}
