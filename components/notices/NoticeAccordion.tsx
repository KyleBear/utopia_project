"use client";

import { useState } from "react";
import Link from "next/link";
import { Bell, ChevronDown, ChevronUp } from "lucide-react";

type Notice = {
  id: string;
  title: string;
  content: string | null;
  is_pinned: boolean;
  created_at: string;
};

type Props = {
  pinned: Notice | null;
  recent: Notice[];
};

export function NoticeAccordion({ pinned, recent }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      {/* 필독 공지 */}
      {pinned && (
        <Link
          href={`/notices/${pinned.id}`}
          className="flex items-start gap-2 px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-brand-50 dark:bg-brand-950/30 hover:bg-brand-100 dark:hover:bg-brand-950/50 transition-colors"
        >
          <span className="shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded bg-brand-500 text-white mt-0.5">필독</span>
          <p className="text-xs font-medium text-slate-800 dark:text-slate-200 leading-snug line-clamp-2">
            {pinned.title}
          </p>
        </Link>
      )}

      {/* 공지사항 헤더 — 클릭 시 목록 토글 */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Bell size={13} className="text-brand-500" />
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">공지사항</span>
          {recent.length > 0 && (
            <span className="text-[10px] text-slate-400">{recent.length}</span>
          )}
        </div>
        {open ? (
          <ChevronUp size={13} className="text-slate-400" />
        ) : (
          <ChevronDown size={13} className="text-slate-400" />
        )}
      </button>

      {/* 공지 목록 — 펼쳐질 때 */}
      {open && (
        <ul className="divide-y divide-slate-100 dark:divide-slate-800 border-t border-slate-100 dark:border-slate-800">
          {recent.length === 0 ? (
            <li className="px-4 py-3 text-xs text-slate-400 dark:text-slate-600 text-center">
              공지사항이 없습니다.
            </li>
          ) : (
            recent.map((notice) => (
              <li key={notice.id}>
                <Link
                  href={`/notices/${notice.id}`}
                  className="flex items-center gap-2 px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
                >
                  <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600 shrink-0" />
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-snug line-clamp-1 group-hover:text-brand-500 transition-colors">
                    {notice.title}
                  </p>
                </Link>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
