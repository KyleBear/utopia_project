"use client";

import { useState, useTransition, useRef } from "react";
import { deleteComment, addComment } from "@/lib/actions/comments";
import { timeAgo } from "@/lib/utils";
import type { Comment } from "@/lib/types";
import { UserRound, Lock, Trash2, CornerDownRight, EyeOff, Loader2 } from "lucide-react";

export function CommentList({ comments, currentUserId, isLoggedIn, postId }: {
  comments: Comment[];
  currentUserId?: string;
  isLoggedIn: boolean;
  postId: string;
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
      {comments.map(comment => (
        <CommentItem
          key={comment.id}
          comment={comment}
          currentUserId={currentUserId}
          isLoggedIn={isLoggedIn}
          postId={postId}
        />
      ))}
    </ul>
  );
}

function CommentItem({ comment, currentUserId, isLoggedIn, postId }: {
  comment: Comment;
  currentUserId?: string;
  isLoggedIn: boolean;
  postId: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [deleted, setDeleted] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);

  if (deleted) return null;

  const canDelete = currentUserId === comment.user_id;
  const author = comment.is_anonymous ? "익명" : comment.author_nickname ?? "알 수 없음";

  return (
    <li>
      <div className="flex gap-3">
        <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 mt-0.5">
          {comment.is_anonymous
            ? <Lock size={12} className="text-slate-400" />
            : <UserRound size={12} className="text-slate-400" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{author}</span>
            <span className="text-xs text-slate-400 dark:text-slate-600">{timeAgo(comment.created_at)}</span>
            <div className="ml-auto flex items-center gap-2">
              {isLoggedIn && (
                <button
                  onClick={() => setShowReplyForm(p => !p)}
                  className="text-xs text-slate-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors"
                >
                  답글
                </button>
              )}
              {canDelete && (
                <button
                  onClick={() => startTransition(async () => {
                    await deleteComment(comment.id, comment.post_id);
                    setDeleted(true);
                  })}
                  disabled={isPending}
                  className="text-slate-300 dark:text-slate-700 hover:text-red-400 dark:hover:text-red-500 transition-colors"
                >
                  <Trash2 size={12} />
                </button>
              )}
            </div>
          </div>
          <p className="mt-1 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{comment.content}</p>
        </div>
      </div>

      {/* 대댓글 목록 */}
      {comment.replies && comment.replies.length > 0 && (
        <ul className="mt-2 ml-10 space-y-2 border-l-2 border-slate-100 dark:border-slate-800 pl-3">
          {comment.replies.map(reply => (
            <ReplyItem
              key={reply.id}
              reply={reply}
              currentUserId={currentUserId}
              postId={postId}
            />
          ))}
        </ul>
      )}

      {/* 답글 입력폼 */}
      {showReplyForm && (
        <div className="mt-2 ml-10">
          <ReplyForm
            postId={postId}
            parentId={comment.id}
            onDone={() => setShowReplyForm(false)}
          />
        </div>
      )}
    </li>
  );
}

function ReplyItem({ reply, currentUserId, postId }: {
  reply: Comment;
  currentUserId?: string;
  postId: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [deleted, setDeleted] = useState(false);

  if (deleted) return null;

  const canDelete = currentUserId === reply.user_id;
  const author = reply.is_anonymous ? "익명" : reply.author_nickname ?? "알 수 없음";

  return (
    <li className="flex gap-2">
      <CornerDownRight size={12} className="text-slate-300 dark:text-slate-700 mt-1 shrink-0" />
      <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
        {reply.is_anonymous
          ? <Lock size={10} className="text-slate-400" />
          : <UserRound size={10} className="text-slate-400" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{author}</span>
          <span className="text-xs text-slate-400 dark:text-slate-600">{timeAgo(reply.created_at)}</span>
          {canDelete && (
            <button
              onClick={() => startTransition(async () => {
                await deleteComment(reply.id, postId);
                setDeleted(true);
              })}
              disabled={isPending}
              className="ml-auto text-slate-300 dark:text-slate-700 hover:text-red-400 dark:hover:text-red-500 transition-colors"
            >
              <Trash2 size={11} />
            </button>
          )}
        </div>
        <p className="mt-0.5 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{reply.content}</p>
      </div>
    </li>
  );
}

function ReplyForm({ postId, parentId, onDone }: {
  postId: string;
  parentId: string;
  onDone: () => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await addComment(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        formRef.current?.reset();
        onDone();
      }
    });
  }

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-1.5">
      {error && <p className="text-xs text-red-500">{error}</p>}
      <input type="hidden" name="post_id" value={postId} />
      <input type="hidden" name="parent_id" value={parentId} />
      <input type="hidden" name="is_anonymous" value={isAnonymous ? "on" : "off"} />
      <textarea
        name="content"
        required
        rows={2}
        maxLength={500}
        placeholder="답글을 입력하세요..."
        className="input resize-none text-sm leading-relaxed"
      />
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setIsAnonymous(p => !p)}
          className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
        >
          <EyeOff size={12} className={isAnonymous ? "text-brand-500" : "text-slate-400"} />
          {isAnonymous ? "익명" : "실명"}
        </button>
        <div className="flex gap-1.5">
          <button type="button" onClick={onDone}
            className="text-xs px-3 py-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
            취소
          </button>
          <button type="submit" disabled={isPending} className="btn-primary text-xs px-3 py-1.5">
            {isPending ? <Loader2 size={11} className="animate-spin" /> : null}
            {isPending ? "등록 중..." : "등록"}
          </button>
        </div>
      </div>
    </form>
  );
}
