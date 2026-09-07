import { listPosts } from "@/lib/posts";
import { SITE } from "@/lib/site";

export const dynamic = "force-dynamic";

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export async function GET() {
  const posts = await listPosts();
  const items = posts
    .map((post) => {
      const url = `${SITE.url}/blog/${post.slug}`;
      return `<item>
        <title>${escapeXml(post.title)}</title>
        <link>${url}</link>
        <guid>${url}</guid>
        <pubDate>${new Date(post.publishedAt || post.createdAt).toUTCString()}</pubDate>
        <description>${escapeXml(post.excerpt)}</description>
      </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>EXPal journal</title>
    <link>${SITE.url}/blog</link>
    <description>${escapeXml(SITE.description)}</description>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=300",
    },
  });
}
