import type { Metadata } from 'next';
import { LottieAnimation } from '../components/lottie-animation';
import { Navbar } from '../components/navbar';

export const metadata: Metadata = {
  title: "About | Syazwan's Portfolio",
  description: 'A little about Syazwan, the developer behind this portfolio.',
};

export default function AboutPage() {
  return (
    <main id="main" tabIndex={-1} className="relative flex min-h-svh w-full flex-col overflow-x-clip bg-background px-6 py-6 text-slate-900 transition-colors duration-300 dark:text-slate-100 focus:outline-none">
      <Navbar />
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col py-6 sm:px-8 sm:py-8 lg:px-12 lg:py-10">
        <section
          aria-label="About"
          className="flex flex-1 flex-col justify-center gap-6 rounded-2xl border border-dashed border-slate-900/15 bg-white/50 p-6 text-center backdrop-blur-md sm:p-10 dark:border-white/10 dark:bg-slate-900/30"
        >
          <div className="mx-auto w-full max-w-xs sm:max-w-sm lg:max-w-md">
            <LottieAnimation src="/lottie/about.json" className="aspect-[1330/920] w-full" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600 dark:text-slate-400">
            About
          </p>
          <h1 className="text-3xl font-black leading-[1.05] tracking-tight sm:text-4xl lg:text-5xl">
            Hey, I&apos;m{' '}
            <span className="bg-gradient-to-r from-teal-700 to-cyan-700 bg-clip-text text-transparent dark:from-teal-300 dark:to-cyan-400">
              Syazwan
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg dark:text-slate-300">
            I&apos;m a software developer specialising in web development using the MERN
            stack. Welcome to my portfolio site — I&apos;m currently building new work to
            showcase here. Check back soon.
          </p>
        </section>
      </div>
    </main>
  );
}
