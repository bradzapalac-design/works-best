import type { Horizon } from "../types";
import { HORIZON_LABEL } from "../lib/labels";
import { formatHorizonLabel } from "../lib/dates";

interface HorizonControlProps {
  value: Horizon;
  onChange: (horizon: Horizon) => void;
}

export function HorizonControl({ value, onChange }: HorizonControlProps) {
  return (
    <div className="horizon-row">
      <p className="horizon-kicker">{formatHorizonLabel(value)}</p>
      <div className="segmented" role="tablist" aria-label="Horizon">
        {(["week", "month", "year"] as const).map((horizon) => (
          <button
            key={horizon}
            type="button"
            role="tab"
            aria-selected={value === horizon}
            className={value === horizon ? "is-on" : ""}
            onClick={() => onChange(horizon)}
          >
            {HORIZON_LABEL[horizon]}
          </button>
        ))}
      </div>
    </div>
  );
}
