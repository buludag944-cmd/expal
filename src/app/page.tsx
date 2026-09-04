import type { Metadata } from "next";
import Link from "next/link";
import BlogSection from "@/components/BlogSection";
import JsonLd from "@/components/JsonLd";
import { listPosts } from "@/lib/posts";
import { websiteJsonLd } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `${SITE.name} — ${SITE.tagline}`,
  description: SITE.description,
  alternates: { canonical: "/" },
};

const FEATURES = [
  {
    title: "Housing with expat-friendly filters",
    body: "Find rooms and homes from people who understand deposits, references, and arriving mid-lease.",
  },
  {
    title: "Visa & IRP tracking",
    body: "Clear pathways for Stamp 1, Stamp 4, and what a job change can mean for your permission to stay.",
  },
  {
    title: "Community & local know-how",
    body: "Events, threads, and lived advice so you are not piecing Dublin together from ten WhatsApp groups.",
  },
  {
    title: "Referrals that actually open doors",
    body: "Reach people already inside the companies you want — because a warm intro still beats a cold CV.",
  },
];

export default async function HomePage() {
  const posts = (await listPosts()).slice(0, 3);

  return (
    <>
      <JsonLd data={websiteJsonLd()} />
      <section className="hero">
        <div className="site-wrap hero-copy">
          <p className="eyebrow" style={{ color: "#7ecef4" }}>
            {SITE.tagline}
          </p>
          <h1>
            Relocate smarter.
            <br />
            Settle faster.
            <br />
            Thrive longer.
          </h1>
          <p>
            Everything an expat actually needs — housing, visa guidance, community,
            and job referrals — with public guides you can read before you ever
            create an account.
          </p>
          <div className="hero-actions">
            <Link className="btn" href="#blog">
              Browse the blog
            </Link>
            <a
              className="btn btn-secondary"
              href={SITE.appUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Join EXPal
            </a>
          </div>
          <div className="pills" aria-label="Product highlights">
            <span className="pill">Housing</span>
            <span className="pill">Visa & IRP</span>
            <span className="pill">Community</span>
            <span className="pill">Referrals</span>
          </div>
        </div>
      </section>

      <section id="features" className="section">
        <div className="site-wrap">
          <div className="section-head">
            <p className="eyebrow">Built for the move</p>
            <h2>One place for the messy middle of starting over</h2>
            <p className="lede">
              EXPal is free. The landing page and journal stay public so search
              engines — and people still planning a move — can find help without a
              login wall.
            </p>
          </div>
          <div className="feature-grid">
            {FEATURES.map((feature) => (
              <article className="feature-card" key={feature.title}>
                <h3>{feature.title}</h3>
                <p className="muted">{feature.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <BlogSection posts={posts} />

      <section className="cta-band">
        <div className="site-wrap">
          <p className="eyebrow" style={{ color: "#7ecef4" }}>
            No account needed to read
          </p>
          <h2>Land on EXPal. Learn. Join when you are ready.</h2>
          <p className="lede" style={{ color: "rgba(255,255,255,0.78)" }}>
            Articles are indexed for search. The community app stays optional until
            you want housing listings, messages, or referrals.
          </p>
          <div className="hero-actions" style={{ marginTop: "1.25rem" }}>
            <Link className="btn" href="/blog">
              Open the journal
            </Link>
            <a
              className="btn btn-secondary"
              href={SITE.appUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Join the app
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
