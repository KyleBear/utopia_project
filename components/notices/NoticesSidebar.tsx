import { getPinnedNotice, getRecentNotices } from "@/lib/actions/notices";
import { AdBanner } from "@/components/ui/AdBanner";
import { ExpertBanner } from "@/components/ui/ExpertBanner";
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

      {/* 전문가 신뢰 배너 */}
      <ExpertBanner />

      {/* 광고 배너 */}
      <AdBanner />
    </aside>
  );
}
