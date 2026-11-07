import type { Metadata, Viewport } from "next";
import { Recursive } from "next/font/google";
import "./globals.css";

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
  themeColor: "#1d1b19",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${recursive.variable} h-full`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
