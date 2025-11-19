// Minimal frontend TypeScript entry — handles theme toggle (matches `index.html`)
const themeBtn = document.querySelector('[data-theme-btn]') as HTMLButtonElement | null;

function setTheme(theme: 'dark' | 'light') {
  document.documentElement.setAttribute('data-theme', theme);
  try { localStorage.setItem('theme', theme); } catch {}
}

function initTheme() {
  const stored = (localStorage.getItem('theme') as 'dark' | 'light' | null) || null;
  if (stored) { setTheme(stored); return; }
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  setTheme(prefersDark ? 'dark' : 'light');
}

document.addEventListener('DOMContentLoaded', () => {
  initTheme();

  if (!themeBtn) return;

  themeBtn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    setTheme(current === 'dark' ? 'light' : 'dark');
  });
});
