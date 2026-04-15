import Link from "next/link";

export function AdBanner() {
  return (
    <Link
      href="https://heart-link-web.vercel.app/"
      target="_blank"
      rel="noopener noreferrer"
      className="block group"
    >
      <div className="relative overflow-hidden rounded-xl border border-pink-200 dark:border-pink-900/50 bg-gradient-to-br from-pink-50 via-rose-50 to-red-50 dark:from-pink-950/40 dark:via-rose-950/30 dark:to-red-950/40 p-4 space-y-3 hover:shadow-md hover:shadow-pink-100 dark:hover:shadow-pink-950/30 transition-all duration-200">

        {/* 배경 하트 장식 */}
        <div className="absolute -top-3 -right-3 text-6xl opacity-10 select-none pointer-events-none">
          ❤️
        </div>
        <div className="absolute -bottom-2 -left-2 text-4xl opacity-10 select-none pointer-events-none">
          💕
        </div>

        {/* 상단 라벨 */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-medium text-pink-400 dark:text-pink-500 uppercase tracking-wider">
            AD
          </span>
          <span className="text-[10px] text-pink-300 dark:text-pink-700">
            소개팅 앱
          </span>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="text-center space-y-2">
          <div className="text-3xl leading-none">💝</div>
          <div>
            <p className="text-sm font-bold text-pink-600 dark:text-pink-400 leading-tight">
              Heart Link
            </p>
            <p className="text-xs text-rose-500 dark:text-rose-400 mt-0.5">
              인연을 연결해드려요
            </p>
          </div>
        </div>

        {/* 하트 라인 */}
        <div className="flex items-center justify-center gap-1 text-pink-300 dark:text-pink-700 text-xs">
          <span>♥</span><span>♥</span><span>♥</span>
        </div>

        {/* CTA 버튼 */}
        <div className="w-full text-center py-1.5 rounded-lg bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-semibold group-hover:from-pink-600 group-hover:to-rose-600 transition-all">
          지금 만나러 가기 →
        </div>
      </div>
    </Link>
  );
}
