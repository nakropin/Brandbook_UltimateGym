interface FloorplanInfoProps {
  name: string;
  height: string;
}

export default function FloorplanInfo({ name, height }: FloorplanInfoProps) {
  const headline = "font-akzidenz-condensed font-bold text-2xl";

  return (
    <div>
      <h2 className={`${headline}`}>{name}</h2>
      <p>{height}</p>
    </div>
  );
}
