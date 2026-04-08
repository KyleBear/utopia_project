import { FindAccountForm } from "@/components/auth/FindAccountForm";

export const metadata = { title: "아이디 찾기 — Utopia" };

export default function FindAccountPage() {
  return (
    <div className="card p-6 space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">아이디 찾기</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          가입 시 설정한 닉네임으로 이메일을 찾습니다
        </p>
      </div>
      <FindAccountForm />
    </div>
  );
}
