"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { signup } from "@/lib/actions/auth";
import { ErrorMessage, SuccessMessage } from "@/components/ui/ErrorMessage";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export function SignupForm() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPw, setShowPw] = useState(false);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(formData: FormData) {
    setError(null);
    setSuccess(null);
    const password = formData.get("password") as string;
    const confirm = formData.get("confirm") as string;
    if (password !== confirm) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }
    if (password.length < 8) {
      setError("비밀번호는 8자 이상이어야 합니다.");
      return;
    }
    startTransition(async () => {
      const result = await signup(formData);
      if (result?.error) setError(result.error);
      else if (result?.success) setSuccess(result.success);
    });
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      {error && <ErrorMessage message={error} />}
      {success && <SuccessMessage message={success} />}

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">이메일</label>
        <input name="email" type="email" required autoComplete="email" placeholder="you@example.com" className="input" />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">비밀번호</label>
        <div className="relative">
          <input
            name="password"
            type={showPw ? "text" : "password"}
            required
            autoComplete="new-password"
            placeholder="8자 이상"
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
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">비밀번호 확인</label>
        <input
          name="confirm"
          type={showPw ? "text" : "password"}
          required
          autoComplete="new-password"
          placeholder="비밀번호 재입력"
          className="input"
        />
      </div>

      <button type="submit" disabled={isPending} className="btn-primary w-full py-2.5">
        {isPending ? <Loader2 size={15} className="animate-spin" /> : null}
        {isPending ? "가입 중..." : "회원가입"}
      </button>

      <p className="text-center text-sm text-slate-500 dark:text-slate-400">
        이미 계정이 있으신가요?{" "}
        <Link href="/login" className="text-brand-600 dark:text-brand-400 hover:underline font-medium">
          로그인
        </Link>
      </p>
    </form>
  );
}
