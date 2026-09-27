import { nowIso } from "./ids";
import type { AppData, Theme } from "../types";

/** Stable id so a saved workspace is migrated once and never duplicated. */
export const SONICWALL_VP_THEME_ID = "theme-sonicwall-vp";

export const SONICWALL_VP_THEME_NAME = "SonicWall - VP";

export function createSonicWallVpTheme(order: number, stamp = nowIso()): Theme {
  return {
    id: SONICWALL_VP_THEME_ID,
    name: SONICWALL_VP_THEME_NAME,
    description: "The VP Finance seat at SonicWall.",
    color: "#7A4E6D",
    icon: "star",
    archived: false,
    order,
    createdAt: stamp,
    updatedAt: stamp,
  };
}

/**
 * Add the SonicWall VP theme when a saved workspace does not already have it.
 * Existing themes, objectives, and activity are left untouched.
 * A theme that was archived or renamed (same id) is not re-added.
 */
export function ensureBuiltinThemes(data: AppData): AppData {
  const present = data.themes.some(
    (theme) =>
      theme.id === SONICWALL_VP_THEME_ID || theme.name === SONICWALL_VP_THEME_NAME,
  );
  if (present) return data;
  const order = data.themes.reduce((max, theme) => Math.max(max, theme.order), -1) + 1;
  return {
    ...data,
    themes: [...data.themes, createSonicWallVpTheme(order)],
  };
}
