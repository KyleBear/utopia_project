import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { adminGetAllUsers, adminGetAllPosts } from "@/lib/actions/admin";
import { AdminDeletePostButton, AdminDeleteUserButton } from "@/components/admin/AdminDeleteButton";
import { timeAgo } from "@/lib/utils";
import { Shield, Users, FileText, Lock } from "lucide-react";

export const revalidate = 0;

const ADMIN_EMAIL = "juongho1024@gmail.com";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.email !== ADMIN_EMAIL) redirect("/");

  const [users, posts] = await Promise.all([
    adminGetAllUsers(),
    adminGetAllPosts(),
  ]);

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Shield size={20} className="text-brand-500" />
        <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100">관리자 페이지</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="card p-4 flex items-center gap-3">
          <Users size={18} className="text-blue-500" />
          <div>
            <p className="text-xs text-slate-400">전체 회원</p>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{users.length}</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <FileText size={18} className="text-green-500" />
          <div>
            <p className="text-xs text-slate-400">전체 게시글</p>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{posts.length}</p>
          </div>
        </div>
      </div>

      {/* Users */}
      <section className="card overflow-hidden">
        <div className="flex items-center gap-2 p-4 border-b border-slate-100 dark:border-slate-800">
          <Users size={15} className="text-slate-500" />
          <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300">회원 관리</h2>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {users.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-8">회원이 없습니다.</p>
          ) : (
            users.map((u) => (
              <div key={u.id} className="flex items-center gap-3 px-4 py-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
                    {u.nickname || <span className="text-slate-400">닉네임 없음</span>}
                  </p>
                  <p className="text-xs text-slate-400 truncate">{u.email}</p>
                </div>
                <span className="text-xs text-slate-300 dark:text-slate-600 shrink-0">
                  {timeAgo(u.created_at)}
                </span>
                <AdminDeleteUserButton userId={u.id} nickname={u.nickname} />
              </div>
            ))
          )}
        </div>
      </section>

      {/* Posts */}
      <section className="card overflow-hidden">
        <div className="flex items-center gap-2 p-4 border-b border-slate-100 dark:border-slate-800">
          <FileText size={15} className="text-slate-500" />
          <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300">게시글 관리</h2>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {posts.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-8">게시글이 없습니다.</p>
          ) : (
            posts.map((post: {
              id: string;
              title: string;
              category: string;
              is_anonymous: boolean;
              author_nickname: string | null;
              created_at: string;
              comment_count: number;
              like_count: number;
            }) => (
              <div key={post.id} className="flex items-center gap-3 px-4 py-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
                    {post.title}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-slate-400">{post.category}</span>
                    <span className="text-slate-300 dark:text-slate-700 text-xs">·</span>
                    <span className="text-xs text-slate-400 flex items-center gap-0.5">
                      {post.is_anonymous ? <><Lock size={10} />익명</> : (post.author_nickname ?? "알 수 없음")}
                    </span>
                    <span className="text-slate-300 dark:text-slate-700 text-xs">·</span>
                    <span className="text-xs text-slate-400">댓글 {post.comment_count}</span>
                  </div>
                </div>
                <span className="text-xs text-slate-300 dark:text-slate-600 shrink-0">
                  {timeAgo(post.created_at)}
                </span>
                <AdminDeletePostButton postId={post.id} />
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
