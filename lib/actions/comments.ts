"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function getComments(postId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("comments")
    .select("id, post_id, user_id, parent_id, content, is_anonymous, created_at, profiles(nickname), users(email)")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);

  type MappedComment = {
    id: string; post_id: string; user_id: string; parent_id: string | null;
    content: string; is_anonymous: boolean; created_at: string;
    author_nickname: string | null; author_email: string | null; replies: MappedComment[];
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapped: MappedComment[] = (data ?? []).map((c: any) => ({
    id: c.id as string,
    post_id: c.post_id as string,
    user_id: c.user_id as string,
    parent_id: c.parent_id as string | null,
    content: c.content as string,
    is_anonymous: c.is_anonymous as boolean,
    created_at: c.created_at as string,
    author_nickname: c.is_anonymous ? null :
      (Array.isArray(c.profiles) ? c.profiles[0]?.nickname : c.profiles?.nickname) ?? null,
    author_email: c.is_anonymous ? null :
      (Array.isArray(c.users) ? c.users[0]?.email : c.users?.email) ?? null,
    replies: [],
  }));

  const topLevel = mapped.filter((c: MappedComment) => !c.parent_id);
  const replies  = mapped.filter((c: MappedComment) => c.parent_id);
  return topLevel.map((comment: MappedComment) => ({
    ...comment,
    replies: replies.filter((r: MappedComment) => r.parent_id === comment.id),
  }));
}

export async function addComment(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "로그인이 필요합니다." };

  const postId      = formData.get("post_id") as string;
  const content     = (formData.get("content") as string)?.trim();
  const isAnonymous = formData.get("is_anonymous") === "on";
  const parentId    = (formData.get("parent_id") as string) || null;

  if (!content) return { error: "댓글 내용을 입력해주세요." };
  if (content.length > 500) return { error: "댓글은 500자 이내로 입력해주세요." };

  const { error } = await supabase
    .from("comments")
    .insert({ post_id: postId, user_id: user.id, content, is_anonymous: isAnonymous, parent_id: parentId });

  if (error) return { error: error.message };

  revalidatePath(`/posts/${postId}`);
  return { success: true };
}

export async function deleteComment(commentId: string, postId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "로그인이 필요합니다." };

  const { error } = await supabase
    .from("comments")
    .delete()
    .eq("id", commentId)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath(`/posts/${postId}`);
  return { success: true };
}
