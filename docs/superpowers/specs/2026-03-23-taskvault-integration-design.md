# Taskvault Integration — Projekt-Dashboard

**Date:** 2026-03-23
**Status:** Approved

## Overview

Read-only integration of the Taskvault (Obsidian vault on Google Drive) into the Brandbook app. Displays a project dashboard with all current video production projects and a detail view for each project.

## Data Source

- **Location:** Google Drive Shared Drive → `02_Marketing/KONZEPT/04_Projekt` (or wherever the `00 - Projekte/` folder is placed)
- **Format:** Markdown files with YAML frontmatter
- **Access:** Google Drive API with `drive.readonly` scope
- **Auth:** Existing NextAuth Google OAuth (authenticated users only)

### Project Frontmatter Schema

```yaml
id: "2026-03-19_UG01_test_123"
titel: "test 123"
kategorie: "UG"           # UG, UM, BJJ, KM, UF, MMA, RI, WK, MT, KB, BX, FB, MSC, KK, IM
verantwortlicher: ""
erstellt: 2026-03-19       # Note: gray-matter parses bare dates as Date objects → coerce to string
fällig: 2026-04-18
cloud: "https://drive.google.com/drive/folders/..."
typ: projekt
vorlage: "[[00_Projekt]]"
```

## Architecture

### Auth Changes

- Add `https://www.googleapis.com/auth/drive.readonly` to the Google OAuth scope in `src/app/api/auth/[...nextauth]/route.ts`.
- Users will need to re-consent once due to the new scope.

### Authorization

Only authenticated users (via Google OAuth) can access the project data. The API routes check for a valid session token before making any Drive API calls. This matches the existing pattern used by the calendar routes.

### New API Routes

**`GET /api/projekte`**
1. Get user's access token from session via `getToken()`
2. List all `.md` files in the Taskvault projects folder on Google Drive (by folder ID, stored as env var `TASKVAULT_FOLDER_ID` — server-only, no `NEXT_PUBLIC_` prefix)
3. For each file: download content in parallel (batches of 5 to avoid rate limits), parse YAML frontmatter with `gray-matter`
4. Filter: only include files where `typ === "projekt"`
5. Coerce `erstellt` and `fällig` date fields to ISO strings
6. Handle Google Drive pagination (`nextPageToken`) for folders with 100+ files
7. Cache results in-memory with 120s TTL to avoid repeated Drive API calls
8. Return JSON array of project metadata + Google Drive file IDs

Response shape:
```typescript
interface ProjectListItem {
  fileId: string;          // Google Drive file ID (for detail route)
  id: string;              // Taskvault project ID
  titel: string;
  kategorie: string;
  verantwortlicher: string;
  erstellt: string;        // ISO date string
  fällig: string;          // ISO date string
  cloud: string;           // Google Drive asset folder URL (validated)
}
```

**`GET /api/projekte/[fileId]`**
1. Get user's access token from session via `getToken()`
2. Validate `fileId` format (alphanumeric + hyphens/underscores only)
3. Download single `.md` file by Google Drive file ID
4. Verify the file's parent folder matches `TASKVAULT_FOLDER_ID` (prevents using this endpoint as a general Drive file reader)
5. Parse frontmatter + body with `gray-matter`
6. Coerce date fields to ISO strings
7. Return frontmatter metadata + raw markdown body

Response shape:
```typescript
interface ProjectDetail {
  fileId: string;
  metadata: ProjectListItem;
  content: string;          // Raw markdown body
}
```

### New Pages

**`/projekte` — Dashboard**
- Auth-gated: shows `LoginPrompt` if not logged in (update `LoginPrompt` to accept custom `message` prop)
- Fetches `/api/projekte` on mount
- Displays project table/grid with: Titel, Kategorie (color-coded badge), Verantwortlicher, Erstellt, Fällig
- Each row/card links to `/projekte/[fileId]`
- Loading, error, and empty states ("Keine Projekte vorhanden")

**`/projekte/[fileId]` — Detail**
- Auth-gated
- Fetches `/api/projekte/[fileId]` on mount
- Header: title, kategorie badge, dates, cloud link button (validated: only render as link if URL starts with `https://drive.google.com/`)
- Body: markdown rendered as HTML with `react-markdown`
- Back button to dashboard
- Loading, error, and not-found states

### New Components

**`ProjectCard`** — Single project in the overview grid/table
- Props: `ProjectListItem`
- Shows: title, kategorie badge (color-coded), verantwortlicher, dates

### Navigation

Add "Projekte" entry to `brandbook.json` sections array so it appears in the Sidebar.

### LoginPrompt Update

Make `LoginPrompt` accept an optional `message` prop (default: current text) so it can be reused across pages with context-appropriate messaging.

## Dependencies

- `gray-matter` — YAML frontmatter parsing
- `react-markdown` — Markdown to HTML rendering

## Environment Variables

- `TASKVAULT_FOLDER_ID` — Google Drive folder ID of the `00 - Projekte/` folder (server-only, NOT prefixed with `NEXT_PUBLIC_`)

## Error Handling

- Not authenticated → `LoginPrompt` component (with page-specific message)
- Drive folder not found → Error message with guidance
- Single project not found / fileId outside allowed folder → 404-style display
- API errors → Displayed in UI with retry option
- Zero projects → Empty state message
- `cloud` URL validation → Only render as link if starts with `https://drive.google.com/`
