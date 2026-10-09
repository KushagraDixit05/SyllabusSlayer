import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

/** Display face for the brutalist headings (font-black). */
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

/** Data face for stat values, labels and tabular figures. */
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
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
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <body className="antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
