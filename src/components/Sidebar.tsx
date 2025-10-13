import Link from "next/link";
import brandbook from "@/brandbook.json";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full h-screen flex-1 p-4 bg-dark_blue text-white text-xl">
      <nav>
        <ul>
          {brandbook.sections.map((section) => {
            const isActive = pathname === section.url;
            return (
              <li
                key={section.id}
                className={`mb-1 ${isActive ? "text-ultimate_blue" : ""}`}
              >
                <Link href={`${section.url}`}>
                  {section.icon} {section.title}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
