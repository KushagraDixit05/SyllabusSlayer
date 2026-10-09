"use client";

import { LandingPageFrame, type LandingPageProps } from "./LandingPageFrame";
import { KAGE_TYPOGRAPHY } from "./kageTypography";
import { splitTypographyProps, usePageTypography, type PageTypographyProps } from "./pageTypography";

import "./styles.css";

/* The document's own query knobs, not an edit to it:
   `adapt=0` locks its performance governor, which otherwise rescales the
   renderer (and reallocates the whole bloom pyramid) every time average frame
   time crosses 23ms or drops under 13.8ms — a machine sitting between those
   thresholds ping-pongs and hitches on every step. `dpr=1.25` pulls the
   default 1.8 pixel-ratio cap down; the scene is fill-bound, so this is the
   cheapest frame-time win available. Both are reversible by editing the URL. */
export function KageLandingPage(props: LandingPageProps & PageTypographyProps) {
  const [type, frame] = splitTypographyProps(props);
  const customization = usePageTypography(KAGE_TYPOGRAPHY, type);
  return <LandingPageFrame {...frame} customization={customization} title="SyllabusSlayer — Plan your learning, one playlist at a time" sourceUrl="/landing-pages/kage.html?adapt=0&dpr=1.25" />;
}
