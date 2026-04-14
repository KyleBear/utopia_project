import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getExpertBySlug } from "@/lib/data/experts";
import { ShareButtons } from "@/components/profile/ShareButtons";
import { ArrowLeft, Briefcase, BadgeCheck } from "lucide-react";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const expert = await getExpertBySlug(slug);
  if (!expert) return { title: "전문가를 찾을 수 없습니다 — Utopia" };

  const name = expert.nickname ?? slug;
  const description = expert.bio ?? `${name}의 전문가 프로필 — Utopia`;
  const url = `${process.env.NEXT_PUBLIC_APP_URL}/e/${slug}`;

  return {
    title: `${name} — 전문가 프로필 | Utopia`,
    description,
    openGraph: {
      title: `${name} — 전문가 프로필`,
      description,
      url,
      type: "profile",
      images: [{ url: `${url}/opengraph-image`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} — 전문가 프로필`,
      description,
      images: [`${url}/opengraph-image`],
    },
    alternates: { canonical: url },
  };
}

export default async function ExpertProfilePage({ params }: Props) {
  const { slug } = await params;
  const expert = await getExpertBySlug(slug);
  if (!expert) notFound();

  const name = expert.nickname ?? slug;
  const profileUrl = `${process.env.NEXT_PUBLIC_APP_URL}/e/${slug}`;

  // JSON-LD 구조화 데이터
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    url: profileUrl,
    description: expert.bio ?? undefined,
    knowsAbout: expert.expertise,
    memberOf: {
      "@type": "Organization",
      name: "Utopia",
      url: process.env.NEXT_PUBLIC_APP_URL,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-xl mx-auto space-y-5 animate-slide-up">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
        >
          <ArrowLeft size={14} />
          홈으로
        </Link>

        {/* 프로필 카드 */}
        <div className="card p-6 space-y-5">
          {/* 헤더 */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center shrink-0">
                <span className="text-2xl font-bold text-brand-500">
                  {name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    {name}
                  </h1>
                  <BadgeCheck size={16} className="text-brand-500" />
                </div>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                  전문가 · @{slug}
                </p>
              </div>
            </div>
          </div>

          {/* 소개 */}
          {expert.bio && (
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {expert.bio}
            </p>
          )}

          {/* 전문 분야 태그 */}
          {expert.expertise.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                <Briefcase size={13} />
                전문 분야
              </div>
              <div className="flex flex-wrap gap-1.5">
                {expert.expertise.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 text-xs bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 rounded-full border border-brand-100 dark:border-brand-900"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 공유 버튼 */}
          <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
            <ShareButtons url={profileUrl} name={name} />
          </div>
        </div>
      </div>
    </>
  );
}
