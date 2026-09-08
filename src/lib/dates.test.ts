import { describe, expect, it } from "vitest";
import { formatDue, formatHorizonLabel, startOfWeek, todayISO } from "./dates";

describe("dates", () => {
  it("formats todayISO in local time", () => {
    expect(todayISO(new Date(2026, 8, 8))).toBe("2026-09-08");
  });

  it("starts the week on Monday", () => {
    const tuesday = new Date(2026, 8, 8);
    const start = startOfWeek(tuesday);
    expect(start.getDay()).toBe(1);
    expect(start.getDate()).toBe(7);
  });

  it("labels due dates relative to today", () => {
    const now = new Date(2026, 8, 8);
    expect(formatDue("2026-09-08", now)).toBe("due today");
    expect(formatDue("2026-09-07", now)).toBe("due yesterday");
    expect(formatDue("2026-09-01", now)).toBe("7d overdue");
  });

  it("labels the year horizon", () => {
    expect(formatHorizonLabel("year", new Date(2026, 8, 8))).toBe("2026");
  });
});
