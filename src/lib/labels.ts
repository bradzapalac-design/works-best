import type { Horizon, ObjectiveStatus } from "../types";

export const HORIZON_LABEL: Record<Horizon, string> = {
  week: "Week",
  month: "Month",
  year: "Year",
};

export const STATUS_LABEL: Record<ObjectiveStatus, string> = {
  not_started: "Not started",
  in_progress: "In progress",
  done: "Done",
  parked: "Parked",
};
