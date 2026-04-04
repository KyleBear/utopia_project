import { getPosts } from "@/lib/actions/posts";
import { PostCard } from "./PostCard";
import { FileQuestion, ServerCrash } from "lucide-react";
import type { SortOption } from "@/lib/types";

export async function PostList({ sort }: { sort: SortOption }) {
  const isConfigured =
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder");

  if (!isConfigured) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-2 text-slate-400 dark:text-slate-600">
        <ServerCrash size={36} className="mb-1 opacity-50" />
        <p className="text-sm font-medium">Supabase 연결이 설정되지 않았습니다</p>
        <p className="text-xs text-center leading-relaxed">
          <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-slate-500">
            .env.local
          </code>{" "}
          에 실제 Supabase URL과 anon key를 입력해주세요.
        </p>
      </div>
    );
  }

  const posts = await getPosts(sort);

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400 dark:text-slate-600">
        <FileQuestion size={36} className="mb-3 opacity-50" />
        <p className="text-sm">아직 게시글이 없습니다.</p>
        <p className="text-xs mt-1">첫 번째 고민을 나눠보세요!</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
