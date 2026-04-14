import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { DeleteAccountButton } from "@/components/auth/DeleteAccountButton";
import { ExpertProfileForm } from "@/components/profile/ExpertProfileForm";
import { getMyExpertProfile } from "@/lib/data/experts";
import { generateSlugFromNickname } from "@/lib/actions/profile";
import { ArrowLeft, UserRound, BadgeCheck, ExternalLink } from "lucide-react";

export const revalidate = 0;

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("nickname")
    .eq("id", user.id)
    .maybeSingle();

  const [expertProfile, suggestedSlug] = await Promise.all([
    getMyExpertProfile(),
    generateSlugFromNickname(),
  ]);

  return (
    <div className="max-w-xl mx-auto space-y-5 animate-slide-up">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
        <ArrowLeft size={14} />
        홈으로
      </Link>

      {/* 기본 정보 */}
      <div className="card p-5 space-y-4">
        <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100">내 정보</h1>

        <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
          <div className="w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center">
            <UserRound size={18} className="text-brand-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
              {profile?.nickname ?? "알 수 없음"}
            </p>
            <p className="text-xs text-slate-400">{user.email}</p>
          </div>
        </div>
      </div>

      {/* 전문가 프로필 */}
      <div className="card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <BadgeCheck size={16} className="text-brand-500" />
            전문가 프로필
          </h2>
          {expertProfile && (
            <Link
              href={`/e/${expertProfile.slug}`}
              className="text-xs text-brand-500 hover:underline flex items-center gap-1"
            >
              공개 프로필 보기 <ExternalLink size={11} />
            </Link>
          )}
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          전문가 프로필을 등록하면 검색엔진에 노출되고, 고유 URL로 공유할 수 있습니다.
        </p>

        <ExpertProfileForm existing={expertProfile} suggestedSlug={suggestedSlug} />
      </div>

      {/* 위험 구역 */}
      <div className="card p-5 space-y-3 border-red-100 dark:border-red-900/30">
        <h2 className="text-sm font-semibold text-red-500">위험 구역</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          탈퇴 시 계정과 모든 데이터가 영구 삭제되며 복구할 수 없습니다.
        </p>
        <DeleteAccountButton />
      </div>
    </div>
  );
}
