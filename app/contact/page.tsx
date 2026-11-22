import type { Metadata } from 'next';
import { LottieAnimation } from '../components/lottie-animation';
import { Navbar } from '../components/navbar';
import { StatusBanner } from '../components/status-banner';

export const metadata: Metadata = {
  title: "Contact | Syazwan's Portfolio",
  description: 'Get in touch about projects, collaborations, or questions.',
};

const statusMessages = {
  success: {
    role: 'status',
    className:
      'border-teal-600/25 bg-teal-500/10 text-teal-950 dark:border-teal-300/25 dark:bg-teal-400/10 dark:text-teal-50',
    title: 'Message sent!',
    body: "Thanks for reaching out. I'll get back to you as soon as I can.",
  },
  invalid: {
    role: 'alert',
    className:
      'border-rose-600/25 bg-rose-500/10 text-rose-950 dark:border-rose-400/25 dark:bg-rose-500/10 dark:text-rose-50',
    title: 'Check your details',
    body: 'Please add your name, a valid email address, and a message before sending.',
  },
  'invalid-name': {
    role: 'alert',
    className:
      'border-rose-600/25 bg-rose-500/10 text-rose-950 dark:border-rose-400/25 dark:bg-rose-500/10 dark:text-rose-50',
    title: 'Your name is missing',
    body: 'Please add your name before sending the message.',
  },
  'invalid-email': {
    role: 'alert',
    className:
      'border-rose-600/25 bg-rose-500/10 text-rose-950 dark:border-rose-400/25 dark:bg-rose-500/10 dark:text-rose-50',
    title: 'Check your email address',
    body: 'Please add a valid email address so I can reply to you.',
  },
  'invalid-message': {
    role: 'alert',
    className:
      'border-rose-600/25 bg-rose-500/10 text-rose-950 dark:border-rose-400/25 dark:bg-rose-500/10 dark:text-rose-50',
    title: 'Your message is empty',
    body: 'Please write a message before sending the form.',
  },
  unavailable: {
    role: 'status',
    className:
      'border-amber-600/25 bg-amber-500/10 text-amber-950 dark:border-amber-300/25 dark:bg-amber-400/10 dark:text-amber-50',
    title: "Messaging isn't available right now",
    body: 'The contact form is not configured yet. Please try again soon.',
  },
  error: {
    role: 'alert',
    className:
      'border-rose-600/25 bg-rose-500/10 text-rose-950 dark:border-rose-400/25 dark:bg-rose-500/10 dark:text-rose-50',
    title: 'Your message could not be sent',
    body: 'Something went wrong on my end. Please try again in a moment.',
  },
} as const;

type StatusKey = keyof typeof statusMessages;

type ContactPageProps = {
  searchParams: Promise<{ status?: string | string[] }>;
};

function isStatusKey(value: string): value is StatusKey {
  return value in statusMessages;
}

const inputClasses =
  'mt-2 h-12 w-full rounded-full border border-slate-900/15 bg-white/70 px-4 text-base font-semibold outline-none transition-colors placeholder:font-normal placeholder:text-slate-600 focus:border-teal-700 focus:ring-2 focus:ring-teal-700 dark:border-white/10 dark:bg-slate-950/40 dark:placeholder:text-slate-400 dark:focus:border-teal-300 dark:focus:ring-teal-300';

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const { status: rawStatus } = await searchParams;
  const status =
    typeof rawStatus === 'string' && isStatusKey(rawStatus)
      ? rawStatus
      : Array.isArray(rawStatus) && rawStatus[0] && isStatusKey(rawStatus[0])
        ? rawStatus[0]
        : null;
  const invalidField =
    status === 'invalid-name'
      ? 'name'
      : status === 'invalid-email'
        ? 'email'
        : status === 'invalid-message'
          ? 'message'
          : null;

  return (
    <main id="main" tabIndex={-1} className="relative flex min-h-svh w-full flex-col overflow-x-clip bg-background px-6 py-6 text-slate-900 transition-colors duration-300 dark:text-slate-100 focus:outline-none">
      <Navbar />
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col py-6 sm:px-8 sm:py-8 lg:px-12 lg:py-10">
        <section aria-label="Contact" className="flex flex-1 flex-col gap-8 sm:gap-10">
          <div className="flex flex-col-reverse items-center gap-6 sm:flex-row sm:justify-between sm:gap-8 lg:gap-12">
            <div className="w-full max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600 dark:text-slate-400">
                Contact
              </p>
              <h1 className="mt-4 text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
                Let&apos;s build something{' '}
                <span className="bg-gradient-to-r from-teal-700 to-cyan-700 bg-clip-text text-transparent dark:from-teal-300 dark:to-cyan-400">
                  great together
                </span>
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg dark:text-slate-300">
                Have a project, collaboration, or question in mind? Send me a note and
                I&apos;ll get back to you as soon as I can.
              </p>
            </div>

            <div className="w-24 shrink-0 sm:w-32 lg:w-40">
              <LottieAnimation src="/lottie/contact.json" className="aspect-square w-full" />
            </div>
          </div>

          {status && (
            <StatusBanner
              id="contact-status"
              focusOnMount
              role={statusMessages[status].role}
              className={statusMessages[status].className}
              title={statusMessages[status].title}
              body={statusMessages[status].body}
            />
          )}

          <form
            action="/contact/send"
            method="post"
            className="rounded-2xl border border-slate-900/10 bg-white/50 p-6 backdrop-blur-xl sm:p-8 dark:border-white/10 dark:bg-slate-900/30"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="contact-name"
                  className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-600 dark:text-slate-400"
                >
                  Name
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  required
                  maxLength={200}
                  autoComplete="name"
                  placeholder="Your name"
                  aria-invalid={invalidField === 'name'}
                  aria-describedby={invalidField === 'name' ? 'contact-status' : undefined}
                  className={inputClasses}
                />
              </div>

              <div>
                <label
                  htmlFor="contact-email"
                  className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-600 dark:text-slate-400"
                >
                  Email
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  required
                  maxLength={320}
                  autoComplete="email"
                  placeholder="you@example.com"
                  aria-invalid={invalidField === 'email'}
                  aria-describedby={invalidField === 'email' ? 'contact-status' : undefined}
                  className={inputClasses}
                />
              </div>
            </div>

            <div className="mt-5">
              <label
                htmlFor="contact-message"
                className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-600 dark:text-slate-400"
              >
                Message
              </label>
              <textarea
                id="contact-message"
                name="message"
                required
                maxLength={5000}
                rows={6}
                placeholder="What would you like to talk about?"
                aria-invalid={invalidField === 'message'}
                aria-describedby={invalidField === 'message' ? 'contact-status' : undefined}
                className="mt-2 w-full resize-y rounded-2xl border border-slate-900/15 bg-white/70 p-4 text-base leading-relaxed outline-none transition-colors placeholder:text-slate-600 focus:border-teal-700 focus:ring-2 focus:ring-teal-700 dark:border-white/10 dark:bg-slate-950/40 dark:placeholder:text-slate-400 dark:focus:border-teal-300 dark:focus:ring-teal-300"
              />
            </div>

            <div aria-hidden="true" className="hidden">
              <label htmlFor="contact-company">Company</label>
              <input
                id="contact-company"
                name="company"
                type="text"
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="submit"
                className="liquid-cta flex h-12 w-full items-center justify-center rounded-full px-6 text-sm font-bold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 dark:focus-visible:ring-teal-300 sm:w-auto dark:text-slate-950"
              >
                <span className="relative z-10">Send message</span>
              </button>
              <p className="text-center text-xs leading-relaxed text-slate-600 sm:text-left dark:text-slate-400">
                Your email is only used to reply to you.
              </p>
            </div>
          </form>

          <p className="text-center text-xs leading-relaxed text-slate-600 dark:text-slate-400">
            Prefer a CV?{' '}
            <a
              href="https://resume.awangkusyazwan.my"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-teal-700 underline underline-offset-2 hover:text-teal-800 dark:text-teal-300 dark:hover:text-teal-200"
            >
              Download my resume
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
