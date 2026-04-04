import { Suspense } from "react";
import Link from "next/link";
import { PostList } from "@/components/posts/PostList";
import { SortTabs } from "@/components/posts/SortTabs";
import { PenLine, Loader2 } from "lucide-react";
import type { SortOption } from "@/lib/types";

export const revalidate = 0;

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string }>;
}) {
  const { sort } = await searchParams;
  const currentSort: SortOption = sort === "popular" ? "popular" : "latest";

  return (
    <div className="space-y-5">
      {/* Hero */}
      <div className="card p-5 bg-gradient-to-br from-brand-50 to-white dark:from-brand-950/30 dark:to-slate-900 border-brand-100 dark:border-brand-900/40">
        <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100">
          당신의 고민을 나눠보세요 💬
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          익명으로 자유롭게, 따뜻한 위로와 진심 어린 조언을 받을 수 있어요.
        </p>
        <Link href="/posts/new" className="btn-primary mt-3 w-fit text-xs">
          <PenLine size={13} />
          고민 올리기
        </Link>
      </div>

      {/* Sort + List */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300">게시글</h2>
        <SortTabs current={currentSort} />
      </div>

      <Suspense
        fallback={
          <div className="flex justify-center py-12">
            <Loader2 size={20} className="animate-spin text-slate-400" />
          </div>
        }
      >
        <PostList sort={currentSort} />
      </Suspense>
    </div>
  );
}
