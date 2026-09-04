import type { Metadata } from "next";
import BlogCard from "@/components/BlogCard";
import { listPosts } from "@/lib/posts";
import { SITE } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Expat guides & stories",
  description:
    "Public EXPal articles on Irish housing, visas, jobs, and settling in — readable without an account.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "EXPal journal",
    description:
      "Guides for expats in Ireland. No login required.",
    url: `${SITE.url}/blog`,
    type: "website",
  },
};

export default async function BlogIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const query = q.trim().toLowerCase();
  const posts = await listPosts();
  const filtered = query
    ? posts.filter((post) =>
        [post.title, post.excerpt, post.content, post.tags.join(" ")]
          .join(" ")
          .toLowerCase()
          .includes(query),
      )
    : posts;

  return (
    <div className="section">
      <div className="site-wrap">
        <div className="section-head">
          <p className="eyebrow">Journal</p>
          <h1 className="page-title">Stories that help you settle</h1>
          <p className="lede">
            Every article is public. Share a link, rank on Google, or read on the
            bus — no EXPal account required.
          </p>
        </div>
        <form className="search-bar" action="/blog" method="get">
          <label htmlFor="q">Search articles</label>
          <input
            id="q"
            name="q"
            defaultValue={q}
            placeholder="Housing, Stamp 4, referrals…"
          />
        </form>
        {filtered.length === 0 ? (
          <p className="muted">No matching articles yet.</p>
        ) : (
          <div className="blog-grid">
            {filtered.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
