import Link from "next/link";
import { ProjectListItem } from "@/types/types";

const KATEGORIE_COLORS: Record<string, string> = {
  UG: "bg-ultimate_blue text-white",
  UM: "bg-ultimate_blue text-white",
  BJJ: "bg-fitness_green text-white",
  KM: "bg-standup_red text-white",
  UF: "bg-fitness_green text-white",
  MMA: "bg-standup_red text-white",
  MT: "bg-standup_red text-white",
  KB: "bg-boxing_yellow text-black",
  BX: "bg-boxing_yellow text-black",
  FB: "bg-boxing_yellow text-black",
  MSC: "bg-gray-500 text-white",
};

function formatDate(dateStr: string): string {
  if (!dateStr) return "–";
  try {
    return new Date(dateStr).toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export default function ProjectCard({ project }: { project: ProjectListItem }) {
  const badgeClass =
    KATEGORIE_COLORS[project.kategorie] || "bg-gray-400 text-white";

  return (
    <Link href={`/projekte/${project.fileId}`}>
      <div className="flex items-center gap-4 p-3 bg-white border border-gray-200 rounded-lg hover:border-ultimate_blue hover:shadow-md transition cursor-pointer">
        <span
          className={`px-2 py-1 text-xs font-bold rounded shrink-0 ${badgeClass}`}
        >
          {project.kategorie}
        </span>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-800 truncate">
            {project.titel || project.id}
          </h3>
        </div>
        {project.verantwortlicher && (
          <span className="text-sm text-gray-500 shrink-0">
            {project.verantwortlicher}
          </span>
        )}
        <span className="text-sm text-gray-400 shrink-0">
          {formatDate(project.erstellt)}
        </span>
        <span className="text-sm text-gray-400 shrink-0">
          Fällig: {formatDate(project.fällig)}
        </span>
      </div>
    </Link>
  );
}
