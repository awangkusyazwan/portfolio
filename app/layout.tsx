import type { Metadata } from "next";
import { Google_Sans } from "next/font/google";
import "./globals.css";

const googleSans = Google_Sans({
  variable: "--font-google-sans",
  subsets: ["latin"],
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  title: "Syazwan's Portfolio",
  description: "Powered by Next.js",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-theme="light"
      suppressHydrationWarning
      className={`${googleSans.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");var d=t==="dark"||(t!=="light"&&window.matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.setAttribute("data-theme",d?"dark":"light")}catch(e){}})()`,
          }}
        />
      </head>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
