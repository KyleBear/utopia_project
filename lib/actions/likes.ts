"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function toggleLike(postId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "로그인이 필요합니다." };

  const { data: existing } = await supabase
    .from("likes")
    .select("id")
    .eq("post_id", postId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    await supabase.from("likes").delete().eq("id", existing.id);
    revalidatePath(`/posts/${postId}`);
    return { liked: false };
  }

  await supabase.from("likes").insert({ post_id: postId, user_id: user.id });
  revalidatePath(`/posts/${postId}`);
  return { liked: true };
}
