import type { CSSProperties } from "react";
import type { Horizon, Objective, Theme } from "../types";
import { formatPercent, themeScore } from "../lib/scoring";
import { Icon } from "./Icons";
import { ProgressBar } from "./ProgressBar";

interface ScorecardStripProps {
  themes: Theme[];
  objectives: Objective[];
  horizon: Horizon;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

export function ScorecardStrip({
  themes,
  objectives,
  horizon,
  selectedId,
  onSelect,
}: ScorecardStripProps) {
  return (
    <div className="scorecards" aria-label="Theme scorecards">
      {themes.map((theme) => {
        const score = themeScore(theme.id, objectives, horizon);
        const on = selectedId === theme.id;
        return (
          <button
            key={theme.id}
            type="button"
            className={`scorecard ${on ? "is-on" : ""}`}
            style={{ "--theme": theme.color } as CSSProperties}
            onClick={() => onSelect(on ? null : theme.id)}
            aria-pressed={on}
          >
            <span className="scorecard-icon">
              <Icon name={theme.icon} size={16} />
            </span>
            <span className="scorecard-name">{theme.name}</span>
            <ProgressBar value={score.avg} color={theme.color} label={`${theme.name} progress`} />
            <span className="scorecard-meta">
              {score.total === 0
                ? "No items"
                : `${score.done} of ${score.total} · ${formatPercent(score.avg)}`}
            </span>
          </button>
        );
      })}
    </div>
  );
}
