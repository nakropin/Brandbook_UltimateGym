interface SubHeaderProps {
  title: string | undefined;
}

export default function SubHeader({ title }: SubHeaderProps) {
  return <h1 className="font-jersey text-3xl mb-4">{title}</h1>;
}
