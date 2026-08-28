// Small helper functions for reading/writing JSON data in the browser's localStorage.
// This lets the whole app work like it has a real backend, without needing one yet.

export function loadData(key, fallbackValue) {
  if (typeof window === "undefined") return fallbackValue;

  const raw = window.localStorage.getItem(key);
  if (!raw) return fallbackValue;

  try {
    return JSON.parse(raw);
  } catch {
    return fallbackValue;
  }
}

export function saveData(key, value) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}
