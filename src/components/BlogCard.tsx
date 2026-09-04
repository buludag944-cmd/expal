import Link from "next/link";
import type { BlogPost } from "@/lib/posts";
import { readingTime } from "@/lib/slug";

function formatDate(value?: string) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-IE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function BlogCard({ post }: { post: BlogPost }) {
  const minutes = readingTime(post.content);
  return (
    <article className="blog-card">
      <Link href={`/blog/${post.slug}`} className="blog-card-link">
        <div className="blog-card-meta">
          <time dateTime={post.publishedAt || post.createdAt}>
            {formatDate(post.publishedAt || post.createdAt)}
          </time>
          <span>{minutes} min read</span>
        </div>
        <h3>{post.title}</h3>
        <p>{post.excerpt}</p>
        {post.tags.length > 0 ? (
          <ul className="tags">
            {post.tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        ) : null}
      </Link>
    </article>
  );
}
