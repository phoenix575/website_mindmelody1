import type { Metadata } from "next";

import { PageHero } from "@/components/page-hero";
import {
  Badge,
  ButtonLink,
  Card,
  Prose,
  Section,
  SectionHeading,
  cn,
} from "@/components/ui";
import { STAGES } from "@/lib/content";

export const metadata: Metadata = {
  title: "Roadmap",
  description:
    "Every MindMelody stage from the initial scaffold through the YouTube integration — what shipped, what was skipped, and the caveats that come with building on a skipped validation stage.",
  alternates: { canonical: "/roadmap" },
};

const STATUS_COPY = {
  shipped: { label: "Shipped", tone: "accent" as const },
  skipped: { label: "Skipped", tone: "warm" as const },
  open: { label: "Open", tone: "muted" as const },
};

const CAVEATS = [
  {
    title: "The brain-state signal is unvalidated",
    body: "Stage 9 — validating the valence–arousal estimate against ground-truth EEG recordings — was never carried out, and Stages 10 through 14 were built on top of it anyway, on explicit request. Everything downstream inherits that uncertainty. The pipeline is sound engineering; whether the number means what its name suggests is genuinely unknown.",
  },
  {
    title: "No signed build has been distributed",
    body: "Icon, launch screen, privacy label and reviewer notes are prepared, but project.yml still carries an empty DEVELOPMENT_TEAM placeholder. Nothing has gone through TestFlight or App Review. Simulator builds need no Apple account at all.",
  },
  {
    title: "Hardware coverage is narrow",
    body: "The packet decoder targets one GATT profile. Other headsets need their own decoder — the protocol boundary makes that a contained change rather than a rewrite, but it is still work nobody has done.",
  },
  {
    title: "Streaming credentials are yours to supply",
    body: "Both integrations ship empty. Without a Spotify Client ID or a YouTube API key, those two modes show a not-configured state and do nothing — which is the intended behaviour, not a bug.",
  },
];

export default function RoadmapPage() {
  const shipped = STAGES.filter((s) => s.status === "shipped").length;

  return (
    <>
      <PageHero
        eyebrow="Roadmap"
        title="Fourteen stages, one of them skipped"
        lede="A build log rather than a promise list. Everything below either shipped or explicitly did not, and the one that did not is the most important item on the page."
      >
        <div className="flex flex-wrap gap-2">
          <Badge tone="accent">{shipped} stage groups shipped</Badge>
          <Badge tone="warm">1 skipped</Badge>
          <Badge tone="muted">123 tests passing</Badge>
        </div>
      </PageHero>

      <Section>
        <SectionHeading
          eyebrow="History"
          title="What was built, in order"
          lede="Stages 0 through 6 produced v1. Everything after that was added on top of a complete, working app."
        />

        <ol className="mt-12 space-y-4">
          {STAGES.map((stage) => {
            const status = STATUS_COPY[stage.status];
            return (
              <li key={stage.id} className="relative">
                <Card
                  className={cn(
                    "border-l-4",
                    stage.status === "shipped"
                      ? "border-l-accent"
                      : stage.status === "skipped"
                        ? "border-l-warm"
                        : "border-l-border-strong",
                  )}
                >
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                    <span className="font-mono text-xs text-subtle">
                      {stage.id}
                    </span>
                    <h3 className="text-lg font-semibold">{stage.title}</h3>
                    <Badge tone={status.tone} className="ml-auto">
                      {status.label}
                    </Badge>
                  </div>
                  <p className="mt-3 leading-relaxed text-muted">
                    {stage.summary}
                  </p>
                </Card>
              </li>
            );
          })}
        </ol>
      </Section>

      <Section id="caveats" className="scroll-mt-20 border-y border-border bg-bg-deep">
        <SectionHeading
          eyebrow="Caveats"
          title="What you should know before trusting any of it"
          lede="These are not hedges. Each one is a real limitation that would change how you read the app's output."
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {CAVEATS.map((caveat) => (
            <Card key={caveat.title} className="h-full">
              <h3 className="text-lg font-semibold">{caveat.title}</h3>
              <p className="mt-3 leading-relaxed text-muted">{caveat.body}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading
              eyebrow="What would come next"
              title="The obvious unfinished business"
            />
            <Prose className="mt-6">
              <p>
                The honest answer to &ldquo;what is next&rdquo; is{" "}
                <strong>the stage that was skipped</strong>. Validation against
                real EEG recordings would either give the valence–arousal
                readout a foundation or reveal that it needs rebuilding — and
                until that happens, every feature added on top is built on an
                assumption rather than a result.
              </p>
              <p>
                After that: broader hardware support through additional packet
                decoders, and an actual signed TestFlight build so the thing can
                be used by someone who did not clone it.
              </p>
            </Prose>
          </div>

          <Card className="lg:p-8">
            <h3 className="text-lg font-semibold">Start here instead</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              You do not need hardware, an Apple Developer account or a Spotify
              key to see the whole system run. Generate the project, build for a
              simulator, pick the mock source, and the full pipeline plays.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonLink href="/developers#build">Build instructions</ButtonLink>
              <ButtonLink href="/how-it-works" variant="secondary">
                How the loop works
              </ButtonLink>
            </div>
          </Card>
        </div>
      </Section>
    </>
  );
}
