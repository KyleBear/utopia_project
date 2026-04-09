"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function Pagination({ total, pageSize, currentPage }: {
  total: number;
  pageSize: number;
  currentPage: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const totalPages = Math.ceil(total / pageSize);

  if (totalPages <= 1) return null;

  function goTo(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    startTransition(() => {
      router.push(`/?${params.toString()}`);
    });
  }

  // 최대 5개 페이지 버튼
  const start = Math.max(1, currentPage - 2);
  const end   = Math.min(totalPages, start + 4);
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  return (
    <div className={cn("flex items-center justify-center gap-1 mt-6", isPending && "opacity-60 pointer-events-none")}>
      <button onClick={() => goTo(currentPage - 1)} disabled={currentPage === 1}
        className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30">
        <ChevronLeft size={16} />
      </button>

      {start > 1 && (
        <>
          <button onClick={() => goTo(1)} className="w-8 h-8 text-xs rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500">1</button>
          {start > 2 && <span className="text-slate-400 text-xs px-1">…</span>}
        </>
      )}

      {pages.map(p => (
        <button key={p} onClick={() => goTo(p)}
          className={cn(
            "w-8 h-8 text-xs rounded-lg font-medium transition-colors",
            p === currentPage
              ? "bg-brand-600 text-white"
              : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400"
          )}>
          {p}
        </button>
      ))}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="text-slate-400 text-xs px-1">…</span>}
          <button onClick={() => goTo(totalPages)} className="w-8 h-8 text-xs rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500">{totalPages}</button>
        </>
      )}

      <button onClick={() => goTo(currentPage + 1)} disabled={currentPage === totalPages}
        className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30">
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
