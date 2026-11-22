import type { Metadata } from 'next';
import { Navbar } from '../components/navbar';
import { ProjectsPlaceholder } from '../components/projects-placeholder';

export const metadata: Metadata = {
  title: "Work | Syazwan's Portfolio",
  description: 'Projects and experiments by Syazwan.',
};

export default function WorkPage() {
  return (
    <main id="main" tabIndex={-1} className="relative flex min-h-svh w-full flex-col overflow-x-clip bg-background px-6 py-6 text-slate-900 transition-colors duration-300 dark:text-slate-100 focus:outline-none">
      <Navbar />
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col py-6 sm:px-8 sm:py-8 lg:px-12 lg:py-10">
        <section aria-label="Work" className="flex flex-1 flex-col">
          <h1 className="sr-only">Work</h1>
          <ProjectsPlaceholder />
        </section>
      </div>
    </main>
  );
}
