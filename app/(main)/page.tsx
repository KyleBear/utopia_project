import { Suspense } from "react";
import Link from "next/link";
import { PostList } from "@/components/posts/PostList";
import { SortTabs } from "@/components/posts/SortTabs";
import { CategoryTabs } from "@/components/posts/CategoryTabs";
import { PenLine, Loader2 } from "lucide-react";
import type { SortOption } from "@/lib/types";

export const revalidate = 30;

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string; page?: string; category?: string }>;
}) {
  const { sort, page, category } = await searchParams;
  const currentSort: SortOption = sort === "popular" ? "popular" : "latest";
  const currentPage = Math.max(1, parseInt(page ?? "1"));
  const currentCategory = category ?? "전체";

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

      {/* 카테고리 */}
      <Suspense fallback={null}>
        <CategoryTabs current={currentCategory} />
      </Suspense>

      {/* 정렬 */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-400 dark:text-slate-600">
          {currentCategory !== "전체" ? `#${currentCategory}` : "전체 글"}
        </p>
        <Suspense fallback={null}>
          <SortTabs current={currentSort} />
        </Suspense>
      </div>

      {/* 목록 */}
      <Suspense fallback={
        <div className="flex justify-center py-12">
          <Loader2 size={20} className="animate-spin text-slate-400" />
        </div>
      }>
        <PostList sort={currentSort} page={currentPage} category={currentCategory} />
      </Suspense>
    </div>
  );
}
