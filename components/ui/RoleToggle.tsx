"use client";

import { useTransition } from "react";
import { setRole } from "@/lib/actions/role";
import type { UserRole } from "@/lib/types";
import { Users, Briefcase } from "lucide-react";

export function RoleToggle({ currentRole }: { currentRole: UserRole }) {
  const [isPending, startTransition] = useTransition();

  function toggle() {
    const next: UserRole = currentRole === "client" ? "expert" : "client";
    startTransition(() => setRole(next));
  }

  return (
    <button
      onClick={toggle}
      disabled={isPending}
      className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-colors
        border-slate-200 dark:border-slate-700
        bg-slate-50 dark:bg-slate-800/50
        hover:bg-slate-100 dark:hover:bg-slate-700
        disabled:opacity-50"
      title={currentRole === "client" ? "전문가 모드로 전환" : "의뢰자 모드로 전환"}
    >
      {currentRole === "client" ? (
        <>
          <Users size={13} className="text-slate-400" />
          <span className="text-slate-500 dark:text-slate-400">의뢰자</span>
        </>
      ) : (
        <>
          <Briefcase size={13} className="text-brand-500" />
          <span className="text-brand-500">전문가</span>
        </>
      )}
    </button>
  );
}
