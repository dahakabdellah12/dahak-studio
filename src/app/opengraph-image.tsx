import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "DAHAK Studio - Software Developer Portfolio";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0a1a",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: "72px",
            fontWeight: "bold",
            fontFamily: "monospace",
            color: "#00f0ff",
          }}
        >
          DAHAK STUDIO
        </div>
        <div
          style={{
            display: "flex",
            fontSize: "24px",
            color: "rgba(255,255,255,0.6)",
            marginTop: "20px",
            fontFamily: "monospace",
          }}
        >
          Software Developer Portfolio
        </div>
        <div
          style={{
            display: "flex",
            width: "300px",
            height: "2px",
            marginTop: "28px",
            backgroundColor: "#00f0ff",
          }}
        />
        <div
          style={{
            display: "flex",
            fontSize: "16px",
            fontFamily: "monospace",
            color: "rgba(0,240,255,0.4)",
            marginTop: "20px",
          }}
        >
          Desktop / Mobile / Games / Open Source
        </div>
        {/* Corner TL */}
        <div
          style={{
            position: "absolute",
            top: "32px",
            left: "32px",
            width: "40px",
            height: "40px",
            borderTop: "2px solid #00f0ff",
            borderLeft: "2px solid #00f0ff",
            opacity: 0.3,
          }}
        />
        {/* Corner TR */}
        <div
          style={{
            position: "absolute",
            top: "32px",
            right: "32px",
            width: "40px",
            height: "40px",
            borderTop: "2px solid #ff2a6d",
            borderRight: "2px solid #ff2a6d",
            opacity: 0.3,
          }}
        />
        {/* Corner BL */}
        <div
          style={{
            position: "absolute",
            bottom: "32px",
            left: "32px",
            width: "40px",
            height: "40px",
            borderBottom: "2px solid #ff2a6d",
            borderLeft: "2px solid #ff2a6d",
            opacity: 0.3,
          }}
        />
        {/* Corner BR */}
        <div
          style={{
            position: "absolute",
            bottom: "32px",
            right: "32px",
            width: "40px",
            height: "40px",
            borderBottom: "2px solid #00f0ff",
            borderRight: "2px solid #00f0ff",
            opacity: 0.3,
          }}
        />
      </div>
    ),
    { ...size }
  );
}
