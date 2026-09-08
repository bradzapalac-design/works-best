export type Horizon = "week" | "month" | "year";

export type ObjectiveStatus = "not_started" | "in_progress" | "done" | "parked";

export type MetricKind = "boolean" | "count" | "number";

export type MetricDirection = "up" | "down";

export type ThemeIcon =
  | "people"
  | "heart"
  | "coins"
  | "briefcase"
  | "home"
  | "compass"
  | "leaf"
  | "star"
  | "book"
  | "spark";

export interface Theme {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: ThemeIcon;
  archived: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface TargetMetric {
  kind: MetricKind;
  target: number;
  current: number;
  /** Baseline when the metric was created — used for progress on number goals. */
  start?: number;
  unit?: string;
  direction?: MetricDirection;
}

export interface Objective {
  id: string;
  themeId: string;
  title: string;
  notes: string;
  horizon: Horizon;
  status: ObjectiveStatus;
  metric?: TargetMetric;
  dueDate?: string;
  priority: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Activity {
  id: string;
  objectiveId: string;
  note: string;
  delta?: number;
  createdAt: string;
}

export interface AppUi {
  lastHorizon: Horizon;
}

export interface AppData {
  version: 1;
  themes: Theme[];
  objectives: Objective[];
  activities: Activity[];
  ui: AppUi;
}

export const HORIZONS: Horizon[] = ["week", "month", "year"];

export const STATUSES: ObjectiveStatus[] = [
  "not_started",
  "in_progress",
  "done",
  "parked",
];

export const THEME_ICONS: ThemeIcon[] = [
  "people",
  "heart",
  "coins",
  "briefcase",
  "home",
  "compass",
  "leaf",
  "star",
  "book",
  "spark",
];

export const THEME_COLORS = [
  "#C45C26",
  "#4A7C59",
  "#2C4A6E",
  "#3D5A80",
  "#8B5E3C",
  "#7A4E6D",
  "#3F6B62",
  "#A15C12",
  "#5C4A3A",
  "#4E5D4A",
] as const;

export const STORAGE_KEY = "works-best:v1";
