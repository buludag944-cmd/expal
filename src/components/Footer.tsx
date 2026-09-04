import Link from "next/link";
import { SITE } from "@/lib/site";

export default function Footer() {
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
          <Link href="/admin">Write a post</Link>
          <a href={SITE.appUrl} target="_blank" rel="noopener noreferrer">
            Join EXPal
          </a>
        </div>
        <p className="muted app-id">
          {SITE.appId} · {SITE.appUrl.replace(/^https?:\/\//, "")}
        </p>
      </div>
    </footer>
  );
}
