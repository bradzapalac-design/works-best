import { useState } from "react";
import { Icon } from "../components/Icons";
import { ObjectiveForm } from "../components/ObjectiveForm";
import { ThemeForm } from "../components/ThemeForm";
import { flash } from "../lib/flash";
import { useStore } from "../store";
import type { Theme } from "../types";

export function ThemesPage() {
  const {
    data,
    addTheme,
    updateTheme,
    reorderThemes,
    archiveTheme,
    restoreTheme,
    addObjective,
  } = useStore();
  const [editing, setEditing] = useState<Theme | null>(null);
  const [creating, setCreating] = useState(false);
  const [addingFor, setAddingFor] = useState<string | null>(null);

  const sorted = [...data.themes].sort((a, b) => a.order - b.order);
  const active = sorted.filter((t) => !t.archived);
  const archived = sorted.filter((t) => t.archived);

  function move(id: string, dir: -1 | 1) {
    const ids = active.map((t) => t.id);
    const i = ids.indexOf(id);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= ids.length) return;
    const next = [...ids];
    const [item] = next.splice(i, 1);
    next.splice(j, 0, item);
    reorderThemes(next);
  }

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <h1>Themes</h1>
          <p className="lede">
            North stars. They stay relatively stable. Specifics live under them and can
            change with the season.
          </p>
        </div>
        <button type="button" className="btn primary" onClick={() => setCreating(true)}>
          <Icon name="plus" size={16} /> New theme
        </button>
      </header>

      <ul className="theme-manage">
        {active.map((theme, index) => {
          const count = data.objectives.filter((o) => o.themeId === theme.id).length;
          return (
            <li key={theme.id} className="theme-manage-card">
              <span className="theme-badge lg" style={{ background: theme.color }}>
                <Icon name={theme.icon} />
              </span>
              <div className="theme-manage-body">
                <h2>{theme.name}</h2>
                <p>{theme.description || "No description yet."}</p>
                <p className="muted">
                  {count} objective{count === 1 ? "" : "s"}
                </p>
              </div>
              <div className="theme-manage-actions">
                <button
                  type="button"
                  className="btn ghost"
                  disabled={index === 0}
                  onClick={() => move(theme.id, -1)}
                >
                  Up
                </button>
                <button
                  type="button"
                  className="btn ghost"
                  disabled={index === active.length - 1}
                  onClick={() => move(theme.id, 1)}
                >
                  Down
                </button>
                <button type="button" className="btn ghost" onClick={() => setAddingFor(theme.id)}>
                  Add objective
                </button>
                <button type="button" className="btn ghost" onClick={() => setEditing(theme)}>
                  Rename
                </button>
                <button
                  type="button"
                  className="btn ghost"
                  onClick={() => {
                    archiveTheme(theme.id);
                    flash(`Archived ${theme.name}`);
                  }}
                >
                  Archive
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      {archived.length > 0 ? (
        <section className="archived-block">
          <h2>Archived</h2>
          <p className="lede">Hidden from the dashboard. Restore anytime.</p>
          <ul className="theme-manage">
            {archived.map((theme) => (
              <li key={theme.id} className="theme-manage-card is-archived">
                <span className="theme-badge lg" style={{ background: theme.color }}>
                  <Icon name={theme.icon} />
                </span>
                <div className="theme-manage-body">
                  <h2>{theme.name}</h2>
                  <p>{theme.description}</p>
                </div>
                <div className="theme-manage-actions">
                  <button
                    type="button"
                    className="btn ghost"
                    onClick={() => {
                      restoreTheme(theme.id);
                      flash(`Restored ${theme.name}`);
                    }}
                  >
                    Restore
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {creating ? (
        <ThemeForm
          onClose={() => setCreating(false)}
          onSave={(input) => {
            addTheme(input);
            setCreating(false);
            flash("Theme added");
          }}
        />
      ) : null}

      {editing ? (
        <ThemeForm
          initial={editing}
          onClose={() => setEditing(null)}
          onSave={(input) => {
            updateTheme(editing.id, input);
            setEditing(null);
            flash("Theme updated");
          }}
        />
      ) : null}

      {addingFor ? (
        <ObjectiveForm
          themes={data.themes}
          defaultThemeId={addingFor}
          onClose={() => setAddingFor(null)}
          onSave={(input) => {
            addObjective(input);
            setAddingFor(null);
            flash("Objective added");
          }}
        />
      ) : null}
    </div>
  );
}
