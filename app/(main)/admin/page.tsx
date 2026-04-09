import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { adminGetAllUsers, adminGetAllPosts } from "@/lib/actions/admin";
import { getNotices } from "@/lib/actions/notices";
import { AdminDeletePostButton, AdminDeleteUserButton } from "@/components/admin/AdminDeleteButton";
import { AdminNoticeForm } from "@/components/admin/AdminNoticeForm";
import { AdminDeleteNoticeButton } from "@/components/admin/AdminDeleteNoticeButton";
import { timeAgo } from "@/lib/utils";
import { Shield, Users, FileText, Bell, Lock, ChevronRight } from "lucide-react";

export const revalidate = 0;

const ADMIN_EMAIL = "juongho1024@gmail.com";

type Tab = "users" | "posts" | "notices";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email !== ADMIN_EMAIL) redirect("/");

  const { tab } = await searchParams;
  const currentTab: Tab = (tab === "posts" || tab === "notices") ? tab : "users";

  const [users, posts, notices] = await Promise.all([
    adminGetAllUsers(),
    adminGetAllPosts(),
    getNotices(),
  ]);

  const tabs = [
    { key: "users",   label: "회원 관리",   icon: Users,    count: users.length },
    { key: "posts",   label: "게시물 관리", icon: FileText, count: posts.length },
    { key: "notices", label: "공지사항",    icon: Bell,     count: notices.length },
  ] as const;

  return (
    <div className="max-w-4xl mx-auto space-y-5 animate-slide-up">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Shield size={20} className="text-brand-500" />
        <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100">관리자 페이지</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-slate-200 dark:border-slate-800">
        {tabs.map(({ key, label, icon: Icon, count }) => (
          <Link
            key={key}
            href={`/admin?tab=${key}`}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              currentTab === key
                ? "border-brand-500 text-brand-600 dark:text-brand-400"
                : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            <Icon size={14} />
            {label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
              currentTab === key
                ? "bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400"
                : "bg-slate-100 dark:bg-slate-800 text-slate-500"
            }`}>
              {count}
            </span>
          </Link>
        ))}
      </div>

      {/* 회원 관리 */}
      {currentTab === "users" && (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400">닉네임</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400">이메일</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400">가입일</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400">작성 글</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {users.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-12 text-sm text-slate-400">회원이 없습니다.</td></tr>
                ) : users.map((u) => {
                  const postCount = posts.filter((p: { user_id: string }) => p.user_id === u.id).length;
                  return (
                    <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                      <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200">
                        {u.nickname || <span className="text-slate-400 text-xs">없음</span>}
                      </td>
                      <td className="px-4 py-3 text-slate-500 dark:text-slate-400 text-xs">{u.email}</td>
                      <td className="px-4 py-3 text-slate-400 text-xs">{timeAgo(u.created_at)}</td>
                      <td className="px-4 py-3">
                        <Link href={`/admin?tab=posts&user=${u.id}`} className="inline-flex items-center gap-1 text-xs text-brand-500 hover:underline">
                          {postCount}개 <ChevronRight size={10} />
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <AdminDeleteUserButton userId={u.id} nickname={u.nickname} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 게시물 관리 */}
      {currentTab === "posts" && (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400">제목</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400">카테고리</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400">작성자</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400">작성일</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400">댓글</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {posts.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-12 text-sm text-slate-400">게시글이 없습니다.</td></tr>
                ) : posts.map((post: {
                  id: string; title: string; category: string;
                  is_anonymous: boolean; author_nickname: string | null;
                  created_at: string; comment_count: number; like_count: number;
                }) => (
                  <tr key={post.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                    <td className="px-4 py-3 max-w-[200px]">
                      <Link href={`/posts/${post.id}`} target="_blank"
                        className="text-slate-800 dark:text-slate-200 hover:text-brand-500 truncate block">
                        {post.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">{post.category}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">
                      {post.is_anonymous
                        ? <span className="flex items-center gap-1"><Lock size={10} />익명</span>
                        : post.author_nickname ?? "알 수 없음"}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-400">{timeAgo(post.created_at)}</td>
                    <td className="px-4 py-3 text-xs text-slate-400">{post.comment_count}</td>
                    <td className="px-4 py-3 text-right">
                      <AdminDeletePostButton postId={post.id} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 공지사항 관리 */}
      {currentTab === "notices" && (
        <div className="space-y-4">
          <AdminNoticeForm />

          <div className="card overflow-hidden">
            {notices.length === 0 ? (
              <p className="text-center py-12 text-sm text-slate-400">공지사항이 없습니다.</p>
            ) : (
              <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                {notices.map((notice) => (
                  <li key={notice.id} className="flex items-start gap-3 px-4 py-3">
                    <div className="flex-1 min-w-0 space-y-0.5">
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{notice.title}</p>
                      {notice.content && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 whitespace-pre-wrap">{notice.content}</p>
                      )}
                      <p className="text-[10px] text-slate-300 dark:text-slate-600">{timeAgo(notice.created_at)}</p>
                    </div>
                    <AdminDeleteNoticeButton id={notice.id} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
