import { LoginForm } from "@/components/auth/LoginForm";

export const metadata = { title: "로그인 — Utopia" };

export default function LoginPage() {
  return (
    <div className="card p-6 space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">로그인</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          계정으로 로그인하여 고민을 나눠보세요
        </p>
      </div>
      <LoginForm />
    </div>
  );
}
