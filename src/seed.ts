import { newId, nowIso } from "./lib/ids";
import type { AppData, Objective, Theme } from "./types";

const STAMP = "2026-01-05T15:00:00.000Z";

function theme(
  partial: Omit<Theme, "createdAt" | "updatedAt" | "archived">,
): Theme {
  return { ...partial, archived: false, createdAt: STAMP, updatedAt: STAMP };
}

function objective(
  partial: Omit<Objective, "createdAt" | "updatedAt" | "priority" | "notes"> & {
    notes?: string;
    priority?: boolean;
  },
): Objective {
  return {
    notes: "",
    priority: false,
    createdAt: STAMP,
    updatedAt: STAMP,
    ...partial,
  };
}

export function createSeedData(): AppData {
  const family = theme({
    id: "theme-family",
    name: "Family",
    description: "Time together, household rhythm, and the people who matter.",
    color: "#C45C26",
    icon: "people",
    order: 0,
  });
  const health = theme({
    id: "theme-health",
    name: "Health",
    description: "Energy, habits, and staying ahead of the annual checklist.",
    color: "#4A7C59",
    icon: "heart",
    order: 1,
  });
  const money = theme({
    id: "theme-money",
    name: "Money / Investments",
    description: "Spending reviews, savings discipline, and long-game funding.",
    color: "#2C4A6E",
    icon: "coins",
    order: 2,
  });
  const work = theme({
    id: "theme-work",
    name: "Work / Career",
    description: "Meaningful outcomes this week and the next chapter over the year.",
    color: "#3D5A80",
    icon: "briefcase",
    order: 3,
  });
  const home = theme({
    id: "theme-home",
    name: "Home",
    description: "A house that runs on systems, not last-minute scrambles.",
    color: "#8B5E3C",
    icon: "home",
    order: 4,
  });

  const objectives: Objective[] = [
    objective({
      id: "obj-family-week",
      themeId: family.id,
      title: "Lock this week's meals and chores",
      notes: "A simple schedule beats a heroic Sunday catch-up.",
      horizon: "week",
      status: "in_progress",
      priority: true,
    }),
    objective({
      id: "obj-family-month",
      themeId: family.id,
      title: "Plan a family outing",
      notes: "Put one trip, hike, or shared event on the month.",
      horizon: "month",
      status: "not_started",
    }),
    objective({
      id: "obj-family-year",
      themeId: family.id,
      title: "Put a family trip on the calendar",
      notes: "Dates first. Details can follow.",
      horizon: "year",
      status: "not_started",
    }),
    objective({
      id: "obj-health-week",
      themeId: health.id,
      title: "Move four days this week",
      notes: "Walk, gym, or run — count the days, not the drama.",
      horizon: "week",
      status: "in_progress",
      metric: { kind: "count", target: 4, current: 1, unit: "days" },
    }),
    objective({
      id: "obj-health-month",
      themeId: health.id,
      title: "Book remaining annual exams",
      notes: "Derm, dentist, physical, eyes — check them off as they land.",
      horizon: "month",
      status: "in_progress",
      metric: { kind: "count", target: 4, current: 1, unit: "booked" },
    }),
    objective({
      id: "obj-health-year",
      themeId: health.id,
      title: "Finish a 5k or outdoor event",
      notes: "Pick a date. Train toward it in the weekly movement goal.",
      horizon: "year",
      status: "not_started",
      metric: { kind: "boolean", target: 1, current: 0 },
    }),
    objective({
      id: "obj-money-week",
      themeId: money.id,
      title: "Glance at this week's spend",
      notes: "Ten minutes. No spreadsheet novel required.",
      horizon: "week",
      status: "not_started",
    }),
    objective({
      id: "obj-money-month",
      themeId: money.id,
      title: "Family spending review",
      notes: "What leaked? What can wait? Hold each other accountable.",
      horizon: "month",
      status: "not_started",
    }),
    objective({
      id: "obj-money-year",
      themeId: money.id,
      title: "Fully fund kids' college savings",
      notes: "Track the milestone here; keep account numbers in your own books.",
      horizon: "year",
      status: "in_progress",
      metric: { kind: "boolean", target: 1, current: 0 },
    }),
    objective({
      id: "obj-work-week",
      themeId: work.id,
      title: "Ship one meaningful outcome",
      notes: "One thing that would still matter on Friday.",
      horizon: "week",
      status: "not_started",
      priority: true,
    }),
    objective({
      id: "obj-work-month",
      themeId: work.id,
      title: "Block a career or skill check-in",
      notes: "A conversation, a course module, or a portfolio hour.",
      horizon: "month",
      status: "not_started",
    }),
    objective({
      id: "obj-work-year",
      themeId: work.id,
      title: "Write the next career chapter in one page",
      notes: "Direction first, then the year's bets.",
      horizon: "year",
      status: "not_started",
    }),
    objective({
      id: "obj-home-week",
      themeId: home.id,
      title: "One home maintenance task",
      notes: "Pick the squeaky thing. Finish it.",
      horizon: "week",
      status: "not_started",
    }),
    objective({
      id: "obj-home-month",
      themeId: home.id,
      title: "Seasonal home reset",
      notes: "A closet, a system, or a neglected corner — not the whole house.",
      horizon: "month",
      status: "not_started",
    }),
    objective({
      id: "obj-home-year",
      themeId: home.id,
      title: "Keep the house on systems, not scrambles",
      notes: "Chore rhythm, maintenance list, and a place for the extras.",
      horizon: "year",
      status: "in_progress",
    }),
  ];

  return {
    version: 1,
    themes: [family, health, money, work, home],
    objectives,
    activities: [
      {
        id: newId(),
        objectiveId: "obj-health-week",
        note: "Morning walk. Counted as day 1.",
        delta: 1,
        createdAt: nowIso(),
      },
    ],
    ui: { lastHorizon: "week" },
  };
}
