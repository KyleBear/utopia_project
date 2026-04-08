"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function login(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();
  const email    = formData.get("email")    as string;
  const password = formData.get("password") as string;
  const nickname = (formData.get("nickname") as string)?.trim();

  if (!nickname || nickname.length < 2 || nickname.length > 20) {
    return { error: "닉네임은 2~20자 사이로 입력해주세요." };
  }

  // 닉네임 중복 체크
  const { data: existingNickname } = await supabase
    .from("profiles")
    .select("id")
    .eq("nickname", nickname)
    .maybeSingle();

  if (existingNickname) return { error: "이미 사용 중인 닉네임입니다." };

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      data: { nickname },
    },
  });

  if (error) {
    const msg = error.message.toLowerCase();
    if (msg.includes("already registered") || msg.includes("already exists") || msg.includes("user already")) {
      return { error: "이미 사용 중인 이메일입니다." };
    }
    return { error: error.message };
  }

  return { success: true };
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}

export async function resetPassword(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?next=/update-password`,
  });

  if (error) return { error: error.message };
  return { success: "비밀번호 재설정 링크를 이메일로 보냈습니다." };
}

export async function deleteAccount() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "로그인이 필요합니다." };

  const admin = createAdminClient();
  const { error } = await admin.auth.admin.deleteUser(user.id);
  if (error) return { error: error.message };

  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}

export async function findAccount(formData: FormData) {
  const supabase = await createClient();
  const nickname = (formData.get("nickname") as string)?.trim();

  const { data } = await supabase
    .from("profiles")
    .select("id")
    .eq("nickname", nickname)
    .maybeSingle();

  if (!data) return { error: "해당 닉네임으로 가입된 계정이 없습니다." };

  // auth.users 에서 이메일 조회 (users view 사용)
  const { data: user } = await supabase
    .from("users")
    .select("email")
    .eq("id", data.id)
    .maybeSingle();

  if (!user?.email) return { error: "계정 정보를 찾을 수 없습니다." };

  const email = user.email as string;
  const masked = email.slice(0, 2) + "***@" + email.split("@")[1];
  return { email: masked };
}
