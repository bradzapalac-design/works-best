import { useState, type FormEvent } from "react";
import { STATUSES, type Objective, type ObjectiveStatus } from "../types";
import { STATUS_LABEL } from "../lib/labels";
import { formatMetric } from "../lib/scoring";
import { Modal } from "./Modal";

interface CheckInDialogProps {
  objective: Objective;
  onClose: () => void;
  onSave: (input: {
    note: string;
    delta?: number;
    nextCurrent?: number;
    nextStatus?: ObjectiveStatus;
  }) => void;
}

export function CheckInDialog({ objective, onClose, onSave }: CheckInDialogProps) {
  const metric = objective.metric;
  const [note, setNote] = useState("");
  const [delta, setDelta] = useState("1");
  const [nextCurrent, setNextCurrent] = useState(String(metric?.current ?? 0));
  const [status, setStatus] = useState<ObjectiveStatus>(objective.status);

  function submit(e: FormEvent) {
    e.preventDefault();
    const payload: {
      note: string;
      delta?: number;
      nextCurrent?: number;
      nextStatus?: ObjectiveStatus;
    } = {
      note: note.trim() || defaultNote(),
    };
    if (metric?.kind === "count") {
      const d = Number(delta);
      if (Number.isFinite(d) && d !== 0) payload.delta = d;
    }
    if (metric?.kind === "number") {
      const n = Number(nextCurrent);
      if (Number.isFinite(n)) payload.nextCurrent = n;
    }
    if (metric?.kind === "boolean" && status === "done") {
      payload.nextCurrent = 1;
    }
    if (status !== objective.status) payload.nextStatus = status;
    onSave(payload);
  }

  function defaultNote(): string {
    if (metric?.kind === "count") return `Logged ${delta}`;
    if (metric?.kind === "number") return `Updated to ${nextCurrent}${metric.unit ? ` ${metric.unit}` : ""}`;
    if (status === "done") return "Marked done";
    return "Check-in";
  }

  return (
    <Modal title="Check-in" onClose={onClose}>
      <form className="form" onSubmit={submit}>
        <p className="form-lead">
          <strong>{objective.title}</strong>
          {metric ? <span> · {formatMetric(metric)}</span> : null}
        </p>
        {metric?.kind === "count" ? (
          <label>
            Delta
            <input
              type="number"
              step="any"
              value={delta}
              onChange={(e) => setDelta(e.target.value)}
            />
          </label>
        ) : null}
        {metric?.kind === "number" ? (
          <label>
            Current value{metric.unit ? ` (${metric.unit})` : ""}
            <input
              type="number"
              step="any"
              value={nextCurrent}
              onChange={(e) => setNextCurrent(e.target.value)}
            />
          </label>
        ) : null}
        <label>
          Status
          <select value={status} onChange={(e) => setStatus(e.target.value as ObjectiveStatus)}>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABEL[s]}
              </option>
            ))}
          </select>
        </label>
        <label>
          Note
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            placeholder="What moved, even a little"
          />
        </label>
        <div className="form-actions">
          <span />
          <div className="form-actions-right">
            <button type="button" className="btn ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn primary">
              Save check-in
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
