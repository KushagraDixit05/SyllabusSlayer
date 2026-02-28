import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Syllabus Slayer | YouTube Time Architect",
  description: "Transform YouTube playlists into strategic learning plans. Calculate durations, optimize playback speed, and plan your learning journey.",
  keywords: ["youtube", "playlist", "calculator", "learning", "productivity", "time management"],
  authors: [{ name: "Syllabus Slayer" }],
  openGraph: {
    title: "Syllabus Slayer | YouTube Time Architect",
    description: "Transform YouTube playlists into strategic learning plans",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className="antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
