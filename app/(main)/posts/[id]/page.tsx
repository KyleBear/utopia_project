import { notFound } from "next/navigation";
import Link from "next/link";
import { getPost } from "@/lib/data/posts";
import { getComments } from "@/lib/actions/comments";
import { createClient } from "@/lib/supabase/server";
import { LikeButton } from "@/components/likes/LikeButton";
import { CommentForm } from "@/components/comments/CommentForm";
import { CommentList } from "@/components/comments/CommentList";
import { deletePost } from "@/lib/actions/posts";
import { timeAgo } from "@/lib/utils";
import { CategoryBadge } from "@/components/posts/CategoryTabs";
import { ArrowLeft, UserRound, Lock, MessageCircle, Trash2, Pencil } from "lucide-react";

export const revalidate = 60;

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [post, comments] = await Promise.all([
    getPost(id),
    getComments(id),
  ]);

  if (!post) notFound();

  const isOwner = user?.id === post.user_id;

  let userHasLiked = false;
  if (user) {
    const { data: like } = await supabase
      .from("likes")
      .select("id")
      .eq("post_id", id)
      .eq("user_id", user.id)
      .maybeSingle();
    userHasLiked = !!like;
  }

  return (
    <div className="max-w-xl mx-auto space-y-5 animate-slide-up">
      {/* Back */}
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
        <ArrowLeft size={14} />
        목록으로
      </Link>

      {/* Post */}
      <article className="card p-5 space-y-4">
        <header className="space-y-2">
          <div className="mb-1">
            <CategoryBadge category={post.category} />
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 leading-snug">
            {post.title}
          </h1>
          <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
            <span className="flex items-center gap-1">
              {post.is_anonymous ? (
                <><Lock size={11} />익명</>
              ) : (
                <><UserRound size={11} />{post.author_nickname ?? "알 수 없음"}</>
              )}
            </span>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <span>{timeAgo(post.created_at)}</span>

            {isOwner && (
              <div className="ml-auto flex items-center gap-2">
                <Link
                  href={`/posts/${id}/edit`}
                  className="flex items-center gap-1 text-slate-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors"
                >
                  <Pencil size={12} />
                  수정
                </Link>
                <form
                  action={async () => {
                    "use server";
                    await deletePost(id);
                  }}
                >
                  <button
                    type="submit"
                    className="flex items-center gap-1 text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={12} />
                    삭제
                  </button>
                </form>
              </div>
            )}
          </div>
        </header>

        <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
            {post.content}
          </p>
        </div>

        {/* Like */}
        <div className="flex items-center gap-3 pt-1">
          <LikeButton
            postId={id}
            initialCount={post.like_count ?? 0}
            initialLiked={userHasLiked}
            isLoggedIn={!!user}
          />
          <span className="flex items-center gap-1 text-xs text-slate-400">
            <MessageCircle size={13} />
            댓글 {comments.length}개
          </span>
        </div>
      </article>

      {/* Comments */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300">댓글</h2>
        <CommentForm postId={id} isLoggedIn={!!user} />
        <CommentList comments={comments} currentUserId={user?.id} isLoggedIn={!!user} postId={id} />
      </section>
    </div>
  );
}
