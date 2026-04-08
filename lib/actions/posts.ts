"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { SortOption } from "@/lib/types";

const PAGE_SIZE = 15;

export async function getPosts(
  sort: SortOption = "latest",
  page = 1,
  category = "전체"
) {
  const supabase = await createClient();
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let query = supabase.from("posts_with_counts").select("*", { count: "exact" });

  if (category !== "전체") {
    query = query.eq("category", category);
  }

  if (sort === "popular") {
    query = query.order("like_count", { ascending: false }).order("created_at", { ascending: false });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  query = query.range(from, to);

  const { data, error, count } = await query;
  if (error) {
    console.error("[getPosts]", error.message);
    return { posts: [], total: 0 };
  }
  return { posts: data ?? [], total: count ?? 0 };
}

export async function getPost(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: post, error } = await supabase
    .from("posts_with_counts")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;

  let userHasLiked = false;
  if (user) {
    const { data: like } = await supabase
      .from("likes")
      .select("id")
      .eq("post_id", id)
      .eq("user_id", user.id)
      .maybeSingle();
    userHasLiked = !!like;
  }

  return { ...post, user_has_liked: userHasLiked };
}

export async function createPost(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const title       = (formData.get("title") as string)?.trim();
  const content     = (formData.get("content") as string)?.trim();
  const category    = (formData.get("category") as string) || "기타";
  const isAnonymous = formData.get("is_anonymous") === "on";

  if (!title || !content) return { error: "제목과 내용을 입력해주세요." };
  if (title.length > 100) return { error: "제목은 100자 이내로 입력해주세요." };

  const { data, error } = await supabase
    .from("posts")
    .insert({ user_id: user.id, title, content, category, is_anonymous: isAnonymous })
    .select("id")
    .single();

  if (error) return { error: error.message };

  revalidatePath("/");
  redirect(`/posts/${data.id}`);
}

export async function deletePost(postId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "로그인이 필요합니다." };

  const { error } = await supabase
    .from("posts")
    .delete()
    .eq("id", postId)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/");
  redirect("/");
}
