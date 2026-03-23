"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect, useCallback, useMemo } from "react";
import LoginPrompt from "@/components/LoginPrompt";
import ProjectModal from "@/components/ProjectModal";
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

type SortKey = "id" | "titel" | "kategorie" | "verantwortlicher" | "erstellt" | "fällig" | "status";

const STATUS_COLORS: Record<string, string> = {
  offen: "bg-gray-200 text-gray-700",
  "in bearbeitung": "bg-ultimate_blue/20 text-ultimate_blue",
  "in review": "bg-boxing_yellow/20 text-boxing_yellow",
  abgeschlossen: "bg-fitness_green/20 text-fitness_green",
};
type SortDir = "asc" | "desc";

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

export default function Projekte() {
  const { data: session } = useSession();
  const [projects, setProjects] = useState<ProjectListItem[]>([]);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("erstellt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [filterKategorie, setFilterKategorie] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  const loadProjects = useCallback(async () => {
    if (!session?.accessToken) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/projekte", {
        headers: { Authorization: `Bearer ${session.accessToken}` },
      });

      if (!res.ok) throw new Error(`Fehler: ${res.statusText}`);

      const data = (await res.json()) as ProjectListItem[];
      setProjects(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unbekannter Fehler");
    } finally {
      setLoading(false);
    }
  }, [session?.accessToken]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const kategorien = useMemo(
    () => [...new Set(projects.map((p) => p.kategorie))].sort(),
    [projects]
  );

  const filteredAndSorted = useMemo(() => {
    let result = [...projects];

    if (filterKategorie) {
      result = result.filter((p) => p.kategorie === filterKategorie);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.titel.toLowerCase().includes(q) ||
          p.id.toLowerCase().includes(q) ||
          p.verantwortlicher.toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => {
      const aVal = a[sortKey] || "";
      const bVal = b[sortKey] || "";
      const cmp = aVal.localeCompare(bVal, "de");
      return sortDir === "asc" ? cmp : -cmp;
    });

    return result;
  }, [projects, filterKategorie, searchQuery, sortKey, sortDir]);

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  function SortIcon({ columnKey }: { columnKey: SortKey }) {
    if (sortKey !== columnKey) return <span className="text-gray-300 ml-1">↕</span>;
    return <span className="ml-1">{sortDir === "asc" ? "↑" : "↓"}</span>;
  }

  if (!session) {
    return <LoginPrompt message="Bitte melde dich an, um die Projekte zu sehen." />;
  }

  return (
    <div className="relative min-h-screen">
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-lg flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={loadProjects}
            className="ml-4 px-3 py-1 bg-red-200 hover:bg-red-300 rounded text-sm transition"
          >
            Erneut versuchen
          </button>
        </div>
      )}

      {/* Filter bar */}
      <div className="flex gap-3 mb-4">
        <input
          type="text"
          placeholder="Suche nach Titel, ID oder Verantwortlicher..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-ultimate_blue"
        />
        <select
          value={filterKategorie}
          onChange={(e) => setFilterKategorie(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-ultimate_blue bg-white"
        >
          <option value="">Alle Kategorien</option>
          {kategorien.map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <p className="text-gray-600">Projekte werden geladen...</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-left text-gray-600">
                <th
                  className="px-2 py-3 font-semibold cursor-pointer hover:text-gray-900 select-none w-16"
                  onClick={() => handleSort("kategorie")}
                >
                  Kat.
                  <SortIcon columnKey="kategorie" />
                </th>
                <th
                  className="px-2 py-3 font-semibold cursor-pointer hover:text-gray-900 select-none text-center w-12"
                  onClick={() => handleSort("id")}
                >
                  Nr.
                  <SortIcon columnKey="id" />
                </th>
                <th
                  className="px-4 py-3 font-semibold cursor-pointer hover:text-gray-900 select-none"
                  onClick={() => handleSort("titel")}
                >
                  Titel
                  <SortIcon columnKey="titel" />
                </th>
                <th
                  className="px-4 py-3 font-semibold cursor-pointer hover:text-gray-900 select-none"
                  onClick={() => handleSort("verantwortlicher")}
                >
                  Verantwortlich
                  <SortIcon columnKey="verantwortlicher" />
                </th>
                <th
                  className="px-4 py-3 font-semibold cursor-pointer hover:text-gray-900 select-none"
                  onClick={() => handleSort("erstellt")}
                >
                  Erstellt
                  <SortIcon columnKey="erstellt" />
                </th>
                <th
                  className="px-4 py-3 font-semibold cursor-pointer hover:text-gray-900 select-none"
                  onClick={() => handleSort("fällig")}
                >
                  Fällig
                  <SortIcon columnKey="fällig" />
                </th>
                <th
                  className="px-4 py-3 font-semibold cursor-pointer hover:text-gray-900 select-none"
                  onClick={() => handleSort("status")}
                >
                  Status
                  <SortIcon columnKey="status" />
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSorted.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    Keine Projekte gefunden.
                  </td>
                </tr>
              ) : (
                filteredAndSorted.map((project) => {
                  const badgeClass =
                    KATEGORIE_COLORS[project.kategorie] || "bg-gray-400 text-white";
                  const idNum = project.id.match(/[A-Z]{2,3}(\d+)/)?.[1] || project.id;
                  return (
                    <tr
                      key={project.fileId}
                      className="border-b border-gray-100 hover:bg-gray-50 transition cursor-pointer"
                      onClick={() => setSelectedFileId(project.fileId)}
                    >
                      <td className="px-2 py-3 w-16">
                        <span
                          className={`px-2 py-1 text-xs font-bold rounded ${badgeClass}`}
                        >
                          {project.kategorie}
                        </span>
                      </td>
                      <td className="px-2 py-3 text-gray-500 font-mono text-xs text-center w-12">
                        {idNum}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-800">
                        {project.titel || project.id}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {project.verantwortlicher || "–"}
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {formatDate(project.erstellt)}
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {formatDate(project.fällig)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded capitalize ${STATUS_COLORS[project.status] || STATUS_COLORS.offen}`}
                        >
                          {project.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {selectedFileId && (
        <ProjectModal
          fileId={selectedFileId}
          onClose={() => setSelectedFileId(null)}
        />
      )}
    </div>
  );
}
