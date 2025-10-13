import Image from "next/image";

export default function Logos() {
  return (
    <section className="flex flex-row">
      <div className="flex-1 space-y-4 w-1/2">
        <p>
          Dem Design der Ecken eines MMA-Rings nachempfunden, repräsentiert das
          Ultimate Gym Logo mit seinen scharfen Kanten und minimalistischen
          Anmutungen die Identität unserer Marke.
        </p>

        <h3 className="text-lg font-medium">Nutzung</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>Merchandise</li>
          <li>Equipment</li>
          <li>Print-Produkte</li>
          <li>Digital-Produkte</li>
        </ul>

        <h3 className="text-lg font-medium">Anwendungsrichtlinien</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>
            Nutzung invertierter Logos auf dunklem oder farbigem Hintergrund
          </li>
          <li>Nutzung schwarzer Logos auf weißem Hintergrund</li>
        </ul>
      </div>
      <div className="flex-1 w-1/2 flex items-center justify-center">
        <Image
          src="/ultimateGym_QUAD.png"
          alt="Ultimate Gym Logo"
          width={800}
          height={800}
          priority
          className="w-full h-auto max-h-96 object-contain"
        />
      </div>
    </section>
  );
}
