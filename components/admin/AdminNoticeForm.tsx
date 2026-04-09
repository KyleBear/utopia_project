"use client";

import { useState } from "react";
import { createNotice } from "@/lib/actions/notices";
import { Loader2, Plus } from "lucide-react";

export function AdminNoticeForm() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const formData = new FormData(e.currentTarget);
    const result = await createNotice(formData);
    setPending(false);
    if (result?.error) {
      setError(result.error);
    } else {
      (e.target as HTMLFormElement).reset();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">새 공지 작성</h3>
      {error && <p className="text-xs text-red-500">{error}</p>}
      <input
        name="title"
        type="text"
        required
        maxLength={100}
        placeholder="공지 제목"
        className="input text-sm"
      />
      <textarea
        name="content"
        rows={3}
        maxLength={1000}
        placeholder="공지 내용 (선택)"
        className="input text-sm resize-none"
      />
      <button type="submit" disabled={pending} className="btn-primary text-xs px-4 py-2">
        {pending ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />}
        공지 등록
      </button>
    </form>
  );
}
