import { ImageResponse } from "next/og";

import { SITE_NAME, SITE_TAGLINE } from "@/lib/site";

export const alt = `${SITE_NAME} — ${SITE_TAGLINE}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background:
            "linear-gradient(135deg, #05070e 0%, #0e1327 55%, #10262c 100%)",
          color: "#e9ecf8",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: "linear-gradient(135deg, #7c5cff, #3fd0c0)",
            }}
          />
          <div style={{ fontSize: 30, fontWeight: 600, letterSpacing: -0.5 }}>
            {SITE_NAME}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 74,
              fontWeight: 700,
              lineHeight: 1.08,
              letterSpacing: -2,
              maxWidth: 900,
            }}
          >
            Music that listens to your head.
          </div>
          <div style={{ fontSize: 30, color: "#a2abc6", maxWidth: 880 }}>
            On-device EEG → valence–arousal → adaptive audio. Your brain data
            never leaves the phone.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 14,
            fontSize: 22,
            color: "#7d86a3",
          }}
        >
          <span>iOS 17+</span>
          <span>·</span>
          <span>Swift &amp; SwiftUI</span>
          <span>·</span>
          <span>Privacy enforced in CI</span>
        </div>
      </div>
    ),
    size,
  );
}
