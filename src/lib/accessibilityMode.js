export const A11Y_KEY = 'a11y_mode_enabled';

export function isAccessibilityModeOn() {
  try { return localStorage.getItem(A11Y_KEY) === '1'; } catch { return false; }
}

export function applyAccessibilityMode(on) {
  document.documentElement.classList.toggle('a11y-mode', !!on);
}