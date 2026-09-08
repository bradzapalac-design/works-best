import type { Horizon, Objective, TargetMetric, Theme } from "../types";

export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

export function metricProgress(metric?: TargetMetric): number | null {
  if (!metric) return null;
  if (metric.kind === "boolean") return metric.current >= 1 ? 1 : 0;
  if (metric.kind === "count") {
    if (metric.target <= 0) return 0;
    return clamp(metric.current / metric.target, 0, 1);
  }
  const start = metric.start ?? 0;
  const { target, current } = metric;
  if (metric.direction === "down") {
    const span = start - target;
    if (span === 0) return current <= target ? 1 : 0;
    return clamp((start - current) / span, 0, 1);
  }
  const span = target - start;
  if (span === 0) return current >= target ? 1 : 0;
  return clamp((current - start) / span, 0, 1);
}

/** Status-aware progress used in scorecards. Parked objectives are omitted by callers. */
export function objectiveProgress(objective: Objective): number {
  if (objective.status === "done") return 1;
  if (objective.status === "parked") return 0;
  const fromMetric = metricProgress(objective.metric);
  if (fromMetric !== null) return fromMetric;
  if (objective.status === "in_progress") return 0.5;
  return 0;
}

export interface ThemeScore {
  themeId: string;
  total: number;
  done: number;
  inPlay: number;
  avg: number;
}

export function themeScore(
  themeId: string,
  objectives: Objective[],
  horizon: Horizon,
): ThemeScore {
  const items = objectives.filter(
    (o) =>
      o.themeId === themeId && o.horizon === horizon && o.status !== "parked",
  );
  const done = items.filter((o) => o.status === "done").length;
  const inPlay = items.filter(
    (o) => o.status === "not_started" || o.status === "in_progress",
  ).length;
  const avg =
    items.length === 0
      ? 0
      : items.reduce((sum, o) => sum + objectiveProgress(o), 0) / items.length;
  return { themeId, total: items.length, done, inPlay, avg };
}

export function activeThemes(themes: Theme[]): Theme[] {
  return [...themes]
    .filter((t) => !t.archived)
    .sort((a, b) => a.order - b.order);
}

export function weeklyInPlayCount(objectives: Objective[], themes: Theme[]): number {
  const activeIds = new Set(activeThemes(themes).map((t) => t.id));
  return objectives.filter(
    (o) =>
      activeIds.has(o.themeId) &&
      o.horizon === "week" &&
      (o.status === "not_started" || o.status === "in_progress"),
  ).length;
}

export function formatPercent(n: number): string {
  return `${Math.round(n * 100)}%`;
}

export function formatMetric(metric: TargetMetric): string {
  if (metric.kind === "boolean") {
    return metric.current >= 1 ? "Done" : "Open";
  }
  const unit = metric.unit ? ` ${metric.unit}` : "";
  const current = formatNumber(metric.current);
  const target = formatNumber(metric.target);
  return `${current} / ${target}${unit}`;
}

export function formatNumber(n: number): string {
  if (Number.isInteger(n)) return String(n);
  return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
}
