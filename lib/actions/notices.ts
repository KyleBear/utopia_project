"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const ADMIN_EMAIL = "juongho1024@gmail.com";

async function assertAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email !== ADMIN_EMAIL) throw new Error("권한이 없습니다.");
}

export async function getNotices() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("notices")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(20);
  return data ?? [];
}

export async function createNotice(formData: FormData) {
  await assertAdmin();
  const title   = (formData.get("title") as string)?.trim();
  const content = (formData.get("content") as string)?.trim();
  if (!title) return { error: "제목을 입력해주세요." };

  const admin = createAdminClient();
  const { error } = await admin.from("notices").insert({ title, content: content || null });
  if (error) return { error: error.message };

  revalidatePath("/");
  revalidatePath("/admin");
  return { success: true };
}

export async function deleteNotice(id: string) {
  await assertAdmin();
  const admin = createAdminClient();
  const { error } = await admin.from("notices").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/");
  revalidatePath("/admin");
  return { success: true };
}
