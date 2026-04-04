import { SignupForm } from "@/components/auth/SignupForm";

export const metadata = { title: "회원가입 — Utopia" };

export default function SignupPage() {
  return (
    <div className="card p-6 space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">회원가입</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Utopia에 오신 것을 환영합니다
        </p>
      </div>
      <SignupForm />
    </div>
  );
}
