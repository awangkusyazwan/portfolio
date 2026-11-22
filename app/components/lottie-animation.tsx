'use client';

import { useEffect, useRef } from 'react';
import { LottieSvg, type LottieHandle } from 'lottie-react';
import { useMotionPaused } from './motion-store';

type LottieAnimationProps = {
  /** Same-origin path to the animation JSON. */
  src: string;
  className?: string;
};

/**
 * Decorative Lottie player. The animations loop forever by default but unmount
 * as soon as the site-wide motion control (or the visitor's reduced-motion
 * setting) asks for them to stop, satisfying WCAG 2.2.2.
 */
export function LottieAnimation({ src, className }: LottieAnimationProps) {
  const paused = useMotionPaused();
  const lottieRef = useRef<LottieHandle>(null);

  // lottie-react suppresses autoplay under reduced motion. If a visitor has
  // explicitly resumed animations, start playback here as well.
  useEffect(() => {
    if (!paused) lottieRef.current?.play();
  }, [paused]);

  return (
    <div aria-hidden="true" className={className}>
      {!paused && (
        <LottieSvg
          src={src}
          autoplay
          loop
          lottieRef={lottieRef}
          className="h-full w-full"
          rendererSettings={{ preserveAspectRatio: 'xMidYMid meet' }}
        />
      )}
    </div>
  );
}
