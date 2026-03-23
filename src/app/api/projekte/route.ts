import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import matter from "gray-matter";
import { ProjectListItem } from "@/types/types";

interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
}

interface DriveListResponse {
  files?: DriveFile[];
  nextPageToken?: string;
}

// Simple in-memory cache
let cache: { data: ProjectListItem[]; timestamp: number } | null = null;
const CACHE_TTL = 120_000; // 2 minutes

function coerceDate(value: unknown): string {
  if (value instanceof Date) return value.toISOString().split("T")[0];
  if (typeof value === "string") return value;
  return "";
}

async function fetchFileContent(
  fileId: string,
  accessToken: string
): Promise<string> {
  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&supportsAllDrives=true`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  if (!res.ok) throw new Error(`Failed to fetch file ${fileId}`);
  return res.text();
}

export async function GET(req: NextRequest) {
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

  // Return cached data if still fresh
  if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
    return NextResponse.json(cache.data);
  }

  const accessToken = token.accessToken as string;

  try {
    // List all .md files in the folder (handle pagination)
    const allFiles: DriveFile[] = [];
    let pageToken: string | undefined;

    do {
      const listUrl = new URL(
        "https://www.googleapis.com/drive/v3/files"
      );
      listUrl.searchParams.set(
        "q",
        `'${folderId}' in parents and name contains '.md' and trashed = false`
      );
      listUrl.searchParams.set("fields", "files(id,name,mimeType),nextPageToken");
      listUrl.searchParams.set("pageSize", "100");
      listUrl.searchParams.set("includeItemsFromAllDrives", "true");
      listUrl.searchParams.set("supportsAllDrives", "true");
      listUrl.searchParams.set("corpora", "allDrives");
      if (pageToken) listUrl.searchParams.set("pageToken", pageToken);

      const listRes = await fetch(listUrl.toString(), {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!listRes.ok) {
        const errBody = await listRes.text();
        throw new Error(`Drive API error: ${listRes.status} - ${errBody}`);
      }

      const data = (await listRes.json()) as DriveListResponse;
      if (data.files) allFiles.push(...data.files);
      pageToken = data.nextPageToken;
    } while (pageToken);

    // Fetch file contents in parallel batches of 5
    const projects: ProjectListItem[] = [];
    const BATCH_SIZE = 5;

    for (let i = 0; i < allFiles.length; i += BATCH_SIZE) {
      const batch = allFiles.slice(i, i + BATCH_SIZE);
      const results = await Promise.allSettled(
        batch.map(async (file) => {
          const content = await fetchFileContent(file.id, accessToken);
          const { data: frontmatter } = matter(content);

          // Only include files with typ === "projekt"
          if (frontmatter.typ !== "projekt") return null;

          return {
            fileId: file.id,
            id: frontmatter.id || file.name.replace(".md", ""),
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
          } satisfies ProjectListItem;
        })
      );

      for (const result of results) {
        if (result.status === "fulfilled" && result.value) {
          projects.push(result.value);
        }
      }
    }

    // Sort by creation date descending (newest first)
    projects.sort((a, b) => b.erstellt.localeCompare(a.erstellt));

    // Update cache
    cache = { data: projects, timestamp: Date.now() };

    return NextResponse.json(projects);
  } catch {
    return NextResponse.json(
      { error: "Fehler beim Laden der Projekte" },
      { status: 500 }
    );
  }
}
