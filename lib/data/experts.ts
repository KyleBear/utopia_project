import { createClient } from "@/lib/supabase/server";
import type { ExpertProfile } from "@/lib/types";

export async function getExpertBySlug(slug: string): Promise<ExpertProfile | null> {
  const supabase = await createClient();

  const { data: expert, error } = await supabase
    .from("expert_profiles")
    .select("*")
    .eq("slug", slug)
    .eq("is_public", true)
    .maybeSingle();

  if (error || !expert) return null;

  // 닉네임 조인
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("nickname")
    .eq("id", expert.user_id)
    .maybeSingle();

  return { ...expert, nickname: profile?.nickname ?? null };
}

export async function getMyExpertProfile(): Promise<ExpertProfile | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("expert_profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  return data ?? null;
}

export async function getExpertList(limit = 20): Promise<ExpertProfile[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("expert_profiles")
    .select("*")
    .eq("is_public", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (!data) return [];

  // 닉네임 배치 조회
  const userIds = data.map((e) => e.user_id);
  const { data: profiles } = await supabase
    .from("user_profiles")
    .select("id, nickname")
    .in("id", userIds);

  const nicknameMap = Object.fromEntries(
    (profiles ?? []).map((p) => [p.id, p.nickname])
  );

  return data.map((e) => ({ ...e, nickname: nicknameMap[e.user_id] ?? null }));
}
