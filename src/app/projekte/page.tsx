"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect, useCallback } from "react";
import LoginPrompt from "@/components/LoginPrompt";
import AuthButton from "@/components/AuthButton";
import ProjectCard from "@/components/ProjectCard";
import { ProjectListItem } from "@/types/types";

export default function Projekte() {
  const { data: session } = useSession();
  const [projects, setProjects] = useState<ProjectListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  if (!session) {
    return <LoginPrompt message="Bitte melde dich an, um die Projekte zu sehen." />;
  }

  return (
    <div className="relative min-h-screen bg-gray-50">
      <div className="flex justify-between items-center pb-4">
        <h1 className="text-2xl font-bold">Projekte</h1>
        <AuthButton session={session} />
      </div>

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

      {loading ? (
        <div className="flex justify-center py-12">
          <p className="text-gray-600">Projekte werden geladen...</p>
        </div>
      ) : projects.length === 0 && !error ? (
        <div className="flex justify-center py-12">
          <p className="text-gray-500">Keine Projekte vorhanden.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <ProjectCard key={project.fileId} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
