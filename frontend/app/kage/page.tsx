import type { Metadata } from "next";

import { KageLanding } from "@/components/kage/KageLanding";

/* The document's own <title> lives inside the iframe and never reaches the tab
   or a crawler, so the route carries the metadata. Note the trade-off: an
   iframed landing page keeps its copy out of the server-rendered HTML, so
   unfurlers see this and nothing more. That is why / keeps the classic
   landing page as the indexable one. */
export const metadata: Metadata = {
  title: "SyllabusSlayer — Plan your learning, one playlist at a time",
  description:
    "Paste any YouTube playlist and see exactly how long it will take. Build a study schedule that fits your week, tune playback speed, and track every session you finish.",
  openGraph: {
    title: "SyllabusSlayer — Plan your learning, one playlist at a time",
    description:
      "Paste any YouTube playlist and see exactly how long it will take. Build a study schedule that fits your week, tune playback speed, and track every session you finish.",
    type: "website",
  },
};

export default function KagePage() {
  return (
    <div className="shader-frame">
      <KageLanding />
    </div>
  );
}
