import type { Metadata, Viewport } from "next";
import { Recursive } from "next/font/google";
import { THEME_BOOTSTRAP } from "@/state/use-theme-sync";
import "./globals.css";

/** The whole portfolio is static content: every route must prerender completely. */
export const ensureStatic = "navigation";

const recursive = Recursive({
  variable: "--font-recursive",
  subsets: ["latin"],
  axes: ["CASL", "MONO", "CRSV"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Marco Ferreira — explore the machine",
  description:
    "An interactive portfolio: explore a PC on a desk, and each part tells you something about Marco Ferreira's work.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#eaf2fc" },
    { media: "(prefers-color-scheme: dark)", color: "#0e1626" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-theme="day"
      className={`${recursive.variable} h-full`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP }} />
      </head>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
