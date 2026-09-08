import type { Activity, Objective, Theme } from "../types";
import { formatRelativeTime } from "../lib/dates";
import { Icon } from "./Icons";

interface ActivityFeedProps {
  activities: Activity[];
  objectives: Objective[];
  themes: Theme[];
  empty: string;
  limit?: number;
}

export function ActivityFeed({
  activities,
  objectives,
  themes,
  empty,
  limit,
}: ActivityFeedProps) {
  const objMap = new Map(objectives.map((o) => [o.id, o]));
  const themeMap = new Map(themes.map((t) => [t.id, t]));
  const items = limit ? activities.slice(0, limit) : activities;

  if (items.length === 0) {
    return <p className="empty-copy">{empty}</p>;
  }

  return (
    <ol className="feed">
      {items.map((item) => {
        const objective = objMap.get(item.objectiveId);
        const theme = objective ? themeMap.get(objective.themeId) : undefined;
        return (
          <li key={item.id} className="feed-item">
            <span
              className="feed-dot"
              style={{ background: theme?.color ?? "#8B5E3C" }}
            >
              {theme ? <Icon name={theme.icon} size={12} /> : null}
            </span>
            <div>
              <p className="feed-title">
                {objective?.title ?? "Removed objective"}
                {item.delta !== undefined ? (
                  <span className="feed-delta">
                    {item.delta > 0 ? "+" : ""}
                    {item.delta}
                  </span>
                ) : null}
              </p>
              <p className="feed-note">{item.note}</p>
              <p className="feed-meta">
                {theme?.name ?? "Theme"} · {formatRelativeTime(item.createdAt)}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
