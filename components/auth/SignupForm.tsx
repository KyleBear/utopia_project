"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { signup } from "@/lib/actions/auth";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { Eye, EyeOff, Loader2, MailCheck } from "lucide-react";

export function SignupForm() {
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [sentEmail, setSentEmail] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(formData: FormData) {
    setError(null);
    const password = formData.get("password") as string;
    const confirm  = formData.get("confirm") as string;
    if (password !== confirm) { setError("비밀번호가 일치하지 않습니다."); return; }
    if (password.length < 8)  { setError("비밀번호는 8자 이상이어야 합니다."); return; }

    const email = formData.get("email") as string;
    const domain = email.split("@")[1]?.toLowerCase();
    if (domain !== "gmail.com" && domain !== "naver.com") {
      setError("Gmail 또는 네이버 이메일만 가입할 수 있습니다.");
      return;
    }
    startTransition(async () => {
      const result = await signup(formData);
      if (result?.error) setError(result.error);
      else { setSentEmail(email); setDone(true); }
    });
  }

  if (done) {
    return (
      <div className="flex flex-col items-center gap-4 py-6 text-center animate-fade-in">
        <div className="w-14 h-14 rounded-full bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center">
          <MailCheck size={28} className="text-brand-500" />
        </div>
        <div>
          <h2 className="font-semibold text-slate-900 dark:text-slate-100">이메일을 확인해주세요</h2>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            <span className="font-medium text-slate-700 dark:text-slate-300">{sentEmail}</span>
            으로 확인 링크를 보냈습니다.<br />
            링크를 클릭하면 가입이 완료됩니다.
          </p>
        </div>
        <p className="text-xs text-slate-400 dark:text-slate-600">메일이 안 보이면 스팸함도 확인해보세요.</p>
        <Link href="/login" className="btn-primary w-full py-2.5 mt-2">로그인 화면으로</Link>
      </div>
    );
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      {error && <ErrorMessage message={error} />}

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">닉네임</label>
        <input name="nickname" type="text" required minLength={2} maxLength={20}
          placeholder="2~20자 (다른 사용자에게 표시됩니다)" className="input" />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">이메일</label>
        <input name="email" type="email" required autoComplete="email"
          placeholder="@gmail.com 또는 @naver.com" className="input" />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">비밀번호</label>
        <div className="relative">
          <input name="password" type={showPw ? "text" : "password"} required
            autoComplete="new-password" placeholder="8자 이상" className="input pr-10" />
          <button type="button" onClick={() => setShowPw(p => !p)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
            {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">비밀번호 확인</label>
        <input name="confirm" type={showPw ? "text" : "password"} required
          autoComplete="new-password" placeholder="비밀번호 재입력" className="input" />
      </div>

      <button type="submit" disabled={isPending} className="btn-primary w-full py-2.5">
        {isPending ? <Loader2 size={15} className="animate-spin" /> : null}
        {isPending ? "가입 중..." : "회원가입"}
      </button>

      <p className="text-center text-sm text-slate-500 dark:text-slate-400">
        이미 계정이 있으신가요?{" "}
        <Link href="/login" className="text-brand-600 dark:text-brand-400 hover:underline font-medium">로그인</Link>
      </p>
    </form>
  );
}
