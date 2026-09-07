import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import { excerptFrom, slugify, uniqueSlug } from "./slug";

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  tags: string[];
  author: string;
  published: boolean;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
};

export type PostInput = {
  title: string;
  slug?: string;
  excerpt?: string;
  content: string;
  coverImage?: string;
  tags?: string[];
  author?: string;
  published?: boolean;
  seoTitle?: string;
  seoDescription?: string;
};

const DATA_PATH = path.join(process.cwd(), "data", "posts.json");

let writeChain: Promise<unknown> = Promise.resolve();

async function readAll(): Promise<BlogPost[]> {
  try {
    const raw = await fs.readFile(DATA_PATH, "utf8");
    const parsed = JSON.parse(raw) as BlogPost[];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    const err = error as NodeJS.ErrnoException;
    if (err.code === "ENOENT") return [];
    throw error;
  }
}

async function writeAll(posts: BlogPost[]): Promise<void> {
  await fs.mkdir(path.dirname(DATA_PATH), { recursive: true });
  const tmp = `${DATA_PATH}.tmp`;
  await fs.writeFile(tmp, `${JSON.stringify(posts, null, 2)}\n`, "utf8");
  await fs.rename(tmp, DATA_PATH);
}

function queueWrite<T>(fn: () => Promise<T>): Promise<T> {
  const run = writeChain.then(fn, fn);
  writeChain = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

export async function listPosts(includeDrafts = false): Promise<BlogPost[]> {
  const posts = await readAll();
  const visible = includeDrafts ? posts : posts.filter((post) => post.published);
  return visible.sort((a, b) => {
    const aDate = a.publishedAt || a.createdAt;
    const bDate = b.publishedAt || b.createdAt;
    return bDate.localeCompare(aDate);
  });
}

export async function getPostBySlug(
  slug: string,
  includeDrafts = false,
): Promise<BlogPost | null> {
  const posts = await readAll();
  return (
    posts.find(
      (post) => post.slug === slug && (includeDrafts || post.published),
    ) || null
  );
}

export async function getPostById(id: string): Promise<BlogPost | null> {
  const posts = await readAll();
  return posts.find((post) => post.id === id) || null;
}

function normalizeInput(input: PostInput, existingSlugs: string[], ignoreSlug?: string): Omit<BlogPost, "id" | "createdAt" | "updatedAt" | "publishedAt"> {
  const title = input.title.trim();
  if (!title) throw new Error("Title is required");
  const content = input.content.trim();
  if (!content) throw new Error("Content is required");

  const baseSlug = slugify(input.slug?.trim() || title);
  const slug = uniqueSlug(
    baseSlug,
    existingSlugs,
    ignoreSlug,
  );
  const excerpt = (input.excerpt || "").trim() || excerptFrom(content);
  const tags = (input.tags || [])
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 8);

  return {
    slug,
    title,
    excerpt,
    content,
    coverImage: input.coverImage?.trim() || undefined,
    tags,
    author: (input.author || "EXPal editorial").trim(),
    published: Boolean(input.published),
    seoTitle: input.seoTitle?.trim() || undefined,
    seoDescription: input.seoDescription?.trim() || undefined,
  };
}

export async function createPost(input: PostInput): Promise<BlogPost> {
  return queueWrite(async () => {
    const posts = await readAll();
    const now = new Date().toISOString();
    const fields = normalizeInput(
      input,
      posts.map((post) => post.slug),
    );
    const post: BlogPost = {
      id: randomUUID(),
      ...fields,
      createdAt: now,
      updatedAt: now,
      publishedAt: fields.published ? now : undefined,
    };
    posts.push(post);
    await writeAll(posts);
    return post;
  });
}

export async function updatePost(id: string, input: PostInput): Promise<BlogPost> {
  return queueWrite(async () => {
    const posts = await readAll();
    const index = posts.findIndex((post) => post.id === id);
    if (index === -1) throw new Error("Post not found");

    const current = posts[index];
    const fields = normalizeInput(
      input,
      posts.map((post) => post.slug),
      current.slug,
    );
    const now = new Date().toISOString();
    const post: BlogPost = {
      ...current,
      ...fields,
      updatedAt: now,
      publishedAt: fields.published
        ? current.publishedAt || now
        : current.publishedAt,
    };
    if (!fields.published) {
      delete post.publishedAt;
    }
    posts[index] = post;
    await writeAll(posts);
    return post;
  });
}

export async function deletePost(id: string): Promise<void> {
  return queueWrite(async () => {
    const posts = await readAll();
    const next = posts.filter((post) => post.id !== id);
    if (next.length === posts.length) throw new Error("Post not found");
    await writeAll(next);
  });
}
