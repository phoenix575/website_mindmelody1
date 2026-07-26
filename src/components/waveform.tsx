/**
 * Decorative EEG-style trace used behind the hero. Purely presentational:
 * it is aria-hidden and its motion is disabled under reduced-motion.
 */
export function Waveform({ className = "" }: { className?: string }) {
  const paths = [
    {
      d: "M0 90 C 60 40, 110 140, 170 90 S 280 30, 340 90 S 450 150, 510 90 S 620 35, 680 90 S 790 145, 850 90 S 960 40, 1020 90",
      stroke: "var(--brand)",
      width: 2,
      opacity: 0.85,
      delay: "0s",
    },
    {
      d: "M0 90 C 40 110, 90 60, 140 95 S 240 130, 300 80 S 400 45, 460 100 S 560 135, 620 85 S 720 50, 780 95 S 880 130, 940 88 S 1000 70, 1020 90",
      stroke: "var(--accent)",
      width: 1.6,
      opacity: 0.6,
      delay: "-4s",
    },
    {
      d: "M0 90 C 30 85, 70 95, 110 88 S 190 100, 240 86 S 330 96, 380 89 S 470 99, 520 87 S 610 97, 660 90 S 760 98, 810 88 S 920 96, 1020 90",
      stroke: "var(--warm)",
      width: 1.2,
      opacity: 0.4,
      delay: "-8s",
    },
  ];

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1020 180"
      preserveAspectRatio="none"
      className={className}
      fill="none"
    >
      {paths.map((path) => (
        <path
          key={path.d}
          d={path.d}
          stroke={path.stroke}
          strokeWidth={path.width}
          strokeLinecap="round"
          opacity={path.opacity}
          strokeDasharray="14 10"
          className="animate-dash"
          style={{ animationDelay: path.delay }}
        />
      ))}
    </svg>
  );
}

/** Small static bar readout used as a band-power illustration. */
export function BandBars({
  values,
  className = "",
}: {
  values: { label: string; value: number }[];
  className?: string;
}) {
  return (
    <ul className={`flex items-end gap-2 ${className}`}>
      {values.map((band, index) => (
        <li key={band.label} className="flex flex-1 flex-col items-center gap-2">
          <div className="flex h-24 w-full items-end rounded-md bg-surface-2">
            <div
              className="w-full rounded-md bg-gradient-to-t from-brand to-accent animate-pulse-soft"
              style={{
                height: `${Math.round(band.value * 100)}%`,
                animationDelay: `${index * 0.4}s`,
              }}
            />
          </div>
          <span className="text-[11px] font-medium text-subtle">
            {band.label}
          </span>
        </li>
      ))}
    </ul>
  );
}
