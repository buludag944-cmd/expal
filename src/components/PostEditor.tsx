"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { BlogPost } from "@/lib/posts";
import { slugify } from "@/lib/slug";

type Props = { post?: BlogPost };

export default function PostEditor({ post }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState(post?.title || "");
  const [slug, setSlug] = useState(post?.slug || "");
  const [excerpt, setExcerpt] = useState(post?.excerpt || "");
  const [content, setContent] = useState(post?.content || "");
  const [tags, setTags] = useState(post?.tags.join(", ") || "");
  const [author, setAuthor] = useState(post?.author || "EXPal editorial");
  const [seoTitle, setSeoTitle] = useState(post?.seoTitle || "");
  const [seoDescription, setSeoDescription] = useState(post?.seoDescription || "");
  const [published, setPublished] = useState(post?.published ?? true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const suggestedSlug = useMemo(() => slugify(title), [title]);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const payload = {
      title,
      slug: slug || suggestedSlug,
      excerpt,
      content,
      tags: tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      author,
      seoTitle,
      seoDescription,
      published,
    };
    try {
      const res = await fetch(post ? `/api/posts/${post.id}` : "/api/posts", {
        method: post ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Could not save");
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Could not reach the server");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="section">
      <div className="site-wrap" style={{ maxWidth: 760 }}>
        <div className="section-head">
          <p className="eyebrow">Writer desk</p>
          <h1 className="page-title">{post ? "Edit post" : "Write a new post"}</h1>
          <p className="lede">
            Use a clear title people would search for. Published posts show on the
            landing page immediately.
          </p>
        </div>
        <form className="form editor-card" style={{ padding: "1.4rem" }} onSubmit={onSubmit}>
          <label>
            Title
            <input value={title} onChange={(e) => setTitle(e.target.value)} required />
          </label>
          <label>
            URL slug
            <input
              value={slug}
              placeholder={suggestedSlug}
              onChange={(e) => setSlug(e.target.value)}
            />
          </label>
          <label>
            Excerpt
            <textarea
              style={{ minHeight: 90 }}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="One or two sentences for Google and the landing page."
            />
          </label>
          <label>
            Article (Markdown)
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </label>
          <label>
            Tags (comma separated)
            <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="housing, Dublin, visa" />
          </label>
          <label>
            Author
            <input value={author} onChange={(e) => setAuthor(e.target.value)} />
          </label>
          <label>
            SEO title (optional)
            <input value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} />
          </label>
          <label>
            SEO description (optional)
            <textarea
              style={{ minHeight: 90 }}
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
            />
          </label>
          <label className="checkbox">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
            />
            Publish on the public landing page
          </label>
          {error ? <p className="error">{error}</p> : null}
          <div className="hero-actions">
            <button className="btn" type="submit" disabled={busy}>
              {busy ? "Saving…" : post ? "Save changes" : "Publish post"}
            </button>
            <button className="btn btn-ghost" type="button" onClick={() => router.push("/admin")}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
