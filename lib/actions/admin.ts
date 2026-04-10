"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const ADMIN_EMAIL = "juongho1024@gmail.com";

async function assertAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email !== ADMIN_EMAIL) {
    throw new Error("권한이 없습니다.");
  }
  return user;
}

export async function adminGetAllUsers() {
  await assertAdmin();
  const admin = createAdminClient();
  const { data: { users }, error } = await admin.auth.admin.listUsers({ perPage: 1000 });
  if (error) return [];
  return users
    .filter(u => u.email !== ADMIN_EMAIL)
    .map(u => ({
      id: u.id,
      email: u.email ?? "",
      nickname: (u.user_metadata?.nickname as string) ?? "",
      created_at: u.created_at,
    }));
}

export async function adminGetAllPosts() {
  await assertAdmin();
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("posts_with_counts")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return [];
  return data ?? [];
}

export async function adminDeletePost(postId: string) {
  await assertAdmin();
  const admin = createAdminClient();
  const { error } = await admin.from("posts").delete().eq("id", postId);
  if (error) return { error: error.message };
  revalidatePath("/", "layout");
  return { success: true };
}

export async function adminDeleteUser(userId: string) {
  await assertAdmin();
  const admin = createAdminClient();
  const { error } = await admin.auth.admin.deleteUser(userId);
  if (error) return { error: error.message };
  revalidatePath("/", "layout");
  return { success: true };
}
