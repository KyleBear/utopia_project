import Link from "next/link";
import { MessageCircle, Heart, UserRound, Lock } from "lucide-react";
import { timeAgo } from "@/lib/utils";
import { CategoryBadge } from "./CategoryTabs";
import type { Post } from "@/lib/types";

export function PostCard({ post }: { post: Post }) {
  const author = post.is_anonymous
    ? "익명"
    : post.author_nickname ?? "알 수 없음";

  return (
    <Link href={`/posts/${post.id}`}
      className="card block p-4 hover:border-brand-300 dark:hover:border-brand-700 hover:shadow-sm transition-all duration-150 animate-fade-in">
      <div className="flex items-start gap-2 mb-1.5">
        <CategoryBadge category={post.category} />
      </div>

      <h2 className="font-semibold text-slate-900 dark:text-slate-100 text-sm leading-snug line-clamp-1">
        {post.title}
      </h2>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
        {post.content}
      </p>

      <div className="mt-3 flex items-center gap-3 text-xs text-slate-400 dark:text-slate-500">
        <span className="flex items-center gap-1">
          {post.is_anonymous ? <Lock size={11} /> : <UserRound size={11} />}
          {author}
        </span>
        <span className="text-slate-300 dark:text-slate-700">·</span>
        <span>{timeAgo(post.created_at)}</span>
        <span className="ml-auto flex items-center gap-2.5">
          <span className="flex items-center gap-1"><Heart size={11} />{post.like_count ?? 0}</span>
          <span className="flex items-center gap-1"><MessageCircle size={11} />{post.comment_count ?? 0}</span>
        </span>
      </div>
    </Link>
  );
}
