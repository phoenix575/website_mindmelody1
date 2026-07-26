import { PIPELINE } from "@/lib/content";
import { Card, CheckItem } from "@/components/ui";

const STEP_ICONS: Record<string, React.ReactNode> = {
  ingest: <path d="M12 3v7m0 0 3-3m-3 3L9 7M5 13v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5" />,
  dsp: <path d="M3 12h3l2-6 3 12 3-9 2 5 1-2h4" />,
  state: (
    <>
      <path d="M4 20V4M4 20h16" />
      <circle cx="15" cy="9" r="2.5" />
      <path d="M4 20 13 11" />
    </>
  ),
  audio: (
    <>
      <path d="M4 10v4M8 7v10M12 4v16M16 8v8M20 11v2" />
    </>
  ),
};

/** Compact four-step summary used on the home page. */
export function PipelineStrip() {
  return (
    <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {PIPELINE.map((stage, index) => (
        <li key={stage.id}>
          <Card className="h-full">
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft text-brand"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {STEP_ICONS[stage.id]}
                </svg>
              </span>
              <span className="font-mono text-xs text-subtle">
                0{index + 1}
              </span>
            </div>
            <h3 className="mt-4 text-lg font-semibold">{stage.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">
              {stage.summary}
            </p>
            <p className="mt-4 font-mono text-[11px] text-subtle">
              {stage.module}
            </p>
          </Card>
        </li>
      ))}
    </ol>
  );
}

/** Full detail view used on /how-it-works. */
export function PipelineDetail() {
  return (
    <ol className="mt-12 space-y-6">
      {PIPELINE.map((stage, index) => (
        <li key={stage.id} id={stage.id} className="scroll-mt-24">
          <Card className="grid gap-6 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:p-8">
            <div>
              <span className="font-mono text-xs text-subtle">
                Step 0{index + 1}
              </span>
              <h3 className="mt-2 text-2xl font-semibold">{stage.title}</h3>
              <p className="mt-2 text-muted">{stage.summary}</p>
              <p className="mt-4 inline-block rounded-lg bg-surface-2 px-2.5 py-1.5 font-mono text-[11px] text-subtle">
                {stage.module}
              </p>
            </div>
            <div>
              <p className="leading-relaxed text-muted">{stage.detail}</p>
              <ul className="mt-5 space-y-3">
                {stage.bullets.map((bullet) => (
                  <CheckItem key={bullet}>{bullet}</CheckItem>
                ))}
              </ul>
            </div>
          </Card>
        </li>
      ))}
    </ol>
  );
}
