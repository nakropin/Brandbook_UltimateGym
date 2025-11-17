import Image from "next/image";
import brandbook from "@/brandbook.json";
import { Logo } from "@/types/types";
import LogoInfo from "@/components/LogoInfo";

export default function LogoGrid() {
  const headline = "font-akzidenz-condensed font-bold text-2xl";

  return (
    <>
      {brandbook.logos.map((logo: Logo) => {
        const isLandscape =
          logo.name !== "Bildmarke" && logo.name !== "Marke zentriert";

        return (
          <section className="flex flex-col gap-4 min-h-1/3" key={logo.name}>
            <h2 className={headline}>{logo.name}</h2>
            <div
              className={`flex gap-4 ${isLandscape ? "flex-col" : "flex-row"}`}
            >
              <div className="flex-1 relative">
                <Image
                  src={logo.path}
                  alt={logo.alt}
                  width={800}
                  height={800}
                  priority
                  className="w-full h-auto"
                />
              </div>
              <div className="flex-1">
                <LogoInfo logo={logo} isLandscape={isLandscape} />
              </div>
            </div>
          </section>
        );
      })}
    </>
  );
}
