import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import { ensureBuiltinThemes } from "./lib/builtinThemes";
import { newId, nowIso } from "./lib/ids";
import { createSeedData } from "./seed";
import { loadData, saveData, clearData, downloadBackup } from "./storage";
import type {
  AppData,
  Horizon,
  Objective,
  ObjectiveStatus,
  TargetMetric,
  Theme,
  ThemeIcon,
} from "./types";

type Action =
  | { type: "replace"; data: AppData }
  | { type: "setHorizon"; horizon: Horizon }
  | { type: "addTheme"; theme: Theme }
  | { type: "updateTheme"; id: string; patch: Partial<Theme> }
  | { type: "reorderThemes"; orderedIds: string[] }
  | { type: "addObjective"; objective: Objective }
  | { type: "updateObjective"; id: string; patch: Partial<Objective> }
  | { type: "deleteObjective"; id: string }
  | {
      type: "checkIn";
      objectiveId: string;
      note: string;
      delta?: number;
      nextCurrent?: number;
      nextStatus?: ObjectiveStatus;
    };

function stamp(): { updatedAt: string } {
  return { updatedAt: nowIso() };
}

function reducer(state: AppData, action: Action): AppData {
  switch (action.type) {
    case "replace":
      return ensureBuiltinThemes(action.data);
    case "setHorizon":
      return { ...state, ui: { ...state.ui, lastHorizon: action.horizon } };
    case "addTheme":
      return { ...state, themes: [...state.themes, action.theme] };
    case "updateTheme":
      return {
        ...state,
        themes: state.themes.map((t) =>
          t.id === action.id ? { ...t, ...action.patch, ...stamp() } : t,
        ),
      };
    case "reorderThemes": {
      const rank = new Map(action.orderedIds.map((id, i) => [id, i]));
      return {
        ...state,
        themes: state.themes.map((t) =>
          rank.has(t.id) ? { ...t, order: rank.get(t.id)!, ...stamp() } : t,
        ),
      };
    }
    case "addObjective":
      return { ...state, objectives: [...state.objectives, action.objective] };
    case "updateObjective":
      return {
        ...state,
        objectives: state.objectives.map((o) =>
          o.id === action.id ? { ...o, ...action.patch, ...stamp() } : o,
        ),
      };
    case "deleteObjective":
      return {
        ...state,
        objectives: state.objectives.filter((o) => o.id !== action.id),
        activities: state.activities.filter((a) => a.objectiveId !== action.id),
      };
    case "checkIn": {
      const objective = state.objectives.find((o) => o.id === action.objectiveId);
      if (!objective) return state;
      let metric = objective.metric;
      let status = action.nextStatus ?? objective.status;
      if (metric && action.nextCurrent !== undefined) {
        metric = { ...metric, current: action.nextCurrent };
      } else if (metric && action.delta !== undefined) {
        metric = { ...metric, current: metric.current + action.delta };
      }
      if (metric?.kind === "boolean" && metric.current >= 1 && !action.nextStatus) {
        status = "done";
      } else if (
        metric &&
        metric.kind !== "boolean" &&
        metric.current >= metric.target &&
        metric.direction !== "down" &&
        !action.nextStatus
      ) {
        status = "done";
      } else if (
        metric?.direction === "down" &&
        metric.current <= metric.target &&
        !action.nextStatus
      ) {
        status = "done";
      } else if (status === "not_started" && !action.nextStatus) {
        status = "in_progress";
      }
      if (action.nextStatus === "done" && metric?.kind === "boolean") {
        metric = { ...metric, current: 1 };
      }
      if (action.nextStatus === "in_progress" && metric?.kind === "boolean") {
        metric = { ...metric, current: 0 };
      }
      const activity = {
        id: newId(),
        objectiveId: objective.id,
        note: action.note,
        delta: action.delta,
        createdAt: nowIso(),
      };
      return {
        ...state,
        objectives: state.objectives.map((o) =>
          o.id === objective.id
            ? { ...o, metric, status, ...stamp() }
            : o,
        ),
        activities: [activity, ...state.activities].slice(0, 200),
      };
    }
    default:
      return state;
  }
}

export interface NewThemeInput {
  name: string;
  description: string;
  color: string;
  icon: ThemeIcon;
}

export interface NewObjectiveInput {
  themeId: string;
  title: string;
  notes: string;
  horizon: Horizon;
  status: ObjectiveStatus;
  metric?: TargetMetric;
  dueDate?: string;
  priority: boolean;
}

export interface CheckInInput {
  note: string;
  delta?: number;
  nextCurrent?: number;
  nextStatus?: ObjectiveStatus;
}

interface StoreValue {
  data: AppData;
  setHorizon: (horizon: Horizon) => void;
  addTheme: (input: NewThemeInput) => void;
  updateTheme: (id: string, patch: Partial<Theme>) => void;
  reorderThemes: (orderedIds: string[]) => void;
  archiveTheme: (id: string) => void;
  restoreTheme: (id: string) => void;
  addObjective: (input: NewObjectiveInput) => void;
  updateObjective: (id: string, patch: Partial<Objective>) => void;
  deleteObjective: (id: string) => void;
  checkIn: (objectiveId: string, input: CheckInInput) => void;
  importData: (data: AppData) => void;
  reset: () => void;
  exportBackup: () => void;
}

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [data, dispatch] = useReducer(reducer, undefined, loadData);

  useEffect(() => {
    saveData(data);
  }, [data]);

  const setHorizon = useCallback((horizon: Horizon) => {
    dispatch({ type: "setHorizon", horizon });
  }, []);

  const addTheme = useCallback((input: NewThemeInput) => {
    const order = data.themes.reduce((max, t) => Math.max(max, t.order), -1) + 1;
    const t = nowIso();
    dispatch({
      type: "addTheme",
      theme: {
        id: newId(),
        archived: false,
        order,
        createdAt: t,
        updatedAt: t,
        ...input,
      },
    });
  }, [data.themes]);

  const updateTheme = useCallback((id: string, patch: Partial<Theme>) => {
    dispatch({ type: "updateTheme", id, patch });
  }, []);

  const reorderThemes = useCallback((orderedIds: string[]) => {
    dispatch({ type: "reorderThemes", orderedIds });
  }, []);

  const archiveTheme = useCallback((id: string) => {
    dispatch({ type: "updateTheme", id, patch: { archived: true } });
  }, []);

  const restoreTheme = useCallback((id: string) => {
    dispatch({ type: "updateTheme", id, patch: { archived: false } });
  }, []);

  const addObjective = useCallback((input: NewObjectiveInput) => {
    const t = nowIso();
    dispatch({
      type: "addObjective",
      objective: {
        id: newId(),
        createdAt: t,
        updatedAt: t,
        ...input,
      },
    });
  }, []);

  const updateObjective = useCallback((id: string, patch: Partial<Objective>) => {
    dispatch({ type: "updateObjective", id, patch });
  }, []);

  const deleteObjective = useCallback((id: string) => {
    dispatch({ type: "deleteObjective", id });
  }, []);

  const checkIn = useCallback((objectiveId: string, input: CheckInInput) => {
    dispatch({ type: "checkIn", objectiveId, ...input });
  }, []);

  const importData = useCallback((next: AppData) => {
    dispatch({ type: "replace", data: next });
  }, []);

  const reset = useCallback(() => {
    clearData();
    dispatch({ type: "replace", data: createSeedData() });
  }, []);

  const exportBackup = useCallback(() => {
    downloadBackup(data);
  }, [data]);

  const value = useMemo<StoreValue>(
    () => ({
      data,
      setHorizon,
      addTheme,
      updateTheme,
      reorderThemes,
      archiveTheme,
      restoreTheme,
      addObjective,
      updateObjective,
      deleteObjective,
      checkIn,
      importData,
      reset,
      exportBackup,
    }),
    [
      data,
      setHorizon,
      addTheme,
      updateTheme,
      reorderThemes,
      archiveTheme,
      restoreTheme,
      addObjective,
      updateObjective,
      deleteObjective,
      checkIn,
      importData,
      reset,
      exportBackup,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
