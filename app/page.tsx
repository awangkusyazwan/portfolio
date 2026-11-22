import { Hero } from './components/hero';
import { Navbar } from './components/navbar';
import { ProjectsPlaceholder } from './components/projects-placeholder';

const Portfolio = () => {
  return (
    <main id="main" tabIndex={-1} className="relative flex min-h-svh w-full flex-col overflow-x-clip bg-background text-slate-900 transition-colors duration-300 dark:text-slate-100 focus:outline-none">
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col px-6 py-6 sm:px-8 sm:py-8 lg:px-12 lg:py-10">
        <Navbar />
        <Hero />
        <ProjectsPlaceholder />
      </div>
    </main>
  );
};

export default Portfolio;
