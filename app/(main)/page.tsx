import { Suspense } from "react";
import Link from "next/link";
import { PostList } from "@/components/posts/PostList";
import { SortTabs } from "@/components/posts/SortTabs";
import { CategoryTabs } from "@/components/posts/CategoryTabs";
import { SearchBar } from "@/components/posts/SearchBar";
import { NoticesSidebar } from "@/components/notices/NoticesSidebar";
import { AdBanner } from "@/components/ui/AdBanner";
import { ExpertBanner } from "@/components/ui/ExpertBanner";
import { PenLine, Loader2, X } from "lucide-react";
import type { SortOption } from "@/lib/types";

export const revalidate = 30;

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string; page?: string; category?: string; search?: string; tag?: string }>;
}) {
  const { sort, page, category, search, tag } = await searchParams;
  const currentSort: SortOption = sort === "popular" ? "popular" : "latest";
  const currentPage = Math.max(1, parseInt(page ?? "1"));
  const currentCategory = category ?? "전체";
  const currentSearch = search ?? "";
  const currentTag = tag ?? "";

  return (
    <div className="flex gap-6 items-start">
      {/* 메인 콘텐츠 */}
      <div className="flex-1 min-w-0 space-y-4">
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

        {/* 검색 */}
        <Suspense fallback={null}>
          <SearchBar />
        </Suspense>

        {/* 카테고리 */}
        <Suspense fallback={null}>
          <CategoryTabs current={currentCategory} />
        </Suspense>

        {/* 정렬 + 필터 상태 */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            {currentSearch && (
              <Link href={`/?${new URLSearchParams({ sort: currentSort, category: currentCategory, ...(currentTag ? { tag: currentTag } : {}) }).toString()}`}
                className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700">
                검색: {currentSearch}<X size={10} />
              </Link>
            )}
            {currentTag && (
              <Link href={`/?${new URLSearchParams({ sort: currentSort, category: currentCategory, ...(currentSearch ? { search: currentSearch } : {}) }).toString()}`}
                className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 rounded-full hover:bg-brand-100 dark:hover:bg-brand-900/40">
                #{currentTag}<X size={10} />
              </Link>
            )}
            {!currentSearch && !currentTag && (
              <p className="text-xs text-slate-400 dark:text-slate-600">
                {currentCategory !== "전체" ? `#${currentCategory}` : "전체 글"}
              </p>
            )}
          </div>
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
          <PostList
            sort={currentSort}
            page={currentPage}
            category={currentCategory}
            search={currentSearch}
            tag={currentTag}
          />
        </Suspense>

        {/* 모바일 전문가 배너 + 광고 배너 — lg 미만에서만 노출 */}
        <div className="block lg:hidden space-y-3">
          <ExpertBanner />
          <AdBanner />
        </div>
      </div>

      {/* 사이드바 */}
      <div className="hidden lg:block w-64 shrink-0 sticky top-20">
        <Suspense fallback={null}>
          <NoticesSidebar />
        </Suspense>
      </div>
    </div>
  );
}
