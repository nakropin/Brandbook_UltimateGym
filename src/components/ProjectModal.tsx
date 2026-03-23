"use client";

import { useEffect, useCallback, useState } from "react";
import { useSession } from "next-auth/react";
import Markdown from "react-markdown";
import { ProjectDetail } from "@/types/types";

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

const STATUS_COLORS: Record<string, string> = {
  offen: "bg-gray-200 text-gray-700",
  "in bearbeitung": "bg-ultimate_blue/20 text-ultimate_blue",
  "in review": "bg-boxing_yellow/20 text-boxing_yellow",
  abgeschlossen: "bg-fitness_green/20 text-fitness_green",
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

interface ProjectModalProps {
  fileId: string;
  onClose: () => void;
}

export default function ProjectModal({ fileId, onClose }: ProjectModalProps) {
  const { data: session } = useSession();
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProject = useCallback(async () => {
    if (!session?.accessToken) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/projekte/${fileId}`, {
        headers: { Authorization: `Bearer ${session.accessToken}` },
      });

      if (res.status === 404) {
        setError("Projekt nicht gefunden.");
        return;
      }

      if (!res.ok) throw new Error(`Fehler: ${res.statusText}`);

      const data = (await res.json()) as ProjectDetail;
      setProject(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unbekannter Fehler");
    } finally {
      setLoading(false);
    }
  }, [session?.accessToken, fileId]);

  useEffect(() => {
    loadProject();
  }, [loadProject]);

  // Close on Escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const metadata = project?.metadata;
  const content = project?.content;
  const badgeClass = metadata
    ? KATEGORIE_COLORS[metadata.kategorie] || "bg-gray-400 text-white"
    : "";
  const statusClass = metadata
    ? STATUS_COLORS[metadata.status] || STATUS_COLORS.offen
    : "";

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 backdrop-blur-sm overflow-y-auto py-8"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-gray-50 rounded-xl shadow-2xl w-full max-w-3xl mx-4 max-h-[90vh] flex flex-col">
        {/* Modal Header Bar */}
        <div className="flex items-center justify-between px-6 pt-4 pb-2 border-b border-gray-200 shrink-0">
          <h2 className="text-lg font-bold text-gray-800 truncate">
            {metadata?.id || "Projekt"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-200 rounded-lg transition text-gray-500 hover:text-gray-800"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Content */}
        <div className="overflow-y-auto flex-1 p-6">
          {loading && (
            <div className="flex justify-center py-12">
              <p className="text-gray-600">Projekt wird geladen...</p>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-100 text-red-800 rounded-lg">{error}</div>
          )}

          {metadata && content && (
            <>
              {/* Project Info */}
              <div className="bg-white border border-gray-200 rounded-lg p-5 mb-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 text-xs font-bold rounded ${badgeClass}`}>
                      {metadata.kategorie}
                    </span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded capitalize ${statusClass}`}>
                      {metadata.status}
                    </span>
                  </div>
                  {metadata.cloud && (
                    <a
                      href={metadata.cloud}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-ultimate_blue hover:underline shrink-0"
                    >
                      Google Drive &rarr;
                    </a>
                  )}
                </div>

                <div className="flex flex-wrap gap-6 mt-3 text-sm text-gray-500">
                  {metadata.verantwortlicher && (
                    <span>Verantwortlich: {metadata.verantwortlicher}</span>
                  )}
                  <span>Erstellt: {formatDate(metadata.erstellt)}</span>
                  <span>Fällig: {formatDate(metadata.fällig)}</span>
                </div>
              </div>

              {/* Markdown */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 max-w-none">
                <Markdown
                  components={{
                    h1: ({ children }) => (
                      <h1 className="text-3xl font-akzidenz-extended font-bold text-gray-900 mt-10 mb-4 pb-3 border-b-2 border-gray-300 first:mt-0 uppercase tracking-wide">
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-2xl font-akzidenz-condensed font-bold text-gray-900 mt-10 mb-4 pb-2 border-b border-gray-200 uppercase tracking-wide">
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-lg font-bold text-gray-700 mt-6 mb-2">
                        {children}
                      </h3>
                    ),
                    h4: ({ children }) => (
                      <h4 className="text-base font-semibold text-gray-600 mt-4 mb-2">
                        {children}
                      </h4>
                    ),
                    p: ({ children }) => (
                      <p className="text-gray-600 leading-relaxed mb-3">{children}</p>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-disc list-inside mb-4 space-y-1 text-gray-600 ml-2">
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal list-inside mb-4 space-y-1 text-gray-600 ml-2">
                        {children}
                      </ol>
                    ),
                    li: ({ children }) => (
                      <li className="text-gray-600">{children}</li>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-ultimate_blue pl-4 py-1 my-4 text-gray-500 italic">
                        {children}
                      </blockquote>
                    ),
                    hr: () => <hr className="my-6 border-gray-200" />,
                    a: ({ href, children }) => (
                      <a
                        href={href}
                        className="text-ultimate_blue hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {children}
                      </a>
                    ),
                  }}
                >
                  {content}
                </Markdown>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
