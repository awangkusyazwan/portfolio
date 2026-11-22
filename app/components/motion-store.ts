import { useSyncExternalStore } from 'react';

const STORAGE_KEY = 'motionPaused';
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

const listeners = new Set<() => void>();

function getStoredPreference(): boolean | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === 'true' || stored === 'false' ? stored === 'true' : null;
  } catch {
    return null;
  }
}

function getSnapshot(): boolean {
  // An explicit visitor choice wins; otherwise follow the OS setting.
  return getStoredPreference() ?? window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

function getServerSnapshot(): boolean {
  return false;
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);

  const media = window.matchMedia(REDUCED_MOTION_QUERY);
  media.addEventListener('change', onChange);
  window.addEventListener('storage', onChange);

  return () => {
    listeners.delete(onChange);
    media.removeEventListener('change', onChange);
    window.removeEventListener('storage', onChange);
  };
}

/** Pause (or resume) every decorative animation on the site. */
export function setMotionPaused(paused: boolean) {
  try {
    localStorage.setItem(STORAGE_KEY, String(paused));
  } catch {
    // Storage may be unavailable; the choice still applies for this session.
  }

  listeners.forEach((listener) => listener());
}

/**
 * Shared pause state for all auto-playing motion. Defaults to the visitor's
 * reduced-motion preference so no one has to hunt for a control to stop it.
 */
export function useMotionPaused() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
