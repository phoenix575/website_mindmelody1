import type { Metadata } from "next";
import Link from "next/link";

import { ButtonLink } from "@/components/ui";
import { NAV_ITEMS } from "@/lib/site";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <section className="relative isolate overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 -z-10 aurora" />
      <div className="container-page py-24 sm:py-32">
        <p className="font-mono text-sm text-brand">404</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
          Signal lost
        </h1>
        <p className="mt-5 max-w-xl text-lg text-muted">
          That page is not part of the pipeline. Here is everything that is.
        </p>

        <ul className="mt-10 grid max-w-3xl gap-3 sm:grid-cols-2">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="block rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-brand"
              >
                <span className="font-semibold">{item.label}</span>
                <span className="mt-1 block text-sm text-muted">
                  {item.description}
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-10">
          <ButtonLink href="/">Back to the home page</ButtonLink>
        </div>
      </div>
    </section>
  );
}
