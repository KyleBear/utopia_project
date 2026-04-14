"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import type { UserRole } from "@/lib/types";

export async function setRole(role: UserRole) {
  const cookieStore = await cookies();
  cookieStore.set("utopia_role", role, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    httpOnly: false,
    sameSite: "lax",
  });
  revalidatePath("/", "layout");
}

export async function getRole(): Promise<UserRole> {
  const cookieStore = await cookies();
  const role = cookieStore.get("utopia_role")?.value;
  return role === "expert" ? "expert" : "client";
}
