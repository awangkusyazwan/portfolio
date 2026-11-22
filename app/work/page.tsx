import { Navbar } from '../components/navbar';
import { ProjectsPlaceholder } from '../components/projects-placeholder';

export default function WorkPage() {
  return (
    <main className="relative flex min-h-svh w-full flex-col overflow-x-clip bg-background px-6 py-6 text-slate-900 transition-colors duration-300 dark:text-slate-100">
      <Navbar />
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col py-6 sm:px-8 sm:py-8 lg:px-12 lg:py-10">
        <section aria-label="Work" className="flex flex-1 flex-col">
          <ProjectsPlaceholder />
        </section>
      </div>
    </main>
  );
}
