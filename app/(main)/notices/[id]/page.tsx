import { notFound } from "next/navigation";
import Link from "next/link";
import { getNoticeById } from "@/lib/actions/notices";
import { timeAgo } from "@/lib/utils";
import { ArrowLeft, Bell } from "lucide-react";

export const revalidate = 60;

export default async function NoticePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const notice = await getNoticeById(id);
  if (!notice) notFound();

  return (
    <div className="max-w-xl mx-auto space-y-5 animate-slide-up">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
        <ArrowLeft size={14} />
        홈으로
      </Link>

      <div className="card p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Bell size={14} className="text-brand-500" />
          {notice.is_pinned && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-brand-500 text-white">필독</span>
          )}
          <span className="text-[10px] text-slate-400">{timeAgo(notice.created_at)}</span>
        </div>

        <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100 leading-snug">
          {notice.title}
        </h1>

        {notice.content && (
          <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
              {notice.content}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
