/**
 * Site content, derived from the MindMelody engineering spec (CLAUDE.md).
 *
 * Kept as plain data so pages stay presentational and so a single factual
 * change (a new stage, a renamed module) lands in exactly one place.
 */

/* ------------------------------------------------------------------ */
/* Signal pipeline                                                     */
/* ------------------------------------------------------------------ */

export type PipelineStage = {
  id: string;
  module: string;
  title: string;
  summary: string;
  detail: string;
  bullets: string[];
};

export const PIPELINE: PipelineStage[] = [
  {
    id: "ingest",
    module: "MindMelody/BLE",
    title: "Ingest",
    summary: "Bluetooth LE EEG in, sample chunks out.",
    detail:
      "A CoreBluetooth central connects to a consumer EEG headband, subscribes to its notify characteristic and decodes the vendor packet format into timestamped sample chunks. A mock source runs the whole pipeline with no hardware attached.",
    bullets: [
      "EEGSource protocol — one interface, real or simulated, swapped atomically",
      "EEGSourceConnectionState separates .connecting from .reconnecting so the UI can tell the difference",
      "EEGPacketDecoder + GATTProfile handle framing, sequence gaps and battery readout",
      "MockEEGSource and SimulatedPeripheral for development without a headset",
    ],
  },
  {
    id: "dsp",
    module: "MindMelody/DSP",
    title: "Process",
    summary: "Filter, de-artifact, transform.",
    detail:
      "Raw samples flow through a fixed-latency ring buffer into a band-pass and mains notch filter, an artifact detector that flags blinks and clenches, and an FFT that produces per-band power frames.",
    bullets: [
      "EEGSignalProcessor orchestrates the chain and retunes the mains notch at runtime (50 Hz / 60 Hz)",
      "ArtifactDetector gates bad frames instead of letting them steer the audio",
      "FFTProcessor emits delta / theta / alpha / beta / gamma band power",
      "RingBuffer keeps allocation off the audio-adjacent path",
    ],
  },
  {
    id: "state",
    module: "MindMelody/BrainState",
    title: "Score",
    summary: "Band power becomes a point on the valence–arousal plane.",
    detail:
      "A per-session calibrator learns your personal range with leaky min/max normalization over a ~30 second baseline window, then the engine emits a smoothed valence–arousal estimate with a per-frame confidence value.",
    bullets: [
      "BrainStateEngine scores continuous valence and arousal, not discrete labels",
      "Calibrator normalizes per session — everyone's alpha is different",
      "Smoothing time constant is tunable at runtime from Settings",
      "Confidence falls with artifacts, low signal quality or a silent source",
    ],
  },
  {
    id: "audio",
    module: "MindMelody/Audio",
    title: "Respond",
    summary: "State drives sound, sound changes state, loop.",
    detail:
      "The mapper turns a brain state into audio parameters — layer gains, filter cutoff, density, reverb — and a slew-limited parameter bus glides toward them so nothing ever steps. Lose the signal and the mix glides back to a neutral preset rather than freezing.",
    bullets: [
      "AdaptiveAudioEngine drives an AVAudioEngine graph with no audible discontinuities",
      "AudioParameterBus enforces slew limits between target and current values",
      "StateToAudioMapper glides to neutral on low confidence or sustained silence",
      "Survives audio-session interruptions and route changes (calls, unplugged headphones)",
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Playback modes                                                      */
/* ------------------------------------------------------------------ */

export type PlaybackMode = {
  id: string;
  name: string;
  tagline: string;
  module: string;
  description: string;
  points: string[];
  network: "None — fully on-device" | "Search requests only";
  status: string;
};

export const PLAYBACK_MODES: PlaybackMode[] = [
  {
    id: "generative",
    name: "Generative",
    tagline: "An ambient bed synthesized on the fly.",
    module: "MindMelody/Audio",
    description:
      "The original mode and the only one with a true closed loop. Layers of an ambient soundscape are mixed, filtered and spatialized continuously from your live brain state — there are no tracks to skip because nothing is pre-rendered.",
    points: [
      "Continuous parameter control, not playlist switching",
      "Slew-limited so every change is a glide, never a jump",
      "Falls back to a neutral preset when confidence drops",
      "Works with the mock source, so you can hear it with no headset",
    ],
    network: "None — fully on-device",
    status: "Shipped in v1 (Stage 4), refined in Stages 8 and 10",
  },
  {
    id: "curated",
    name: "Curated library",
    tagline: "Your own files, matched to your arousal.",
    module: "MindMelody/Music",
    description:
      "Import local audio files, tag each with a plain 0–1 energy slider, and MindMelody picks from your own library as your arousal moves. Two player nodes crossfade so transitions stay smooth.",
    points: [
      "You import the files — no music ships with the app, nothing is licensed on your behalf",
      "Energy is a self-reported tag, not a BPM measurement — MindMelody does no tempo detection",
      "Interval-gated with hysteresis bands so it will not thrash between tracks",
      "Runs on its own AVAudioEngine, mutually exclusive with the generative mode",
    ],
    network: "None — fully on-device",
    status: "Shipped in Stage 12",
  },
  {
    id: "spotify",
    name: "Spotify",
    tagline: "Hand the mood to a service you already pay for.",
    module: "MindMelody/Streaming/Spotify",
    description:
      "Authorize with the Spotify app, and MindMelody issues playback commands over the App Remote while a separate PKCE login covers Web API search. Audio plays in Spotify itself — never inside MindMelody's own audio graph.",
    points: [
      "Authorization Code + PKCE — the app ships no client secret, because it needs none",
      "Access tokens are held in memory only, never written to disk",
      "Only a coarse mood bucket is turned into a search string — never a brain state",
      "Requires your own Client ID; without one the screen says so plainly",
    ],
    network: "Search requests only",
    status: "Shipped in Stage 13",
  },
  {
    id: "youtube",
    name: "YouTube",
    tagline: "Search and hand off. Deliberately nothing more.",
    module: "MindMelody/Streaming/YouTube",
    description:
      "A mood-populated search against the official YouTube Data API v3. Tapping a result opens the video in the YouTube app or Safari. There is no in-app playback, no scraping and no unofficial API — an explicit product decision, not a missing feature.",
    points: [
      "Official Data API v3 only, plain API-key auth",
      "Opens youtube.com/watch?v=… externally via Universal Links",
      "Manual search box as well as mood-driven results",
      "Requires your own API key; without one the screen says so plainly",
    ],
    network: "Search requests only",
    status: "Shipped in Stage 14",
  },
];

/* ------------------------------------------------------------------ */
/* Privacy                                                             */
/* ------------------------------------------------------------------ */

export type PrivacyTest = {
  name: string;
  claim: string;
  mechanism: string;
  allowlist: string;
};

export const PRIVACY_TESTS: PrivacyTest[] = [
  {
    name: "NoNetworkingAPITests",
    claim: "Networking exists in exactly one folder.",
    mechanism:
      "Scans the whole MindMelody/ source tree for URLSession, import Network, CFNetwork and NWConnection outside comments, and fails on any match found outside MindMelody/Streaming/ — or inside it but not on the reviewed allowlist.",
    allowlist:
      "SpotifySearchClient and YouTubeSearchClient. A companion test re-checks that every allowlist entry still matches real source, so line-number drift fails loudly instead of silently widening the hole.",
  },
  {
    name: "NoRawBrainStateInStreamingTests",
    claim: "Brain-state types cannot reach the network layer.",
    mechanism:
      "Scans MindMelody/Streaming/ for any reference to BrainState, BandPowerFrame or EEGSampleChunk outside comments and fails on any match at all.",
    allowlist:
      "None, by design. There is no legitimate reason for these types to appear in this module, so a future change that adds a search function taking a raw BrainState will not compile past CI.",
  },
  {
    name: "NoRawEEGPersistenceTests",
    claim: "Nothing writes EEG data to disk.",
    mechanism:
      "Scans for UserDefaults, FileManager and .write(to:) call sites and fails on any that are not explicitly reviewed.",
    allowlist:
      "Peripheral-UUID persistence in EEGPeripheralClient, preference persistence in AppSettings, and curated-track metadata in TrackLibraryStore. A new disk write touching brain data fails the suite until a human adds it.",
  },
];

export const PRIVACY_FACTS = [
  {
    label: "Raw EEG samples",
    value: "Never leave the process",
    tone: "good" as const,
  },
  {
    label: "Valence–arousal state",
    value: "Never leave the process",
    tone: "good" as const,
  },
  {
    label: "Accounts required",
    value: "None for core use",
    tone: "good" as const,
  },
  {
    label: "Analytics / telemetry SDKs",
    value: "Zero",
    tone: "good" as const,
  },
  {
    label: "Streaming search requests",
    value: "A mood word and your query",
    tone: "neutral" as const,
  },
];

/* ------------------------------------------------------------------ */
/* Roadmap                                                             */
/* ------------------------------------------------------------------ */

export type Stage = {
  id: string;
  title: string;
  status: "shipped" | "skipped" | "open";
  summary: string;
};

export const STAGES: Stage[] = [
  {
    id: "Stages 0–3",
    title: "Scaffold, mock source, DSP, brain state",
    status: "shipped",
    summary:
      "XcodeGen project scaffold, a mock EEG source, the on-device filtering and FFT pipeline, and valence–arousal scoring with per-session calibration.",
  },
  {
    id: "Stage 4",
    title: "Adaptive generative audio",
    status: "shipped",
    summary:
      "The AVAudioEngine graph, the slew-limited parameter bus and the state-to-audio mapper — the closed loop that makes the app an instrument rather than a monitor.",
  },
  {
    id: "Stage 5",
    title: "Real CoreBluetooth ingestion",
    status: "shipped",
    summary:
      "The mock source gets a real sibling: a CoreBluetooth central, packet decoder and GATT profile talking to actual EEG hardware.",
  },
  {
    id: "Stage 6",
    title: "Robustness, polish, privacy CI",
    status: "shipped",
    summary:
      "Low-signal audio decay, a genuine reconnecting state in the UI, battery readout, a calibration indicator, a Settings screen, and the first source-scanning privacy tests. v1 complete.",
  },
  {
    id: "Stage 7",
    title: "BLE developer tools",
    status: "shipped",
    summary: "Instrumentation for debugging real headsets in the field.",
  },
  {
    id: "Stage 8",
    title: "Audio session robustness",
    status: "shipped",
    summary:
      "Interruption and route-change handling — phone calls, unplugged headphones and Bluetooth handoffs no longer strand the engine.",
  },
  {
    id: "Stage 9",
    title: "Validation against real EEG",
    status: "skipped",
    summary:
      "Never carried out. The brain-state signal has not been validated against ground-truth EEG recordings, which is the single largest open caveat in the project.",
  },
  {
    id: "Stage 10",
    title: "Bounded audio quality pass",
    status: "shipped",
    summary: "A time-boxed pass on the sound of the generative mode itself.",
  },
  {
    id: "Stage 11",
    title: "Distribution readiness",
    status: "shipped",
    summary:
      "App icon, launch screen, and the signing, privacy-label and review-notes documentation needed for TestFlight. 71 tests passing.",
  },
  {
    id: "Stage 12",
    title: "Curated local library (v2)",
    status: "shipped",
    summary:
      "Import-and-tag local playback as a parallel mode to the generative soundscape. 90 tests passing.",
  },
  {
    id: "Stage 13",
    title: "Spotify integration",
    status: "shipped",
    summary:
      "App Remote playback plus PKCE search login — the project's first networking code, and the reason the privacy invariant was narrowed and re-enforced rather than dropped.",
  },
  {
    id: "Stage 14",
    title: "YouTube search and hand-off",
    status: "shipped",
    summary:
      "Official Data API v3 search that opens results externally. 123 tests passing.",
  },
];

/* ------------------------------------------------------------------ */
/* FAQ                                                                 */
/* ------------------------------------------------------------------ */

export type Faq = { question: string; answer: string };

export const FAQS: Faq[] = [
  {
    question: "Can I use MindMelody without an EEG headset?",
    answer:
      "Yes. A mock source drives the full pipeline — DSP, brain-state scoring, audio adaptation — from simulated data, so you can build, run and hear the app with nothing attached. It is how most of the app was developed.",
  },
  {
    question: "Does any of my brain data go to the cloud?",
    answer:
      "No. Raw EEG samples and the derived valence–arousal state never leave the process — not to a server, not to disk, not to an analytics SDK. Three source-scanning tests fail the build if a change tries to make it otherwise.",
  },
  {
    question: "Then what do the Spotify and YouTube modes send?",
    answer:
      "A single coarse mood bucket — calm, energetic, focused or neutral — converted into an ordinary search string, plus anything you type into the manual search box. That bucket is the one lossy conversion point both integrations share, and raw brain-state types are barred from the networking module entirely.",
  },
  {
    question: "Is this a medical or diagnostic device?",
    answer:
      "No. MindMelody is a consumer audio experiment. It does not diagnose, treat or monitor any condition, and the valence–arousal signal has not been validated against ground-truth EEG recordings — the validation stage was skipped. Treat the readout as an interesting control signal, not a measurement.",
  },
  {
    question: "Which headsets are supported?",
    answer:
      "Any consumer EEG peripheral whose notify characteristic matches the GATT profile the packet decoder targets. The BLE layer is written against a protocol, so adding a device means adding a decoder, not rewriting the pipeline.",
  },
  {
    question: "Where can I download it?",
    answer:
      "Nowhere yet. The app is TestFlight-ready — icon, launch screen, privacy label and reviewer notes are prepared — but the project ships with an empty DEVELOPMENT_TEAM placeholder rather than a real Apple Developer Team ID, so no signed build has been distributed. Building from source on a simulator needs no Apple account at all.",
  },
  {
    question: "Does the curated mode detect tempo or BPM?",
    answer:
      "No, and that is deliberate. Energy is a plain slider tag you set per track when you import it. There is no analysis of the audio content, which keeps the feature honest about what it actually knows.",
  },
];

/* ------------------------------------------------------------------ */
/* Mood model (mirrors MoodCategory.category(forValence:arousal:))      */
/* ------------------------------------------------------------------ */

export type MoodCategory = "calm" | "energetic" | "focused" | "neutral";

/**
 * Illustrative port of the app's single BrainState → bucket heuristic.
 * The real implementation lives in MindMelody/Streaming/MoodCategory.swift;
 * this copy exists only to make the explorer on the site behave like it.
 *
 * `valence` and `arousal` are both in -1...1.
 */
export function moodCategory(valence: number, arousal: number): MoodCategory {
  const deadzone = 0.2;
  if (Math.abs(valence) < deadzone && Math.abs(arousal) < deadzone) {
    return "neutral";
  }
  if (arousal >= deadzone) {
    return valence >= 0 ? "energetic" : "focused";
  }
  if (arousal <= -deadzone) {
    return valence >= 0 ? "calm" : "neutral";
  }
  return valence >= 0 ? "calm" : "focused";
}

export const MOOD_COPY: Record<
  MoodCategory,
  { label: string; blurb: string; query: string }
> = {
  calm: {
    label: "Calm",
    blurb:
      "Positive and settled. The generative mix thins out, the filter closes and reverb opens up.",
    query: "calm ambient",
  },
  energetic: {
    label: "Energetic",
    blurb:
      "Positive and activated. Density and brightness climb; the curated selector reaches for higher-energy tags.",
    query: "upbeat energetic",
  },
  focused: {
    label: "Focused",
    blurb:
      "Activated but not especially pleasant — the concentration corner. Steady, low-distraction texture.",
    query: "focus concentration instrumental",
  },
  neutral: {
    label: "Neutral",
    blurb:
      "Near the origin, or the state the app glides to whenever confidence drops or the source goes quiet.",
    query: "chill instrumental",
  },
};
