"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { findAccount } from "@/lib/actions/auth";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { Loader2, ArrowLeft, UserRound } from "lucide-react";

export function FindAccountForm() {
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(formData: FormData) {
    setError(null);
    setResult(null);
    startTransition(async () => {
      const res = await findAccount(formData);
      if (res?.error) setError(res.error);
      else if (res?.email) setResult(res.email);
    });
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      {error && <ErrorMessage message={error} />}
      {result && (
        <div className="p-4 rounded-xl bg-brand-50 dark:bg-brand-900/20 border border-brand-100 dark:border-brand-800 text-center space-y-1">
          <p className="text-xs text-slate-500 dark:text-slate-400">가입된 이메일</p>
          <p className="font-semibold text-brand-700 dark:text-brand-300 text-lg">{result}</p>
        </div>
      )}

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">닉네임</label>
        <div className="relative">
          <UserRound size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input name="nickname" type="text" required placeholder="가입 시 설정한 닉네임"
            className="input pl-8" />
        </div>
      </div>

      <button type="submit" disabled={isPending} className="btn-primary w-full py-2.5">
        {isPending ? <Loader2 size={15} className="animate-spin" /> : null}
        {isPending ? "찾는 중..." : "아이디 찾기"}
      </button>

      <div className="flex items-center justify-center gap-4 text-xs text-slate-400">
        <Link href="/login" className="flex items-center gap-1 hover:text-slate-600 dark:hover:text-slate-300">
          <ArrowLeft size={12} /> 로그인
        </Link>
        <span>·</span>
        <Link href="/reset-password" className="hover:text-slate-600 dark:hover:text-slate-300">
          비밀번호 찾기
        </Link>
      </div>
    </form>
  );
}
