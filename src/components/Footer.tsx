"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE } from "@/lib/site";

export default function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/app") || pathname.startsWith("/demo")) return null;

  return (
    <footer className="site-footer">
      <div className="site-wrap footer-inner">
        <div>
          <p className="brand-text">
            EX<span>Pal</span>
          </p>
          <p className="muted">{SITE.tagline}. Completely free.</p>
        </div>
        <div className="footer-links">
          <Link href="/">Home</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/#features">Features</Link>
          <Link href="/login">Log in</Link>
          <Link href="/signup">Sign up</Link>
          <Link href="/app">Mobile app</Link>
          <Link href="/admin">Write a post</Link>
        </div>
        <p className="muted app-id">
          {SITE.appId} · {SITE.appUrl.replace(/^https?:\/\//, "")}
        </p>
      </div>
    </footer>
  );
}
