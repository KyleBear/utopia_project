export type Category = "전체" | "연애" | "직장" | "학교" | "가족" | "기타";

export const CATEGORIES: Category[] = ["전체", "연애", "직장", "학교", "가족", "기타"];

export type Post = {
  id: string;
  user_id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  is_anonymous: boolean;
  created_at: string;
  updated_at: string;
  comment_count?: number;
  like_count?: number;
  user_has_liked?: boolean;
  author_email?: string | null;
  author_nickname?: string | null;
};

export type Comment = {
  id: string;
  post_id: string;
  user_id: string;
  parent_id?: string | null;
  content: string;
  is_anonymous: boolean;
  created_at: string;
  author_email?: string | null;
  author_nickname?: string | null;
  replies?: Comment[];
};

export type Like = {
  id: string;
  post_id: string;
  user_id: string;
  created_at: string;
};

export type SortOption = "latest" | "popular";

export type UserRole = "client" | "expert";

export type ExpertProfile = {
  id: string;
  user_id: string;
  slug: string;
  bio: string | null;
  expertise: string[];
  is_public: boolean;
  created_at: string;
  updated_at: string;
  nickname?: string | null;
};
