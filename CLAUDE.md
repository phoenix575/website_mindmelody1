# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Status

MindMelody is a native iOS app (Swift/SwiftUI, iOS 17+). The Xcode project is generated from `project.yml` via [XcodeGen](https://github.com/yonaskolb/XcodeGen) — do not hand-edit `MindMelody.xcodeproj`; edit `project.yml` and regenerate instead.

## Build & Test

```sh
# Regenerate the .xcodeproj after editing project.yml
xcodegen generate

# Build (Debug, iOS Simulator)
xcodebuild -project MindMelody.xcodeproj -scheme MindMelody \
  -destination 'platform=iOS Simulator,name=iPhone 17' build

# Run tests
xcodebuild -project MindMelody.xcodeproj -scheme MindMelody \
  -destination 'platform=iOS Simulator,name=iPhone 17' test
```

Use whichever installed simulator name `xcrun simctl list devices available` reports if `iPhone 17` isn't present. Verified with Xcode 26.3 / Swift 6.2, deployment target iOS 17.0.

### Signing for TestFlight / App Store (archiving, real devices)

Debug/Simulator builds above work with no Apple Developer account at all
("Sign to Run Locally"). Archiving or signing for a real device, TestFlight,
or App Store submission additionally requires a real Apple Developer
Program **Team ID**. `project.yml` currently sets `DEVELOPMENT_TEAM: ""` as
an explicit placeholder — before archiving, set it to a real Team ID (found
in the Apple Developer portal or Xcode's Accounts pane), either by editing
`project.yml` and re-running `xcodegen generate`, or via a one-off
command-line override, e.g.:

```sh
xcodebuild -project MindMelody.xcodeproj -scheme MindMelody \
  -destination 'generic/platform=iOS' archive \
  -archivePath build/MindMelody.xcarchive \
  DEVELOPMENT_TEAM=ABCDE12345
```

See `PRIVACY_LABEL.md` and `APP_REVIEW_NOTES.md` at the repo root for draft
App Store Connect privacy-questionnaire and reviewer-notes content prepared
alongside this placeholder (Stage 11).

`MindMelody.xcodeproj/` and `Generated/` (the XcodeGen-generated Info.plist) are gitignored — they're build artifacts, not source of truth.

## Module Layout

- `MindMelody/App/` — app entry point (`MindMelodyApp.swift`), composition root (`AppEnvironment.swift`), and user-facing settings (`AppSettings.swift`, a small `UserDefaults`-backed `ObservableObject` for preferences only — never EEG data)
- `MindMelody/BLE/` — Bluetooth LE EEG ingestion: `EEGSource` (protocol + `EEGSourceConnectionState`, which distinguishes `.connecting` from `.reconnecting`), `EEGPeripheralClient` (CoreBluetooth central), `EEGPacketDecoder`, `GATTProfile` (`Mock/` holds `MockEEGSource` + `SimulatedPeripheral` for development without hardware)
- `MindMelody/DSP/` — on-device signal processing: `EEGSignalProcessor` (orchestrator, runtime-configurable mains-notch frequency via `updateMainsFrequency(_:)`), `Filters.swift`, `FFTProcessor`, `ArtifactDetector`, `RingBuffer` (`Models/` for DSP data types)
- `MindMelody/BrainState/` — `BrainStateEngine` (Valence-Arousal scoring, runtime-configurable smoothing time constant via `updateSmoothingTimeConstant(_:)`) and `Calibrator` (per-session leaky min/max normalization with a ~30s baseline-capture window)
- `MindMelody/Audio/` — adaptive ambient audio engine: `AdaptiveAudioEngine` (AVAudioEngine graph), `AudioParameterBus` (slew-limited target/current parameter state), `StateToAudioMapper` (VA → audio parameters, with a confidence-based glide to a neutral preset for both low per-frame signal quality and sustained source silence/disconnection), `Soundscape`
- `MindMelody/Music/` — Stage 12 curated local-library playback, parallel to (not replacing) `Audio/`'s generative soundscape: `LibraryTrack`/`TrackLibraryStore` (user-imported local audio files + a self-reported `0...1` energy tag, JSON-persisted via `UserDefaults`), `CuratedTrackSelector` (pure arousal→energy mapping plus interval-gated, hysteresis-banded track selection — mirrors `StateToAudioMapper`'s settled-average gating pattern), `CuratedPlaybackEngine` (a second, independent `AVAudioEngine` with two `AVAudioPlayerNode`s for crossfading — mutually exclusive with `AdaptiveAudioEngine`, never both running at once), `MusicLibraryView` (import/tag/delete UI, reachable from Settings). No bundled/licensed music ships with the app; no tempo/BPM detection — energy is a plain user-set slider tag, not a measurement.
- `MindMelody/Streaming/` — Stage 13/14 third-party streaming integrations, the only place in the app allowed to touch a real networking API (see the privacy section below):
  - `MindMelody/Streaming/MoodCategory.swift` — the shared `MoodCategory` enum (`.calm`/`.energetic`/`.focused`/`.neutral`) and its one `BrainState`→bucket heuristic (`category(forValence:arousal:)`). This is the single, lossy conversion point that both integrations below funnel through — the only thing ever derived from `BrainState` that's allowed to cross the network. Shared rather than duplicated per-module so the heuristic can't quietly drift between the two integrations; each module still owns its own search-query-string mapping and its own gating selector (own independent interval/hysteresis state — same reasoning `CuratedTrackSelector` already established as a separate type per playback path).
  - `MindMelody/Streaming/Spotify/` — `SpotifyConfig` (placeholder Client ID + two redirect URLs, deliberately **no client secret** — see its doc comment for why and for setup steps), `SpotifyConnectionManager` (wraps the Spotify iOS SDK's App Remote to authorize/connect to the Spotify app and issue playback commands — playback happens in the external Spotify app itself, not in either of our own `AVAudioEngine` graphs), `SpotifyPKCE` (pure, unit-tested RFC 7636 PKCE verifier/challenge generation + authorize-URL/token-request construction), `SpotifyAuthManager` (`ASWebAuthenticationSession`-driven Authorization Code + PKCE login/refresh for Web API search access, in-memory-only token storage), `SpotifyMoodQuery.swift` (Spotify's query-string mapping + `SpotifyMoodSelector` gating), `SpotifySearchClient` (`URLSession`-based `/v1/search` client taking a caller-supplied access token, pure-parsing-function tested), `SpotifyView` (connect/status UI — both the App Remote playback connection and the separate PKCE search login — auto-mood toggle, manual search).
  - `MindMelody/Streaming/YouTube/` — `YouTubeConfig` (placeholder Data API v3 key — see its doc comment for setup steps), `YouTubeMoodQuery.swift` (YouTube's query-string mapping + `YouTubeMoodSelector` gating), `YouTubeSearchClient` (`URLSession`-based Data API v3 `search` client, pure-parsing-function tested), `YouTubeSearchView` (manual search box and/or mood-auto-populated result list). **Search-and-hand-off only, by explicit product decision**: no in-app video/audio playback, no scraping, no unofficial API — tapping a result opens `https://www.youtube.com/watch?v=<id>` externally (YouTube app if installed, else Safari via Universal Links) rather than playing anything inside MindMelody's own process.
- `MindMelody/UI/` — SwiftUI views: `SessionView` (main screen — source picker, live waveform/band-power/brain-state readouts, calibration badge, a 4-way audio-mode picker — Generative/Curated Library/Spotify/YouTube, mutually exclusive, same atomic-switch discipline as the EEG source picker — and settings entry point), `DeviceScanView` (BLE scan/connect sheet, shows battery + reconnecting state), `SettingsView` (mains frequency, sensitivity, privacy statement) (`ViewModels/` for view models, currently unused — state lives directly in the views)
- `MindMelody/Resources/Audio/` — bundled audio assets
- `MindMelodyTests/` — unit tests, split by module (`DSPTests`, `PacketDecoderTests`, `BrainStateTests`, `AudioTests`, `MusicTests`, `StreamingTests`, `PrivacyTests`)

**Privacy constraint:** **EEG/BrainState data never leaves the phone.** This used to also mean "no networking at all" (true through Stage 12); Stage 13/14's Spotify and YouTube integrations legitimately need real `URLSession` calls, so the invariant has narrowed to its actually-essential form — raw EEG samples and the derived Valence-Arousal `BrainState` are never sent anywhere, never persisted off-device, never leave the process — while networking itself is now permitted, but *only* inside `MindMelody/Streaming/`, and only carrying the small closed `MoodCategory` bucket or plain `String`/`Float` query parameters, never a raw brain-state type. This is CI-enforced, not just a convention to remember, via three tests in `PrivacyTests/` (all built on the shared `PrivacySourceScan.swift` file-scanning helper, resolved via `#filePath`-relative directory resolution so it works under Xcode, `xcodebuild`, or CI alike):
- `NoNetworkingAPITests` scans the whole `MindMelody/` source tree for `URLSession`, `import Network`, `CFNetwork`, or `NWConnection` outside comments, and fails on any match that (a) is outside `MindMelody/Streaming/` entirely, or (b) is inside `Streaming/` but not one of its explicit, human-reviewed allowlist entries (currently: `SpotifySearchClient`'s and `YouTubeSearchClient`'s respective `URLSession` usage) — mirrors `NoRawEEGPersistenceTests`' allowlist-with-staleness-check pattern (a companion test confirms every allowlist entry still matches real source, catching line-number drift).
- `NoRawBrainStateInStreamingTests` is the automated codification of the actually-critical half of the promise: it scans `MindMelody/Streaming/` for any direct reference to `BrainState`, `BandPowerFrame`, or `EEGSampleChunk` outside comments and fails on any match at all (no allowlist — there is no legitimate reason for these types to appear in this module). This is what guards against a future PR quietly adding e.g. a search function that takes a raw `BrainState` parameter and having it compile.
- `NoRawEEGPersistenceTests` scans for `UserDefaults`/`FileManager`/`.write(to:` call sites and fails on any that aren't on its explicit, human-reviewed allowlist (currently: `EEGPeripheralClient`'s peripheral-UUID persistence, `AppSettings`'s preference persistence, and `TrackLibraryStore`'s curated-track metadata persistence) — a new disk-write call touching EEG/brain-state data will fail this test until explicitly reviewed and added.

### Spotify / YouTube setup (optional — both integrations degrade to a clear "not configured" state without these)

Both integrations ship with deliberately empty placeholder credentials, the same precedent as `project.yml`'s `DEVELOPMENT_TEAM: ""` — obviously incomplete rather than fake-looking, so it's clear at a glance that real values are still needed:
- **Spotify**: register an app at https://developer.spotify.com/dashboard, fill in `SpotifyConfig.clientID` (no secret — this integration uses Authorization Code + PKCE, which needs none, see `SpotifyConfig.swift`'s doc comment) and register both `redirectURL` (`mindmelody://spotify-callback`, App Remote playback) and `pkceRedirectURL` (`mindmelody://spotify-pkce-callback`, Web API search login) as Redirect URIs — both already share the `mindmelody` custom scheme wired into `project.yml`'s `CFBundleURLTypes`. See `SpotifyConfig.swift`'s doc comment for the full walkthrough. Requires the Spotify app installed on the test device to fully exercise App Remote playback (it talks to it over IPC); search login works standalone via a web sheet.
- **YouTube**: create/reuse a Google Cloud Console project, enable "YouTube Data API v3," create an API key, and fill it into `YouTubeConfig.apiKey`. See `YouTubeConfig.swift`'s doc comment for the full walkthrough. No app-side redirect/URL-scheme setup needed (plain API-key auth).

## Status: v1 build complete (Stage 6, the final planned stage)

Stages 0-6 are done: project scaffold, mock EEG source, on-device DSP pipeline, VA brain-state scoring, adaptive generative audio with closed-loop feedback, real CoreBluetooth BLE ingestion, and this stage's robustness/polish/privacy-CI pass (low-signal audio decay on sustained disconnection, a genuine "reconnecting" connection state surfaced in the UI, battery readout, a calibration-window UI indicator, a Settings screen, and the `PrivacyTests` described above). A v2 phase — a curated, licensed song library layered on top of (or as an alternative to) the generative soundscape — was explicitly scoped out of v1 and is not built here; if picked up later it's a new stage, not an extension of any module listed above.

Since v1, further stages have shipped: Stage 7 (BLE dev tools), Stage 8
(audio session interruption/route-change robustness), Stage 10 (bounded
audio quality pass), and Stage 11 (TestFlight/distribution readiness — app
icon, launch screen, and the signing/privacy/review-notes documentation
referenced above). 71 tests pass as of Stage 11.

Stage 12 (v2, built on explicit request despite the brain-state signal
never having been validated against real EEG — Stage 9 was skipped) adds
the curated local-song-library playback mode described under
`MindMelody/Music/` above, as a `SessionView` mode toggle parallel to (not
replacing) the generative soundscape. 90 tests pass as of Stage 12.

Stage 13 adds the Spotify integration (`MindMelody/Streaming/Spotify/`) and
Stage 14 adds the YouTube search-and-hand-off integration
(`MindMelody/Streaming/YouTube/`) described above, as two more `SessionView`
mode-picker options. These are this project's first legitimate networking
code, which is why the privacy section above changed from a blanket
"no networking" ban to a narrower, still-CI-enforced "EEG/BrainState data
never leaves the phone, networking is otherwise confined to
`MindMelody/Streaming/`" invariant — see `PRIVACY_LABEL.md` and
`APP_REVIEW_NOTES.md` for the accompanying App Store Connect documentation
updates. 123 tests pass as of Stage 14.
