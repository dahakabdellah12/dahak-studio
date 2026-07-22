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
            width: "140px",
            height: "140px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "12px",
            border: "1.5px solid rgba(0,240,255,0.3)",
            backgroundColor: "rgba(0,240,255,0.08)",
            position: "relative",
          }}
        >
          <span
            style={{
              fontSize: "80px",
              fontWeight: "bold",
              color: "#00f0ff",
              fontFamily: "system-ui, sans-serif",
            }}
          >
            D
          </span>
          {/* Corner TL */}
          <div
            style={{
              position: "absolute",
              top: "-2px",
              left: "-2px",
              width: "10px",
              height: "10px",
              borderTop: "2px solid rgba(0,240,255,0.6)",
              borderLeft: "2px solid rgba(0,240,255,0.6)",
            }}
          />
          {/* Corner BR */}
          <div
            style={{
              position: "absolute",
              bottom: "-2px",
              right: "-2px",
              width: "10px",
              height: "10px",
              borderBottom: "2px solid rgba(0,240,255,0.6)",
              borderRight: "2px solid rgba(0,240,255,0.6)",
            }}
          />
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
