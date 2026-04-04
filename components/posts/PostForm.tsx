"use client";

import { useState, useTransition } from "react";
import { createPost } from "@/lib/actions/posts";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { Loader2, Eye, EyeOff } from "lucide-react";

export function PostForm() {
  const [error, setError] = useState<string | null>(null);
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [content, setContent] = useState("");

  async function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await createPost(formData);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      {error && <ErrorMessage message={error} />}

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">제목</label>
        <input
          name="title"
          type="text"
          required
          maxLength={100}
          placeholder="고민 제목을 입력하세요"
          className="input"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">내용</label>
        <textarea
          name="content"
          required
          rows={8}
          maxLength={5000}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="고민을 자세히 적어주세요. 더 구체적일수록 더 좋은 조언을 받을 수 있어요."
          className="input resize-none leading-relaxed"
        />
        <div className="text-right text-xs text-slate-400">{content.length} / 5000</div>
      </div>

      {/* Anonymous toggle */}
      <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
            {isAnonymous ? <EyeOff size={14} /> : <Eye size={14} />}
            {isAnonymous ? "익명으로 게시" : "실명으로 게시"}
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {isAnonymous ? "닉네임이 표시되지 않습니다" : "이메일 앞부분이 표시됩니다"}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsAnonymous((p) => !p)}
          className={`relative w-10 h-5.5 rounded-full transition-colors duration-200 ${
            isAnonymous ? "bg-brand-500" : "bg-slate-300 dark:bg-slate-600"
          }`}
          style={{ height: "22px" }}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-4.5 h-4.5 bg-white rounded-full shadow transition-transform duration-200 ${
              isAnonymous ? "translate-x-4" : "translate-x-0"
            }`}
            style={{ width: "18px", height: "18px" }}
          />
        </button>
        <input type="hidden" name="is_anonymous" value={isAnonymous ? "on" : "off"} />
      </div>

      <button type="submit" disabled={isPending} className="btn-primary w-full py-2.5">
        {isPending ? <Loader2 size={15} className="animate-spin" /> : null}
        {isPending ? "게시 중..." : "고민 게시하기"}
      </button>
    </form>
  );
}
