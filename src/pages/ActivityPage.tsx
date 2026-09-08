import { ActivityFeed } from "../components/ActivityFeed";
import { useStore } from "../store";

export function ActivityPage() {
  const { data } = useStore();
  return (
    <div className="page">
      <header className="page-head">
        <div>
          <h1>Activity</h1>
          <p className="lede">
            Check-ins land here: a note, an optional numeric delta, and when it happened.
            The last 200 are kept on this device.
          </p>
        </div>
      </header>
      <ActivityFeed
        activities={data.activities}
        objectives={data.objectives}
        themes={data.themes}
        empty="Nothing logged yet. Open an objective on the dashboard and save a check-in."
      />
    </div>
  );
}
