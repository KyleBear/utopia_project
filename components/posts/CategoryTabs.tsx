"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { CATEGORIES, type Category } from "@/lib/types";

const CATEGORY_COLORS: Record<string, string> = {
  전체: "bg-slate-700 text-white dark:bg-slate-200 dark:text-slate-900",
  연애: "bg-pink-500 text-white",
  직장: "bg-blue-500 text-white",
  학교: "bg-green-500 text-white",
  가족: "bg-orange-500 text-white",
  기타: "bg-slate-500 text-white",
};

export function CategoryTabs({ current }: { current: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleClick(value: Category) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("category", value);
    params.delete("page");
    router.push(`/?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {CATEGORIES.map((cat) => (
        <button key={cat} onClick={() => handleClick(cat)}
          className={cn(
            "px-3 py-1 text-xs font-medium rounded-full transition-all",
            current === cat
              ? CATEGORY_COLORS[cat]
              : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
          )}>
          {cat}
        </button>
      ))}
    </div>
  );
}

export function CategoryBadge({ category }: { category: string }) {
  return (
    <span className={cn(
      "inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full",
      CATEGORY_COLORS[category] ?? CATEGORY_COLORS["기타"]
    )}>
      {category}
    </span>
  );
}
