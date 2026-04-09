import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getPost } from "@/lib/data/posts";
import { createClient } from "@/lib/supabase/server";
import { EditPostForm } from "@/components/posts/EditPostForm";
import { ArrowLeft } from "lucide-react";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [post, supabase] = await Promise.all([getPost(id), createClient()]);

  if (!post) notFound();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.id !== post.user_id) redirect(`/posts/${id}`);

  return (
    <div className="max-w-xl mx-auto space-y-5 animate-slide-up">
      <Link href={`/posts/${id}`} className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
        <ArrowLeft size={14} />
        돌아가기
      </Link>

      <div className="card p-5 space-y-5">
        <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100">글 수정</h1>
        <EditPostForm post={post} />
      </div>
    </div>
  );
}
