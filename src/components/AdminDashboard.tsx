"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { BlogPost } from "@/lib/posts";

export default function AdminDashboard({ posts }: { posts: BlogPost[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState("");
  const [message, setMessage] = useState("");

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
  }

  async function remove(id: string) {
    if (!window.confirm("Delete this post permanently?")) return;
    setBusyId(id);
    setMessage("");
    const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setMessage(data.error || "Could not delete");
    }
    setBusyId("");
    router.refresh();
  }

  return (
    <div className="section">
      <div className="site-wrap">
        <div className="section-head">
          <p className="eyebrow">Writer desk</p>
          <h1 className="page-title">Your EXPal posts</h1>
          <p className="lede">
            Published stories appear on the public landing page and at /blog.
            Drafts stay hidden from search engines and visitors.
          </p>
        </div>
        <div className="hero-actions" style={{ marginBottom: "1.5rem" }}>
          <Link className="btn" href="/admin/posts/new">
            Write a new post
          </Link>
          <button className="btn btn-ghost" type="button" onClick={logout}>
            Sign out
          </button>
        </div>
        {message ? <p className="error">{message}</p> : null}
        <div className="admin-list">
          {posts.map((post) => (
            <div className="admin-card admin-row" key={post.id}>
              <div>
                <strong>{post.title}</strong>
                <p className="muted" style={{ margin: "0.2rem 0 0" }}>
                  /blog/{post.slug}
                </p>
              </div>
              <div className="hero-actions">
                <span className={`badge ${post.published ? "" : "draft"}`}>
                  {post.published ? "Published" : "Draft"}
                </span>
                <Link className="btn btn-secondary" href={`/admin/posts/${post.id}`}>
                  Edit
                </Link>
                <button
                  className="btn btn-danger"
                  type="button"
                  disabled={busyId === post.id}
                  onClick={() => remove(post.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {posts.length === 0 ? <p className="muted">No posts yet.</p> : null}
        </div>
      </div>
    </div>
  );
}
