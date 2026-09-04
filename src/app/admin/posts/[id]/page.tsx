import { notFound, redirect } from "next/navigation";
import PostEditor from "@/components/PostEditor";
import { isAdminSession } from "@/lib/auth";
import { getPostById } from "@/lib/posts";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Edit post",
  robots: { index: false, follow: false },
};

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!(await isAdminSession())) redirect("/admin");
  const { id } = await params;
  const post = await getPostById(id);
  if (!post) notFound();
  return <PostEditor post={post} />;
}
