import type { Metadata } from "next";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import { renderMarkdown } from "@/lib/markdown";
import { getPostBySlug, listPosts } from "@/lib/posts";
import { articleJsonLd } from "@/lib/seo";
import { SITE } from "@/lib/site";
import { readingTime } from "@/lib/slug";

export const dynamic = "force-dynamic";

type Params = { slug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Article not found" };
  const title = post.seoTitle || post.title;
  const description = post.seoDescription || post.excerpt;
  const url = `${SITE.url}/blog/${post.slug}`;
  return {
    title,
    description,
    keywords: post.tags,
    authors: [{ name: post.author }],
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title,
      description,
      url,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const html = renderMarkdown(post.content);
  const minutes = readingTime(post.content);
  const related = (await listPosts())
    .filter((item) => item.id !== post.id)
    .slice(0, 3);

  return (
    <article className="article">
      <JsonLd data={articleJsonLd(post)} />
      <div className="site-wrap">
        <header className="article-header">
          <p className="eyebrow">EXPal journal</p>
          <h1 className="page-title">{post.title}</h1>
          <p className="lede">{post.excerpt}</p>
          <p className="muted">
            {post.author} · {minutes} min read ·{" "}
            {new Date(post.publishedAt || post.createdAt).toLocaleDateString(
              "en-IE",
              { day: "numeric", month: "long", year: "numeric" },
            )}
          </p>
        </header>
        <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />
        {related.length > 0 ? (
          <aside className="section" style={{ paddingLeft: 0, paddingRight: 0 }}>
            <h2>Keep reading</h2>
            <ul>
              {related.map((item) => (
                <li key={item.id}>
                  <a href={`/blog/${item.slug}`}>{item.title}</a>
                </li>
              ))}
            </ul>
          </aside>
        ) : null}
      </div>
    </article>
  );
}
