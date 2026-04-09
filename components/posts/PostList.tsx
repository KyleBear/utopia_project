import { getPosts } from "@/lib/data/posts";
import { PostCard } from "./PostCard";
import { Pagination } from "./Pagination";
import { FileQuestion, ServerCrash } from "lucide-react";
import type { SortOption } from "@/lib/types";

const PAGE_SIZE = 15;

export async function PostList({ sort, page, category, search = "", tag = "" }: {
  sort: SortOption;
  page: number;
  category: string;
  search?: string;
  tag?: string;
}) {
  const isConfigured =
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder");

  if (!isConfigured) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-2 text-slate-400 dark:text-slate-600">
        <ServerCrash size={36} className="mb-1 opacity-50" />
        <p className="text-sm font-medium">Supabase 연결이 설정되지 않았습니다</p>
      </div>
    );
  }

  const { posts, total } = await getPosts(sort, page, category, search, tag);

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400 dark:text-slate-600">
        <FileQuestion size={36} className="mb-3 opacity-50" />
        <p className="text-sm">
          {search ? `"${search}"에 대한 검색 결과가 없습니다.` :
           tag ? `#${tag} 태그의 글이 없습니다.` :
           "아직 게시글이 없습니다."}
        </p>
        {(search || tag) && <p className="text-xs mt-1">다른 검색어나 태그를 시도해보세요.</p>}
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-2">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
      <Pagination total={total} pageSize={PAGE_SIZE} currentPage={page} />
    </div>
  );
}
