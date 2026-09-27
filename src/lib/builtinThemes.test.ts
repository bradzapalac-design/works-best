import { describe, expect, it } from "vitest";
import { createSeedData } from "../seed";
import type { AppData, Theme } from "../types";
import {
  SONICWALL_VP_THEME_ID,
  SONICWALL_VP_THEME_NAME,
  ensureBuiltinThemes,
} from "./builtinThemes";

function withoutSonicWall(data: AppData): AppData {
  return {
    ...data,
    themes: data.themes.filter(
      (theme) =>
        theme.id !== SONICWALL_VP_THEME_ID && theme.name !== SONICWALL_VP_THEME_NAME,
    ),
  };
}

describe("ensureBuiltinThemes", () => {
  it("adds SonicWall - VP to a saved workspace that does not have it", () => {
    const saved = withoutSonicWall(createSeedData());
    const work = saved.themes.find((theme) => theme.id === "theme-work");
    const beforeObjectives = saved.objectives.map((objective) => ({
      id: objective.id,
      themeId: objective.themeId,
    }));

    const next = ensureBuiltinThemes(saved);

    expect(next).not.toBe(saved);
    expect(next.themes).toHaveLength(saved.themes.length + 1);
    expect(next.themes.at(-1)).toMatchObject({
      id: SONICWALL_VP_THEME_ID,
      name: SONICWALL_VP_THEME_NAME,
      icon: "star",
      color: "#7A4E6D",
      archived: false,
      order: 5,
    });
    expect(next.themes.slice(0, -1)).toEqual(saved.themes);
    expect(next.objectives).toEqual(saved.objectives);
    expect(next.activities).toEqual(saved.activities);
    expect(next.ui).toEqual(saved.ui);
    expect(next.objectives.map((objective) => ({
      id: objective.id,
      themeId: objective.themeId,
    }))).toEqual(beforeObjectives);
    expect(work?.name).toBe("Work / Career");
    expect(
      next.objectives.filter((objective) => objective.themeId === "theme-work"),
    ).toEqual(saved.objectives.filter((objective) => objective.themeId === "theme-work"));
    expect(
      next.objectives.some((objective) => objective.themeId === SONICWALL_VP_THEME_ID),
    ).toBe(false);
  });

  it("does not add a second copy when the theme is already saved", () => {
    const seed = createSeedData();
    expect(ensureBuiltinThemes(seed)).toBe(seed);
  });

  it("does not duplicate a theme the user already named SonicWall - VP", () => {
    const saved = withoutSonicWall(createSeedData());
    const custom: Theme = {
      id: "theme-custom-sw",
      name: SONICWALL_VP_THEME_NAME,
      description: "Already here.",
      color: "#3F6B62",
      icon: "compass",
      archived: false,
      order: 2,
      createdAt: "2026-02-01T00:00:00.000Z",
      updatedAt: "2026-02-01T00:00:00.000Z",
    };
    const withCustom: AppData = { ...saved, themes: [...saved.themes, custom] };
    expect(ensureBuiltinThemes(withCustom)).toBe(withCustom);
  });

  it("leaves an archived SonicWall theme archived", () => {
    const seed = createSeedData();
    const archived: AppData = {
      ...seed,
      themes: seed.themes.map((theme) =>
        theme.id === SONICWALL_VP_THEME_ID ? { ...theme, archived: true } : theme,
      ),
    };
    const next = ensureBuiltinThemes(archived);
    expect(next).toBe(archived);
    expect(next.themes.find((theme) => theme.id === SONICWALL_VP_THEME_ID)?.archived).toBe(
      true,
    );
  });
});
