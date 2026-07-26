import type { Metadata } from "next";

import { PageHero } from "@/components/page-hero";
import {
  Badge,
  ButtonLink,
  Card,
  CheckItem,
  Prose,
  Section,
  SectionHeading,
} from "@/components/ui";
import { PRIVACY_FACTS, PRIVACY_TESTS } from "@/lib/content";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "EEG samples and derived brain state never leave the device. Three source-scanning tests enforce it in CI: networking is confined to one module, brain-state types are barred from it, and every disk write is allowlisted.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Privacy"
        title="Your brain data never leaves your phone — and CI is what makes that true"
        lede="This page is not a policy written by someone who has not read the code. It describes an invariant, the three tests that enforce it, and the exact places where the rule is relaxed."
      >
        <div className="flex flex-wrap gap-2">
          {PRIVACY_FACTS.map((fact) => (
            <Badge key={fact.label} tone={fact.tone === "good" ? "accent" : "warm"}>
              {fact.label}: {fact.value}
            </Badge>
          ))}
        </div>
      </PageHero>

      <Section>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-start">
          <div>
            <SectionHeading
              eyebrow="The invariant"
              title="One sentence, held to precisely"
            />
            <Prose className="mt-6">
              <p className="rounded-2xl border border-border bg-surface p-6 text-lg leading-relaxed text-fg">
                Raw EEG samples and the derived valence–arousal{" "}
                <strong>BrainState</strong> are never sent anywhere, never
                persisted off-device, and never leave the process.
              </p>
              <p>
                Through Stage 12 this was enforced by the blunter rule{" "}
                <em>no networking at all</em> — the app contained not a single
                <code className="mx-1 font-mono text-sm">URLSession</code>
                call. Stages 13 and 14 added Spotify and YouTube integrations
                that genuinely need one, so rather than quietly dropping the
                promise or keeping a rule the code no longer obeyed, the
                invariant was narrowed to its essential form and re-enforced.
              </p>
              <p>
                Networking is now permitted, but{" "}
                <strong>only inside MindMelody/Streaming/</strong>, and only
                carrying a small closed mood bucket or plain string and float
                query parameters — never a brain-state type. That narrowing was
                a deliberate, documented decision, not a drift.
              </p>
            </Prose>
          </div>

          <Card className="lg:p-8">
            <h2 className="text-lg font-semibold">
              The single conversion point
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Both streaming integrations funnel through one shared enum with
              four cases. It is the only thing derived from your brain state
              that is ever allowed to cross the network, and it is shared
              precisely so the heuristic cannot quietly diverge between the two
              modules.
            </p>
            <div className="mt-5 rounded-xl bg-surface-2 p-4 font-mono text-sm">
              <div className="text-subtle">{"// MoodCategory.swift"}</div>
              <div className="mt-2 text-fg">.calm</div>
              <div className="text-fg">.energetic</div>
              <div className="text-fg">.focused</div>
              <div className="text-fg">.neutral</div>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-subtle">
              Two continuous axes collapse into two bits. Whatever a search
              request reveals about you, that is the ceiling.
            </p>
          </Card>
        </div>
      </Section>

      <Section id="tests" className="scroll-mt-20 border-y border-border bg-bg-deep">
        <SectionHeading
          eyebrow="Enforcement"
          title="Three tests, not three paragraphs"
          lede="All three are built on a shared source-scanning helper that resolves paths relative to the test file itself, so they behave identically in Xcode, under xcodebuild and in CI."
        />

        <ol className="mt-12 space-y-5">
          {PRIVACY_TESTS.map((test, index) => (
            <li key={test.name}>
              <Card className="lg:p-8">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono text-xs text-subtle">
                    0{index + 1}
                  </span>
                  <h3 className="font-mono text-base font-semibold text-brand">
                    {test.name}
                  </h3>
                </div>
                <p className="mt-3 text-lg font-medium">{test.claim}</p>
                <div className="mt-5 grid gap-6 sm:grid-cols-2">
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-subtle">
                      What it does
                    </h4>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {test.mechanism}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-subtle">
                      Allowlist
                    </h4>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {test.allowlist}
                    </p>
                  </div>
                </div>
              </Card>
            </li>
          ))}
        </ol>

        <p className="mt-8 max-w-3xl text-sm leading-relaxed text-subtle">
          The point of an allowlist with a staleness check is that widening it
          is an explicit, reviewable act. A contributor cannot add a network
          call in a new file and have the suite stay green, and they cannot
          shift an existing allowlisted call to a new line without the
          companion test noticing.
        </p>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Specifics"
          title="What is stored, and what is sent"
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <Card className="lg:p-8">
            <h3 className="text-lg font-semibold">Written to disk</h3>
            <p className="mt-2 text-sm text-muted">
              Exactly three things, each one reviewed and allowlisted:
            </p>
            <ul className="mt-5 space-y-3 text-sm">
              <CheckItem>
                The UUID of the last EEG peripheral, so it can reconnect
              </CheckItem>
              <CheckItem>
                Your preferences — mains frequency, sensitivity, chosen mode
              </CheckItem>
              <CheckItem>
                Curated-track metadata: file references and your energy tags
              </CheckItem>
            </ul>
            <p className="mt-5 text-xs leading-relaxed text-subtle">
              No EEG samples, no band powers, no brain-state history. There is
              no session log to export, because there is no session log.
            </p>
          </Card>

          <Card className="lg:p-8">
            <h3 className="text-lg font-semibold">Sent over the network</h3>
            <p className="mt-2 text-sm text-muted">
              Only when you enable a streaming mode, and only this:
            </p>
            <ul className="mt-5 space-y-3 text-sm">
              <CheckItem>
                A search string derived from one of four mood buckets
              </CheckItem>
              <CheckItem>Anything you type into the manual search box</CheckItem>
              <CheckItem>
                Your own OAuth token or API key, to the service that issued it
              </CheckItem>
            </ul>
            <p className="mt-5 text-xs leading-relaxed text-subtle">
              Spotify tokens are held in memory only and are gone when the app
              exits. Requests go to Spotify and Google respectively — there is
              no MindMelody server in the path, because there is no MindMelody
              server.
            </p>
          </Card>
        </div>

        <Card className="mt-6 lg:p-8">
          <h3 className="text-lg font-semibold">Third-party terms</h3>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted">
            When you connect Spotify or use YouTube search, your interaction
            with those services is governed by their own privacy policies and
            terms — MindMelody cannot make promises on their behalf. Both
            integrations are optional, ship with empty credential placeholders,
            and display a clear &ldquo;not configured&rdquo; state until you
            supply your own. If you never touch them, the app never opens a
            socket.
          </p>
        </Card>
      </Section>

      <Section className="border-t border-border bg-bg-deep">
        <div className="rounded-3xl border border-border bg-surface p-8 sm:p-12">
          <h2 className="text-2xl font-semibold">Not a medical device</h2>
          <Prose className="mt-4 max-w-3xl">
            <p>
              MindMelody does not diagnose, treat, cure, prevent or monitor any
              medical condition, and it is not a wellness claim dressed as an
              app. The valence–arousal signal it computes has never been
              validated against ground-truth EEG recordings — that stage was
              skipped — so the readout should be understood as a control signal
              for an audio engine, and nothing more.
            </p>
            <p>
              Consumer EEG hardware is noisy, electrode contact is fickle, and
              a jaw clench looks a lot like a brainwave. The app is built to
              degrade gracefully around all of that; it is not built to be
              right about you.
            </p>
          </Prose>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/roadmap#caveats" variant="secondary">
              Known caveats
            </ButtonLink>
            <ButtonLink href="/developers" variant="secondary">
              Read the code path yourself
            </ButtonLink>
          </div>
        </div>
      </Section>
    </>
  );
}
