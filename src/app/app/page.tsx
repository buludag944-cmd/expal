import type { Metadata } from "next";
import ExpalApp from "@/mobile/ExpalApp";

export const metadata: Metadata = {
  title: "Mobile app",
  description:
    "The EXPal mobile app — home, explore, community, visa tracker, and profile for life in Dublin.",
};

export default function MobileAppPage() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        minHeight: "100dvh",
        background: "#ececef",
        display: "grid",
        placeItems: "center",
      }}
    >
      <div
        style={{
          width: "min(430px, 100%)",
          height: "100dvh",
          maxHeight: "932px",
          background: "#f3f3f5",
          boxShadow: "0 20px 60px rgba(28,28,30,0.18)",
        }}
      >
        <ExpalApp />
      </div>
    </div>
  );
}
