# Organizer App

Organizer App ist eine moderne React-PWA fuer ein fest montiertes Familien-Dashboard im Portrait-Format. Der MVP zeigt Uhrzeit, Datum, Wetter, heutige Termine, Wochenuebersicht, To-dos und lokale Settings auf einem Screen.

## 1. Architektur

- Frontend: React + TypeScript + Vite
- Styling: Tailwind CSS v4 ueber Vite-Plugin
- Routing: React Router mit einer Dashboard-Route
- Data Fetching: TanStack Query fuer Wetter, Kalender und To-dos
- State: Zustand fuer persistente Settings
- Backend/Sync: Supabase fuer To-dos, mit lokalem Fallback wenn keine Env gesetzt ist
- Wetter: Open-Meteo API mit LocalStorage-Fallback fuer Offline-Nutzung
- PWA: vite-plugin-pwa mit Standalone-Manifest und Workbox-Runtime-Cache

## 2. Projektstruktur

```text
Organizer-app/
	src/
		components/
			ClockCard.tsx
			SettingsCard.tsx
			TodayCard.tsx
			TodosCard.tsx
			WeatherCard.tsx
			WeekCard.tsx
		lib/
			types.ts
			utils.ts
		pages/
			AppShell.tsx
		services/
			calendar.ts
			supabase.ts
			todos.ts
			weather.ts
		store/
			settingsStore.ts
		main.tsx
		styles.css
	public/
		pwa-192.svg
		pwa-512.svg
	.env.example
	index.html
	package.json
	tsconfig.json
	tsconfig.app.json
	vite.config.ts
```

## 3. Dependencies

- react
- react-dom
- react-router-dom
- @tanstack/react-query
- zustand
- @supabase/supabase-js
- vite-plugin-pwa
- tailwindcss
- @tailwindcss/vite
- vite
- typescript

## 4. MVP

- Ein Dashboard-Screen, optimiert fuer ein festes Portrait-Touchdisplay
- Uhrzeit und Datum als visuelle Hauptflaeche
- Wetter ueber Open-Meteo
- Kalender aktuell mit Mock-Daten, Architektur spaeter fuer Google Calendar erweiterbar
- To-dos mit Supabase-Schnittstelle und lokalem Offline-Fallback
- Settings fuer Ort, Koordinaten und Refresh-Intervall
- Offline-freundlich durch PWA-Cache und zuletzt bekannte Wetter-/Settings-Daten

## 5. Env-Beispiel

Siehe `.env.example`.

Beispiel fuer eine spaetere Supabase-Tabelle:

```sql
create table todos (
	id uuid primary key default gen_random_uuid(),
	title text not null,
	notes text,
	done boolean not null default false,
	due_date timestamptz
);
```

## 6. Lokal starten

```bash
npm install
npm run dev
```

Danach im Browser:

```text
http://localhost:5173
```

## 7. Cloudflare Pages Deployment

Build-Command:

```bash
npm run build
```

Output-Verzeichnis:

```text
dist
```

Empfohlene Cloudflare-Pages-Einstellungen:

- Framework preset: Vite
- Build command: `npm run build`
- Build output directory: `dist`
- Environment variables: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_DEFAULT_LAT`, `VITE_DEFAULT_LON`

## 8. Naechste Ausbaustufen

1. Google-Calendar-OAuth und Sync-Adapter einfuehren
2. Supabase Auth fuer Familienmitglieder und Rollen
3. Drag-and-drop fuer To-do-Priorisierung
4. Familien-Widgets wie Einkaufsliste, Hausstatus, Abfallkalender
5. Query-Persistenz und Background-Sync fuer robusteren Offline-Betrieb