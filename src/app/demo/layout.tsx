import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mobile walkthrough",
  description: "Watch the EXPal mobile app: home, explore, visa tracker, community, and profile.",
};

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
