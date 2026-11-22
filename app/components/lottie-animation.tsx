'use client';

import { LottieSvg } from 'lottie-react';

type LottieAnimationProps = {
  /** Same-origin path to the animation JSON. */
  src: string;
  className?: string;
};

/**
 * Decorative Lottie player. Animations are served from /public so pages never
 * depend on lottie.host, which sends no CORS headers. The SVG-only engine keeps
 * the client bundle small, and lottie-react holds the first frame for people
 * who ask for reduced motion.
 */
export function LottieAnimation({ src, className }: LottieAnimationProps) {
  return (
    <div aria-hidden="true" className={className}>
      <LottieSvg
        src={src}
        autoplay
        loop
        className="h-full w-full"
        rendererSettings={{ preserveAspectRatio: 'xMidYMid meet' }}
      />
    </div>
  );
}
