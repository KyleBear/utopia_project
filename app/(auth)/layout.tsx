import Link from "next/link";
import { Sparkles } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0a0a0f]">
      <header className="px-6 py-4 flex items-center justify-between max-w-sm mx-auto w-full">
        <Link href="/" className="flex items-center gap-1.5 font-bold text-lg">
          <Sparkles size={16} className="text-brand-500" />
          <span className="bg-gradient-to-r from-brand-600 to-brand-400 bg-clip-text text-transparent">
            Utopia
          </span>
        </Link>
        <ThemeToggle />
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-sm">
          {children}
        </div>
      </main>
    </div>
  );
}
