interface TitleCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  hideQuote?: boolean;
  color?: "dark_blue" | "ultimate_blue" | "white";
}

// Color scheme definitions
const colorSchemes = {
  dark_blue: {
    bg: "bg-dark_blue",
    text: "text-white",
    title: "text-ultimate_blue",
  },
  ultimate_blue: {
    bg: "bg-ultimate_blue",
    text: "text-white",
    title: "text-dark_blue",
  },
  white: {
    bg: "bg-white",
    text: "text-black_blue",
    title: "text-ultimate_blue",
  },
} as const;

export default function TitleCard({
  title,
  children,
  className = "h-screen",
  hideQuote = false,
  color = "dark_blue",
}: TitleCardProps) {
  const colors = colorSchemes[color];
  return (
    <section
      className={`${colors.bg} ${colors.text} ${className} flex flex-row  items-center snap-start snap-always justify-center -ml-4 ${className}`}
    >
      <div className="flex flex-row w-3/4 ">
        {!hideQuote && (
          <div
            className={`font-black text-9xl mr-2 flex-shrink-0 -mt-10 ${colors.title}`}
          >
            “
          </div>
        )}
        <div className="flex-1 flex-col">
          <h1 className={`font-black text-8xl mb-6 ${colors.title}`}>
            {title}
          </h1>
          {children}
        </div>
      </div>
    </section>
  );
}
