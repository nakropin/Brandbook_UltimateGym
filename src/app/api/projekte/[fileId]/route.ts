import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import matter from "gray-matter";
import { ProjectDetail } from "@/types/types";

function isValidFileId(fileId: string): boolean {
  return /^[a-zA-Z0-9_-]+$/.test(fileId) && fileId.length > 0;
}

function coerceDate(value: unknown): string {
  if (value instanceof Date) return value.toISOString().split("T")[0];
  if (typeof value === "string") return value;
  return "";
}

// In-memory cache per fileId
const cache = new Map<string, { data: ProjectDetail; timestamp: number }>();
const CACHE_TTL = 120_000; // 2 minutes

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ fileId: string }> }
) {
  const { fileId } = await params;

  if (!isValidFileId(fileId)) {
    return NextResponse.json({ error: "Invalid file ID" }, { status: 400 });
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token?.accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const folderId = process.env.TASKVAULT_FOLDER_ID;
  if (!folderId) {
    return NextResponse.json(
      { error: "TASKVAULT_FOLDER_ID not configured" },
      { status: 500 }
    );
  }

  // Return cached data if fresh
  const cached = cache.get(fileId);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return NextResponse.json(cached.data);
  }

  const accessToken = token.accessToken as string;
  const headers = { Authorization: `Bearer ${accessToken}` };

  try {
    // Fetch metadata and content in parallel
    const [metaRes, contentRes] = await Promise.all([
      fetch(
        `https://www.googleapis.com/drive/v3/files/${fileId}?fields=id,name,parents&supportsAllDrives=true`,
        { headers }
      ),
      fetch(
        `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&supportsAllDrives=true`,
        { headers }
      ),
    ]);

    if (!metaRes.ok || !contentRes.ok) {
      return NextResponse.json(
        { error: "Projekt nicht gefunden" },
        { status: 404 }
      );
    }

    const [meta, rawContent] = await Promise.all([
      metaRes.json() as Promise<{ id: string; name: string; parents?: string[] }>,
      contentRes.text(),
    ]);

    // Security check: file must be in the expected folder
    if (!meta.parents?.includes(folderId)) {
      return NextResponse.json(
        { error: "Projekt nicht gefunden" },
        { status: 404 }
      );
    }

    const { data: frontmatter, content } = matter(rawContent);

    const project: ProjectDetail = {
      fileId,
      metadata: {
        fileId,
        id: frontmatter.id || meta.name.replace(".md", ""),
        titel: frontmatter.titel || "",
        kategorie: frontmatter.kategorie || "",
        verantwortlicher: frontmatter.verantwortlicher || "",
        erstellt: coerceDate(frontmatter.erstellt),
        fällig: coerceDate(frontmatter.fällig),
        cloud:
          typeof frontmatter.cloud === "string" &&
          frontmatter.cloud.startsWith("https://drive.google.com/")
            ? frontmatter.cloud
            : "",
        status: frontmatter.status || "offen",
      },
      content,
    };

    cache.set(fileId, { data: project, timestamp: Date.now() });

    return NextResponse.json(project);
  } catch {
    return NextResponse.json(
      { error: "Fehler beim Laden des Projekts" },
      { status: 500 }
    );
  }
}
