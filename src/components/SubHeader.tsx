interface SubHeaderProps {
  title: string | undefined;
}

export default function SubHeader({ title }: SubHeaderProps) {
  return (
    <h1
      className={`font-akzidenz-extended font-bold text-3xl mb-4 ${
        title === "Brand Story" ? "text-white" : ""
      }`}
    >
      {title}
    </h1>
  );
}
