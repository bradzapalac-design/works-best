import { useRef, useState } from "react";
import { flash } from "../lib/flash";
import { parseBackupJson } from "../lib/validate";
import { useStore } from "../store";

export function DataPage() {
  const { data, exportBackup, importData, reset } = useStore();
  const fileRef = useRef<HTMLInputElement>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onFile(file: File | undefined) {
    if (!file) return;
    setError(null);
    const text = await file.text();
    const parsed = parseBackupJson(text);
    if (!parsed.ok) {
      setError(parsed.error);
      return;
    }
    importData(parsed.data);
    flash("Backup imported");
  }

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <h1>Data</h1>
          <p className="lede">
            Everything lives in this browser (localStorage). Export a JSON backup before
            clearing site data. Import replaces what is here.
          </p>
        </div>
      </header>

      <div className="data-grid">
        <section className="data-card">
          <h2>Export</h2>
          <p>
            Download themes, objectives, and activity as JSON.{" "}
            {data.themes.length} themes, {data.objectives.length} objectives,{" "}
            {data.activities.length} check-ins.
          </p>
          <button type="button" className="btn primary" onClick={exportBackup}>
            Download backup
          </button>
        </section>

        <section className="data-card">
          <h2>Import</h2>
          <p>Restore from a Works Best backup. This replaces the current workspace.</p>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            hidden
            onChange={(e) => {
              void onFile(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
          <button type="button" className="btn ghost" onClick={() => fileRef.current?.click()}>
            Choose JSON file
          </button>
          {error ? <p className="form-error">{error}</p> : null}
        </section>

        <section className="data-card">
          <h2>Reset</h2>
          <p>
            Restore the sample themes and objectives. Your current data will be replaced.
            Export first if you want it back.
          </p>
          {confirmReset ? (
            <div className="form-actions-right">
              <button type="button" className="btn ghost" onClick={() => setConfirmReset(false)}>
                Cancel
              </button>
              <button
                type="button"
                className="btn danger"
                onClick={() => {
                  reset();
                  setConfirmReset(false);
                  flash("Workspace reset to sample data");
                }}
              >
                Reset now
              </button>
            </div>
          ) : (
            <button type="button" className="btn ghost" onClick={() => setConfirmReset(true)}>
              Reset to sample
            </button>
          )}
        </section>
      </div>
    </div>
  );
}
