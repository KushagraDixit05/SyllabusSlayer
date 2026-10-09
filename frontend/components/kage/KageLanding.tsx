"use client";

import { useCallback, useRef } from "react";
import { signOut, useSession } from "next-auth/react";

import { KageLandingPage } from "./KageLandingPage";

/* The document is same-origin from public/, so the host can reach into it.
   `applyScene` is the seam LandingPageFrame already provides for exactly this:
   it runs on every load and whenever this callback's identity changes, which is
   why it is memoized on the one value it reads. The session-dependent CTAs are
   the only thing injected — all other copy and every other link lives in the
   document itself.

   This mirrors the useSession() branch already in components/landing/HeroSection.tsx
   and LandingFooter.tsx, so signed-in visitors get the same treatment here as on /. */
export function KageLanding() {
  const { status } = useSession();
  const signedIn = status === "authenticated";

  /* The sign-out listener below is attached once per element and then outlives
     this callback, so it cannot close over `signedIn` — it reads the ref the
     render keeps current instead. */
  const signedInRef = useRef(signedIn);
  signedInRef.current = signedIn;

  const applyScene = useCallback(
    (frame: HTMLIFrameElement) => {
      const doc = frame.contentDocument;
      if (!doc) return;

      const setLabel = (anchor: HTMLAnchorElement, label: string) => {
        const slot = anchor.querySelector("[data-session-label]");
        if (slot) slot.textContent = label;
      };

      const href = signedIn ? "/dashboard" : "/auth/signin";
      const label = signedIn ? "Go to Dashboard" : "Start free";

      /* Every node the document marks as session-dependent. Set target=_top so
         the grant in URL_FRAME_SANDBOX actually moves the parent rather than
         navigating the iframe in place. */
      doc.querySelectorAll<HTMLAnchorElement>("[data-session-cta]").forEach((a) => {
        a.setAttribute("href", href);
        a.setAttribute("target", "_top");
        setLabel(a, label);
      });

      /* The footer's account link: an entrance when signed out, an exit when
         signed in. Sign-out has no URL worth navigating to — next-auth needs a
         POST — so the anchor keeps a sensible href for the signed-out case and
         the handler takes over once there is a session to end. */
      doc.querySelectorAll<HTMLAnchorElement>("[data-session-link]").forEach((a) => {
        a.setAttribute("href", signedIn ? "/dashboard/profile" : "/auth/signin");
        a.setAttribute("target", "_top");
        setLabel(a, signedIn ? "Sign out" : "Sign in");

        if (a.dataset.sessionBound) return;
        a.dataset.sessionBound = "1";
        a.addEventListener("click", (event) => {
          if (!signedInRef.current) return;
          event.preventDefault();
          void signOut({ callbackUrl: "/" });
        });
      });

      /* Anything else pointing into the app has to break out of the frame too. */
      doc.querySelectorAll<HTMLAnchorElement>('a[href^="/"]').forEach((a) => {
        a.setAttribute("target", "_top");
      });
    },
    [signedIn],
  );

  return (
    <KageLandingPage
      applyScene={applyScene}
      headingFont="onest"
      bodyFont="onest"
      headingWeight="400"
      bodyWeight="300"
      primaryColor="#e0231c"
      headingSize={46}
      bodySize={17}
      headingLetterSpacing={-0.012}
    />
  );
}
