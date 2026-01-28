import {  User } from '@supabase/supabase-js';

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

// Blog interface representing a blog post
export interface Blog {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  author_id: string;
  date: Date;
  category: string;
  image: string;
  tags: string[];
}

// Comment interface representing a comment on a blog post
export interface Comment {
  id: string;
  user_id: string;
  post_id: string;
  author: string;
  content: string;
  image?: string;
  date: Date;
}

export interface BlogState {
  blogs: Blog[];
  comments: Comment[];
  selectedBlog: Blog | null;
  loading: boolean;
  error: string | null;
  searchQuery: string;
  selectedCategory: string;
  currentPage: number;
}

export interface RootState {
  auth: AuthState;
  blogs: BlogState;
}