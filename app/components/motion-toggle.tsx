'use client';

import { useMotionPaused, setMotionPaused } from './motion-store';

const PauseIcon = () => (
  <svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4 fill-current">
    <rect x="4" y="3" width="3" height="10" rx="1" />
    <rect x="9" y="3" width="3" height="10" rx="1" />
  </svg>
);

const PlayIcon = () => (
  <svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4 fill-current">
    <path d="M5 3.5v9l7-4.5-7-4.5Z" />
  </svg>
);

/**
 * Site-wide control for WCAG 2.2.2 Pause, Stop, Hide. It stops every decorative
 * animation at once rather than adding a separate control to each one.
 */
export const MotionToggle = () => {
  const paused = useMotionPaused();

  return (
    <button
      type="button"
      aria-label="Pause animations"
      aria-pressed={paused}
      title={paused ? 'Resume animations' : 'Pause animations'}
      onClick={() => setMotionPaused(!paused)}
      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-600 transition-colors hover:bg-slate-900/[0.06] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-700 motion-reduce:transition-none dark:text-slate-300 dark:hover:bg-white/10 dark:focus-visible:ring-purple-300"
    >
      {paused ? <PlayIcon /> : <PauseIcon />}
    </button>
  );
};
