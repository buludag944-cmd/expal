import { NextResponse } from "next/server";
import { isAdminSession, isAdminConfigured } from "@/lib/auth";
import { createPost, listPosts } from "@/lib/posts";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const all = searchParams.get("all") === "1";
  if (all && !(await isAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const posts = await listPosts(all);
  return NextResponse.json({ posts });
}

export async function POST(request: Request) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isAdminConfigured()) {
    return NextResponse.json({ error: "Admin password is not configured" }, { status: 500 });
  }
  try {
    const body = await request.json();
    const post = await createPost(body);
    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not create post";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
