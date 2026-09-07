import Link from "next/link";

export default function NotFound() {
  return (
    <div className="section">
      <div className="site-wrap">
        <h1 className="page-title">That page is not here</h1>
        <p className="lede">The journal is public — try the landing page or the full article list.</p>
        <div className="hero-actions" style={{ marginTop: "1.2rem" }}>
          <Link className="btn" href="/">
            Back to EXPal
          </Link>
          <Link className="btn btn-secondary" href="/blog">
            Browse articles
          </Link>
        </div>
      </div>
    </div>
  );
}
