import { createSeedData } from "./seed";
import { STORAGE_KEY, type AppData } from "./types";
import { parseBackupJson } from "./lib/validate";

export function loadData(): AppData {
  if (typeof localStorage === "undefined") return createSeedData();
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return createSeedData();
  const parsed = parseBackupJson(raw);
  if (!parsed.ok) {
    console.warn("Works Best: stored data could not be read, reseeding.", parsed.error);
    return createSeedData();
  }
  return parsed.data;
}

export function saveData(data: AppData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function clearData(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function downloadBackup(data: AppData): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const stamp = new Date().toISOString().slice(0, 10);
  const a = document.createElement("a");
  a.href = url;
  a.download = `works-best-backup-${stamp}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
