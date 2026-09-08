import { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { subscribeFlash } from "../lib/flash";

export function Layout() {
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    return subscribeFlash((message) => {
      setToast(message);
    });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 2800);
    return () => window.clearTimeout(t);
  }, [toast]);

  return (
    <div className="app-shell">
      <header className="topbar">
        <NavLink to="/" className="brand">
          <span className="brand-mark" aria-hidden="true" />
          <span>
            <span className="brand-name">Works Best</span>
            <span className="brand-sub">Goal Activity Tracker</span>
          </span>
        </NavLink>
        <nav className="nav" aria-label="Primary">
          <NavLink to="/" end>
            Dashboard
          </NavLink>
          <NavLink to="/themes">Themes</NavLink>
          <NavLink to="/activity">Activity</NavLink>
          <NavLink to="/data">Data</NavLink>
        </nav>
      </header>
      <main className="main">
        <Outlet />
      </main>
      {toast ? (
        <div className="toast" role="status">
          {toast}
        </div>
      ) : null}
    </div>
  );
}
