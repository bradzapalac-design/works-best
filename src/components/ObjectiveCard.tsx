import type { CSSProperties } from "react";
import type { Objective, Theme } from "../types";
import { formatDue, isOverdue } from "../lib/dates";
import { HORIZON_LABEL, STATUS_LABEL } from "../lib/labels";
import { formatMetric, metricProgress, objectiveProgress } from "../lib/scoring";
import { Icon } from "./Icons";
import { ProgressBar } from "./ProgressBar";

interface ObjectiveCardProps {
  objective: Objective;
  theme: Theme;
  onCheckIn: () => void;
  onQuick: () => void;
  onEdit: () => void;
}

export function ObjectiveCard({
  objective,
  theme,
  onCheckIn,
  onQuick,
  onEdit,
}: ObjectiveCardProps) {
  const progress = objectiveProgress(objective);
  const metricPct = metricProgress(objective.metric);
  const overdue =
    objective.dueDate &&
    objective.status !== "done" &&
    objective.status !== "parked" &&
    isOverdue(objective.dueDate);

  const quickLabel =
    objective.metric?.kind === "count"
      ? "+1"
      : objective.status === "done"
        ? "Reopen"
        : "Done";

  return (
    <article
      className={`obj-card ${objective.status === "done" ? "is-done" : ""} ${
        objective.status === "parked" ? "is-parked" : ""
      }`}
      style={{ "--theme": theme.color } as CSSProperties}
    >
      <button
        type="button"
        className={`mark ${objective.status === "done" ? "is-checked" : ""}`}
        onClick={onQuick}
        aria-label={
          objective.metric?.kind === "count"
            ? `Add one toward ${objective.title}`
            : objective.status === "done"
              ? `Reopen ${objective.title}`
              : `Mark ${objective.title} done`
        }
      >
        {objective.status === "done" ? <Icon name="check" size={14} /> : null}
      </button>
      <div className="obj-body">
        <div className="obj-top">
          <h3>
            {objective.priority ? (
              <span className="hot" title="Priority">
                <Icon name="flag" size={13} />
              </span>
            ) : null}
            {objective.title}
          </h3>
          <div className="obj-actions">
            {objective.metric?.kind === "count" ? (
              <button type="button" className="text-btn" onClick={onQuick}>
                {quickLabel}
              </button>
            ) : null}
            <button type="button" className="text-btn" onClick={onCheckIn}>
              Check-in
            </button>
            <button type="button" className="text-btn" onClick={onEdit}>
              Edit
            </button>
          </div>
        </div>
        {objective.notes ? <p className="obj-notes">{objective.notes}</p> : null}
        <div className="obj-meta">
          <span className="pill">{HORIZON_LABEL[objective.horizon]}</span>
          <span className={`pill status-${objective.status}`}>
            {STATUS_LABEL[objective.status]}
          </span>
          {objective.dueDate ? (
            <span className={`due ${overdue ? "is-late" : ""}`}>
              {formatDue(objective.dueDate)}
            </span>
          ) : null}
          {objective.metric ? (
            <span className="metric-label">{formatMetric(objective.metric)}</span>
          ) : null}
        </div>
        {metricPct !== null ? (
          <ProgressBar value={progress} color={theme.color} />
        ) : null}
      </div>
    </article>
  );
}
