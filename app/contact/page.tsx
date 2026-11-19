import { Navbar } from '../components/navbar';

export default function ContactPage() {
  return (
    <main className="relative flex min-h-svh w-full flex-col overflow-x-clip bg-background text-slate-900 transition-colors duration-300 dark:text-slate-100 px-6 py-6">
      <Navbar />
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col px-6 py-6 sm:px-8 sm:py-8 lg:px-12 lg:py-10">
        <section
          aria-label="Contact"
          className="flex flex-1 flex-col justify-center items-center gap-6 rounded-2xl border border-dashed border-slate-900/15 bg-white/50 p-8 text-center backdrop-blur-md sm:p-10 dark:border-white/10 dark:bg-slate-900/30"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Contact
          </p>
          <h1 className="text-3xl font-black leading-[1.05] tracking-tight sm:text-4xl lg:text-5xl">
            Let&apos;s build something <span className="bg-gradient-to-r from-teal-700 to-cyan-700 bg-clip-text text-transparent dark:from-teal-300 dark:to-cyan-400">great together</span>
          </h1>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg dark:text-slate-300">
            I&apos;m currently focused on new projects. Feel free to reach out through
            the contact details on my resume.
          </p>
          <a
            href="https://resume.awangkusyazwan.my"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-slate-900 px-7 py-3 text-sm font-bold text-white shadow-[0_0_20px_rgba(15,23,42,0.18)] transition-colors hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:shadow-[0_0_20px_rgba(255,255,255,0.18)] dark:hover:bg-slate-200"
          >
            Download CV/Resume
          </a>
        </section>
      </div>
    </main>
  );
}
