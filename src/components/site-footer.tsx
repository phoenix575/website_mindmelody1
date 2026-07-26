import Link from "next/link";

import { Logo } from "@/components/logo";
import { NAV_ITEMS, SITE_NAME, SITE_TAGLINE } from "@/lib/site";

const RESOURCES = [
  { href: "/privacy#tests", label: "Privacy tests" },
  { href: "/developers#build", label: "Build & test" },
  { href: "/developers#integrations", label: "Spotify / YouTube setup" },
  { href: "/roadmap#caveats", label: "Known caveats" },
];

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-bg-deep">
      <div className="container-page py-12 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5">
              <Logo className="h-8 w-8" />
              <span className="font-semibold tracking-tight">
                Mind<span className="text-brand">Melody</span>
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
              {SITE_TAGLINE} A native iOS experiment in closed-loop audio, where
              the signal driving the music never leaves the device that made it.
            </p>
            <p className="mt-4 max-w-sm text-xs leading-relaxed text-subtle">
              Not a medical device. MindMelody does not diagnose, treat or
              monitor any condition.
            </p>
          </div>

          <nav aria-labelledby="footer-explore">
            <h2
              id="footer-explore"
              className="text-xs font-semibold uppercase tracking-[0.16em] text-subtle"
            >
              Explore
            </h2>
            <ul className="mt-4 space-y-2.5">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted transition-colors hover:text-brand"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="footer-resources">
            <h2
              id="footer-resources"
              className="text-xs font-semibold uppercase tracking-[0.16em] text-subtle"
            >
              Reference
            </h2>
            <ul className="mt-4 space-y-2.5">
              {RESOURCES.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted transition-colors hover:text-brand"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border pt-6 text-xs text-subtle sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {SITE_NAME}. Built with Next.js.
          </p>
          <p>
            Spotify and YouTube are trademarks of their respective owners.
            MindMelody is not affiliated with either.
          </p>
        </div>
      </div>
    </footer>
  );
}
