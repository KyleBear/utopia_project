"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { deleteNotice } from "@/lib/actions/notices";
import { useRouter } from "next/navigation";

export function AdminDeleteNoticeButton({ id }: { id: string }) {
  const [pending, setPending] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("이 공지를 삭제하시겠습니까?")) return;
    setPending(true);
    await deleteNotice(id);
    setPending(false);
    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      disabled={pending}
      className="p-1.5 text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors disabled:opacity-50"
    >
      {pending ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
    </button>
  );
}
