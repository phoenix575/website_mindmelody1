"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/components/ui";
import { NAV_ITEMS, SITE_NAME } from "@/lib/site";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [lastPathname, setLastPathname] = useState(pathname);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Close the mobile panel whenever the route changes. Adjusting state during
  // render rather than in an effect avoids a second paint with a stale panel.
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  // Escape closes and returns focus to the trigger.
  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-bg/85 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-md font-semibold tracking-tight"
        >
          <Logo className="h-8 w-8" />
          <span className="text-[15px]">
            Mind<span className="text-brand">Melody</span>
          </span>
          <span className="sr-only">— home</span>
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={cn(
                    "rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                    isActive(item.href)
                      ? "bg-brand-soft text-brand"
                      : "text-muted hover:bg-surface-2 hover:text-fg",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/developers#build"
            className="hidden rounded-full bg-brand px-4 py-2 text-sm font-semibold text-brand-fg transition hover:brightness-110 sm:inline-flex"
          >
            Build it locally
          </Link>
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-muted transition-colors hover:border-brand hover:text-brand lg:hidden"
          >
            <span className="sr-only">
              {open ? "Close main menu" : "Open main menu"}
            </span>
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-[18px] w-[18px]"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
            >
              {open ? (
                <path d="M6 6l12 12M18 6 6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      <div
        id="mobile-nav"
        hidden={!open}
        className="border-t border-border bg-bg lg:hidden"
      >
        <nav aria-label="Main (mobile)" className="container-page py-4">
          <ul className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={cn(
                    "block rounded-xl px-3 py-3 transition-colors",
                    isActive(item.href)
                      ? "bg-brand-soft"
                      : "hover:bg-surface-2",
                  )}
                >
                  <span
                    className={cn(
                      "block text-sm font-semibold",
                      isActive(item.href) ? "text-brand" : "text-fg",
                    )}
                  >
                    {item.label}
                  </span>
                  <span className="mt-0.5 block text-xs text-subtle">
                    {item.description}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/developers#build"
            className="mt-3 flex items-center justify-center rounded-full bg-brand px-4 py-2.5 text-sm font-semibold text-brand-fg"
          >
            Build {SITE_NAME} locally
          </Link>
        </nav>
      </div>
    </header>
  );
}
