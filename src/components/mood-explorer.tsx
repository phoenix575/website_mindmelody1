"use client";

import { useMemo, useRef, useState } from "react";

import { MOOD_COPY, moodCategory } from "@/lib/content";
import { Badge, cn } from "@/components/ui";

/** Illustrative stand-in for StateToAudioMapper's VA → parameter mapping. */
function audioParameters(valence: number, arousal: number) {
  const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
  return [
    {
      label: "Layer density",
      value: clamp01(0.35 + arousal * 0.4),
      hint: "How many soundscape voices are audible",
    },
    {
      label: "Filter cutoff",
      value: clamp01(0.4 + arousal * 0.3 + valence * 0.18),
      hint: "Brightness of the low-pass on the bed",
    },
    {
      label: "Reverb mix",
      value: clamp01(0.55 - arousal * 0.35),
      hint: "Space opens up as arousal falls",
    },
    {
      label: "Harmonic warmth",
      value: clamp01(0.5 + valence * 0.4),
      hint: "Consonance of the drifting chord set",
    },
  ];
}

const MOOD_TONE = {
  calm: "accent",
  energetic: "warm",
  focused: "brand",
  neutral: "muted",
} as const;

export function MoodExplorer() {
  const [valence, setValence] = useState(0.45);
  const [arousal, setArousal] = useState(-0.35);
  const plotRef = useRef<HTMLDivElement>(null);

  const mood = moodCategory(valence, arousal);
  const copy = MOOD_COPY[mood];
  const params = useMemo(
    () => audioParameters(valence, arousal),
    [valence, arousal],
  );

  // Pointer dragging on the plane is a convenience on top of the sliders,
  // which remain the accessible, keyboard-operable source of truth.
  function handlePointer(event: React.PointerEvent<HTMLDivElement>) {
    if (event.buttons !== 1 && event.type !== "pointerdown") return;
    const rect = plotRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = 1 - ((event.clientY - rect.top) / rect.height) * 2;
    const round = (n: number) =>
      Math.round(Math.min(1, Math.max(-1, n)) * 100) / 100;
    setValence(round(x));
    setArousal(round(y));
  }

  const left = ((valence + 1) / 2) * 100;
  const bottom = ((arousal + 1) / 2) * 100;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      {/* ---------------- plane ---------------- */}
      <div>
        <div
          ref={plotRef}
          onPointerDown={handlePointer}
          onPointerMove={handlePointer}
          className="relative aspect-square w-full touch-none select-none overflow-hidden rounded-2xl border border-border bg-surface"
        >
          {/* quadrant tints */}
          <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
            <div className="bg-brand/[0.07]" />
            <div className="bg-warm/[0.09]" />
            <div className="bg-surface-2/70" />
            <div className="bg-accent/[0.08]" />
          </div>

          {/* axes */}
          <div className="absolute inset-x-0 top-1/2 h-px bg-border-strong" />
          <div className="absolute inset-y-0 left-1/2 w-px bg-border-strong" />

          {/* quadrant labels */}
          <span className="absolute left-3 top-3 text-[11px] font-semibold uppercase tracking-wider text-brand">
            Focused
          </span>
          <span className="absolute right-3 top-3 text-[11px] font-semibold uppercase tracking-wider text-warm">
            Energetic
          </span>
          <span className="absolute bottom-3 right-3 text-[11px] font-semibold uppercase tracking-wider text-accent">
            Calm
          </span>
          <span className="absolute bottom-3 left-3 text-[11px] font-semibold uppercase tracking-wider text-subtle">
            Low / negative
          </span>

          {/* axis names */}
          <span className="absolute bottom-1/2 left-1/2 ml-2 translate-y-1/2 text-[11px] text-subtle">
            valence →
          </span>
          <span className="absolute left-1/2 top-2 -translate-x-[130%] text-[11px] text-subtle">
            arousal ↑
          </span>

          {/* neutral deadzone */}
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 h-[20%] w-[20%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-border-strong"
          />

          {/* current point */}
          <div
            className="absolute h-5 w-5 -translate-x-1/2 translate-y-1/2 rounded-full border-2 border-bg bg-brand shadow-lg transition-[left,bottom] duration-150 ease-out"
            style={{ left: `${left}%`, bottom: `${bottom}%` }}
          >
            <span className="absolute inset-0 -m-2 rounded-full bg-brand/25 animate-pulse-soft" />
          </div>
        </div>
        <p className="mt-3 text-xs text-subtle">
          Drag the plane, or use the sliders below. This mirrors the app&rsquo;s
          own <code className="font-mono">MoodCategory</code> heuristic — the
          one lossy conversion the streaming modes are allowed to use.
        </p>
      </div>

      {/* ---------------- controls & readout ---------------- */}
      <div className="flex flex-col gap-5">
        <div className="grid gap-4">
          <Slider
            id="valence"
            label="Valence"
            hint="unpleasant → pleasant"
            value={valence}
            onChange={setValence}
          />
          <Slider
            id="arousal"
            label="Arousal"
            hint="drowsy → activated"
            value={arousal}
            onChange={setArousal}
          />
        </div>

        <div
          className="rounded-2xl border border-border bg-surface p-5"
          aria-live="polite"
        >
          <div className="flex flex-wrap items-center gap-3">
            <Badge tone={MOOD_TONE[mood]}>{copy.label}</Badge>
            <span className="font-mono text-xs text-subtle">
              v {valence.toFixed(2)} · a {arousal.toFixed(2)}
            </span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-muted">{copy.blurb}</p>

          <dl className="mt-5 space-y-3">
            {params.map((param) => (
              <div key={param.label}>
                <div className="flex items-baseline justify-between gap-3">
                  <dt className="text-sm font-medium">{param.label}</dt>
                  <dd className="font-mono text-xs text-subtle">
                    {param.value.toFixed(2)}
                  </dd>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-surface-2">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-brand to-accent transition-[width] duration-200"
                    style={{ width: `${param.value * 100}%` }}
                  />
                </div>
                <p className="mt-1 text-xs text-subtle">{param.hint}</p>
              </div>
            ))}
          </dl>

          <div className="mt-5 rounded-xl border border-dashed border-border-strong bg-surface-2 p-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-subtle">
              What a streaming mode would send
            </p>
            <p className="mt-1.5 font-mono text-sm text-fg">
              q={copy.query.replace(/ /g, "+")}
            </p>
            <p className="mt-1.5 text-xs text-subtle">
              One bucket, one query string. Never the numbers on the left.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Slider({
  id,
  label,
  hint,
  value,
  onChange,
}: {
  id: string;
  label: string;
  hint: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-sm font-medium">
          {label}
        </label>
        <span className="font-mono text-xs text-subtle">{value.toFixed(2)}</span>
      </div>
      <input
        id={id}
        type="range"
        min={-1}
        max={1}
        step={0.01}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        aria-describedby={`${id}-hint`}
        className={cn(
          "mt-2 h-2 w-full cursor-pointer appearance-none rounded-full bg-surface-2",
          "[&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-bg [&::-webkit-slider-thumb]:bg-brand",
          "[&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-bg [&::-moz-range-thumb]:bg-brand",
        )}
      />
      <p id={`${id}-hint`} className="mt-1 text-xs text-subtle">
        {hint}
      </p>
    </div>
  );
}
