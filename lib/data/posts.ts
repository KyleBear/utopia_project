import { unstable_cache } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { SortOption } from "@/lib/types";

const PAGE_SIZE = 15;

export const getPosts = unstable_cache(
  async (sort: SortOption = "latest", page = 1, category = "전체", search = "", tag = "") => {
    const supabase = await createClient();
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    let query = supabase.from("posts_with_counts").select("*", { count: "exact" });

    if (category !== "전체") query = query.eq("category", category);
    if (tag) query = query.contains("tags", [tag]);
    if (search) query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`);

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
  },
  ["posts"],
  { revalidate: 30, tags: ["posts"] }
);

export const getPost = unstable_cache(
  async (id: string) => {
    const supabase = await createClient();
    const { data: post, error } = await supabase
      .from("posts_with_counts")
      .select("*")
      .eq("id", id)
      .single();
    if (error) return null;
    return post;
  },
  ["post"],
  { revalidate: 60, tags: ["posts"] }
);

export async function getMyPosts(page = 1) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { posts: [], total: 0 };

  const from = (page - 1) * PAGE_SIZE;
  const to   = from + PAGE_SIZE - 1;

  const { data, error, count } = await supabase
    .from("posts_with_counts")
    .select("*", { count: "exact" })
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) return { posts: [], total: 0 };
  return { posts: data ?? [], total: count ?? 0 };
}
