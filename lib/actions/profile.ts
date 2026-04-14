"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

function toSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 50);
}

export async function upsertExpertProfile(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "로그인이 필요합니다." };

  const slug = (formData.get("slug") as string)?.trim();
  const bio = (formData.get("bio") as string)?.trim() || null;
  const expertiseRaw = formData.get("expertise") as string;
  const expertise = expertiseRaw
    ? expertiseRaw.split(",").map((s) => s.trim()).filter(Boolean)
    : [];
  const is_public = formData.get("is_public") !== "false";

  if (!slug) return { error: "슬러그(URL)를 입력해주세요." };
  if (slug.length < 2 || slug.length > 50) return { error: "슬러그는 2~50자 사이여야 합니다." };
  if (!/^[a-z0-9-]+$/.test(slug)) return { error: "슬러그는 영소문자, 숫자, 하이픈만 사용할 수 있습니다." };

  // 슬러그 중복 확인 (본인 제외)
  const { data: existing } = await supabase
    .from("expert_profiles")
    .select("user_id")
    .eq("slug", slug)
    .maybeSingle();

  if (existing && existing.user_id !== user.id) {
    return { error: "이미 사용 중인 슬러그입니다." };
  }

  const { error } = await supabase
    .from("expert_profiles")
    .upsert({ user_id: user.id, slug, bio, expertise, is_public }, { onConflict: "user_id" });

  if (error) return { error: error.message };

  revalidatePath("/profile");
  revalidatePath(`/e/${slug}`);
  return { success: true, slug };
}

export async function generateSlugFromNickname(): Promise<string> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return "";

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("nickname")
    .eq("id", user.id)
    .maybeSingle();

  return toSlug(profile?.nickname ?? user.id.slice(0, 8));
}
