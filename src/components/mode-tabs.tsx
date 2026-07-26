"use client";

import { useRef, useState } from "react";

import { PLAYBACK_MODES } from "@/lib/content";
import { Badge, CheckItem, cn } from "@/components/ui";

/**
 * A real ARIA tablist: arrow keys move between tabs, Home/End jump to the
 * ends, and only the active tab is in the tab order.
 */
export function ModeTabs() {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  function onKeyDown(event: React.KeyboardEvent) {
    const last = PLAYBACK_MODES.length - 1;
    let next: number | null = null;

    if (event.key === "ArrowRight") next = active === last ? 0 : active + 1;
    else if (event.key === "ArrowLeft") next = active === 0 ? last : active - 1;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = last;

    if (next !== null) {
      event.preventDefault();
      setActive(next);
      tabRefs.current[next]?.focus();
    }
  }

  const mode = PLAYBACK_MODES[active];

  return (
    <div className="mt-10">
      <div
        role="tablist"
        aria-label="Playback modes"
        onKeyDown={onKeyDown}
        className="flex flex-wrap gap-2 rounded-2xl border border-border bg-surface p-2"
      >
        {PLAYBACK_MODES.map((item, index) => (
          <button
            key={item.id}
            ref={(node) => {
              tabRefs.current[index] = node;
            }}
            role="tab"
            id={`mode-tab-${item.id}`}
            aria-selected={index === active}
            aria-controls={`mode-panel-${item.id}`}
            tabIndex={index === active ? 0 : -1}
            onClick={() => setActive(index)}
            className={cn(
              "flex-1 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors",
              index === active
                ? "bg-brand text-brand-fg"
                : "text-muted hover:bg-surface-2 hover:text-fg",
            )}
          >
            {item.name}
          </button>
        ))}
      </div>

      <div
        role="tabpanel"
        id={`mode-panel-${mode.id}`}
        aria-labelledby={`mode-tab-${mode.id}`}
        tabIndex={0}
        className="mt-4 rounded-2xl border border-border bg-surface p-6 sm:p-8"
      >
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="text-xl font-semibold">{mode.tagline}</h3>
          <Badge
            tone={mode.network === "Search requests only" ? "warm" : "accent"}
          >
            {mode.network}
          </Badge>
        </div>

        <p className="mt-3 max-w-3xl leading-relaxed text-muted">
          {mode.description}
        </p>

        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {mode.points.map((point) => (
            <CheckItem key={point}>{point}</CheckItem>
          ))}
        </ul>

        <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-2 border-t border-border pt-5 text-sm">
          <div className="flex gap-2">
            <dt className="text-subtle">Module</dt>
            <dd className="font-mono text-xs leading-5 text-fg">
              {mode.module}
            </dd>
          </div>
          <div className="flex gap-2">
            <dt className="text-subtle">Status</dt>
            <dd className="text-muted">{mode.status}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
