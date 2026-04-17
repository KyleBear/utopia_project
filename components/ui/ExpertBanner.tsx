import Image from "next/image";

const AVATARS = [
  "https://randomuser.me/api/portraits/women/44.jpg",
  "https://randomuser.me/api/portraits/men/32.jpg",
  "https://randomuser.me/api/portraits/women/68.jpg",
];

export function ExpertBanner() {
  return (
    <div className="relative overflow-hidden rounded-xl border border-violet-200 dark:border-violet-900/50 bg-gradient-to-br from-violet-50 via-indigo-50 to-blue-50 dark:from-violet-950/40 dark:via-indigo-950/30 dark:to-blue-950/40 px-3 py-2.5 flex items-center gap-3">

      {/* 배경 장식 */}
      <div className="absolute -top-2 -right-2 text-4xl opacity-10 select-none pointer-events-none">💬</div>

      {/* 아바타 스택 */}
      <div className="flex -space-x-2 shrink-0">
        {AVATARS.map((src, i) => (
          <div
            key={i}
            className="relative w-6 h-6 rounded-full border-2 border-white dark:border-slate-800 overflow-hidden"
          >
            <Image src={src} alt="전문가" fill className="object-cover" unoptimized />
          </div>
        ))}
      </div>

      {/* 텍스트 */}
      <div className="group/text flex-1 min-w-0 relative">
        <p className="text-xs font-bold text-violet-700 dark:text-violet-300 leading-tight">
          익명 전문가가 함께해요
        </p>
        <p className="text-[10px] text-indigo-400 dark:text-indigo-500 truncate">
          심리상담사 · 정신건강전문가 활동 중
        </p>

        {/* 호버 툴팁 */}
        <div className="pointer-events-none absolute bottom-full left-0 mb-2 hidden group-hover/text:block z-50">
          <div className="rounded-lg bg-slate-800 dark:bg-slate-700 text-white text-[10px] leading-relaxed px-2.5 py-2 shadow-lg w-52">
            유토피아는 심리상담사·정신건강전문가·임상심리사 등이 익명으로 활동하며 진심 어린 답변을 드리는 무료 익명 상담 커뮤니티예요.
          </div>
          {/* 말풍선 꼬리 */}
          <div className="ml-3 w-2 h-2 bg-slate-800 dark:bg-slate-700 rotate-45 -mt-1" />
        </div>
      </div>

      {/* 뱃지 */}
      <div className="shrink-0 px-2.5 py-1 rounded-lg bg-gradient-to-r from-violet-500 to-indigo-500 text-white text-[10px] font-semibold">
        무료 익명 상담
      </div>
    </div>
  );
}
