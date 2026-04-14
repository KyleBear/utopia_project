"use client";

import { useActionState, useState } from "react";
import { upsertExpertProfile } from "@/lib/actions/profile";
import type { ExpertProfile } from "@/lib/types";
import { Loader2, BadgeCheck, Eye, EyeOff, ExternalLink } from "lucide-react";
import Link from "next/link";

type Props = { existing: ExpertProfile | null; suggestedSlug: string };

const initial = { error: undefined as string | undefined, success: false, slug: undefined as string | undefined };

export function ExpertProfileForm({ existing, suggestedSlug }: Props) {
  const [state, action, pending] = useActionState(
    async (_prev: typeof initial, formData: FormData) => {
      const result = await upsertExpertProfile(formData);
      return result as typeof initial;
    },
    initial
  );

  const [expertiseTags, setExpertiseTags] = useState<string[]>(existing?.expertise ?? []);
  const [tagInput, setTagInput] = useState("");

  function addTag() {
    const tag = tagInput.trim();
    if (tag && !expertiseTags.includes(tag) && expertiseTags.length < 10) {
      setExpertiseTags([...expertiseTags, tag]);
      setTagInput("");
    }
  }

  function removeTag(tag: string) {
    setExpertiseTags(expertiseTags.filter((t) => t !== tag));
  }

  return (
    <form action={action} className="space-y-4">
      {/* 숨김 필드: expertise */}
      <input type="hidden" name="expertise" value={expertiseTags.join(",")} />

      {/* 슬러그 */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-slate-600 dark:text-slate-400">
          프로필 URL (슬러그)
        </label>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">utopia.kr/e/</span>
          <input
            name="slug"
            defaultValue={existing?.slug ?? suggestedSlug}
            placeholder="my-profile"
            className="input flex-1 text-sm"
            required
          />
        </div>
        <p className="text-xs text-slate-400">영소문자, 숫자, 하이픈만 사용 가능</p>
      </div>

      {/* 소개 */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-slate-600 dark:text-slate-400">
          자기 소개 <span className="text-slate-400">(최대 500자)</span>
        </label>
        <textarea
          name="bio"
          defaultValue={existing?.bio ?? ""}
          rows={3}
          maxLength={500}
          placeholder="전문 분야와 경험을 간략하게 소개해주세요"
          className="input w-full resize-none text-sm"
        />
      </div>

      {/* 전문 분야 태그 */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-slate-600 dark:text-slate-400">
          전문 분야 태그 <span className="text-slate-400">(최대 10개)</span>
        </label>
        <div className="flex gap-2">
          <input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
            placeholder="예: 커리어 상담, 심리 코칭"
            className="input flex-1 text-sm"
          />
          <button type="button" onClick={addTag} className="btn-ghost text-xs px-3">
            추가
          </button>
        </div>
        {expertiseTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {expertiseTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => removeTag(tag)}
                className="px-2.5 py-1 text-xs bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 rounded-full border border-brand-100 dark:border-brand-900 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors"
              >
                {tag} ×
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 공개 여부 */}
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="hidden" name="is_public" value="false" />
          <input
            type="checkbox"
            name="is_public"
            value="true"
            defaultChecked={existing?.is_public ?? true}
            className="w-4 h-4 accent-brand-500"
          />
          <span className="text-sm text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            {existing?.is_public !== false ? (
              <><Eye size={13} />프로필 공개</>
            ) : (
              <><EyeOff size={13} />프로필 비공개</>
            )}
          </span>
        </label>
      </div>

      {/* 에러/성공 */}
      {state.error && (
        <p className="text-xs text-red-500">{state.error}</p>
      )}
      {state.success && state.slug && (
        <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400">
          <BadgeCheck size={14} />
          저장되었습니다.{" "}
          <Link href={`/e/${state.slug}`} className="underline flex items-center gap-1">
            프로필 보기 <ExternalLink size={11} />
          </Link>
        </div>
      )}

      <button type="submit" disabled={pending} className="btn-primary text-xs w-fit">
        {pending ? <Loader2 size={13} className="animate-spin" /> : <BadgeCheck size={13} />}
        {existing ? "프로필 수정" : "전문가 등록"}
      </button>
    </form>
  );
}
