"use client";

import { useSyncExternalStore } from "react";

type Theme = "light" | "dark";

const STORAGE_KEY = "mm-theme";
const CHANGE_EVENT = "mm-theme-change";

/** Runs before paint (see layout.tsx) so the first frame is already correct. */
export const THEME_INIT_SCRIPT = `(function(){try{var s=localStorage.getItem("mm-theme");var m=window.matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.setAttribute("data-theme",s==="light"||s==="dark"?s:(m?"dark":"light"));}catch(e){document.documentElement.setAttribute("data-theme","dark");}})();`;

function storedTheme(): Theme | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === "light" || value === "dark" ? value : null;
  } catch {
    // Storage can be unavailable in private modes; treat it as "no preference".
    return null;
  }
}

/*
 * The theme lives on <html data-theme>, which makes the DOM the external
 * store. Reading it through useSyncExternalStore keeps the server render
 * (undefined) and the hydrated client render in sync without a setState
 * inside an effect.
 */
function subscribe(onStoreChange: () => void) {
  const media = window.matchMedia("(prefers-color-scheme: dark)");

  const onMediaChange = () => {
    // System changes only apply while the user has no explicit preference.
    if (storedTheme()) return;
    document.documentElement.setAttribute(
      "data-theme",
      media.matches ? "dark" : "light",
    );
    onStoreChange();
  };

  media.addEventListener("change", onMediaChange);
  window.addEventListener(CHANGE_EVENT, onStoreChange);

  return () => {
    media.removeEventListener("change", onMediaChange);
    window.removeEventListener(CHANGE_EVENT, onStoreChange);
  };
}

function getSnapshot(): Theme {
  return document.documentElement.getAttribute("data-theme") === "light"
    ? "light"
    : "dark";
}

function getServerSnapshot(): Theme | undefined {
  return undefined;
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const isDark = theme !== "light";

  function toggle() {
    const next: Theme = getSnapshot() === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // The toggle still works for this session without persistence.
    }
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={
        theme === undefined
          ? "Toggle colour theme"
          : `Switch to ${isDark ? "light" : "dark"} theme`
      }
      aria-pressed={theme === undefined ? undefined : isDark}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-muted transition-colors hover:border-brand hover:text-brand"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-[18px] w-[18px]"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {isDark ? (
          <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" />
        ) : (
          <>
            <circle cx="12" cy="12" r="4.2" />
            <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.2 5.2l1.4 1.4M17.4 17.4l1.4 1.4M18.8 5.2l-1.4 1.4M6.6 17.4l-1.4 1.4" />
          </>
        )}
      </svg>
    </button>
  );
}
