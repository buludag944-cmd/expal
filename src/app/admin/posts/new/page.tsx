import { redirect } from "next/navigation";
import PostEditor from "@/components/PostEditor";
import { isAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "New post",
  robots: { index: false, follow: false },
};

export default async function NewPostPage() {
  if (!(await isAdminSession())) redirect("/admin");
  return <PostEditor />;
}
