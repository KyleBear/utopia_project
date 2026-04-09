"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { cn } from "@/lib/utils";
import { Clock, TrendingUp } from "lucide-react";

const tabs = [
  { value: "latest", label: "최신순", icon: Clock },
  { value: "popular", label: "인기순", icon: TrendingUp },
];

export function SortTabs({ current }: { current: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  function handleClick(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    startTransition(() => {
      router.replace(`/?${params.toString()}`);
    });
  }

  return (
    <div className="flex gap-1">
      {tabs.map(({ value, label, icon: Icon }) => (
        <button
          key={value}
          onClick={() => handleClick(value)}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors",
            current === value
              ? "bg-brand-600 text-white"
              : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          )}
        >
          <Icon size={12} />
          {label}
        </button>
      ))}
    </div>
  );
}
