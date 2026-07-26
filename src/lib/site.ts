/**
 * Single source of truth for site-wide metadata and navigation.
 *
 * `SITE_URL` is read from NEXT_PUBLIC_SITE_URL when present (set it in the
 * hosting provider's env) and otherwise falls back to a sensible default so
 * that `next build` never depends on external configuration.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://mindmelody.app";

export const SITE_NAME = "MindMelody";

export const SITE_TAGLINE = "Music that listens to your head.";

export const SITE_DESCRIPTION =
  "MindMelody is a native iOS app that reads consumer EEG over Bluetooth, scores your state on a valence–arousal model entirely on-device, and adapts what you hear in real time. Your brain data never leaves the phone.";

export type NavItem = {
  href: string;
  label: string;
  description: string;
};

export const NAV_ITEMS: NavItem[] = [
  {
    href: "/how-it-works",
    label: "How it works",
    description: "From electrode to soundscape, one closed loop.",
  },
  {
    href: "/features",
    label: "Features",
    description: "Four playback modes, one brain-state engine.",
  },
  {
    href: "/privacy",
    label: "Privacy",
    description: "The promise, and the tests that enforce it.",
  },
  {
    href: "/developers",
    label: "Developers",
    description: "Build, test, and configure the app locally.",
  },
  {
    href: "/roadmap",
    label: "Roadmap",
    description: "Every shipped stage, and what is still open.",
  },
];
