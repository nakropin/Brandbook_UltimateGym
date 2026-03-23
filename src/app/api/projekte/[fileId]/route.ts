import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import matter from "gray-matter";
import { ProjectDetail } from "@/types/types";

// Validate fileId format: alphanumeric, hyphens, underscores only
function isValidFileId(fileId: string): boolean {
  return /^[a-zA-Z0-9_-]+$/.test(fileId) && fileId.length > 0;
}

function coerceDate(value: unknown): string {
  if (value instanceof Date) return value.toISOString().split("T")[0];
  if (typeof value === "string") return value;
  return "";
}

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

  const accessToken = token.accessToken as string;

  try {
    // First verify the file belongs to the expected folder
    const metaRes = await fetch(
      `https://www.googleapis.com/drive/v3/files/${fileId}?fields=id,name,parents&supportsAllDrives=true`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    if (!metaRes.ok) {
      return NextResponse.json(
        { error: "Projekt nicht gefunden" },
        { status: 404 }
      );
    }

    const meta = (await metaRes.json()) as {
      id: string;
      name: string;
      parents?: string[];
    };

    // Security check: file must be in the expected folder
    if (!meta.parents?.includes(folderId)) {
      return NextResponse.json(
        { error: "Projekt nicht gefunden" },
        { status: 404 }
      );
    }

    // Download file content
    const contentRes = await fetch(
      `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&supportsAllDrives=true`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    if (!contentRes.ok) {
      throw new Error(`Failed to fetch file content`);
    }

    const rawContent = await contentRes.text();
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
      },
      content,
    };

    return NextResponse.json(project);
  } catch {
    return NextResponse.json(
      { error: "Fehler beim Laden des Projekts" },
      { status: 500 }
    );
  }
}
