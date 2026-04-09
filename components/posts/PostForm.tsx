"use client";

import { useState, useTransition } from "react";
import { createPost } from "@/lib/actions/posts";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { Loader2, EyeOff, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { CATEGORIES } from "@/lib/types";

const CATEGORY_COLORS: Record<string, string> = {
  연애: "border-pink-400 bg-pink-50 text-pink-700 dark:bg-pink-900/20 dark:text-pink-300",
  직장: "border-blue-400 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300",
  학교: "border-green-400 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300",
  가족: "border-orange-400 bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300",
  기타: "border-slate-400 bg-slate-50 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
};

export function PostForm() {
  const [error, setError] = useState<string | null>(null);
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [category, setCategory] = useState("기타");
  const [content, setContent] = useState("");
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      try {
        const result = await createPost(formData);
        if (result?.error) setError(result.error);
      } catch (e) {
        // redirect()는 NEXT_REDIRECT 에러를 throw하므로 반드시 re-throw
        throw e;
      }
    });
  }

  const postCategories = CATEGORIES.filter(c => c !== "전체");

  return (
    <form action={handleSubmit} className="space-y-4">
      {error && <ErrorMessage message={error} />}

      {/* 카테고리 */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">카테고리</label>
        <div className="flex flex-wrap gap-2">
          {postCategories.map(cat => (
            <button key={cat} type="button" onClick={() => setCategory(cat)}
              className={cn(
                "px-3 py-1 text-xs font-medium rounded-full border transition-all",
                category === cat
                  ? CATEGORY_COLORS[cat]
                  : "border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-300"
              )}>
              {cat}
            </button>
          ))}
        </div>
        <input type="hidden" name="category" value={category} />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">제목</label>
        <input name="title" type="text" required maxLength={100}
          placeholder="고민 제목을 입력하세요" className="input" />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">내용</label>
        <textarea name="content" required rows={8} maxLength={5000}
          value={content} onChange={e => setContent(e.target.value)}
          placeholder="고민을 자세히 적어주세요."
          className="input resize-none leading-relaxed" />
        <div className="text-right text-xs text-slate-400">{content.length} / 5000</div>
      </div>

      {/* 익명 토글 */}
      <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
            {isAnonymous ? <EyeOff size={14} /> : <Eye size={14} />}
            {isAnonymous ? "익명으로 게시" : "닉네임으로 게시"}
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {isAnonymous ? "작성자가 표시되지 않습니다" : "닉네임이 표시됩니다"}
          </p>
        </div>
        <button type="button" onClick={() => setIsAnonymous(p => !p)}
          className={cn("relative rounded-full transition-colors duration-200",
            isAnonymous ? "bg-brand-500" : "bg-slate-300 dark:bg-slate-600"
          )} style={{ width: 40, height: 22 }}>
          <span className={cn("absolute top-0.5 left-0.5 bg-white rounded-full shadow transition-transform duration-200",
            isAnonymous ? "translate-x-[18px]" : "translate-x-0"
          )} style={{ width: 18, height: 18 }} />
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
