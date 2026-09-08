import {
  HORIZONS,
  STATUSES,
  THEME_ICONS,
  type Activity,
  type AppData,
  type Horizon,
  type MetricKind,
  type Objective,
  type ObjectiveStatus,
  type TargetMetric,
  type Theme,
  type ThemeIcon,
} from "../types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isBool(value: unknown): value is boolean {
  return typeof value === "boolean";
}

function isNum(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function asHorizon(value: unknown): Horizon | null {
  return isString(value) && (HORIZONS as string[]).includes(value)
    ? (value as Horizon)
    : null;
}

function asStatus(value: unknown): ObjectiveStatus | null {
  return isString(value) && (STATUSES as string[]).includes(value)
    ? (value as ObjectiveStatus)
    : null;
}

function asIcon(value: unknown): ThemeIcon | null {
  return isString(value) && (THEME_ICONS as string[]).includes(value)
    ? (value as ThemeIcon)
    : null;
}

function parseMetric(value: unknown): TargetMetric | undefined {
  if (value === undefined || value === null) return undefined;
  if (!isRecord(value)) throw new Error("Metric must be an object.");
  const kind = value.kind;
  if (kind !== "boolean" && kind !== "count" && kind !== "number") {
    throw new Error("Metric kind must be boolean, count, or number.");
  }
  if (!isNum(value.target) || !isNum(value.current)) {
    throw new Error("Metric needs numeric current and target.");
  }
  const metric: TargetMetric = {
    kind: kind as MetricKind,
    target: value.target,
    current: value.current,
  };
  if (value.start !== undefined) {
    if (!isNum(value.start)) throw new Error("Metric start must be a number.");
    metric.start = value.start;
  }
  if (value.unit !== undefined) {
    if (!isString(value.unit)) throw new Error("Metric unit must be a string.");
    metric.unit = value.unit;
  }
  if (value.direction !== undefined) {
    if (value.direction !== "up" && value.direction !== "down") {
      throw new Error("Metric direction must be up or down.");
    }
    metric.direction = value.direction;
  }
  return metric;
}

function parseTheme(value: unknown, index: number): Theme {
  if (!isRecord(value)) throw new Error(`Theme ${index + 1} is not an object.`);
  const icon = asIcon(value.icon);
  if (!isString(value.id) || !value.id) throw new Error(`Theme ${index + 1} needs an id.`);
  if (!isString(value.name) || !value.name.trim()) {
    throw new Error(`Theme ${index + 1} needs a name.`);
  }
  if (!isString(value.description)) throw new Error(`Theme ${value.name} needs a description string.`);
  if (!isString(value.color) || !value.color) throw new Error(`Theme ${value.name} needs a color.`);
  if (!icon) throw new Error(`Theme ${value.name} has an unknown icon.`);
  if (!isBool(value.archived)) throw new Error(`Theme ${value.name} needs archived boolean.`);
  if (!isNum(value.order)) throw new Error(`Theme ${value.name} needs a numeric order.`);
  if (!isString(value.createdAt) || !isString(value.updatedAt)) {
    throw new Error(`Theme ${value.name} needs timestamps.`);
  }
  return {
    id: value.id,
    name: value.name,
    description: value.description,
    color: value.color,
    icon,
    archived: value.archived,
    order: value.order,
    createdAt: value.createdAt,
    updatedAt: value.updatedAt,
  };
}

function parseObjective(value: unknown, index: number, themeIds: Set<string>): Objective {
  if (!isRecord(value)) throw new Error(`Objective ${index + 1} is not an object.`);
  const horizon = asHorizon(value.horizon);
  const status = asStatus(value.status);
  if (!isString(value.id) || !value.id) throw new Error(`Objective ${index + 1} needs an id.`);
  if (!isString(value.themeId) || !themeIds.has(value.themeId)) {
    throw new Error(`Objective ${index + 1} points at an unknown theme.`);
  }
  if (!isString(value.title) || !value.title.trim()) {
    throw new Error(`Objective ${index + 1} needs a title.`);
  }
  if (!isString(value.notes)) throw new Error(`Objective "${value.title}" needs a notes string.`);
  if (!horizon) throw new Error(`Objective "${value.title}" has an invalid horizon.`);
  if (!status) throw new Error(`Objective "${value.title}" has an invalid status.`);
  if (!isBool(value.priority)) throw new Error(`Objective "${value.title}" needs priority boolean.`);
  if (!isString(value.createdAt) || !isString(value.updatedAt)) {
    throw new Error(`Objective "${value.title}" needs timestamps.`);
  }
  const dueDate =
    value.dueDate === undefined || value.dueDate === null
      ? undefined
      : isString(value.dueDate)
        ? value.dueDate
        : undefined;
  if (value.dueDate != null && !dueDate) {
    throw new Error(`Objective "${value.title}" has an invalid due date.`);
  }
  return {
    id: value.id,
    themeId: value.themeId,
    title: value.title,
    notes: value.notes,
    horizon,
    status,
    metric: parseMetric(value.metric),
    dueDate,
    priority: value.priority,
    createdAt: value.createdAt,
    updatedAt: value.updatedAt,
  };
}

function parseActivity(value: unknown, index: number, objectiveIds: Set<string>): Activity {
  if (!isRecord(value)) throw new Error(`Activity ${index + 1} is not an object.`);
  if (!isString(value.id) || !value.id) throw new Error(`Activity ${index + 1} needs an id.`);
  if (!isString(value.objectiveId) || !objectiveIds.has(value.objectiveId)) {
    throw new Error(`Activity ${index + 1} points at an unknown objective.`);
  }
  if (!isString(value.note)) throw new Error(`Activity ${index + 1} needs a note string.`);
  if (!isString(value.createdAt)) throw new Error(`Activity ${index + 1} needs a timestamp.`);
  const delta =
    value.delta === undefined || value.delta === null
      ? undefined
      : isNum(value.delta)
        ? value.delta
        : undefined;
  if (value.delta != null && delta === undefined) {
    throw new Error(`Activity ${index + 1} has a non-numeric delta.`);
  }
  return {
    id: value.id,
    objectiveId: value.objectiveId,
    note: value.note,
    delta,
    createdAt: value.createdAt,
  };
}

export type ParseResult =
  | { ok: true; data: AppData }
  | { ok: false; error: string };

export function parseBackup(raw: unknown): ParseResult {
  try {
    if (!isRecord(raw)) return { ok: false, error: "Backup must be a JSON object." };
    if (raw.version !== 1) {
      return { ok: false, error: "Unsupported backup version. Expected version 1." };
    }
    if (!Array.isArray(raw.themes) || !Array.isArray(raw.objectives) || !Array.isArray(raw.activities)) {
      return { ok: false, error: "Backup needs themes, objectives, and activities arrays." };
    }
    const themes = raw.themes.map(parseTheme);
    const themeIds = new Set(themes.map((t) => t.id));
    const objectives = raw.objectives.map((o, i) => parseObjective(o, i, themeIds));
    const objectiveIds = new Set(objectives.map((o) => o.id));
    const activities = raw.activities.map((a, i) => parseActivity(a, i, objectiveIds));
    const lastHorizon = isRecord(raw.ui) ? asHorizon(raw.ui.lastHorizon) : null;
    return {
      ok: true,
      data: {
        version: 1,
        themes,
        objectives,
        activities,
        ui: { lastHorizon: lastHorizon ?? "week" },
      },
    };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Could not read backup.",
    };
  }
}

export function parseBackupJson(text: string): ParseResult {
  try {
    return parseBackup(JSON.parse(text) as unknown);
  } catch {
    return { ok: false, error: "File is not valid JSON." };
  }
}
