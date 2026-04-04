"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { login } from "@/lib/actions/auth";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [showPw, setShowPw] = useState(false);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await login(formData);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      {error && <ErrorMessage message={error} />}

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
          이메일
        </label>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          className="input"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
          비밀번호
        </label>
        <div className="relative">
          <input
            name="password"
            type={showPw ? "text" : "password"}
            required
            autoComplete="current-password"
            placeholder="••••••••"
            className="input pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPw((p) => !p)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          >
            {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
        <div className="text-right">
          <Link
            href="/reset-password"
            className="text-xs text-brand-600 dark:text-brand-400 hover:underline"
          >
            비밀번호를 잊으셨나요?
          </Link>
        </div>
      </div>

      <button type="submit" disabled={isPending} className="btn-primary w-full py-2.5">
        {isPending ? <Loader2 size={15} className="animate-spin" /> : null}
        {isPending ? "로그인 중..." : "로그인"}
      </button>

      <p className="text-center text-sm text-slate-500 dark:text-slate-400">
        계정이 없으신가요?{" "}
        <Link href="/signup" className="text-brand-600 dark:text-brand-400 hover:underline font-medium">
          회원가입
        </Link>
      </p>
    </form>
  );
}
