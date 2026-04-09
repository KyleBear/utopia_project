"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition, useEffect, useState } from "react";
import { Search, X } from "lucide-react";

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const [value, setValue] = useState(searchParams.get("search") ?? "");

  // URL의 search param이 바뀌면 input도 동기화
  useEffect(() => {
    setValue(searchParams.get("search") ?? "");
  }, [searchParams]);

  // 300ms debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set("search", value);
      } else {
        params.delete("search");
      }
      params.delete("page");
      startTransition(() => {
        router.replace(`/?${params.toString()}`);
      });
    }, 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  function clear() {
    setValue("");
  }

  return (
    <div className="relative">
      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder="제목 또는 내용 검색..."
        className="input pl-8 pr-8 py-2 text-sm w-full"
      />
      {value && (
        <button
          onClick={clear}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
