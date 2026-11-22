import { LottieAnimation } from '../components/lottie-animation';

export const ProjectsPlaceholder = () => {
  return (
    <section
      aria-label="Projects"
      className="rounded-2xl border border-dashed border-slate-900/15 bg-white/50 p-8 text-center backdrop-blur-md sm:p-10 dark:border-white/10 dark:bg-slate-900/30"
    >
      <div className="mx-auto w-32 sm:w-44 lg:w-56">
        <LottieAnimation src="/lottie/work.json" className="aspect-square w-full" />
      </div>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600 dark:text-slate-400">
        Projects
      </p>
      <h2 className="mt-3 text-xl font-bold sm:text-2xl">Projects are coming soon</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-600 dark:text-slate-400">
        I&apos;m currently building new work to showcase here. Check back soon.
      </p>
    </section>
  );
};
