import { describe, expect, it } from "vitest";
import { parseBackup, parseBackupJson } from "./validate";
import { createSeedData } from "../seed";

describe("parseBackup", () => {
  it("accepts the seed payload", () => {
    const result = parseBackup(createSeedData());
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.themes).toHaveLength(6);
      expect(result.data.themes.map((theme) => theme.name)).toContain("SonicWall - VP");
      expect(result.data.themes.map((theme) => theme.name)).toContain("Work / Career");
      expect(result.data.objectives.length).toBeGreaterThan(0);
    }
  });

  it("rejects the wrong version", () => {
    const result = parseBackup({ version: 2, themes: [], objectives: [], activities: [] });
    expect(result.ok).toBe(false);
  });

  it("rejects JSON that is not an object", () => {
    expect(parseBackupJson("[]").ok).toBe(false);
    expect(parseBackupJson("nope").ok).toBe(false);
  });

  it("rejects an objective that points at a missing theme", () => {
    const seed = createSeedData();
    seed.objectives[0].themeId = "missing";
    const result = parseBackup(seed);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toMatch(/unknown theme/);
  });
});
