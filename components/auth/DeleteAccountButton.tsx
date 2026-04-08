"use client";

import { useState, useTransition } from "react";
import { deleteAccount } from "@/lib/actions/auth";
import { Loader2, Trash2 } from "lucide-react";

export function DeleteAccountButton() {
  const [confirm, setConfirm] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteAccount();
      if (result?.error) setError(result.error);
    });
  }

  if (!confirm) {
    return (
      <button
        onClick={() => setConfirm(true)}
        className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 dark:hover:text-red-400 font-medium transition-colors"
      >
        <Trash2 size={14} />
        회원 탈퇴
      </button>
    );
  }

  return (
    <div className="space-y-3">
      {error && <p className="text-xs text-red-500">{error}</p>}
      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
        정말 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.
      </p>
      <div className="flex gap-2">
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50"
        >
          {isPending ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
          {isPending ? "탈퇴 중..." : "탈퇴 확인"}
        </button>
        <button
          onClick={() => setConfirm(false)}
          disabled={isPending}
          className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
        >
          취소
        </button>
      </div>
    </div>
  );
}
