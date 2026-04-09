import { Header } from "@/components/ui/Header";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-6">
        {children}
      </main>
      <footer className="border-t border-slate-200 dark:border-slate-800 py-5 text-center text-xs text-slate-400 dark:text-slate-600 space-y-1">
        <p>© 2025 Utopia — 당신의 고민을 함께 나눠요</p>
        <p>
          오류 및 관계자 문의:{" "}
          <a href="mailto:utopia3112@gmail.com" className="hover:text-slate-600 dark:hover:text-slate-400 underline underline-offset-2 transition-colors">
            utopia3112@gmail.com
          </a>
        </p>
      </footer>
    </div>
  );
}
