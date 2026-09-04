import AdminDashboard from "@/components/AdminDashboard";
import AdminLogin from "@/components/AdminLogin";
import { isAdminSession } from "@/lib/auth";
import { listPosts } from "@/lib/posts";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Writer desk",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  if (!(await isAdminSession())) {
    return <AdminLogin />;
  }
  const posts = await listPosts(true);
  return <AdminDashboard posts={posts} />;
}
