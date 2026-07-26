import type { Metadata } from "next";

import { MoodExplorer } from "@/components/mood-explorer";
import { PageHero } from "@/components/page-hero";
import { PipelineDetail } from "@/components/pipeline";
import {
  ButtonLink,
  Card,
  CheckItem,
  Section,
  SectionHeading,
} from "@/components/ui";

export const metadata: Metadata = {
  title: "How it works",
  description:
    "From Bluetooth packets to a soundscape: MindMelody's four-stage on-device pipeline — BLE ingestion, DSP, valence–arousal scoring and adaptive audio.",
  alternates: { canonical: "/how-it-works" },
};

const FAILURE_MODES = [
  {
    title: "The headset drops out",
    body: "The connection state distinguishes connecting from reconnecting, so the UI tells you which is happening. Meanwhile the mapper treats the silence as low confidence and glides the mix toward a neutral preset rather than freezing on the last state it saw.",
  },
  {
    title: "You blink, chew or clench",
    body: "The artifact detector flags the frame and its confidence collapses. Bad frames are gated out of the brain-state estimate instead of being allowed to yank the music around.",
  },
  {
    title: "A call comes in",
    body: "Audio-session interruptions and route changes — a phone call, unplugged headphones, a Bluetooth speaker appearing — are handled explicitly, so the engine resumes instead of silently dying.",
  },
  {
    title: "Mains hum at 50 or 60 Hz",
    body: "The notch frequency is a runtime setting, not a build constant. Change region, change the setting, and the processor retunes without a restart.",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <PageHero
        eyebrow="How it works"
        title="Electrode to speaker, without a round trip"
        lede="MindMelody is a closed loop that happens to be an app: the signal it reads shapes the sound it makes, which changes the signal it reads. Four stages stand between the two, and all four run on the phone."
      >
        <ButtonLink href="#state" variant="secondary">
          Jump to the brain-state model
        </ButtonLink>
      </PageHero>

      <Section>
        <SectionHeading
          eyebrow="The pipeline"
          title="Four stages, each one a module"
          lede="The boundaries are not decorative — the EEG source is a protocol, so a mock and a real headset are interchangeable, and each stage can be tested without the ones around it."
        />
        <PipelineDetail />
      </Section>

      <Section className="border-y border-border bg-bg-deep">
        <SectionHeading
          eyebrow="The model"
          title="Why valence and arousal, not labels"
          lede="Classifying someone as “relaxed” or “stressed” invents a precision the signal does not have. Two continuous axes admit what is actually being measured: roughly how activated you are, and roughly how pleasant it seems."
        />

        <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
          <MoodExplorer />

          <Card>
            <h3 className="text-lg font-semibold">Calibration first</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Nobody&rsquo;s alpha band looks like anybody else&rsquo;s, and
              yours will not look the same tomorrow. So every session opens with
              a roughly 30-second baseline window, and normalization keeps
              adapting afterwards with a leaky min/max so a single outlier
              cannot permanently rescale the axes.
            </p>
            <ul className="mt-5 space-y-3 text-sm">
              <CheckItem>Per-session, never a stored profile</CheckItem>
              <CheckItem>Progress is visible as a calibration badge</CheckItem>
              <CheckItem>Smoothing constant tunable in Settings</CheckItem>
            </ul>
          </Card>
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="When things go wrong"
          title="The interesting part of a real-time system is the failure modes"
          lede="A demo works when the signal is clean. Most of this project's later stages went into what happens when it is not."
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {FAILURE_MODES.map((item) => (
            <Card key={item.title} className="h-full">
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {item.body}
              </p>
            </Card>
          ))}
        </div>
      </Section>

      <Section className="border-t border-border bg-bg-deep">
        <div className="rounded-3xl border border-border bg-surface p-8 sm:p-12">
          <h2 className="text-2xl font-semibold">
            One caveat, stated plainly
          </h2>
          <p className="mt-4 max-w-3xl leading-relaxed text-muted">
            The validation stage — checking this valence–arousal signal against
            ground-truth EEG recordings — was skipped, and later work was built
            on top of it anyway. The pipeline is real, the DSP is real, the
            tests are real; what has never been established is how well the
            resulting number corresponds to your actual state. Treat MindMelody
            as an instrument with an unusual controller, not as a measurement
            device.
          </p>
          <div className="mt-8">
            <ButtonLink href="/roadmap#caveats" variant="secondary">
              See the full list of open items
            </ButtonLink>
          </div>
        </div>
      </Section>
    </>
  );
}
