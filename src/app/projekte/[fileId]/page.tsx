"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Markdown from "react-markdown";
import LoginPrompt from "@/components/LoginPrompt";
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

export default function ProjektDetail() {
  const { data: session } = useSession();
  const params = useParams();
  const fileId = params.fileId as string;

  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProject = useCallback(async () => {
    if (!session?.accessToken || !fileId) return;

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

  if (!session) {
    return <LoginPrompt message="Bitte melde dich an, um das Projekt zu sehen." />;
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <p className="text-gray-600">Projekt wird geladen...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Link
          href="/projekte"
          className="inline-flex items-center text-ultimate_blue hover:underline mb-4"
        >
          &larr; Zurück zu Projekte
        </Link>
        <div className="p-4 bg-red-100 text-red-800 rounded-lg">{error}</div>
      </div>
    );
  }

  if (!project) return null;

  const { metadata, content } = project;
  const badgeClass =
    KATEGORIE_COLORS[metadata.kategorie] || "bg-gray-400 text-white";

  return (
    <div className="min-h-screen bg-gray-50">
      <Link
        href="/projekte"
        className="inline-flex items-center text-ultimate_blue hover:underline mb-6"
      >
        &larr; Zurück zu Projekte
      </Link>

      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {metadata.id}
            </h1>
            {metadata.verantwortlicher && (
              <p className="text-gray-500 mt-1">{metadata.verantwortlicher}</p>
            )}
          </div>
          <span
            className={`px-3 py-1 text-sm font-bold rounded ${badgeClass}`}
          >
            {metadata.kategorie}
          </span>
        </div>

        <div className="flex flex-wrap gap-6 mt-4 text-sm text-gray-600">
          <span>Erstellt: {formatDate(metadata.erstellt)}</span>
          <span>Fällig: {formatDate(metadata.fällig)}</span>
          {metadata.cloud && (
            <a
              href={metadata.cloud}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ultimate_blue hover:underline"
            >
              Google Drive &rarr;
            </a>
          )}
        </div>
      </div>

      {/* Markdown Content */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 max-w-none markdown-content">
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
    </div>
  );
}
