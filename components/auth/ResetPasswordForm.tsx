"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { resetPassword } from "@/lib/actions/auth";
import { ErrorMessage, SuccessMessage } from "@/components/ui/ErrorMessage";
import { Loader2, ArrowLeft } from "lucide-react";

export function ResetPasswordForm() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(formData: FormData) {
    setError(null);
    setSuccess(null);
    startTransition(async () => {
      const result = await resetPassword(formData);
      if (result?.error) setError(result.error);
      else if (result?.success) setSuccess(result.success);
    });
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      {error && <ErrorMessage message={error} />}
      {success && <SuccessMessage message={success} />}

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">가입한 이메일</label>
        <input name="email" type="email" required autoComplete="email" placeholder="you@example.com" className="input" />
      </div>

      <button type="submit" disabled={isPending} className="btn-primary w-full py-2.5">
        {isPending ? <Loader2 size={15} className="animate-spin" /> : null}
        {isPending ? "전송 중..." : "재설정 링크 보내기"}
      </button>

      <Link href="/login" className="flex items-center justify-center gap-1 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
        <ArrowLeft size={13} />
        로그인으로 돌아가기
      </Link>
    </form>
  );
}
