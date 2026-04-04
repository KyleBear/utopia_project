"use client";

import { useState, useTransition } from "react";
import { toggleLike } from "@/lib/actions/likes";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

export function LikeButton({
  postId,
  initialCount,
  initialLiked,
  isLoggedIn,
}: {
  postId: string;
  initialCount: number;
  initialLiked: boolean;
  isLoggedIn: boolean;
}) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!isLoggedIn) {
      window.location.href = "/login";
      return;
    }
    // Optimistic update
    setLiked((p) => !p);
    setCount((c) => (liked ? c - 1 : c + 1));

    startTransition(async () => {
      const result = await toggleLike(postId);
      if (result?.error) {
        // Revert on error
        setLiked((p) => !p);
        setCount((c) => (liked ? c + 1 : c - 1));
      }
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all duration-150",
        liked
          ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-500 dark:text-red-400"
          : "border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-red-200 dark:hover:border-red-800 hover:text-red-400"
      )}
    >
      <Heart
        size={15}
        className={cn("transition-transform", liked && "fill-current scale-110")}
      />
      <span>{count}</span>
    </button>
  );
}
