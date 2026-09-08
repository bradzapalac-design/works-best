import { useState, type FormEvent } from "react";
import {
  HORIZONS,
  STATUSES,
  type Horizon,
  type Objective,
  type ObjectiveStatus,
  type TargetMetric,
  type Theme,
} from "../types";
import { HORIZON_LABEL, STATUS_LABEL } from "../lib/labels";
import { Modal } from "./Modal";

interface ObjectiveFormProps {
  themes: Theme[];
  initial?: Objective;
  defaultThemeId?: string;
  defaultHorizon?: Horizon;
  onClose: () => void;
  onSave: (input: {
    themeId: string;
    title: string;
    notes: string;
    horizon: Horizon;
    status: ObjectiveStatus;
    metric?: TargetMetric;
    dueDate?: string;
    priority: boolean;
  }) => void;
  onDelete?: () => void;
}

type MetricMode = "none" | "boolean" | "count" | "number";

export function ObjectiveForm({
  themes,
  initial,
  defaultThemeId,
  defaultHorizon,
  onClose,
  onSave,
  onDelete,
}: ObjectiveFormProps) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [themeId, setThemeId] = useState(
    initial?.themeId ?? defaultThemeId ?? themes[0]?.id ?? "",
  );
  const [horizon, setHorizon] = useState<Horizon>(
    initial?.horizon ?? defaultHorizon ?? "week",
  );
  const [status, setStatus] = useState<ObjectiveStatus>(initial?.status ?? "not_started");
  const [dueDate, setDueDate] = useState(initial?.dueDate ?? "");
  const [priority, setPriority] = useState(initial?.priority ?? false);
  const [mode, setMode] = useState<MetricMode>(initial?.metric?.kind ?? "none");
  const [target, setTarget] = useState(String(initial?.metric?.target ?? 1));
  const [current, setCurrent] = useState(String(initial?.metric?.current ?? 0));
  const [start, setStart] = useState(
    String(initial?.metric?.start ?? initial?.metric?.current ?? 0),
  );
  const [unit, setUnit] = useState(initial?.metric?.unit ?? "");
  const [direction, setDirection] = useState(initial?.metric?.direction ?? "up");
  const [confirmDelete, setConfirmDelete] = useState(false);

  function submit(e: FormEvent) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed || !themeId) return;
    let metric: TargetMetric | undefined;
    if (mode === "boolean") {
      metric = {
        kind: "boolean",
        target: 1,
        current: status === "done" ? 1 : Number(current) >= 1 ? 1 : 0,
      };
    } else if (mode === "count" || mode === "number") {
      const t = Number(target);
      const c = Number(current);
      if (!Number.isFinite(t) || !Number.isFinite(c)) return;
      metric = {
        kind: mode,
        target: t,
        current: c,
        unit: unit.trim() || undefined,
      };
      if (mode === "number") {
        const s = Number(start);
        metric.start = Number.isFinite(s) ? s : c;
        metric.direction = direction;
      }
    }
    onSave({
      themeId,
      title: trimmed,
      notes: notes.trim(),
      horizon,
      status,
      metric,
      dueDate: dueDate || undefined,
      priority,
    });
  }

  const activeThemes = themes.filter((t) => !t.archived || t.id === themeId);

  return (
    <Modal title={initial ? "Edit objective" : "New objective"} onClose={onClose} wide>
      <form className="form" onSubmit={submit}>
        <label>
          Title
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="A specific, seasonal outcome"
          />
        </label>
        <label>
          Notes
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Why it matters, or how you’ll know it’s done"
          />
        </label>
        <div className="form-row">
          <label>
            Theme
            <select value={themeId} onChange={(e) => setThemeId(e.target.value)}>
              {activeThemes.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Horizon
            <select value={horizon} onChange={(e) => setHorizon(e.target.value as Horizon)}>
              {HORIZONS.map((h) => (
                <option key={h} value={h}>
                  {HORIZON_LABEL[h]}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="form-row">
          <label>
            Status
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ObjectiveStatus)}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABEL[s]}
                </option>
              ))}
            </select>
          </label>
          <label>
            Due date
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </label>
        </div>
        <label className="check-label">
          <input
            type="checkbox"
            checked={priority}
            onChange={(e) => setPriority(e.target.checked)}
          />
          Priority — keep this one in view
        </label>
        <fieldset className="metric-fields">
          <legend>Target metric</legend>
          <div className="choice-row">
            {(
              [
                ["none", "None"],
                ["boolean", "Checklist"],
                ["count", "Count"],
                ["number", "Number"],
              ] as const
            ).map(([value, label]) => (
              <label key={value} className={`choice ${mode === value ? "is-on" : ""}`}>
                <input
                  type="radio"
                  name="metric-mode"
                  value={value}
                  checked={mode === value}
                  onChange={() => setMode(value)}
                />
                {label}
              </label>
            ))}
          </div>
          {mode === "count" || mode === "number" ? (
            <div className="form-row">
              <label>
                Current
                <input
                  type="number"
                  step="any"
                  value={current}
                  onChange={(e) => setCurrent(e.target.value)}
                />
              </label>
              <label>
                Target
                <input
                  type="number"
                  step="any"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                />
              </label>
              <label>
                Unit
                <input
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  placeholder="days, lbs…"
                />
              </label>
            </div>
          ) : null}
          {mode === "number" ? (
            <div className="form-row">
              <label>
                Starting point
                <input
                  type="number"
                  step="any"
                  value={start}
                  onChange={(e) => setStart(e.target.value)}
                />
              </label>
              <label>
                Direction
                <select
                  value={direction}
                  onChange={(e) => setDirection(e.target.value as "up" | "down")}
                >
                  <option value="up">Climb toward target</option>
                  <option value="down">Descend toward target</option>
                </select>
              </label>
            </div>
          ) : null}
        </fieldset>
        <div className="form-actions">
          {onDelete ? (
            confirmDelete ? (
              <button type="button" className="btn danger" onClick={onDelete}>
                Confirm delete
              </button>
            ) : (
              <button type="button" className="btn ghost" onClick={() => setConfirmDelete(true)}>
                Delete
              </button>
            )
          ) : (
            <span />
          )}
          <div className="form-actions-right">
            <button type="button" className="btn ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn primary">
              Save
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
