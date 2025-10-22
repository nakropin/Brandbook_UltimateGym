import { ColorInfoProps } from "@/types/types";

export default function ColorInfo({ hoveredColor }: ColorInfoProps) {
  return (
    <div className="w-1/2 flex-[1_1_0%] space-y-4">
      <section className="h-32">
        <h3 className="font-jersey">Ultimate Gym Farbpalette</h3>
        <p>
          Wenn vom Ultimate Gym als Marke oder als eigenständige Entität
          gesprochen wird, wird die Farbpalette &quot;Ultimate Gym&quot;
          genutzt. Durch ihre neutrale Farbgestaltung hebt sie sich vom den
          Farben der einzelnen Sportbereiche ab.
        </p>
      </section>

      <section>
        <h3 className="font-jersey">Colorcode Sportarten</h3>
        <p className="mb-2">
          Abhängig von der Sportart wird eine andere Hauptfarbe für Designs
          genutzt. Jeder Kurs kann in eine von vier Sport-Kategorien eingeteilt
          werden:
        </p>
        <ul className="list-disc list-inside space-y-1-y-1">
          <li>MMA, Ringen &Wettkampf</li>
          <li>Box-Kurse</li>
          <li>Fittness & Selbstverteidigung</li>
          <li>BJJ</li>
        </ul>
      </section>

      {hoveredColor?.description && (
        <div className="p-4 bg-gray-100 rounded">
          <h4 className="font-bold">
            {hoveredColor.name.replace("_", " ").toUpperCase()}
          </h4>
          <p>{hoveredColor.description}</p>
        </div>
      )}
    </div>
  );
}
