"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { adminDeletePost, adminDeleteUser } from "@/lib/actions/admin";
import { useRouter } from "next/navigation";

export function AdminDeletePostButton({ postId }: { postId: string }) {
  const [pending, setPending] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("이 글을 삭제하시겠습니까?")) return;
    setPending(true);
    const result = await adminDeletePost(postId);
    if (result?.error) {
      alert("삭제 실패: " + result.error);
    }
    setPending(false);
    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      disabled={pending}
      className="flex items-center gap-1 px-2 py-1 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors disabled:opacity-50"
    >
      {pending ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
      삭제
    </button>
  );
}

export function AdminDeleteUserButton({ userId, nickname }: { userId: string; nickname: string }) {
  const [pending, setPending] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    if (!confirm(`"${nickname || "이 회원"}"을 탈퇴 처리하시겠습니까?\n해당 회원의 모든 글과 댓글이 삭제됩니다.`)) return;
    setPending(true);
    const result = await adminDeleteUser(userId);
    if (result?.error) {
      alert("삭제 실패: " + result.error);
    }
    setPending(false);
    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      disabled={pending}
      className="flex items-center gap-1 px-2 py-1 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors disabled:opacity-50"
    >
      {pending ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
      탈퇴
    </button>
  );
}
