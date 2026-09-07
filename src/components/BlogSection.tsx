import Link from "next/link";
import type { BlogPost } from "@/lib/posts";
import BlogCard from "./BlogCard";

export default function BlogSection({ posts }: { posts: BlogPost[] }) {
  return (
    <section id="blog" className="section blog-section">
      <div className="site-wrap">
        <div className="section-head">
          <p className="eyebrow">From the EXPal journal</p>
          <h2>Guides for life abroad — no login required</h2>
          <p className="lede">
            Practical writing on housing, visas, work, and community. Open any
            article from Google or a shared link without creating an account.
          </p>
        </div>
        {posts.length === 0 ? (
          <p className="muted">New stories are on the way. Check back soon.</p>
        ) : (
          <div className="blog-grid">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}
        <div className="section-cta">
          <Link className="btn btn-secondary" href="/blog">
            View all articles
          </Link>
        </div>
      </div>
    </section>
  );
}
