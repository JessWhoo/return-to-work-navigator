/**
 * Escape a value for safe interpolation into an HTML string.
 *
 * Used by print helpers that build a document with `document.write(...)`.
 * React escapes JSX automatically, but a value dropped into a template-string
 * HTML document does not — user-editable or AI-generated text containing
 * `<`, `>` or quotes could otherwise inject markup or script into the
 * print window (which shares this app's origin).
 */
export function escapeHtml(value) {
  if (value === null || value === undefined) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}