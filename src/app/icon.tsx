import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";
export const rel = "apple-touch-icon";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "180px",
          height: "180px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0a1a",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            border: "1px solid rgba(0,240,255,0.3)",
            borderRadius: "20px",
          }}
        />
        <svg width="100" height="100" viewBox="0 0 32 32">
          <path
            d="M8 8h10a6 6 0 0 1 0 12H8V8z"
            fill="none"
            stroke="#00f0ff"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line
            x1="8" y1="8" x2="8" y2="24"
            stroke="#00f0ff"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle cx="16" cy="14" r="1.2" fill="#00f0ff" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
