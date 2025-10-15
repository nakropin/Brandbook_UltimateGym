import TitleCard from "@/components/TitleCard";

export default function brandstory() {
  return (
    <div className="bg-dark_blue -m-20 p-20">
      <TitleCard title="Vision" className="h-screen-minus-header">
        <h2 className="font-bold text-5xl">
          Wir sind mehr als ein Gym. <br />
          Mehr als nur Trainer. <br />
          Wir sind Psychologen. <br />
          Wir sind Freunde. <br />
          Wir sind die <span className="text-ultimate_blue">
            ultimative{" "}
          </span>{" "}
          Community.
        </h2>
        <h3 className="text-2xl">
          — Peter Frontera, Inhaber des Ultimate Gyms
        </h3>
      </TitleCard>
      <TitleCard title="Mission" color="ultimate_blue">
        <h2 className="font-bold text-5xl">
          Wir bieten erstklassiges Kampfsporttraining für alle Altersgruppen und
          Levels – von Kindern bis zu Profiathleten.
        </h2>
        <p className="text-2xl mt-8">
          In unseren Standorten in Augsburg und Königsbrunn verbinden wir
          technische Exzellenz mit pädagogischem Anspruch. Wir vermitteln mehr
          als Techniken: Wir stärken Selbstvertrauen, fördern Respekt und
          schaffen eine Community, in der sich jeder willkommen fühlt.
        </p>
      </TitleCard>
      <TitleCard title="About" color="white" className="h-screen -mb-20">
        <div>
          <p>
            Das Ultimate Gym Augsburg ist eine der ältesten und führenden
            Kampfsportschulen der Region. Unser umfangreiches Kursangebot
            umfasst <b>BJJ, Muay Thai, Boxen, MMA</b> und <b>Fitness</b> – für
            alle Altersgruppen und jedes Trainingsniveau. Mit unseren zwei
            Standorten in Augsburg und Königsbrunn sind wir in der idealen Lage,
            die Bedürfnisse unserer Mitglieder und Zielgruppen abzudecken und
            künftig weiter zu wachsen.
          </p>
          <br />
          <p>
            Ultimate Gym ist <b>BOLD.</b>
            <br />
            Ultimate Gym ist <b>Dynmaisch.</b>
            <br />
            Inspiriert von aktuellen, amerkianischen Sports Graphic Design
            vermitteln wir ein starkes Außenbild mit haptisch anmutenden
            Elementen, wie Papier-Texturen und Riss-Kanten.
          </p>
        </div>
      </TitleCard>
    </div>
  );
}
