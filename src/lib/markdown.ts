import { marked } from "marked";

const renderer = new marked.Renderer();

renderer.link = ({ href, title, text }) => {
  const titleAttr = title ? ` title="${escapeHtml(title)}"` : "";
  const safeHref = escapeAttribute(href || "");
  return `<a href="${safeHref}"${titleAttr} rel="noopener noreferrer">${text}</a>`;
};

marked.setOptions({
  gfm: true,
  breaks: true,
  renderer,
});

export function renderMarkdown(markdown: string): string {
  return marked.parse(markdown, { async: false }) as string;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function escapeAttribute(value: string): string {
  if (/^(https?:|mailto:|\/|#)/i.test(value)) {
    return escapeHtml(value);
  }
  return "#";
}
