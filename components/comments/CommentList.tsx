"use client";

import { useState, useTransition } from "react";
import { deleteComment } from "@/lib/actions/comments";
import { timeAgo, maskEmail } from "@/lib/utils";
import type { Comment } from "@/lib/types";
import { UserRound, Lock, Trash2 } from "lucide-react";

export function CommentList({
  comments,
  currentUserId,
}: {
  comments: Comment[];
  currentUserId?: string;
}) {
  if (comments.length === 0) {
    return (
      <p className="text-center text-sm text-slate-400 dark:text-slate-600 py-6">
        아직 댓글이 없습니다. 첫 댓글을 남겨보세요!
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          canDelete={currentUserId === comment.user_id}
        />
      ))}
    </ul>
  );
}

function CommentItem({ comment, canDelete }: { comment: Comment; canDelete: boolean }) {
  const [isPending, startTransition] = useTransition();
  const [deleted, setDeleted] = useState(false);

  if (deleted) return null;

  function handleDelete() {
    startTransition(async () => {
      await deleteComment(comment.id, comment.post_id);
      setDeleted(true);
    });
  }

  return (
    <li className="flex gap-3">
      <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 mt-0.5">
        {comment.is_anonymous ? (
          <Lock size={12} className="text-slate-400" />
        ) : (
          <UserRound size={12} className="text-slate-400" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
            {comment.is_anonymous
              ? "익명"
              : comment.author_email
              ? maskEmail(comment.author_email)
              : "알 수 없음"}
          </span>
          <span className="text-xs text-slate-400 dark:text-slate-600">
            {timeAgo(comment.created_at)}
          </span>
          {canDelete && (
            <button
              onClick={handleDelete}
              disabled={isPending}
              className="ml-auto text-slate-300 dark:text-slate-700 hover:text-red-400 dark:hover:text-red-500 transition-colors"
            >
              <Trash2 size={12} />
            </button>
          )}
        </div>
        <p className="mt-1 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          {comment.content}
        </p>
      </div>
    </li>
  );
}
