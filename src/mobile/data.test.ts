import { describe, expect, it } from "vitest";
import {
  daysBetween,
  formatDayCount,
  greetingForHour,
  visaProgress,
} from "./data";

describe("journey math", () => {
  it("counts 107 days from 23 May 2026 to 7 Sep 2026", () => {
    expect(daysBetween("2026-05-23", new Date("2026-09-07T12:00:00"))).toBe(107);
  });

  it("places a 5-year PR route at 6% after 107 days", () => {
    const progress = visaProgress(107);
    expect(progress.percent).toBe(6);
    expect(progress.daysToPr).toBe(1718);
  });

  it("formats thousand separators the Irish way", () => {
    expect(formatDayCount(1718)).toBe("1,718");
  });
});

describe("greeting", () => {
  it("uses afternoon in the middle of the day", () => {
    expect(greetingForHour(14)).toBe("Good afternoon");
  });
});
