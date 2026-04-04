"use client";

import { useState, useTransition, useRef } from "react";
import { addComment } from "@/lib/actions/comments";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { Loader2, EyeOff } from "lucide-react";

export function CommentForm({ postId, isLoggedIn }: { postId: string; isLoggedIn: boolean }) {
  const [error, setError] = useState<string | null>(null);
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  if (!isLoggedIn) {
    return (
      <div className="text-center py-6 text-sm text-slate-400 dark:text-slate-600 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
        댓글을 작성하려면{" "}
        <a href="/login" className="text-brand-600 dark:text-brand-400 hover:underline">로그인</a>
        이 필요합니다.
      </div>
    );
  }

  async function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await addComment(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        formRef.current?.reset();
      }
    });
  }

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-2">
      {error && <ErrorMessage message={error} />}
      <input type="hidden" name="post_id" value={postId} />
      <input type="hidden" name="is_anonymous" value={isAnonymous ? "on" : "off"} />

      <textarea
        name="content"
        required
        rows={3}
        maxLength={500}
        placeholder="따뜻한 한마디를 남겨보세요..."
        className="input resize-none text-sm leading-relaxed"
      />

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setIsAnonymous((p) => !p)}
          className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
        >
          <EyeOff size={12} className={isAnonymous ? "text-brand-500" : "text-slate-400"} />
          {isAnonymous ? "익명" : "실명"}
        </button>

        <button type="submit" disabled={isPending} className="btn-primary text-xs px-4 py-1.5">
          {isPending ? <Loader2 size={12} className="animate-spin" /> : null}
          {isPending ? "등록 중..." : "댓글 등록"}
        </button>
      </div>
    </form>
  );
}
