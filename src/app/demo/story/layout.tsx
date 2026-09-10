import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LinkedIn story",
  description: "Personal 4:5 EXPal story cut for LinkedIn — Bahar built this.",
  robots: { index: false, follow: false },
};

export default function StoryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
