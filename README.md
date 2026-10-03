# Wellwisher

Wellwisher is a local-first fixed daily tracker for study, projects, health, wellbeing, reflections, career applications, and long-term quests. It uses no sample records: dashboard scores, XP, ranks, streaks, achievements, calendars, and analytics are calculated from the records you save.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). First run asks for your name, timezone, GATE/CGPA context, career year, and daily targets.

## Data and privacy

Everything is normalized and saved in browser `localStorage`. Settings supports JSON export/import and a full reset. The optional private habit can be PIN-gated (the PIN is a local UI boundary, not encryption). The optional `/api/coach` route uses `ASTRA_API_KEY` on the server and gives a local-safe fallback when no key is configured.
