import type { Metadata, Viewport } from "next";
import { Archivo } from "next/font/google";
import { SITE_URL } from "@/lib/site";
import { THEME_BOOTSTRAP } from "@/state/use-theme-sync";
import "./globals.css";

/** The whole portfolio is static content: every route must prerender completely. */
export const ensureStatic = "navigation";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

export const metadata: Metadata = {
  // absolute URLs for the link-preview image (set SITE_URL where the site is hosted)
  metadataBase: new URL(SITE_URL),
  title: "Marco Ferreira — explore the machine",
  description:
    "An interactive portfolio: explore a PC on a desk, and each part tells you something about Marco Ferreira's work.",
  // The day icon; useThemeSync swaps in the night one when the light switch flips.
  icons: { icon: [{ url: "/icons/day.svg", type: "image/svg+xml" }] },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#e4edf9" },
    { media: "(prefers-color-scheme: dark)", color: "#0d1628" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-theme="day"
      className={`${archivo.variable} h-full`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP }} />
      </head>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
