import { getNotices } from "@/lib/actions/notices";
import { Bell, Megaphone } from "lucide-react";
import { timeAgo } from "@/lib/utils";

export async function NoticesSidebar() {
  const notices = await getNotices();

  return (
    <aside className="space-y-3">
      {/* 공지사항 */}
      <div className="card overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <Bell size={13} className="text-brand-500" />
          <h2 className="text-xs font-semibold text-slate-700 dark:text-slate-300">공지사항</h2>
        </div>

        {notices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 gap-2 text-slate-400 dark:text-slate-600">
            <Megaphone size={22} className="opacity-40" />
            <p className="text-xs">공지사항이 없습니다.</p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {notices.map((notice) => (
              <li key={notice.id} className="px-4 py-3 space-y-1">
                <p className="text-xs font-medium text-slate-800 dark:text-slate-200 leading-snug">
                  {notice.title}
                </p>
                {notice.content && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed whitespace-pre-wrap">
                    {notice.content}
                  </p>
                )}
                <p className="text-[10px] text-slate-300 dark:text-slate-600">
                  {timeAgo(notice.created_at)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}
