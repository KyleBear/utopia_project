"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

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

  const rawTags = (formData.get("tags") as string) ?? "";
  const tags = rawTags.split(",").map(t => t.trim()).filter(Boolean).slice(0, 5);

  const { data, error } = await supabase
    .from("posts")
    .insert({ user_id: user.id, title, content, category, is_anonymous: isAnonymous, tags })
    .select("id")
    .single();

  if (error) return { error: error.message };

  revalidateTag("posts");
  revalidatePath("/");
  redirect(`/posts/${data.id}`);
}

export async function updatePost(postId: string, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const title       = (formData.get("title") as string)?.trim();
  const content     = (formData.get("content") as string)?.trim();
  const category    = (formData.get("category") as string) || "기타";
  const isAnonymous = formData.get("is_anonymous") === "on";

  if (!title || !content) return { error: "제목과 내용을 입력해주세요." };
  if (title.length > 100) return { error: "제목은 100자 이내로 입력해주세요." };

  const rawTags = (formData.get("tags") as string) ?? "";
  const tags = rawTags.split(",").map(t => t.trim()).filter(Boolean).slice(0, 5);

  const { error } = await supabase
    .from("posts")
    .update({ title, content, category, is_anonymous: isAnonymous, tags })
    .eq("id", postId)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  revalidateTag("posts");
  revalidatePath(`/posts/${postId}`);
  revalidatePath("/");
  redirect(`/posts/${postId}`);
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

  revalidateTag("posts");
  revalidatePath("/");
  redirect("/");
}
