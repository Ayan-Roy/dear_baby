# Dear Baby

A permanent digital pregnancy journal, timeline, and memory book — built with React + Vite.

This is a **frontend-only prototype** using in-memory dummy data (see `src/data/dummyData.js`).
Nothing persists yet — there's no backend or database wired up. That's the natural next step
(Node/Express + Postgres or MongoDB) once you're happy with the UI and structure.

## Getting started

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually http://localhost:5173).

## Project structure

```
dear-baby/
├── index.html
├── vite.config.js
├── package.json
└── src/
    ├── main.jsx            # entry point, sets up React Router
    ├── App.jsx             # app shell, holds shared state (events, journal)
    ├── index.css           # design tokens + all styling
    ├── utils.js            # small date helpers
    ├── data/
    │   └── dummyData.js    # all dummy/seed data lives here
    ├── components/
    │   ├── Sidebar.jsx     # left nav
    │   └── UI.jsx          # ProgressRing, StatCard
    └── pages/
        ├── Dashboard.jsx
        ├── Timeline.jsx
        ├── Journal.jsx
        ├── Gallery.jsx
        ├── Medical.jsx
        ├── CalendarPage.jsx
        ├── Checklists.jsx
        └── BabyNames.jsx
```

## What's implemented

- **Dashboard** — pregnancy week progress ring, due date, days remaining, today's journal
  prompt, quick stats, recent memories
- **Timeline** — the "ribbon" thread through every milestone, category filters, add-memory form
- **Journal** — mood picker + "Dear Baby" diary entries, new entries persist in session state
- **Gallery** — album grid (placeholder tiles — wire up real photo upload/storage later)
- **Medical** — weight trend chart (Recharts), BP, current medicines, doctor visit log
- **Calendar** — month grid with dots marking days that have a timeline event
- **Checklists** — Hospital Bag / Baby Shopping / Mother Care / Birth Plan, with progress bars
- **Baby Names** — add names, vote with hearts, sorted by votes

## Design system

All tokens live at the top of `src/index.css`:

- `--paper` / `--paper-alt` — parchment backgrounds
- `--ink` / `--ink-soft` — plum-black text
- `--sage` — growth/nature accent (checklists, progress)
- `--rose` — warmth accent (timeline ribbon, primary actions)
- `--gold` — milestone accent (big timeline moments)
- Fonts: **Fraunces** (serif, emotional headings/journal) + **Inter** (UI/body)

## Next steps (not yet built)

- Node/Express API + database (Postgres/Mongo) to replace in-memory state
- Real photo upload (S3 / Firebase Storage) for the Gallery
- Ultrasound page, Document storage, Statistics page, "On This Day" memories
- Auth (single mother-owner account, no doctor/clinic accounts per the brief)
- Pregnancy Book PDF export
