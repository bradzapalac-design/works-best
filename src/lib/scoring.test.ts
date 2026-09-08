import { describe, expect, it } from "vitest";
import {
  formatMetric,
  metricProgress,
  objectiveProgress,
  themeScore,
  weeklyInPlayCount,
} from "./scoring";
import type { Objective, Theme } from "../types";

const baseObj = (patch: Partial<Objective>): Objective => ({
  id: "o1",
  themeId: "t1",
  title: "Test",
  notes: "",
  horizon: "week",
  status: "not_started",
  priority: false,
  createdAt: "",
  updatedAt: "",
  ...patch,
});

describe("metricProgress", () => {
  it("returns null without a metric", () => {
    expect(metricProgress(undefined)).toBeNull();
  });

  it("treats boolean as 0 or 1", () => {
    expect(metricProgress({ kind: "boolean", target: 1, current: 0 })).toBe(0);
    expect(metricProgress({ kind: "boolean", target: 1, current: 1 })).toBe(1);
  });

  it("scales count toward target and clamps", () => {
    expect(metricProgress({ kind: "count", target: 4, current: 2 })).toBe(0.5);
    expect(metricProgress({ kind: "count", target: 4, current: 8 })).toBe(1);
    expect(metricProgress({ kind: "count", target: 0, current: 1 })).toBe(0);
  });

  it("handles upward and downward number goals", () => {
    expect(
      metricProgress({
        kind: "number",
        start: 0,
        current: 50,
        target: 100,
        direction: "up",
      }),
    ).toBe(0.5);
    expect(
      metricProgress({
        kind: "number",
        start: 220,
        current: 210,
        target: 200,
        direction: "down",
      }),
    ).toBe(0.5);
  });
});

describe("objectiveProgress", () => {
  it("marks done as complete regardless of metric", () => {
    expect(
      objectiveProgress(
        baseObj({
          status: "done",
          metric: { kind: "count", target: 4, current: 1 },
        }),
      ),
    ).toBe(1);
  });

  it("uses half-credit for in-progress items without a metric", () => {
    expect(objectiveProgress(baseObj({ status: "in_progress" }))).toBe(0.5);
    expect(objectiveProgress(baseObj({ status: "not_started" }))).toBe(0);
  });
});

describe("themeScore", () => {
  it("ignores other horizons and parked items", () => {
    const objs = [
      baseObj({ id: "a", horizon: "week", status: "done" }),
      baseObj({ id: "b", horizon: "week", status: "not_started" }),
      baseObj({ id: "c", horizon: "week", status: "parked" }),
      baseObj({ id: "d", horizon: "month", status: "done" }),
    ];
    const score = themeScore("t1", objs, "week");
    expect(score.total).toBe(2);
    expect(score.done).toBe(1);
    expect(score.inPlay).toBe(1);
    expect(score.avg).toBe(0.5);
  });
});

describe("weeklyInPlayCount", () => {
  it("counts active weekly work and skips archived themes", () => {
    const themes: Theme[] = [
      {
        id: "t1",
        name: "A",
        description: "",
        color: "#000",
        icon: "star",
        archived: false,
        order: 0,
        createdAt: "",
        updatedAt: "",
      },
      {
        id: "t2",
        name: "B",
        description: "",
        color: "#000",
        icon: "star",
        archived: true,
        order: 1,
        createdAt: "",
        updatedAt: "",
      },
    ];
    const objs = [
      baseObj({ id: "1", themeId: "t1", horizon: "week", status: "in_progress" }),
      baseObj({ id: "2", themeId: "t1", horizon: "week", status: "not_started" }),
      baseObj({ id: "3", themeId: "t1", horizon: "week", status: "done" }),
      baseObj({ id: "4", themeId: "t2", horizon: "week", status: "in_progress" }),
    ];
    expect(weeklyInPlayCount(objs, themes)).toBe(2);
  });
});

describe("formatMetric", () => {
  it("renders boolean and counted metrics", () => {
    expect(formatMetric({ kind: "boolean", target: 1, current: 0 })).toBe("Open");
    expect(formatMetric({ kind: "count", target: 4, current: 1, unit: "days" })).toBe(
      "1 / 4 days",
    );
  });
});
