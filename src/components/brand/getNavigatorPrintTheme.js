export default function getNavigatorPrintTheme() {
  const theme = window.getComputedStyle(document.documentElement);
  const tokens = ['--brand-text', '--brand-muted-foreground', '--brand-primary', '--brand-border', '--brand-muted', '--brand-surface', '--brand-font-body', '--brand-font-heading', '--brand-radius-md'];
  return `
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Nunito+Sans:wght@400;600;700&display=swap');
    :root { ${tokens.map(token => `${token}:${theme.getPropertyValue(token)};`).join('')} }
    body { font-family: var(--brand-font-body), Arial, sans-serif; max-width: 700px; margin: 40px auto; padding: 0 16px; color: var(--brand-text); background: var(--brand-surface); line-height: 1.6; }
    h1 { font-family: var(--brand-font-heading), serif; font-size: 1.4rem; color: var(--brand-text); line-height: 1.2; letter-spacing: .04em; margin-bottom: 4px; }
    .meta { color: var(--brand-muted-foreground); font-size: .85rem; margin-bottom: 24px; }
    pre, .summary { font-family: var(--brand-font-body), Arial, sans-serif; white-space: pre-wrap; overflow-wrap: anywhere; font-size: .95rem; background: var(--brand-muted); border-left: 4px solid var(--brand-primary); padding: 16px 20px; border-radius: var(--brand-radius-md); }
    .footer { margin-top: 32px; font-size: .8rem; color: var(--brand-muted-foreground); border-top: 1px solid var(--brand-border); padding-top: 12px; }
    a { color: var(--brand-primary); }
  `;
}