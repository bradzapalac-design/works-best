# Works Best

**Works Best Goal Activity Tracker** is a personal life/goal dashboard. You keep a few enduring **themes** (north stars), then add and update **specific objectives** under those themes, and track progress across **week / month / year** horizons.

Themes are meant to be stable. Specifics are editable and seasonal.

Data stays in this browser (`localStorage`). Export a JSON backup if you want it elsewhere.

## Themes vs objectives

| | Themes | Objectives |
| --- | --- | --- |
| Role | North stars for areas of life | Concrete outcomes under a theme |
| Cadence | Rarely change; add / rename / archive / reorder | Change with the week, month, or year |
| Examples | Family, Health, Money / Investments, Work / Career, Home | “Move four days this week”, “Family spending review”, “Put a trip on the calendar” |
| Fields | Name, short description, color, icon | Title, notes, horizon, status, optional metric, optional due date, priority |

A theme scorecard on the dashboard is the roll-up of that theme’s objectives **for the selected horizon**. Parked items are left out of the score.

## Horizons

- **Week** — a tight set of outcomes. The dashboard *suggests* three or fewer in play. It will not block you from adding more.
- **Month** — reviews, bookings, and one-off projects.
- **Year** — milestones that should still matter in December.

## Run it

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

```bash
npm run build    # production build
npm run preview  # serve the build
npm test         # scoring + backup validation
```

Requires Node.js 20+.

## Using the app

1. **Dashboard** — switch Week / Month / Year. Click a scorecard to filter. Check off work, tap **+1** on counts, or **Check-in** to log a note and optional numeric delta.
2. **Themes** — create, rename, reorder, archive, and restore north stars. Add objectives from here too.
3. **Activity** — recent check-ins.
4. **Data** — export JSON, import a backup (replaces current data), or reset to the sample workspace.

First launch seeds five themes and a light set of sample objectives so the board is not blank. Sample data is illustrative only — it does not include private account balances.

## Backup format

Export is a JSON object with `version: 1`, plus `themes`, `objectives`, `activities`, and `ui.lastHorizon`. Import validates that shape and that every objective/activity points at a known theme/objective.

## Stack

Vite, React 19, TypeScript. No backend.
