import { Suspense } from "react";
import Link from "next/link";
import { PostList } from "@/components/posts/PostList";
import { SortTabs } from "@/components/posts/SortTabs";
import { CategoryTabs } from "@/components/posts/CategoryTabs";
import { SearchBar } from "@/components/posts/SearchBar";
import { NoticesSidebar } from "@/components/notices/NoticesSidebar";
import { getRole } from "@/lib/actions/role";
import { getExpertList } from "@/lib/data/experts";
import { PenLine, Loader2, X, Briefcase, Users, BadgeCheck, ArrowRight } from "lucide-react";
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

  const role = await getRole();
  const isExpert = role === "expert";

  // 전문가 모드일 때 전문가 목록 미리 로드
  const experts = isExpert ? await getExpertList(6) : [];

  return (
    <div className="flex gap-6 items-start">
      {/* 메인 콘텐츠 */}
      <div className="flex-1 min-w-0 space-y-4">

        {/* Hero — 역할별 동선 분리 */}
        {isExpert ? (
          /* 전문가 동선 */
          <div className="card p-5 bg-gradient-to-br from-violet-50 to-white dark:from-violet-950/30 dark:to-slate-900 border-violet-100 dark:border-violet-900/40 space-y-3">
            <div className="flex items-center gap-2">
              <Briefcase size={16} className="text-brand-500" />
              <span className="text-xs font-semibold text-brand-500 uppercase tracking-wide">전문가 모드</span>
            </div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              전문가로서 도움을 나눠보세요 ✦
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              프로필을 완성하고 의뢰자들에게 전문성을 알려보세요.
            </p>
            <div className="flex gap-2">
              <Link href="/profile" className="btn-primary mt-1 w-fit text-xs">
                <Briefcase size={13} />
                내 전문가 프로필
              </Link>
              <Link href="/posts" className="btn-ghost mt-1 w-fit text-xs">
                <Users size={13} />
                의뢰 보러가기
              </Link>
            </div>
          </div>
        ) : (
          /* 의뢰자 동선 */
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
        )}

        {/* 전문가 모드: 등록된 전문가 목록 */}
        {isExpert && experts.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <BadgeCheck size={14} className="text-brand-500" />
                활동 중인 전문가
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {experts.map((expert) => (
                <Link
                  key={expert.id}
                  href={`/e/${expert.slug}`}
                  className="card p-3 flex items-center gap-3 hover:border-brand-200 dark:hover:border-brand-800 transition-colors group"
                >
                  <div className="w-9 h-9 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center shrink-0 text-sm font-bold text-brand-500">
                    {(expert.nickname ?? expert.slug).charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1">
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
                        {expert.nickname ?? expert.slug}
                      </p>
                      <BadgeCheck size={12} className="text-brand-500 shrink-0" />
                    </div>
                    {expert.expertise.length > 0 && (
                      <p className="text-xs text-slate-400 truncate">
                        {expert.expertise.slice(0, 2).join(" · ")}
                      </p>
                    )}
                  </div>
                  <ArrowRight size={14} className="text-slate-300 dark:text-slate-600 group-hover:text-brand-400 transition-colors shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        )}

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
