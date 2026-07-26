import type { Metadata } from "next";

import { ModeTabs } from "@/components/mode-tabs";
import { PageHero } from "@/components/page-hero";
import {
  Badge,
  ButtonLink,
  Card,
  CheckItem,
  Section,
  SectionHeading,
} from "@/components/ui";
import { PLAYBACK_MODES } from "@/lib/content";

export const metadata: Metadata = {
  title: "Features",
  description:
    "Four mutually exclusive playback modes — generative soundscape, curated local library, Spotify App Remote and YouTube search hand-off — plus the session UI, settings and developer tooling around them.",
  alternates: { canonical: "/features" },
};

const SESSION_FEATURES = [
  {
    title: "Live session readout",
    body: "Waveform, per-band power, valence–arousal and confidence, updating continuously — plus a badge that tells you when calibration is still running rather than leaving you guessing.",
  },
  {
    title: "Device scanning that admits uncertainty",
    body: "The scan sheet shows discovered peripherals, battery level, and a reconnecting state that is genuinely distinct from a first connection — because those two feel very different when you are wearing the thing.",
  },
  {
    title: "Atomic source and mode switching",
    body: "Swapping between the mock source and a real headset, or between the four audio modes, tears down cleanly before bringing the next one up. Two audio engines never run at the same time.",
  },
  {
    title: "Settings that matter",
    body: "Mains notch frequency for your region, brain-state sensitivity via the smoothing time constant, the curated library manager, and a privacy statement that describes what the code actually does.",
  },
];

const NON_FEATURES = [
  {
    title: "No account, ever",
    body: "There is no MindMelody server to have an account on. Optional Spotify and YouTube access uses your own credentials against their APIs.",
  },
  {
    title: "No bundled music",
    body: "The curated mode plays files you import. Nothing is licensed on your behalf and nothing ships in the binary.",
  },
  {
    title: "No tempo detection",
    body: "Track energy is a slider you set. The app does not analyse your audio and does not pretend to know its BPM.",
  },
  {
    title: "No in-app YouTube playback",
    body: "Results open in the YouTube app or Safari. No embedded player, no scraping, no unofficial endpoints — a decision, not a gap.",
  },
];

export default function FeaturesPage() {
  return (
    <>
      <PageHero
        eyebrow="Features"
        title="Everything the app does — and a few things it refuses to"
        lede="MindMelody is deliberately small. One engine reads your state; four modes decide what to do about it; nothing else runs in the background collecting anything."
      >
        <div className="flex flex-wrap gap-2">
          {PLAYBACK_MODES.map((mode) => (
            <Badge key={mode.id} tone="muted">
              {mode.name}
            </Badge>
          ))}
        </div>
      </PageHero>

      <Section>
        <SectionHeading
          eyebrow="Playback modes"
          title="Four ways to hear the same signal"
          lede="Two run entirely on-device; two hand a coarse mood off to a service you already use. All four are mutually exclusive, and switching between them is atomic."
        />
        <ModeTabs />
      </Section>

      <Section className="border-y border-border bg-bg-deep">
        <SectionHeading
          eyebrow="Session"
          title="The screen you actually look at"
          lede="A single main view: pick a source, watch the signal, choose a mode, and get to settings. Everything else is a sheet."
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {SESSION_FEATURES.map((feature) => (
            <Card key={feature.title} className="h-full">
              <h3 className="text-lg font-semibold">{feature.title}</h3>
              <p className="mt-3 leading-relaxed text-muted">{feature.body}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
          <div>
            <SectionHeading
              eyebrow="By omission"
              title="The features that aren't there, on purpose"
              lede="Every one of these could be added. Each was left out because the honest version of it costs more than it returns."
            />
            <div className="mt-8">
              <ButtonLink href="/privacy" variant="secondary">
                Why the constraints are enforced in CI
              </ButtonLink>
            </div>
          </div>

          <ul className="space-y-4">
            {NON_FEATURES.map((item) => (
              <li key={item.title}>
                <Card>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {item.body}
                  </p>
                </Card>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section className="border-t border-border bg-bg-deep">
        <SectionHeading
          eyebrow="Under the hood"
          title="Built to be worked on"
          lede="The project is generated from a single project.yml via XcodeGen, split by module, and covered by a test suite that includes the privacy invariants themselves."
        />
        <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <CheckItem>
            XcodeGen-generated project — no merge conflicts in a .pbxproj
          </CheckItem>
          <CheckItem>
            123 tests across DSP, decoding, brain state, audio, music,
            streaming and privacy
          </CheckItem>
          <CheckItem>
            Pure functions for PKCE, query mapping and response parsing, tested
            without a network
          </CheckItem>
          <CheckItem>
            Mock EEG source and simulated peripheral for hardware-free work
          </CheckItem>
          <CheckItem>
            iOS 17+, Swift 6.2, verified against Xcode 26.3
          </CheckItem>
          <CheckItem>
            Distribution assets and reviewer notes prepared for TestFlight
          </CheckItem>
        </ul>
        <div className="mt-10">
          <ButtonLink href="/developers#build">Build it yourself</ButtonLink>
        </div>
      </Section>
    </>
  );
}
