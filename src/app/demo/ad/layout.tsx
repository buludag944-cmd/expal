import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Marketing cut",
  description: "Vertical 9:16 EXPal marketing walkthrough for Play Store and social.",
  robots: { index: false, follow: false },
};

export default function MarketingAdLayout({ children }: { children: React.ReactNode }) {
  return children;
}
