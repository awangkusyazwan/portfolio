'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { MotionToggle } from './motion-toggle';
import { ThemeToggle } from './theme-toggle';

const SCROLL_COLLAPSE_OFFSET = 30;

const navLinks = [
  { id: 'work', label: 'Work', href: '/work' },
  { id: 'about', label: 'About', href: '/about' },
  { id: 'sponsor', label: 'Sponsor', href: '/sponsor-me' },
];

const focusRingClasses =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-700 dark:focus-visible:ring-purple-300';

const menuItemClasses = `flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition-colors duration-300 hover:bg-slate-900/[0.04] active:bg-slate-900/[0.07] dark:text-slate-200 dark:hover:bg-white/[0.06] dark:active:bg-white/10 ${focusRingClasses}`;

type PillPosition = {
  left: number;
  width: number;
};

const MenuIcon = ({ open }: { open: boolean }) => (
  <span aria-hidden="true" className="relative z-10 block h-3.5 w-4">
    <span
      className={`absolute left-0 top-1/2 h-[1.5px] w-4 rounded-full bg-current transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${open ? '-translate-y-1/2 rotate-45' : '-translate-y-[3.5px]'
        }`}
    />
    <span
      className={`absolute left-0 top-1/2 h-[1.5px] w-4 rounded-full bg-current transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${open ? '-translate-y-1/2 -rotate-45' : 'translate-y-[2px]'
        }`}
    />
  </span>
);

const MenuChevron = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 16 16"
    fill="none"
    className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500"
  >
    <path
      d="M6 3.5 10.5 8 6 12.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const MenuLinks = ({ onNavigate }: { onNavigate: () => void }) => (
  <>
    {navLinks.map((link) => (
      <Link key={link.id} href={link.href} onClick={onNavigate} className={menuItemClasses}>
        {link.label}
        <MenuChevron />
      </Link>
    ))}
  </>
);

const MenuContactLink = ({ onNavigate }: { onNavigate: () => void }) => (
  <Link
    href="/contact"
    onClick={onNavigate}
    className={`liquid-cta mt-1 flex h-11 items-center justify-center gap-1.5 rounded-full px-4 text-sm font-semibold text-white dark:text-slate-950 ${focusRingClasses}`}
  >
    <span className="relative z-10">Contact</span>
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      fill="none"
      className="relative z-10 h-3.5 w-3.5"
    >
      <path
        d="M3 8h9.5M8.5 3.5 13 8l-4.5 4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </Link>
);

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [pillPosition, setPillPosition] = useState<PillPosition | null>(null);
  const glassRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const sheenFrame = useRef<number | null>(null);
  const collapsedRef = useRef(false);
  const mobileToggleRef = useRef<HTMLButtonElement>(null);
  const compactToggleRef = useRef<HTMLButtonElement>(null);

  const compactMenuOpen = scrolled && menuOpen;
  const mobileMenuOpen = menuOpen && !scrolled;

  useEffect(() => {
    const handleScroll = () => {
      const nextCollapsed = window.scrollY > SCROLL_COLLAPSE_OFFSET;

      if (nextCollapsed === collapsedRef.current) return;

      collapsedRef.current = nextCollapsed;
      setScrolled(nextCollapsed);
      setMenuOpen(false);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;

      setMenuOpen(false);
      // The open panel becomes inert; return focus to the button that opened it.
      const toggle = scrolled ? compactToggleRef.current : mobileToggleRef.current;
      toggle?.focus();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [menuOpen, scrolled]);

  // Keep the liquid pill aligned if the links change size (font load, resize).
  useEffect(() => {
    if (!hoveredLink) return;

    const container = linksRef.current;
    const target = container?.querySelector<HTMLElement>(`[data-nav-link="${hoveredLink}"]`);
    if (!container || !target) return;

    const updatePill = () => {
      setPillPosition({ left: target.offsetLeft, width: target.offsetWidth });
    };

    const observer = new ResizeObserver(updatePill);
    observer.observe(container);
    observer.observe(target);

    return () => observer.disconnect();
  }, [hoveredLink]);

  useEffect(
    () => () => {
      if (sheenFrame.current !== null) cancelAnimationFrame(sheenFrame.current);
    },
    [],
  );

  function handleGlassPointerMove(event: ReactPointerEvent<HTMLElement>) {
    if (event.pointerType !== 'mouse' || sheenFrame.current !== null) return;

    const glass = glassRef.current;
    if (!glass) return;

    const rect = glass.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    sheenFrame.current = requestAnimationFrame(() => {
      sheenFrame.current = null;
      glass.style.setProperty('--glass-x', `${x}px`);
      glass.style.setProperty('--glass-y', `${y}px`);
    });
  }

  function showPill(id: string, element: HTMLElement) {
    setHoveredLink(id);
    setPillPosition({ left: element.offsetLeft, width: element.offsetWidth });
  }

  return (
    <nav
      aria-label="Primary"
      className={`nav-morph nav-enter sticky top-4 z-50 ${scrolled ? 'pointer-events-none' : ''
        }`}
    >
      {/* One glass surface that morphs from the full bar into the hamburger. */}
      <div
        ref={glassRef}
        data-scrolled={scrolled}
        onPointerMove={handleGlassPointerMove}
        className={`nav-glass liquid-glass relative ml-auto overflow-hidden px-2.5 py-2 sm:px-4 ${scrolled
          ? 'pointer-events-auto w-[52px] translate-x-[var(--nav-escape)] rounded-full'
          : 'w-full rounded-[1.75rem] sm:rounded-full'
          }`}
      >
        <span aria-hidden="true" className="liquid-glass-tint" />
        <span aria-hidden="true" className="liquid-glass-sheen" />

        {/* Keeps the resting bar at 52px while the content is overlaid. */}
        <div aria-hidden="true" className="h-9" />

        {/* Full navbar content. Its width stays at the expanded bar width (100cqw
            resolves against the nav container, not the shrinking glass), so the
            shell clips it from the left instead of reflowing it mid-shrink. */}
        <div
          aria-hidden={scrolled}
          inert={scrolled}
          className={`absolute right-0 top-0 z-10 flex h-[52px] w-[100cqw] items-center justify-between gap-2 px-2.5 transition-opacity motion-reduce:transition-none sm:gap-3 sm:px-4 ${scrolled
            ? 'pointer-events-none opacity-0 duration-[250ms]'
            : 'opacity-100 delay-200 duration-300'
            }`}
        >
          <span
            className="nav-reveal relative z-10 min-w-0"
            style={{ animationDelay: '140ms' }}
          >
            <Link
              href="/"
              className={`inline-flex max-w-full items-center rounded-full px-1 text-lg font-bold tracking-tight sm:text-2xl ${focusRingClasses}`}
            >
              <span className="block whitespace-nowrap bg-gradient-to-r from-teal-700 to-cyan-700 bg-clip-text text-transparent dark:from-teal-300 dark:to-cyan-400">
                Syazwan
              </span>
            </Link>
          </span>

          {/* Desktop controls */}
          <div
            className="nav-reveal hidden items-center gap-1 sm:flex"
            style={{ animationDelay: '240ms' }}
          >
            <div
              ref={linksRef}
              onPointerLeave={() => setHoveredLink(null)}
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                  setHoveredLink(null);
                }
              }}
              className="relative flex items-center gap-0.5"
            >
              <span
                aria-hidden="true"
                className="liquid-pill"
                style={{
                  left: pillPosition?.left ?? 0,
                  width: pillPosition?.width ?? 0,
                  opacity: hoveredLink && pillPosition ? 1 : 0,
                }}
              />

              {navLinks.map((link) => (
                <Link
                  key={link.id}
                  href={link.href}
                  data-nav-link={link.id}
                  onPointerEnter={(event) => showPill(link.id, event.currentTarget)}
                  onFocus={(event) => showPill(link.id, event.currentTarget)}
                  className={`relative z-10 flex h-9 items-center justify-center rounded-full px-3.5 text-sm font-medium text-slate-600 transition-[color,transform] duration-300 hover:text-slate-950 active:scale-95 motion-reduce:transition-none dark:text-slate-300 dark:hover:text-white ${focusRingClasses}`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <MotionToggle />
            <ThemeToggle />

            <Link
              href="/contact"
              className={`liquid-cta group/cta flex h-9 items-center justify-center gap-1.5 rounded-full px-4 text-sm font-semibold text-white dark:text-slate-950 ${focusRingClasses}`}
            >
              <span className="relative z-10">Contact</span>
              <svg
                aria-hidden="true"
                viewBox="0 0 16 16"
                fill="none"
                className="relative z-10 h-3.5 w-3.5 transition-transform duration-300 group-hover/cta:translate-x-0.5 motion-reduce:transition-none"
              >
                <path
                  d="M3 8h9.5M8.5 3.5 13 8l-4.5 4.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>

          {/* Mobile controls */}
          <div
            className="nav-reveal relative z-10 flex shrink-0 items-center gap-1 sm:hidden"
            style={{ animationDelay: '240ms' }}
          >
            <MotionToggle />
            <ThemeToggle />

            <button
              ref={mobileToggleRef}
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className={`flex h-9 w-9 items-center justify-center rounded-full text-slate-600 transition-[background-color,color,transform] duration-300 hover:bg-slate-900/[0.06] active:scale-90 motion-reduce:transition-none dark:text-slate-300 dark:hover:bg-white/10 ${focusRingClasses}`}
            >
              <MenuIcon open={mobileMenuOpen} />
            </button>
          </div>
        </div>

        {/* The hamburger revealed by the shrink. */}
        <button
          ref={compactToggleRef}
          type="button"
          inert={!scrolled}
          aria-hidden={!scrolled}
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={compactMenuOpen}
          aria-controls="compact-nav"
          aria-label={compactMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          className={`absolute right-0 top-0 z-20 flex h-[52px] w-[52px] items-center justify-center rounded-full text-slate-700 transition-[opacity,scale] focus-visible:ring-inset motion-reduce:transition-none dark:text-slate-200 dark:hover:text-white ${focusRingClasses} ${scrolled
            ? 'opacity-100 delay-100 duration-200 active:scale-90'
            : 'pointer-events-none opacity-0 duration-150'
            }`}
        >
          <MenuIcon open={compactMenuOpen} />
        </button>

        {/* Mobile sheet that grows out of the same glass capsule */}
        <div
          id="mobile-nav"
          aria-hidden={!mobileMenuOpen}
          inert={!mobileMenuOpen}
          style={scrolled ? { display: 'none' } : undefined}
          className={`relative z-10 grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none sm:hidden ${mobileMenuOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
            }`}
        >
          <div className="min-h-0 overflow-hidden">
            <div className="mt-2 flex flex-col gap-1 border-t border-slate-900/10 px-0.5 pb-1 pt-2 dark:border-white/10">
              <MenuLinks onNavigate={() => setMenuOpen(false)} />
              <MenuContactLink onNavigate={() => setMenuOpen(false)} />
            </div>
          </div>
        </div>
      </div>

      {/* Menu opened from the shrunken hamburger */}
      <div
        id="compact-nav"
        aria-hidden={!compactMenuOpen}
        inert={!compactMenuOpen}
        className={`absolute right-0 top-[3.75rem] z-50 w-64 max-w-[calc(100vw-2rem)] translate-x-[var(--nav-escape)] origin-top-right transition-[opacity,translate,scale] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${compactMenuOpen
          ? 'pointer-events-auto translate-y-0 scale-100 opacity-100'
          : 'pointer-events-none -translate-y-2 scale-95 opacity-0'
          }`}
      >
        <div
          data-scrolled="true"
          className="liquid-glass liquid-glass-menu overflow-hidden rounded-[1.75rem] p-2"
        >
          <span aria-hidden="true" className="liquid-glass-tint" />

          <div className="relative z-10 flex flex-col gap-1">
            <MenuLinks onNavigate={() => setMenuOpen(false)} />

            <div className="mt-1 flex items-center justify-between gap-2 rounded-2xl px-2 py-1">
              <span className="px-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-600 dark:text-slate-400">
                Display
              </span>
              <div className="flex items-center gap-1">
                <MotionToggle />
                <ThemeToggle />
              </div>
            </div>

            <MenuContactLink onNavigate={() => setMenuOpen(false)} />
          </div>
        </div>
      </div>
    </nav>
  );
};
