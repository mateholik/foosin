import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

export function assertSupabaseEnv() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY (or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY)."
    );
  }
}

export const supabase = createClient(
  supabaseUrl ?? "https://example.supabase.co",
  supabaseAnonKey ?? "example-anon-key"
);

export type Player = {
  id: string;
  name: string;
  created_at: string;
};

export type Team = {
  id: string;
  name: string;
  player_1_id: string;
  player_2_id: string;
  created_at: string;
};

export type Game = {
  id: string;
  team_a_id: string;
  team_a_name: string;
  player_a1: string;
  player_a2: string;
  team_b_id: string;
  team_b_name: string;
  player_b1: string;
  player_b2: string;
  score_a: number;
  score_b: number;
  created_at: string;
};
