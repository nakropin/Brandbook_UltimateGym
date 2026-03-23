# Refactoring Plan — Ultimate Gym Brandbook

**Date:** 2026-03-23
**Branch:** `dev` (sequenziell, dann PR → `main`)

---

## Branching-Strategie

- `dev` wird von `main` erstellt
- Alle Refactoring-Commits sequenziell auf `dev`
- Am Ende: PR von `dev` → `main`
- Künftig: Immer von `dev` aus arbeiten, in `main` mergen

---

## Phase 1: Sicherheit & Bugs

### 1.1 Console.logs entfernen
- **Dateien:** `src/app/api/calendar-events/route.ts` (~30 Statements), `src/app/markenstrategie/page.tsx` (~5 Statements)
- **Risiko:** Token-Infos werden geloggt
- **Aktion:** Alle `console.log` Statements entfernen

### 1.2 API-Pfad-Typo fixen
- **Datei:** `src/app/api/calender-list/` → `src/app/api/calendar-list/`
- **Aktion:** Ordner umbenennen, alle Referenzen aktualisieren

### 1.3 Property-Typo fixen
- **Dateien:** `src/components/FloorplanInfo.tsx`, `src/components/FloorplanLayout.tsx`
- **Aktion:** `hight` → `height` in Props-Interface und allen Verwendungen

---

## Phase 2: Architektur & DRY

### 2.1 Duplizierte Interfaces zentralisieren
- `CalendarEvent` existiert in `api/calendar-events/route.ts` UND `markenstrategie/page.tsx` → nach `src/types/` verschieben
- `EventListItemProps` existiert in `EventList.tsx` UND `EventListItem.tsx` → einmal definieren, importieren

### 2.2 Markenstrategie-Page aufteilen
- **Datei:** `src/app/markenstrategie/page.tsx` (201 Zeilen)
- **Aktion:** Custom Hooks extrahieren:
  - `useCalendarEvents` — Fetching + Transformation von Calendar-Daten
  - `useSchulferien` — Fetching von Schulferien-Daten
- UI-Logik von Daten-Logik trennen

### 2.3 Imports vereinheitlichen
- Alle relativen Imports (`../constants/calendar`) durch `@/`-Aliases ersetzen (`@/constants/calendar`)

---

## Phase 3: Cleanup

### 3.1 Tote Komponenten löschen
- `src/components/EventCard.tsx` — nirgends importiert
- `src/components/EventBadge.tsx` — nirgends importiert

### 3.2 Test-Kommentar entfernen
- `src/constants/calendar.tsx:17` — `//Test-Kommentar`

### 3.3 Magic Strings entfernen
- `src/components/SubHeader.tsx:6` — Hardcoded-Check für "Brand Story"
- Durch Props-basierte Steuerung ersetzen

### 3.4 Under-Construction-Seiten vereinheitlichen
- Betroffene Seiten: `/typographie`, `/toneandvoice`, `/bildsprache`, `/ikonographie`, `/socialmedia`
- Einheitliche Platzhalter-Komponente erstellen oder aus Navigation entfernen

---

## Phase 4: Qualität & Infrastruktur

### 4.1 Error Handling in UI
- Fehlermeldungen für Daten-Fetching in Markenstrategie-Seite
- Loading-States und Error-States sichtbar machen

### 4.2 next.config.ts konfigurieren
- Security-Headers hinzufügen
- Image-Domains konfigurieren

### 4.3 Test-Setup
- Vitest + React Testing Library einrichten
- Erste Tests für API-Routes schreiben
