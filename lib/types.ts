export type Post = {
  id: string;
  user_id: string;
  title: string;
  content: string;
  is_anonymous: boolean;
  created_at: string;
  updated_at: string;
  comment_count?: number;
  like_count?: number;
  user_has_liked?: boolean;
  author_email?: string | null;
};

export type Comment = {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  is_anonymous: boolean;
  created_at: string;
  author_email?: string | null;
};

export type Like = {
  id: string;
  post_id: string;
  user_id: string;
  created_at: string;
};

export type SortOption = "latest" | "popular";
