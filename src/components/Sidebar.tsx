import Link from "next/link";
import brandbook from "@/brandbook.json";
import { usePathname } from "next/navigation";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname();

  // Wiederverwendbare Klassen
  const collapsibleTextClasses = `whitespace-nowrap transition-all duration-300 ${
    isOpen ? "opacity-100 delay-300" : "opacity-0 w-0 overflow-hidden"
  }`;

  const chevronIconClasses = "w-6 h-6";
  const chevronPathProps = {
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 2,
  };

  return (
    <aside
      className={`h-screen bg-dark_blue text-white text-xl transition-all duration-300 flex-shrink-0 flex flex-col ${
        isOpen ? "w-64" : "w-18"
      }`}
    >
      {/* Header */}
      <div
        className={`flex items-center p-4 flex-shrink-0 ${
          isOpen ? "justify-between" : ""
        }`}
      >
        <h2 className={`font-bold ${collapsibleTextClasses}`}>Brandbook</h2>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 hover:bg-white/10 rounded transition-colors"
          aria-label={isOpen ? "Sidebar schließen" : "Sidebar öffnen"}
        >
          {isOpen ? (
            <svg
              className={chevronIconClasses}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path {...chevronPathProps} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          ) : (
            <svg
              className={chevronIconClasses}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path {...chevronPathProps} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 pb-4">
        <ul>
          {brandbook.sections.map((section) => {
            const isActive = pathname === section.url;
            return (
              <li key={section.id} className="mb-1">
                <Link
                  href={section.url}
                  className={`flex items-center py-2 rounded hover:bg-white/10 transition-all duration-300 ${
                    isActive ? "text-ultimate_blue" : ""
                  } ${isOpen ? "pl-0" : "pl-2"}`}
                  title={!isOpen ? section.title : undefined}
                >
                  <span className="text-2xl flex-shrink-0 mr-3">
                    {section.icon}
                  </span>
                  <span className={collapsibleTextClasses}>
                    {section.title}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
