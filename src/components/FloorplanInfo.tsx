interface FloorplanInfoProps {
  name: string;
  hight: string;
}

export default function FloorplanInfo({ name, hight }: FloorplanInfoProps) {
  const headline = "font-akzidenz-condensed font-bold text-2xl";

  return (
    <div>
      <h2 className={`${headline}`}>{name}</h2>
      <p>{hight}</p>
    </div>
  );
}
