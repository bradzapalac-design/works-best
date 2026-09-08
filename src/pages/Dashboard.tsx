import { useMemo, useState } from "react";
import { CheckInDialog } from "../components/CheckInDialog";
import { HorizonControl } from "../components/HorizonControl";
import { Icon } from "../components/Icons";
import { ObjectiveCard } from "../components/ObjectiveCard";
import { ObjectiveForm } from "../components/ObjectiveForm";
import { ScorecardStrip } from "../components/ScorecardStrip";
import { ActivityFeed } from "../components/ActivityFeed";
import { flash } from "../lib/flash";
import { activeThemes, weeklyInPlayCount } from "../lib/scoring";
import { useStore } from "../store";
import type { Objective } from "../types";

export function Dashboard() {
  const { data, setHorizon, addObjective, updateObjective, deleteObjective, checkIn } =
    useStore();
  const horizon = data.ui.lastHorizon;
  const themes = activeThemes(data.themes);
  const [filterId, setFilterId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Objective | null>(null);
  const [creatingFor, setCreatingFor] = useState<string | "any" | null>(null);
  const [checkInFor, setCheckInFor] = useState<Objective | null>(null);

  const themeMap = useMemo(
    () => new Map(data.themes.map((t) => [t.id, t])),
    [data.themes],
  );

  const visibleThemes = filterId ? themes.filter((t) => t.id === filterId) : themes;
  const weeklyCount = weeklyInPlayCount(data.objectives, data.themes);

  const grouped = visibleThemes.map((theme) => ({
    theme,
    items: data.objectives
      .filter((o) => o.themeId === theme.id && o.horizon === horizon)
      .sort(sortObjectives),
  }));

  const inView = grouped.reduce((n, g) => n + g.items.length, 0);

  function onQuick(objective: Objective) {
    if (objective.metric?.kind === "count") {
      checkIn(objective.id, { note: "Logged +1", delta: 1 });
      flash("Progress logged");
      return;
    }
    if (objective.status === "done") {
      checkIn(objective.id, { note: "Reopened", nextStatus: "in_progress" });
      flash("Reopened");
      return;
    }
    checkIn(objective.id, { note: "Marked done", nextStatus: "done" });
    flash("Marked done");
  }

  return (
    <div className="page">
      <HorizonControl value={horizon} onChange={setHorizon} />

      {themes.length === 0 ? (
        <p className="empty-copy">
          No active themes. Restore one from Themes, or add a new north star.
        </p>
      ) : (
        <ScorecardStrip
          themes={themes}
          objectives={data.objectives}
          horizon={horizon}
          selectedId={filterId}
          onSelect={setFilterId}
        />
      )}

      {horizon === "week" ? (
        <p className={`hint ${weeklyCount > 3 ? "is-warn" : ""}`}>
          {weeklyCount === 0
            ? "No weekly outcomes in play. Add one if this week needs a point of aim."
            : weeklyCount <= 3
              ? `${weeklyCount} weekly outcome${weeklyCount === 1 ? "" : "s"} in play — a tight week usually holds three or fewer.`
              : `${weeklyCount} weekly outcomes in play. A tight week usually holds three or fewer — this is a hint, not a limit.`}
        </p>
      ) : (
        <p className="hint">
          Themes stay put. Specifics under this {horizon} can move with the season.
        </p>
      )}

      <div className="toolbar">
        <p className="toolbar-count">
          {inView} objective{inView === 1 ? "" : "s"} this {horizon}
          {filterId ? " · filtered" : ""}
        </p>
        <button
          type="button"
          className="btn primary"
          onClick={() => setCreatingFor(filterId ?? "any")}
        >
          <Icon name="plus" size={16} /> New objective
        </button>
      </div>

      {grouped.map(({ theme, items }) => (
        <section key={theme.id} className="theme-block">
          <header className="theme-head">
            <span className="theme-badge" style={{ background: theme.color }}>
              <Icon name={theme.icon} size={14} />
            </span>
            <div>
              <h2>{theme.name}</h2>
              <p>{theme.description}</p>
            </div>
            <button
              type="button"
              className="text-btn"
              onClick={() => setCreatingFor(theme.id)}
            >
              + Add
            </button>
          </header>
          {items.length === 0 ? (
            <p className="empty-copy tight">Nothing on this horizon yet.</p>
          ) : (
            <div className="obj-list">
              {items.map((objective) => (
                <ObjectiveCard
                  key={objective.id}
                  objective={objective}
                  theme={theme}
                  onCheckIn={() => setCheckInFor(objective)}
                  onQuick={() => onQuick(objective)}
                  onEdit={() => setEditing(objective)}
                />
              ))}
            </div>
          )}
        </section>
      ))}

      <section className="recent-block">
        <h2>Recent check-ins</h2>
        <ActivityFeed
          activities={data.activities}
          objectives={data.objectives}
          themes={data.themes}
          empty="No check-ins yet. Log progress from any objective."
          limit={6}
        />
      </section>

      {creatingFor ? (
        <ObjectiveForm
          themes={data.themes}
          defaultThemeId={creatingFor === "any" ? themes[0]?.id : creatingFor}
          defaultHorizon={horizon}
          onClose={() => setCreatingFor(null)}
          onSave={(input) => {
            addObjective(input);
            setCreatingFor(null);
            flash("Objective added");
          }}
        />
      ) : null}

      {editing ? (
        <ObjectiveForm
          themes={data.themes}
          initial={editing}
          onClose={() => setEditing(null)}
          onSave={(input) => {
            updateObjective(editing.id, input);
            setEditing(null);
            flash("Objective updated");
          }}
          onDelete={() => {
            deleteObjective(editing.id);
            setEditing(null);
            flash("Objective deleted");
          }}
        />
      ) : null}

      {checkInFor && themeMap.get(checkInFor.themeId) ? (
        <CheckInDialog
          objective={checkInFor}
          onClose={() => setCheckInFor(null)}
          onSave={(input) => {
            checkIn(checkInFor.id, input);
            setCheckInFor(null);
            flash("Check-in saved");
          }}
        />
      ) : null}
    </div>
  );
}

function sortObjectives(a: Objective, b: Objective): number {
  const rank = { in_progress: 0, not_started: 1, parked: 2, done: 3 };
  if (a.priority !== b.priority) return a.priority ? -1 : 1;
  if (rank[a.status] !== rank[b.status]) return rank[a.status] - rank[b.status];
  return a.title.localeCompare(b.title);
}
