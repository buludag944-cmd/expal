import { ImageResponse } from "next/og";

export const alt = "EXPal — Your friend away from home";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "linear-gradient(160deg, #e8473a 0%, #c93b55 40%, #7b4f8e 75%, #3b4fa0 100%)",
          color: "white",
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: 6, textTransform: "uppercase", opacity: 0.8 }}>
          Your friend away from home
        </div>
        <div style={{ fontSize: 88, fontWeight: 800, marginTop: 16 }}>
          EXPal
        </div>
        <div style={{ fontSize: 32, marginTop: 12, maxWidth: 800 }}>
          Public guides for housing, visas, work, and settling in.
        </div>
      </div>
    ),
    size,
  );
}
