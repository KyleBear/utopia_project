import { PostForm } from "@/components/posts/PostForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewPostPage() {
  return (
    <div className="max-w-xl mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <Link href="/" className="btn-ghost p-2 -ml-2">
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100">고민 올리기</h1>
          <p className="text-xs text-slate-400 mt-0.5">익명으로 고민을 나눠보세요</p>
        </div>
      </div>

      <div className="card p-5">
        <PostForm />
      </div>
    </div>
  );
}
