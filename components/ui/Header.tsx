import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/lib/actions/auth";
import { ThemeToggle } from "./ThemeToggle";
import { PenLine, Sparkles, ScrollText, UserRound } from "lucide-react";

export async function Header() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#0a0a0f]/80 backdrop-blur-md">
      <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1.5 font-bold text-lg tracking-tight">
          <Sparkles size={18} className="text-brand-500" />
          <span className="bg-gradient-to-r from-brand-600 to-brand-400 bg-clip-text text-transparent">
            Utopia
          </span>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          {user ? (
            <>
              <Link href="/my-posts" className="btn-ghost text-xs px-3 py-1.5">
                <ScrollText size={13} />
                내 글
              </Link>
              <Link href="/profile" className="btn-ghost text-xs px-3 py-1.5">
                <UserRound size={13} />
                내 정보
              </Link>
              <Link href="/posts/new" className="btn-primary text-xs px-3 py-1.5">
                <PenLine size={13} />
                글쓰기
              </Link>
              <form action={logout}>
                <button type="submit" className="btn-ghost text-xs px-3 py-1.5">
                  로그아웃
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-ghost text-xs px-3 py-1.5">
                로그인
              </Link>
              <Link href="/signup" className="btn-primary text-xs px-3 py-1.5">
                가입하기
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
