import { NextResponse } from "next/server";
import { isAdminSession } from "@/lib/auth";
import { deletePost, getPostById, updatePost } from "@/lib/posts";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const post = await getPostById(id);
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ post });
}

export async function PUT(request: Request, { params }: Params) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  try {
    const body = await request.json();
    const post = await updatePost(id, body);
    return NextResponse.json({ post });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not update post";
    const status = message === "Post not found" ? 404 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  try {
    await deletePost(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not delete post";
    const status = message === "Post not found" ? 404 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
