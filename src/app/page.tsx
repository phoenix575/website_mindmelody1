import type { Metadata } from "next";
import Link from "next/link";

import { FaqList } from "@/components/faq";
import { ModeTabs } from "@/components/mode-tabs";
import { MoodExplorer } from "@/components/mood-explorer";
import { PipelineStrip } from "@/components/pipeline";
import {
  Badge,
  ButtonLink,
  Card,
  CheckItem,
  Section,
  SectionHeading,
} from "@/components/ui";
import { BandBars, Waveform } from "@/components/waveform";
import { PRIVACY_FACTS } from "@/lib/content";

export const metadata: Metadata = {
  title: "MindMelody — Music that listens to your head",
  alternates: { canonical: "/" },
};

const BANDS = [
  { label: "δ", value: 0.42 },
  { label: "θ", value: 0.66 },
  { label: "α", value: 0.88 },
  { label: "β", value: 0.54 },
  { label: "γ", value: 0.28 },
];

export default function HomePage() {
  return (
    <>
      {/* ------------------------------- hero ------------------------------- */}
      <section className="relative isolate overflow-hidden">
        <div aria-hidden="true" className="absolute inset-0 -z-10 aurora" />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 grid-lines opacity-40"
        />

        <div className="container-page pb-20 pt-16 sm:pb-28 sm:pt-24">
          <div className="max-w-3xl animate-rise">
            <Badge tone="accent" className="mb-6">
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 rounded-full bg-accent"
              />
              14 stages shipped · 123 tests passing
            </Badge>

            <h1 className="text-4xl font-semibold leading-[1.08] tracking-tight sm:text-6xl">
              Music that{" "}
              <span className="text-gradient">listens to your head</span>.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted sm:text-xl">
              MindMelody reads a consumer EEG headband over Bluetooth, scores
              your state on a valence–arousal model{" "}
              <strong className="font-semibold text-fg">
                entirely on the phone
              </strong>
              , and reshapes what you hear in real time. No account. No cloud.
              No brain data anywhere but the device that produced it.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <ButtonLink href="/how-it-works">
                See the signal path
                <svg
                  aria-hidden="true"
                  viewBox="0 0 20 20"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 10h11m0 0-4-4m4 4-4 4" />
                </svg>
              </ButtonLink>
              <ButtonLink href="/privacy" variant="secondary">
                Read the privacy promise
              </ButtonLink>
            </div>

            <p className="mt-5 text-sm text-subtle">
              Native iOS 17+ · Swift &amp; SwiftUI · runs headset-free on a mock
              source
            </p>
          </div>

          {/* live-readout mock */}
          <div className="mt-16 animate-rise" style={{ animationDelay: "120ms" }}>
            <Card className="overflow-hidden p-0">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-3">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <span
                    aria-hidden="true"
                    className="h-2 w-2 rounded-full bg-accent animate-pulse-soft"
                  />
                  Session · connected
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone="muted">Battery 78%</Badge>
                  <Badge tone="brand">Calibrating · 12s left</Badge>
                </div>
              </div>

              <div className="relative h-40 bg-surface-2 sm:h-48">
                <Waveform className="absolute inset-0 h-full w-full" />
              </div>

              <div className="grid gap-6 border-t border-border p-5 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] sm:p-6">
                <div>
                  <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-subtle">
                    Band power
                  </h2>
                  <BandBars values={BANDS} className="mt-4" />
                </div>
                <div>
                  <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-subtle">
                    Brain state
                  </h2>
                  <dl className="mt-4 grid grid-cols-2 gap-4">
                    {[
                      { k: "Valence", v: "+0.41" },
                      { k: "Arousal", v: "−0.28" },
                      { k: "Confidence", v: "0.86" },
                      { k: "Artifacts", v: "none" },
                    ].map((row) => (
                      <div
                        key={row.k}
                        className="rounded-xl bg-surface-2 px-4 py-3"
                      >
                        <dt className="text-xs text-subtle">{row.k}</dt>
                        <dd className="mt-1 font-mono text-lg">{row.v}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </Card>
            <p className="mt-3 text-center text-xs text-subtle">
              An illustration of the in-app session readout, not a screenshot.
            </p>
          </div>
        </div>
      </section>

      {/* ----------------------------- pipeline ----------------------------- */}
      <Section>
        <SectionHeading
          eyebrow="The loop"
          title="Four steps, one closed loop, zero round trips"
          lede="Every stage between the electrode and the speaker runs inside the app process. Nothing waits on a server, because nothing is sent to one."
        />
        <div className="mt-12">
          <PipelineStrip />
        </div>
        <div className="mt-8">
          <Link
            href="/how-it-works"
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand underline underline-offset-4"
          >
            Read the full signal path
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </Section>

      {/* ------------------------------ modes ------------------------------- */}
      <Section className="border-y border-border bg-bg-deep">
        <SectionHeading
          eyebrow="Playback modes"
          title="One brain-state engine, four ways to hear it"
          lede="The modes are mutually exclusive by design — switching is atomic, and two audio engines never run at once."
        />
        <ModeTabs />
      </Section>

      {/* ----------------------------- explorer ----------------------------- */}
      <Section>
        <SectionHeading
          eyebrow="Try the model"
          title="Move the point. Hear the argument."
          lede="Valence and arousal are continuous, so the audio is too — MindMelody glides between settings instead of switching presets. Drag around the plane to see what each corner does."
        />
        <div className="mt-12">
          <MoodExplorer />
        </div>
      </Section>

      {/* ------------------------------ privacy ----------------------------- */}
      <Section className="border-y border-border bg-bg-deep">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading
              eyebrow="Privacy"
              title="A promise is a comment. A test is a guarantee."
              lede="“Your brain data stays on your phone” is easy to write on a marketing page and easy to break in a pull request. MindMelody enforces it with three source-scanning tests that fail the build."
            />
            <ul className="mt-8 space-y-3">
              <CheckItem>
                Raw EEG and valence–arousal state never leave the process
              </CheckItem>
              <CheckItem>
                Networking is confined to one folder, allowlisted call site by
                call site
              </CheckItem>
              <CheckItem>
                Brain-state types are structurally barred from that folder
              </CheckItem>
              <CheckItem>
                New disk writes fail CI until a human reviews them
              </CheckItem>
            </ul>
            <div className="mt-8">
              <ButtonLink href="/privacy" variant="secondary">
                How the tests work
              </ButtonLink>
            </div>
          </div>

          <Card className="lg:p-8">
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-subtle">
              What leaves your device
            </h3>
            <dl className="mt-5 divide-y divide-border">
              {PRIVACY_FACTS.map((fact) => (
                <div
                  key={fact.label}
                  className="flex items-center justify-between gap-4 py-3.5"
                >
                  <dt className="text-sm text-muted">{fact.label}</dt>
                  <dd>
                    <Badge tone={fact.tone === "good" ? "accent" : "warm"}>
                      {fact.value}
                    </Badge>
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-5 text-xs leading-relaxed text-subtle">
              The streaming modes are the only networked code in the app, and
              the most they can express about you is one of four words: calm,
              energetic, focused or neutral.
            </p>
          </Card>
        </div>
      </Section>

      {/* -------------------------------- faq ------------------------------- */}
      <Section>
        <SectionHeading
          eyebrow="Questions"
          title="Straight answers, including the awkward ones"
        />
        <FaqList />
      </Section>

      {/* -------------------------------- cta ------------------------------- */}
      <Section className="pb-24">
        <div className="relative isolate overflow-hidden rounded-3xl border border-border bg-surface px-6 py-14 text-center sm:px-12">
          <div aria-hidden="true" className="absolute inset-0 -z-10 aurora" />
          <h2 className="text-balance text-3xl font-semibold sm:text-4xl">
            Clone it, build it, hear it — no headset required
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">
            The mock EEG source drives the entire pipeline, so a simulator build
            gives you the real thing with simulated input. No Apple Developer
            account needed.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/developers#build">Build instructions</ButtonLink>
            <ButtonLink href="/roadmap" variant="secondary">
              What is shipped so far
            </ButtonLink>
          </div>
        </div>
      </Section>
    </>
  );
}
