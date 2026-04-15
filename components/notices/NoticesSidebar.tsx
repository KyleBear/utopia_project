import { getPinnedNotice, getRecentNotices } from "@/lib/actions/notices";
import { AdBanner } from "@/components/ui/AdBanner";
import { NoticeAccordion } from "./NoticeAccordion";

export async function NoticesSidebar() {
  const [pinned, recent] = await Promise.all([
    getPinnedNotice(),
    getRecentNotices(3),
  ]);

  return (
    <aside className="space-y-3">
      <div className="card overflow-hidden">
        <NoticeAccordion pinned={pinned} recent={recent} />
      </div>

      {/* 광고 배너 */}
      <AdBanner />
    </aside>
  );
}
