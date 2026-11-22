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

  const isDark = theme === 'dark';
  const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label="Dark mode"
      title={label}
      onClick={toggleTheme}
      className="group relative inline-flex h-7 w-14 shrink-0 items-center rounded-full bg-slate-900/15 shadow-[inset_0_0_0_1px_rgba(15,23,42,0.1)] transition-[background-color,transform] duration-300 hover:bg-slate-900/20 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-700 motion-reduce:transition-none dark:focus-visible:ring-purple-300 dark:bg-teal-500 dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.2)] dark:hover:bg-teal-400"
    >
      {/* Track icons: sun on the light side, moon on the dark side */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-20 flex items-center justify-between px-[7px]"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-3.5 w-3.5 text-amber-500 transition-colors duration-300 motion-reduce:transition-none dark:text-white"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>

        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-3.5 w-3.5 text-slate-600 transition-colors duration-300 motion-reduce:transition-none dark:text-slate-900"
        >
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      </span>

      {/* Sliding thumb: left in light mode, right in dark mode */}
      <span
        aria-hidden="true"
        className="absolute left-0.5 top-0.5 z-10 h-6 w-6 rounded-full bg-white shadow-[0_2px_5px_rgba(15,23,42,0.25)] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none dark:translate-x-7"
      />
    </button>
  );
};
