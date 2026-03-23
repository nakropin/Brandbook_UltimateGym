interface SubHeaderProps {
  title: string | undefined;
  variant?: "light" | "dark";
}

export default function SubHeader({ title, variant = "dark" }: SubHeaderProps) {
  return (
    <h1
      className={`font-akzidenz-extended font-bold text-3xl mb-4 ${
        variant === "light" ? "text-white" : ""
      }`}
    >
      {title}
    </h1>
  );
}
