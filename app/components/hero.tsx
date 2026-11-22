import { ThreeScene } from './three-scene';

const technologies = ['React', 'Next.js', 'Three.js', 'TypeScript', 'Tailwind'];

export const Hero = () => {
  return (
    <section className="relative flex flex-1 flex-col justify-start gap-8 py-8 sm:gap-10 sm:py-10 lg:flex-row lg:items-end lg:justify-between lg:gap-16 lg:py-20">
      <div className="relative z-0 mx-auto aspect-square w-[clamp(16rem,80vw,34rem)] lg:absolute lg:inset-0 lg:aspect-auto lg:h-auto lg:w-full">
        <ThreeScene />
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        <h1 className="text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
          Reimagining <br />
          <span className="bg-gradient-to-r from-teal-700 to-cyan-700 bg-clip-text text-transparent dark:from-teal-300 dark:to-cyan-400">
            the Future
          </span>
        </h1>
        <p className="mt-6 max-w-lg text-base leading-relaxed text-slate-600 sm:text-lg dark:text-slate-300">
          Welcome to my portfolio site. I&apos;m a software developer specialising in web
          development using the MERN stack.
        </p>

        <div className="mt-8 flex">
          <a
            href="https://resume.awangkusyazwan.my"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-slate-900 px-7 py-3 text-sm font-bold text-white shadow-[0_0_20px_rgba(15,23,42,0.18)] transition-colors hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:shadow-[0_0_20px_rgba(255,255,255,0.25)] dark:hover:bg-slate-200"
          >
            Download CV/Resume
          </a>
        </div>
      </div>

      <aside className="relative z-10 hidden w-full max-w-sm rounded-2xl border border-slate-900/10 bg-white/60 p-6 backdrop-blur-xl transition-colors duration-500 hover:border-purple-500/60 md:block lg:mb-1 lg:w-96 lg:shrink-0 dark:border-white/10 dark:bg-slate-900/40 dark:hover:border-purple-500/50">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600 dark:text-slate-400">
          Stack used for this portfolio
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {technologies.map((tech) => (
            <span
              key={tech}
              className="rounded-lg border border-slate-900/10 bg-slate-100/80 px-3 py-1 font-mono text-xs text-teal-700 dark:border-white/10 dark:bg-slate-800/60 dark:text-teal-300"
            >
              {tech}
            </span>
          ))}
        </div>
      </aside>
    </section>
  );
};
