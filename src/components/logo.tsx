export function Logo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={className}
      role="img"
      aria-label="MindMelody"
      fill="none"
    >
      <defs>
        <linearGradient id="mm-logo-grad" x1="0" y1="0" x2="40" y2="40">
          <stop offset="0%" stopColor="var(--brand)" />
          <stop offset="100%" stopColor="var(--accent)" />
        </linearGradient>
      </defs>
      <rect
        x="1.25"
        y="1.25"
        width="37.5"
        height="37.5"
        rx="11"
        fill="url(#mm-logo-grad)"
        opacity="0.16"
      />
      <rect
        x="1.25"
        y="1.25"
        width="37.5"
        height="37.5"
        rx="11"
        stroke="url(#mm-logo-grad)"
        strokeWidth="1.5"
      />
      {/* A waveform whose amplitude grows then settles — signal into music. */}
      <path
        d="M7 20h3.4l2.1-7.2 2.6 14.4 2.6-11 2.5 8 2.3-5.4 2.2 3.2H33"
        stroke="url(#mm-logo-grad)"
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
