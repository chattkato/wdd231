// storage.js – LocalStorage helpers for user preferences
// ES Module

const PREFS_KEY = 'orbitbase_prefs';

export function getPrefs() {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function setPrefs(updates) {
  try {
    const current = getPrefs();
    localStorage.setItem(PREFS_KEY, JSON.stringify({ ...current, ...updates }));
  } catch (e) {
    console.warn('OrbitBase: Could not write to localStorage', e);
  }
}

export function clearPrefs() {
  localStorage.removeItem(PREFS_KEY);
}