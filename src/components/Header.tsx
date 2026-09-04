"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE } from "@/lib/site";

export default function Header() {
  const pathname = usePathname();
  const onAdmin = pathname.startsWith("/admin");

  return (
    <header className="site-header">
      <div className="site-wrap header-inner">
        <Link href="/" className="brand" aria-label="EXPal home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/expal-logo.svg" alt="" width={40} height={40} />
          <span>
            EX<span>Pal</span>
            <small>{SITE.tagline}</small>
          </span>
        </Link>
        <nav className="nav" aria-label="Primary">
          <Link href="/#features" className={pathname === "/" ? "active" : ""}>
            Features
          </Link>
          <Link href="/#blog" className={pathname.startsWith("/blog") ? "active" : ""}>
            Blog
          </Link>
          <Link href="/blog">Guides</Link>
          {SITE.appUrl ? (
            <a className="btn btn-ghost" href={SITE.appUrl}>
              Open app
            </a>
          ) : null}
          {onAdmin ? (
            <Link className="btn" href="/admin">
              Writer
            </Link>
          ) : (
            <Link className="btn" href="/#blog">
              Read stories
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
