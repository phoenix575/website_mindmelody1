import type { Metadata } from "next";

import { CodeBlock } from "@/components/code-block";
import { PageHero } from "@/components/page-hero";
import {
  Badge,
  Card,
  CheckItem,
  Prose,
  Section,
  SectionHeading,
} from "@/components/ui";

export const metadata: Metadata = {
  title: "Developers",
  description:
    "Build and test MindMelody locally with XcodeGen and xcodebuild, understand the module layout, and configure the optional Spotify and YouTube integrations with your own credentials.",
  alternates: { canonical: "/developers" },
};

const MODULES = [
  {
    path: "MindMelody/App/",
    blurb:
      "App entry point, the composition root that wires everything together, and a small UserDefaults-backed settings object for preferences only.",
  },
  {
    path: "MindMelody/BLE/",
    blurb:
      "The EEGSource protocol and connection states, a CoreBluetooth central, the packet decoder and GATT profile — plus Mock/ for a simulated source and peripheral.",
  },
  {
    path: "MindMelody/DSP/",
    blurb:
      "The signal processor orchestrating filters, FFT, artifact detection and a ring buffer, with the mains notch retunable at runtime.",
  },
  {
    path: "MindMelody/BrainState/",
    blurb:
      "Valence–arousal scoring with a runtime-tunable smoothing constant, and a per-session calibrator using leaky min/max normalization.",
  },
  {
    path: "MindMelody/Audio/",
    blurb:
      "The AVAudioEngine graph, a slew-limited parameter bus, the state-to-audio mapper and the soundscape definition.",
  },
  {
    path: "MindMelody/Music/",
    blurb:
      "Curated local playback: the track store, an interval-gated selector with hysteresis, a second AVAudioEngine with crossfading player nodes, and the library UI.",
  },
  {
    path: "MindMelody/Streaming/",
    blurb:
      "The shared MoodCategory enum and the Spotify and YouTube integrations — the only place in the app permitted to touch a networking API.",
  },
  {
    path: "MindMelody/UI/",
    blurb:
      "SwiftUI views: the session screen, the device scan sheet and settings.",
  },
  {
    path: "MindMelodyTests/",
    blurb:
      "Unit tests split by module, including the three source-scanning privacy tests.",
  },
];

const GENERATE = `# Regenerate the .xcodeproj after editing project.yml
xcodegen generate`;

const BUILD = `xcodebuild -project MindMelody.xcodeproj -scheme MindMelody \\
  -destination 'platform=iOS Simulator,name=iPhone 17' build`;

const TEST = `xcodebuild -project MindMelody.xcodeproj -scheme MindMelody \\
  -destination 'platform=iOS Simulator,name=iPhone 17' test`;

const DEVICES = `xcrun simctl list devices available`;

const ARCHIVE = `xcodebuild -project MindMelody.xcodeproj -scheme MindMelody \\
  -destination 'generic/platform=iOS' archive \\
  -archivePath build/MindMelody.xcarchive \\
  DEVELOPMENT_TEAM=ABCDE12345`;

export default function DevelopersPage() {
  return (
    <>
      <PageHero
        eyebrow="Developers"
        title="Build it, test it, point it at your own credentials"
        lede="MindMelody is a native iOS app for iOS 17 and later, written in Swift and SwiftUI. The Xcode project is generated from project.yml, so the source of truth is a file you can actually review in a diff."
      >
        <div className="flex flex-wrap gap-2">
          <Badge tone="muted">Swift 6.2</Badge>
          <Badge tone="muted">Xcode 26.3</Badge>
          <Badge tone="muted">iOS 17.0+</Badge>
          <Badge tone="muted">XcodeGen</Badge>
        </div>
      </PageHero>

      <Section id="build" className="scroll-mt-20">
        <SectionHeading
          eyebrow="Build & test"
          title="Three commands, no Apple Developer account"
          lede="Debug and simulator builds work with “Sign to Run Locally” — you need an Apple Developer Program Team ID only for archiving, real devices, TestFlight or App Store submission."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <div className="min-w-0 space-y-6">
            <div>
              <h3 className="mb-3 text-sm font-semibold">
                1. Generate the project
              </h3>
              <CodeBlock code={GENERATE} label="xcodegen" />
              <p className="mt-2 text-xs text-subtle">
                Never hand-edit <code className="font-mono">MindMelody.xcodeproj</code>
                . It and <code className="font-mono">Generated/</code> are
                gitignored build artifacts — edit{" "}
                <code className="font-mono">project.yml</code> and regenerate.
              </p>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold">2. Build</h3>
              <CodeBlock code={BUILD} label="build" />
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold">3. Run the tests</h3>
              <CodeBlock code={TEST} label="test" />
              <p className="mt-2 text-xs text-subtle">
                123 tests as of Stage 14, including the privacy invariants.
              </p>
            </div>
          </div>

          <div className="min-w-0 space-y-6">
            <Card>
              <h3 className="font-semibold">If iPhone 17 is not installed</h3>
              <p className="mt-2 text-sm text-muted">
                Use whichever simulator name your machine actually reports:
              </p>
              <div className="mt-4">
                <CodeBlock code={DEVICES} label="simulators" />
              </div>
            </Card>

            <Card>
              <h3 className="font-semibold">Archiving for TestFlight</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                <code className="font-mono">project.yml</code> ships{" "}
                <code className="font-mono">DEVELOPMENT_TEAM: &quot;&quot;</code>{" "}
                as an explicit placeholder. Set a real Team ID in{" "}
                <code className="font-mono">project.yml</code> and regenerate,
                or override it once on the command line:
              </p>
              <div className="mt-4">
                <CodeBlock code={ARCHIVE} label="archive" />
              </div>
              <p className="mt-3 text-xs leading-relaxed text-subtle">
                Draft App Store Connect privacy-questionnaire and reviewer-notes
                content live in <code className="font-mono">PRIVACY_LABEL.md</code>{" "}
                and <code className="font-mono">APP_REVIEW_NOTES.md</code> at the
                repository root.
              </p>
            </Card>

            <Card>
              <h3 className="font-semibold">No headset? No problem.</h3>
              <ul className="mt-4 space-y-3 text-sm">
                <CheckItem>
                  <code className="font-mono">MockEEGSource</code> drives the
                  full pipeline from simulated data
                </CheckItem>
                <CheckItem>
                  <code className="font-mono">SimulatedPeripheral</code> exercises
                  the BLE path without hardware
                </CheckItem>
                <CheckItem>
                  Sources are swapped through one protocol, so nothing
                  downstream can tell the difference
                </CheckItem>
              </ul>
            </Card>
          </div>
        </div>
      </Section>

      <Section className="border-y border-border bg-bg-deep">
        <SectionHeading
          eyebrow="Layout"
          title="Where everything lives"
          lede="Module boundaries follow the signal, so the file you want is usually the stage you are thinking about."
        />
        <dl className="mt-12 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface">
          {MODULES.map((module) => (
            <div
              key={module.path}
              className="grid gap-2 px-6 py-5 sm:grid-cols-[16rem_minmax(0,1fr)] sm:gap-6"
            >
              <dt className="font-mono text-sm text-brand">{module.path}</dt>
              <dd className="text-sm leading-relaxed text-muted">
                {module.blurb}
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section id="integrations" className="scroll-mt-20">
        <SectionHeading
          eyebrow="Optional integrations"
          title="Bring your own credentials"
          lede="Both streaming integrations ship with deliberately empty placeholders — obviously incomplete rather than fake-looking — and degrade to a clear “not configured” state until you fill them in."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <Card className="lg:p-8">
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-semibold">Spotify</h3>
              <Badge tone="accent">Playback + search</Badge>
            </div>
            <Prose className="mt-4 text-sm">
              <p>
                Register an app at the Spotify developer dashboard and fill in{" "}
                <code className="font-mono">SpotifyConfig.clientID</code>. There
                is deliberately <strong>no client secret</strong> — the
                integration uses Authorization Code with PKCE, which does not
                need one, and shipping a secret in a mobile binary would be
                security theatre.
              </p>
              <p>Register both redirect URIs:</p>
            </Prose>
            <ul className="mt-4 space-y-2 font-mono text-xs">
              <li className="rounded-lg bg-surface-2 px-3 py-2">
                mindmelody://spotify-callback
              </li>
              <li className="rounded-lg bg-surface-2 px-3 py-2">
                mindmelody://spotify-pkce-callback
              </li>
            </ul>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              The first covers App Remote playback, the second the Web API
              search login. Both share the{" "}
              <code className="font-mono">mindmelody</code> custom scheme already
              wired into <code className="font-mono">project.yml</code>. Fully
              exercising App Remote needs the Spotify app installed on the test
              device, since it talks to it over IPC; the search login works
              standalone in a web sheet.
            </p>
          </Card>

          <Card className="lg:p-8">
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-semibold">YouTube</h3>
              <Badge tone="warm">Search only</Badge>
            </div>
            <Prose className="mt-4 text-sm">
              <p>
                Create or reuse a Google Cloud Console project, enable{" "}
                <strong>YouTube Data API v3</strong>, create an API key, and put
                it in <code className="font-mono">YouTubeConfig.apiKey</code>.
                Plain API-key auth — no redirect URI or URL-scheme setup needed
                on the app side.
              </p>
              <p>
                This integration is search-and-hand-off by explicit product
                decision. Tapping a result opens{" "}
                <code className="font-mono">
                  youtube.com/watch?v=&lt;id&gt;
                </code>{" "}
                externally via Universal Links — the YouTube app if installed,
                Safari otherwise. There is no embedded player, no scraping and
                no unofficial API.
              </p>
            </Prose>
          </Card>
        </div>

        <Card className="mt-6 border-dashed lg:p-8">
          <h3 className="font-semibold">
            One rule when working in{" "}
            <code className="font-mono text-brand">Streaming/</code>
          </h3>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted">
            Brain-state types cannot appear in this module. Not in a parameter,
            not in a property, not in a type annotation. A test scans the folder
            for <code className="font-mono">BrainState</code>,{" "}
            <code className="font-mono">BandPowerFrame</code> and{" "}
            <code className="font-mono">EEGSampleChunk</code> and fails on any
            match, with no allowlist. Convert to a{" "}
            <code className="font-mono">MoodCategory</code> before you cross the
            boundary — that is what the shared enum is for.
          </p>
        </Card>
      </Section>
    </>
  );
}
