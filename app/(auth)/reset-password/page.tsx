import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export const metadata = { title: "비밀번호 재설정 — Utopia" };

export default function ResetPasswordPage() {
  return (
    <div className="card p-6 space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">비밀번호 재설정</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          가입한 이메일로 재설정 링크를 보내드립니다
        </p>
      </div>
      <ResetPasswordForm />
    </div>
  );
}
