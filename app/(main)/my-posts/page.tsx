import { redirect } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { getMyPosts } from "@/lib/data/posts";
import { PostCard } from "@/components/posts/PostCard";
import { Pagination } from "@/components/posts/Pagination";
import { ArrowLeft, FileQuestion, Loader2 } from "lucide-react";

export const revalidate = 0;

const PAGE_SIZE = 15;

export default async function MyPostsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { page } = await searchParams;
  const currentPage = Math.max(1, parseInt(page ?? "1"));

  return (
    <div className="max-w-xl mx-auto space-y-5 animate-slide-up">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
        <ArrowLeft size={14} />
        홈으로
      </Link>

      <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100">내가 쓴 글</h1>

      <Suspense fallback={
        <div className="flex justify-center py-12">
          <Loader2 size={20} className="animate-spin text-slate-400" />
        </div>
      }>
        <MyPostList page={currentPage} />
      </Suspense>
    </div>
  );
}

async function MyPostList({ page }: { page: number }) {
  const { posts, total } = await getMyPosts(page);

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400 dark:text-slate-600">
        <FileQuestion size={36} className="mb-3 opacity-50" />
        <p className="text-sm">아직 작성한 글이 없습니다.</p>
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
