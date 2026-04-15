import Link from "next/link";

export function AdBanner() {
  return (
    <Link
      href="https://heart-link-web.vercel.app/"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block group"
    >
      <div className="relative overflow-hidden rounded-xl border border-pink-200 dark:border-pink-900/50 bg-gradient-to-br from-pink-50 via-rose-50 to-red-50 dark:from-pink-950/40 dark:via-rose-950/30 dark:to-red-950/40 px-3 py-2.5 flex items-center gap-3 hover:shadow-md hover:shadow-pink-100 dark:hover:shadow-pink-950/30 transition-all duration-200">

        {/* 배경 하트 장식 */}
        <div className="absolute -top-2 -right-2 text-4xl opacity-10 select-none pointer-events-none">❤️</div>

        {/* 아이콘 */}
        <div className="text-xl leading-none shrink-0">💝</div>

        {/* 텍스트 */}
        <div>
          <p className="text-xs font-bold text-pink-600 dark:text-pink-400 leading-tight">Heart Vibe</p>
          <p className="text-[10px] text-rose-400 dark:text-rose-500">인연을 연결해드려요</p>
        </div>

        {/* CTA */}
        <div className="shrink-0 px-2.5 py-1 rounded-lg bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[10px] font-semibold group-hover:from-pink-600 group-hover:to-rose-600 transition-all">
          바로가기 →
        </div>

        {/* AD 라벨 */}
        <span className="absolute top-1 right-1.5 text-[9px] text-pink-300 dark:text-pink-700">AD</span>
      </div>
    </Link>
  );
}
