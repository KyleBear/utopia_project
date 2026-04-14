import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "https://utopia.kr";

  // 정적 페이지
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: "hourly", priority: 1 },
    { url: `${base}/login`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/signup`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];

  // 동적 게시글
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("posts")
    .select("id, updated_at")
    .order("created_at", { ascending: false })
    .limit(1000);

  const postRoutes: MetadataRoute.Sitemap = (posts ?? []).map((post) => ({
    url: `${base}/posts/${post.id}`,
    lastModified: new Date(post.updated_at),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...postRoutes];
}
