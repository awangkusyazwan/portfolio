'use client';

import { useLayoutEffect, useSyncExternalStore } from 'react';

type Theme = 'light' | 'dark';

const STORAGE_KEY = 'theme';
const listeners = new Set<() => void>();

function getStoredTheme(): Theme | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === 'light' || stored === 'dark' ? stored : null;
  } catch {
    return null;
  }
}

function getPreferredTheme(): Theme {
  const stored = getStoredTheme();
  if (stored) return stored;

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function emitChange() {
  listeners.forEach((listener) => listener());
}

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute('data-theme', theme);
  emitChange();
}

function subscribe(listener: () => void) {
  listeners.add(listener);

  const media = window.matchMedia('(prefers-color-scheme: dark)');

  function handleChange(event: MediaQueryListEvent) {
    // An explicit choice always wins over the system preference.
    if (getStoredTheme()) return;

    applyTheme(event.matches ? 'dark' : 'light');
  }

  media.addEventListener('change', handleChange);

  return () => {
    listeners.delete(listener);
    media.removeEventListener('change', handleChange);
  };
}

function getSnapshot(): Theme {
  return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
}

function getServerSnapshot(): Theme {
  return 'light';
}

export const ThemeToggle = () => {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Re-apply the theme after React's development remount, which can reset
  // attributes on <html>. Reads the same source as the inline script.
  useLayoutEffect(() => {
    const current = getPreferredTheme();

    if (document.documentElement.getAttribute('data-theme') !== current) {
      applyTheme(current);
    }
  }, []);

  function toggleTheme() {
    const next = getSnapshot() === 'dark' ? 'light' : 'dark';

    applyTheme(next);

    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Storage can be unavailable (private mode, blocked cookies); the theme
      // still applies for the current session.
    }
  }

  const label = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className="flex h-9 w-9 items-center justify-center rounded-full text-slate-600 transition-[background-color,color,transform] duration-300 hover:bg-slate-900/[0.06] active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/70 motion-reduce:transition-none dark:text-slate-300 dark:hover:bg-white/10"
    >
      <span aria-hidden="true" className="relative block h-4 w-4">
        {/* Sun: shown in dark mode, switches to light */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="absolute inset-0 h-4 w-4 rotate-90 scale-50 opacity-0 transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none dark:rotate-0 dark:scale-100 dark:opacity-100"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>

        {/* Moon: shown in light mode, switches to dark */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="absolute inset-0 h-4 w-4 rotate-0 scale-100 opacity-100 transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none dark:-rotate-90 dark:scale-50 dark:opacity-0"
        >
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      </span>
    </button>
  );
};
