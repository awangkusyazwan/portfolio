'use client';

import { useEffect, useRef } from 'react';

type StatusBannerProps = {
  role: 'status' | 'alert';
  className: string;
  title: string;
  body: string;
  id?: string;
  /** Focus the banner after a form redirect, but not for static notices. */
  focusOnMount?: boolean;
};

/**
 * Status/alert message that receives focus after a form redirect, so keyboard
 * and screen-reader users are told what happened without hunting for it.
 */
export function StatusBanner({
  role,
  className,
  title,
  body,
  id,
  focusOnMount = false,
}: StatusBannerProps) {
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (focusOnMount) bannerRef.current?.focus();
  }, [focusOnMount]);

  return (
    <div
      ref={bannerRef}
      id={id}
      role={role}
      tabIndex={-1}
      className={`rounded-2xl border px-5 py-4 backdrop-blur-xl focus:outline-none ${className}`}
    >
      <p className="text-sm font-bold">{title}</p>
      <p className="mt-1 text-sm leading-relaxed opacity-80">{body}</p>
    </div>
  );
}
